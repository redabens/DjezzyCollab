require('dotenv').config(); // Charger les variables d'environnement depuis .env
var LdapClient = require("ldapjs-client");
const bcrypt = require("bcryptjs");
var client = new LdapClient({ url: process.env.LDAP_URL}); //192.168.11.1 192.168.1.66
//connect to the server ldap
async function connectLDAP() {
  try {
    // Bind to the LDAP server
    await client.bind(process.env.LDAP_ADMIN_DN, process.env.LDAP_ADMIN_PASSWORD); // Replace with your admin DN and password
    console.log("Connected to LDAP server");
  } catch (err) {
    console.log("LDAP connection error:", err);
  }
}

// connectLDAP();

async function disconnectLDAP() {
  try {
    await client.unbind();
    console.log("Disconnected from LDAP server");
  } catch (err) {
    console.log("LDAP disconnection error:", err);
  }
}
async function search(username){
  try {
    // Connexion au serveur LDAP
    await client.bind(process.env.LDAP_ADMIN_DN, process.env.LDAP_ADMIN_PASSWORD); // Remplacez par vos informations d'admin

    // Recherchez l'utilisateur pour obtenir le DN
    const opts = {
      filter: `(sAMAccountName=${username})`, // Filtrez selon l'attribut utilisateur (uid, cn, sAMAccountName, etc.)
      scope: 'sub',
      attributes: ['dn'] // On cherche juste le DN 
    };

    const result = await client.search(process.env.LDAP_USERS_DN, opts); // Remplacez par le DN de base
    if(result.length === 0){
      return false;
    }
    const userDn = result[0].dn; // Récupérez le DN de l'utilisateur
    return true;
  }catch(error){
    // Vérifiez si l'erreur est liée à l'absence de l'utilisateur
    if (error.code === 32) { // LDAP_NO_SUCH_OBJECT
      console.log('utilisateur non trouve');
      return false;
    } else {
      console.error('Erreur d\'authentification:', error.message);
      return 'Erreur d\'authentification';
    }
  } 
}
// authenticate user
// async function authenticate(username, password) {
//   try {
//     const dn = process.env.LDAP_USERS_DN;
//     searchOptions = {
//       filter: `(uid=${username})`,
//       scope: "sub", // We only need to check the base entry itself
//       attributes: ["sn", "userPassword"], // We only care about the DN
//     };

//     const result = await client.search(dn, searchOptions);
//     if (result.length > 0) {
//       const user = result[0];
//       console.log("Entry found:", user);
//       const userPsw = user.userPassword;
//       const isPasswordMatch = await bcrypt.compare(password, userPsw);
//       console.log(isPasswordMatch);
//       if (isPasswordMatch) {
//         console.log("password match correctly in ldap");
//         return true;
//       } else {
//         //icorrect password
//         console.log("password doesnt match the entry's password ");
//         return false;
//       }
//     } else {
//       console.log("No entries found.");
//       return false; // Aucune entrée trouvée
//     }
//     // return result;
//   } catch (err) {
//     console.log("error", err);
//   }
// }

// Fonction d'authentification
async function authenticate(username, password) {
  try {
    // Connexion au serveur LDAP
    await client.bind(process.env.LDAP_ADMIN_DN, process.env.LDAP_ADMIN_PASSWORD); // Remplacez par vos informations d'admin

    // Recherchez l'utilisateur pour obtenir le DN
    const opts = {
      filter: `(sAMAccountName=${username})`, // Filtrez selon l'attribut utilisateur (uid, cn, sAMAccountName, etc.)
      scope: 'sub',
      attributes: ['dn'] // On cherche juste le DN 
    };
    const result = await client.search(process.env.LDAP_USERS_DN, opts); // Remplacez par le DN de base
    if(result.length === 0){
      return 'Utilisateur non trouvé';
    }
    const userDn = result[0].dn; // Récupérez le DN de l'utilisateur
    // Tentez de vous connecter avec le DN de l'utilisateur et le mot de passe fourni
    const connecter = await client.bind(userDn, password);
    if (connecter) {
      return 'Authentification réussie';
    }
  } catch (error) {
    // Vérifiez si le mot de passe est incorrect
    if (error.code === 49) { // LDAP_INVALID_CREDENTIALS
      console.log('Mot de passe incorrect');
      return 'Mot de passe incorrect';
    } else {
      console.error('Erreur d\'authentification:', error.message);
      return 'Erreur d\'authentification';
    }
  }
}


// /*// verify if ou existe in root
// async function ensureOUExists(dn, searchOptions) {
//   try {
//     const result = await client.search(dn, searchOptions);
//     // If the search returns results, the OU exists
//     if (result.length > 0) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     return false;
//   }
// }

// // creat organization unit users if not exist
// async function createOU(dn, callback) {
//   const entry = {
//     objectClass: ["organizationalUnit", "top"],
//     ou: "users",
//   };
//   try {
//     await client.add(dn, entry);
//     callback(true); // OU created successfully
//   } catch (err) {
//     callback(false, err); // Error creating OU
//   }
// }

// async function addUser(userData, callback) {
//   const ouDN = "ou=users,dc=djezzy-collab,dc=com";
//   const username = userData.email.split("@")[0];
//   const userDN = `uid=${userData.email},${ouDN}`; // email instead of username
//   connectLDAP();
//   try {
//     const searchOptions = {
//       scope: "base", // We only need to check the base entry itself
//       attributes: ["dn"], // We only care about the DN
//     };
//     const ouExists = await ensureOUExists(ouDN, searchOptions);

//     if (!ouExists) {
//       await createOU(ouDN, (success, err) => {
//         if (!success) {
//           callback(false, err);
//           return;
//         }
//       });
//     }

//     // Add the user
//     const user = {
//       cn: username,
//       sn: `${userData.firstName} ${userData.lastName}`,
//       objectClass: [
//         "inetOrgPerson",
//         userData.role === "admin" ? "organizationalPerson" : "person",
//         "top",
//       ],
//       userPassword: userData.password, // Make sure this is hashed appropriately
//       uid: userData.email, // changed username with email cuz its more unique
//       mail: userData.email,
//     };
//     await client.add(userDN, user);
//     callback(true);
//   } catch (err) {
//     callback(false, err);
//   }
// }

// // delete user from ldap
// async function deleteUserFromLDAP(email, callback) {
//   const dn = `uid=${email},ou=users,dc=djezzy-collab,dc=com`;
//   try {
//     await client.del(dn);
//     callback(true);
//   } catch (err) {
//     console.log("failed to delete user from ldap: ", err);
//     callback(false, err);
//   }
// }*/
// process.on("SIGINT", () => {
//   disconnectLDAP().then(() => {
//     process.exit();
//   });
// });
module.exports = { connectLDAP,disconnectLDAP,authenticate, search,client }; //  addUser, deleteUserFromLDAP,