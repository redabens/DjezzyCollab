const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users.cjs");
const SiteSFTP = require("../models/sitesftp.cjs");

const { deleteUserFromLDAP, client } = require("./ldap.cjs");

///LDAP functions
const Ldap = require("../models/ldapModel.cjs");
var LdapClient = require("ldapjs-client");
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
    // const ldapConfig = await getLdapConfig();
    // const ldapUrl = `${ldapConfig.url}:${ldapConfig.port}`;
    // client = new LdapClient({ url: ldapUrl });
    // console.log(client);
    // Bind to the LDAP server
    await client.bind(
      process.env.LDAP_ADMIN_DN,
      process.env.LDAP_ADMIN_PASSWORD
    );
    console.log("Connected to LDAP server");
  } catch (err) {
    console.error("LDAP connection error:", err);
  }
}
connectLDAP();
/////////////////////////////////////////////////////////////////////////////////////////////////

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    console.log("error getAllUsers: " + err);
    res.status(500).json({
      status: "error",
      message: "ERROR fetching users",
    });
  }
};

// delete user by id

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User Not Found",
      });
    }

    await User.findByIdAndDelete(userId);
    deleteUserFromLDAP(user.email, (success, err) => {
      if (success) {
        res.status(200).json({
          status: "success",
          message: "User deleted successfully",
        });
      } else {
        console.error("Failed to delelte user from LDAP: ", err);
        res.status(500).json({
          status: "error",
          message: "User deleted from DB but not from LDAP",
        });
      }
    });
  } catch (err) {
    console.log("Error deleting user: " + err);
    res.status(500).json({ status: "error", message: "Error deleting user" });
  }
};

const updateUser = async (req, res) => {
  const data = req.body;
  try {
    // Update user in LDAP
    if (
      data.updatedUserData.firstName !== data.user.firstName ||
      data.updatedUserData.lastName !== data.user.lastName ||
      data.updatedUserData.email !== data.user.email
    ) {
      console.log("ici pour changer cn sn et uid et mail");
      // rechercher et recuperer le dn de l'utilisateur
      const dn = `ou=users,dc=djezzy-collab,dc=com`;
      searchOptions = {
        filter: `(&(uid=${data.user.email}))`,
        scope: "sub", // We only need to check the base entry itself
        attributes: ["uid", "dn"], // We only care about the DN
      };

      const result = await client.search(dn, searchOptions);
      if (!result || result.length === 0) {
        return res.status(404).send({ error: "User not found in LDAP" });
      }
      console.log(result);
      const userDn = result[0].dn; // Extract the DN from the search result
      if (data.updatedUserData.email !== data.user.email) {
        // modifier uid et mail et cn
        const username = data.updatedUserData.email.split("@")[0];
        // Handle renaming (modifying the DN)
        const newDn = `uid=${data.updatedUserData.email},ou=users,dc=djezzy-collab,dc=com`;
        // Renaming the entry
        await client.modifyDN(userDn, newDn);
        const change = {
          operation: "replace", // add, delete, replace
          modification: {
            cn: username,
            mail: data.updatedUserData.email,
            uid: data.updatedUserData.email,
          },
        };
        await client.modify(newDn, change);
      } else {
        // modifier sn
        const change = {
          operation: "replace", // add, delete, replace
          modification: {
            sn: `${data.updatedUserData.firstName} ${data.updatedUserData.lastName}`,
          },
        };
        await client.modify(userDn, change);
      }
    }
    //get checked serveur sftp
    const checkedSite = await SiteSFTP.findOne({ checked: true });
    if (!checkedSite)
      return res.status(401).send({ error: "No site sftp checked" });
    let newDirPath = data.user.DirPath;
    // Trouver l'index de l'objet correspondant dans DirPath
    const index = newDirPath.findIndex(
      (dir) =>
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
    );
    if (index === -1) {
      return res.status(404).send({ error: "No matching path found" });
    }
    // Accéder et modifier l'objet à cet index
    newDirPath[index].path = data.updatedUserData.userPath;
    const user = await User.findByIdAndUpdate(
      data.user._id,
      {
        firstName: data.updatedUserData.firstName,
        lastName: data.updatedUserData.lastName,
        email: data.updatedUserData.email,
        password: data.updatedUserData.password,
        DirPath: newDirPath,
        role: data.updatedUserData.role,
        ableToDelete: data.updatedUserData.ableToDelete,
      },
      { new: false }
    );
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    console.log("Error updating user: " + err);
    res.status(500).json({
      status: "error",
      message: "Error updating user",
    });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User Not Found",
      });
    }
    //get checked serveur sftp
    const checkedSite = await SiteSFTP.findOne({ checked: true });
    if (!checkedSite)
      return res.status(401).send({ error: "No site sftp checked" });
    // recuperer le path du checked site dans user
    const userPath = user.DirPath.filter((dir) => {
      return (
        dir.serveurSFTP.host === checkedSite.host &&
        dir.serveurSFTP.port === checkedSite.port &&
        dir.serveurSFTP.username === checkedSite.username &&
        dir.serveurSFTP.password === checkedSite.password &&
        dir.serveurSFTP.defaultPath === checkedSite.defaultPath
      );
    })[0].path;
    console.log("User path:", userPath);
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
      userPath: userPath,
    });
  } catch (err) {
    console.log("Error fetching the user: " + err);
    res.status(500).json({
      status: "error",
      message: "Error fetching user",
    });
  }
};
module.exports = {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
};
