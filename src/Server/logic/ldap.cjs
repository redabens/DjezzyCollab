var LdapClient = require("ldapjs-client");
var client = new LdapClient({ url: "ldap://localhost:389" });

function authenticate(username, password, callback) {
  const dn = `uid=${username},ou=users,dc=djezzy-collab,dc=com`;

  client.bind(dn, password, (err) => {
    if (err) {
      callback(false); // Authentication failed
    } else {
      callback(true); // Authentication succeeded
    }
  });
}
// verify if ou existe in root
async function ensureOUExists(dn) {
  try {
    const searchOptions = {
      scope: "base", // We only need to check the base entry itself
      attributes: ["dn"], // We only care about the DN
    };

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

  try {
    // Bind to the LDAP server
    await client.bind("cn=admin,dc=djezzy-collab,dc=com", "sara2004"); // Replace with your admin DN and password

    const ouExists = await ensureOUExists(ouDN);

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
    await client.bind("cn=admin,dc=djezzy-collab,dc=com", "sara2004");
    await client.del(dn);
    callback(true);
  } catch (err) {
    console.log("failed to delete user from ldap: ", err);
    callback(false, err);
  }
}
module.exports = { authenticate, addUser, deleteUserFromLDAP };
