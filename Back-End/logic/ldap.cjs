require('dotenv').config(); // Charger les variables d'environnement depuis .env
var LdapClient = require("ldapjs-client");
const bcrypt = require("bcryptjs");
var client = new LdapClient({ url: process.env.LDAP_URL }); //192.168.220.1 192.168.1.66
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

connectLDAP();

async function disconnectLDAP() {
  try {
    await client.unbind();
    console.log("Disconnected from LDAP server");
  } catch (err) {
    console.log("LDAP disconnection error:", err);
  }
}

// authenticate user
async function authenticate(username, password) {
  try {
    const dn = process.env.LDAP_USER_DN;
    searchOptions = {
      filter: `(&(uid=${username}))`,
      scope: "sub", // We only need to check the base entry itself
      attributes: ["uid", "userPassword"], // We only care about the DN
    };

    const result = await client.search(dn, searchOptions);
    if (result.length > 0) {
      const user = result[0];
      console.log("Entry found:", user);
      const userPsw = user.userPassword;
      const isPasswordMatch = await bcrypt.compare(password, userPsw);
      console.log(isPasswordMatch);
      if (isPasswordMatch) {
        console.log("password match correctly in ldap");
        return true;
      } else {
        //icorrect password
        console.log("password doesnt match the entry's password ");
        return false;
      }
    } else {
      console.log("No entries found.");
      return false; // Aucune entrée trouvée
    }
    // return result;
  } catch (err) {
    console.log("error", err);
  }
}
/*// Fonction d'authentification
function authenticate(username, password, callback) {
  // Recherchez l'utilisateur pour obtenir le DN
  const searchOptions = {
    filter: `(sAMAccountName=${username})`, // Filtre de recherche basé sur le nom d'utilisateur
    scope: 'sub'
  };

  client.search('dc=example,dc=com', searchOptions, (err, res) => {
    if (err) {
      return callback(err);
    }

    res.on('searchEntry', (entry) => {
      const userDn = entry.objectName;

      // Essayez de vous connecter avec le DN et le mot de passe
      client.bind(userDn, password, (err) => {
        if (err) {
          return callback(new Error('Authentification échouée'));
        }
        callback(null, 'Authentification réussie');
      });
    });

    res.on('error', (err) => {
      callback(err);
    });

    res.on('end', () => {
      callback(new Error('Utilisateur non trouvé'));
    });
  });
} */
// verify if ou existe in root
async function ensureOUExists(dn, searchOptions) {
  try {
    const result = await client.search(dn, searchOptions);
    // If the search returns results, the OU exists
    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

// creat organization unit users if not exist
async function createOU(dn, callback) {
  const entry = {
    objectClass: ["organizationalUnit", "top"],
    ou: "users",
  };
  try {
    await client.add(dn, entry);
    callback(true); // OU created successfully
  } catch (err) {
    callback(false, err); // Error creating OU
  }
}

async function addUser(userData, callback) {
  const ouDN = "ou=users,dc=djezzy-collab,dc=com";
  const username = userData.email.split("@")[0];
  const userDN = `uid=${userData.email},${ouDN}`; // email instead of username
  connectLDAP();
  try {
    const searchOptions = {
      scope: "base", // We only need to check the base entry itself
      attributes: ["dn"], // We only care about the DN
    };
    const ouExists = await ensureOUExists(ouDN, searchOptions);

    if (!ouExists) {
      await createOU(ouDN, (success, err) => {
        if (!success) {
          callback(false, err);
          return;
        }
      });
    }

    // Add the user
    const user = {
      cn: username,
      sn: `${userData.firstName} ${userData.lastName}`,
      objectClass: [
        "inetOrgPerson",
        userData.role === "admin" ? "organizationalPerson" : "person",
        "top",
      ],
      userPassword: userData.password, // Make sure this is hashed appropriately
      uid: userData.email, // changed username with email cuz its more unique
      mail: userData.email,
    };
    await client.add(userDN, user);
    callback(true);
  } catch (err) {
    callback(false, err);
  }
}

// delete user from ldap
async function deleteUserFromLDAP(email, callback) {
  const dn = `uid=${email},ou=users,dc=djezzy-collab,dc=com`;
  try {
    await client.del(dn);
    callback(true);
  } catch (err) {
    console.log("failed to delete user from ldap: ", err);
    callback(false, err);
  }
}
process.on("SIGINT", () => {
  disconnectLDAP().then(() => {
    process.exit();
  });
});
module.exports = { authenticate, addUser, deleteUserFromLDAP, client };
