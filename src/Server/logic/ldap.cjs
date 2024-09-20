var LdapClient = require("ldapjs-client");
const bcrypt = require("bcryptjs");
const Ldap = require("../models/ldapModel.cjs");

// var client = new LdapClient({ url: "ldap://localhost:389" }); //192.168.11.1 192.168.1.66

var client;
async function getLdapConfig() {
  try {
    const ldapConfig = await Ldap.findOne();
    if (!ldapConfig) {
      throw new Error("LDAP configuration not found in the database.");
    }
    return ldapConfig;
  } catch (error) {
    console.error("Error fetching LDAP configuration:", error);
    throw error;
  }
}
async function connectLDAP() {
  try {
    const ldapConfig = await getLdapConfig();
    const ldapUrl = `${ldapConfig.url}:${ldapConfig.port}`;
    client = new LdapClient({ url: ldapUrl });
    console.log(client);
    // Bind to the LDAP server
    await client.bind(ldapConfig.adminDN, ldapConfig.password);
    console.log("Connected to LDAP server");
  } catch (err) {
    console.error("LDAP connection error:", err);
  }
}
connectLDAP();
// //connect to the server ldap
// async function connectLDAP() {
//   try {
//     // Bind to the LDAP server
//     await client.bind("cn=admin,dc=djezzy-collab,dc=com", "sara2004"); // Replace with your admin DN and password
//     console.log("Connected to LDAP server");
//   } catch (err) {
//     console.log("LDAP connection error:", err);
//   }
// }



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
    const dn = `ou=users,dc=djezzy-collab,dc=com`;
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
