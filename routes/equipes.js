const express = require("express");
const connexion = require("../database");
const router = express.Router();
// const methodOverride = require("method-override");

// app.use(methodOverride("_method"));


router.get("/", (req, res) => {
    connexion.query("SELECT * FROM equipe", (err, results) => {
        if (err) {
        console.log(err);
        } else {
        res.render("equipes/equipes", {
            equipes: results,
        });
        }
    });
});

router.get("/:id/edit", (req, res) => {
    const id = req.params.id;
    connexion.query(
        "SELECT * FROM equipe WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.render("equipes/equipe-edit-form", {
                    equipe: results[0],
                });
            }
        }
    );
});

router.get("/:id/delete", (req, res) => {
    const id = req.params.id;
    connexion.query(
        "DELETE FROM equipe WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/equipes");
            }
        }
    );
});

router
  .route("/create")
  .get((req, res) => {
    res.render("equipes/equipe-create-form");
  })
  .post( (req, res) => {
    const nom = req.body.nom;

    // Vérifiez si une équipe avec le même nom existe déjà
    connexion.query('SELECT * FROM equipe WHERE nom = ?', [nom], (error, results) => {
        if (error) {
            // Gérer l'erreur
            console.error(error);
            res.status(500).send('Erreur lors de la vérification de l\'équipe');
        } else if (results.length > 0) {
            // Si une équipe avec le même nom existe déjà, renvoyez une erreur
            res.render('equipes/equipe-create-form', { error: 'Une équipe avec ce nom existe déjà' });
        } else {
            // Si aucune équipe avec le même nom n'existe, créez la nouvelle équipe
            connexion.query('INSERT INTO equipe SET ?', {nom: nom}, (error, results) => {
                if (error) {
                    // Gérer l'erreur
                    console.error(error);
                    res.status(500).send('Erreur lors de la création de l\'équipe');
                } else {
                    res.redirect('/equipes');
                }
            });
        }
    });
  });

router.route("/:id").get((req, res) => {
    const id = req.params.id;
    connexion.query(
        "SELECT * FROM equipe WHERE id = ?",
        [id],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.render("equipes/equipe-details", {
                    equipe: results[0],
                });
            }
        }
    );
}).put((req, res) => {
    const id = req.params.id;
    const { nom } = req.body;

    connexion.query(
        "UPDATE equipe SET nom = ? WHERE id = ?",
        [nom, id],
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/equipes");
            }
        }
    );
});


module.exports = router;