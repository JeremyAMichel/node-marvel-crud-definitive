// Importer le module MySQL
const mysql = require("mysql");

// Créer une connexion à la base de données en utilisant les paramètres de connexion
// https://www.npmjs.com/package/mysql#introduction
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'marvel'
})

// Etablir la connexion à la base de données
connection.connect((err) => {
    if(err){
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

// Exporter la connexion pour pouvoir l'utiliser dans d'autres modules
module.exports = connection;