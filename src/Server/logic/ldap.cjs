const ldap = require('ldapjs');

const client = ldap.createClient({
  url: 'ldap://192.168.70.106:389' // Remplacez par l'URL de votre serveur LDAP
});

function authenticate(username, password, callback) {
  // Construct the DN (Distinguished Name) based on username
  const dn = `uid=${username},ou=users,dc=djezzy-collab,dc=com`;

  client.bind(dn, password, (err) => {
    if (err) {
      callback(false); // Authentication failed
    } else {
      callback(true);  // Authentication succeeded
    }
  });
}
function addUser(userData, callback) {
    const dn = `uid=${userData.username},ou=users,dc=djezzy-collab,dc=com`;
    const user = {
      cn: userData.fullName,
      sn: userData.lastName,
      uid: userData.username,
      userPassword: userData.password,
      objectClass: ['inetOrgPerson', 'posixAccount', 'top'],
      uidNumber: userData.uidNumber,
      gidNumber: userData.gidNumber,
      homeDirectory: `/home/${userData.username}`,
    };
  
    client.add(dn, user, (err) => {
      if (err) {
        callback(false, err); // Erreur lors de l'ajout
      } else {
        callback(true); // Utilisateur ajouté avec succès
      }
    });
  }
module.exports = { authenticate, addUser };