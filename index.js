const express = require("express");
const connexion = require("./database");
const mustacheExpress = require("mustache-express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");

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
// app.use(methodOverride(function (req, res) {
//   if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//     // look in urlencoded POST bodies and delete it
//     var method = req.body._method;
//     delete req.body._method;
//     return method;
//   }
// }))

app.use(methodOverride("_method"));

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

const equipesRouter = require("./routes/equipes");

app.use("/equipes", equipesRouter);

