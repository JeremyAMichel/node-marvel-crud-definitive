const express = require("express");
const connexion = require("./database");
const mustacheExpress = require("mustache-express");
const path = require("path");
const app = express();

/**
 * Configuration de mustache
 * comme moteur de template
 * pour l'extension .mustache
 */
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

/**
 * Configuration de express
 * pour récupérer les données d'un formulaire
 * et pour servir les fichiers statiques
 * (css, js, images, etc.)
 */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques depuis le dossier node_modules
// app.use('/picocss', express.static(path.join(__dirname, 'node_modules/@picocss/pico/css/pico.purple.min.css')));

// Redirection pour servir le fichier CSS demandé
app.get("/picocss", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/node_modules/@picocss/pico/css/pico.purple.min.css")
  );
});


// Routes à ajouter ici

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.render("home");
});

const personnagesRouter = require("./routes/personnages");

app.use("/personnages", personnagesRouter);

