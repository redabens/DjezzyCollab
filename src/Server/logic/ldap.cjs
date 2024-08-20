var LdapClient = require('ldapjs-client');
var client = new LdapClient({ url: 'ldap://192.168.70.106:389' });// Remplacez par l'URL de votre serveur LDAP

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
    const username = userData.email.split('@')[0];
    const dn = `uid=${username},ou=users,dc=djezzy-collab,dc=com`;
   // Déterminer l'objectClass selon le rôle
   const user = {
    cn: username,
    sn: `${userData.firstName} ${userData.lastName}`,
    objectClass: ['inetOrgPerson', userData.role === 'admin' ? 'organizationalPerson' : 'person', 'top'],
    userPassword: userData.password, // Notez qu'il est recommandé de hasher le mot de passe avant de l'envoyer
    uid: username,
    mail: userData.email
  }
  
    client.add(dn, user, (err) => {
      if (err) {
        callback(false, err); // Erreur lors de l'ajout
      } else {
        callback(true); // Utilisateur ajouté avec succès
      }
    });
  }
module.exports = { authenticate, addUser };