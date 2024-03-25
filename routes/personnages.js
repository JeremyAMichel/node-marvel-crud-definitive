const express = require("express");
const connexion = require("../database");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  connexion.query(
    "SELECT personnage.id, personnage.nom AS personnage_nom, personnage.photo, personnage.description, equipe.nom AS equipe_nom FROM personnage LEFT JOIN equipe ON equipe.id = personnage.equipe_id",
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.render("personnages/personnages", {
          personnages: results,
        });
      }
    }
  );
});

router
  .route("/create")
  .get((req, res) => {
    connexion.query("SELECT * FROM equipe", (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.render("personnages/personnage-create-form", {
          equipes: results,
        });
      }
    });
  })
  .post(upload.single("photo"), (req, res) => {
    const { nom, description, equipe } = req.body;
    let photo = null;
    if (req.file) {
      photo = "/img/" + req.file.filename;
    }

    connexion.query(
      "INSERT INTO personnage (nom, description, equipe_id, photo) VALUES (?, ?, ?, ?)",
      [nom, description, equipe, photo],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/personnages");
        }
      }
    );
  });

router.get("/:id/edit", (req, res) => {
  const id = req.params.id;

  //add select equipe
  connexion.query(
    "SELECT personnage.id, personnage.nom AS personnage_nom, personnage.photo, personnage.description, equipe.nom AS equipe_nom FROM personnage LEFT JOIN equipe ON equipe.id = personnage.equipe_id WHERE personnage.id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const personnage = results[0];

        connexion.query("SELECT * FROM equipe", (err, results) => {
          if (err) {
            console.log(err);
          } else {
            const equipes = results.map((equipe) => ({
              ...equipe,
              selected: equipe.nom === personnage.equipe_nom ? 'selected' : ''
            }));

            res.render("personnages/personnage-edit-form", {
              personnage,
              equipes
            });
          }
        });
      }
    }
  );
});

router.get("/:id/delete", (req, res) => {
  const id = req.params.id;
  connexion.query(
    "SELECT photo FROM personnage WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        const photo = results[0].photo;
        fs.unlink(path.join("public", photo), (err) => {
          if (err) {
            console.log(err);
          } else {
            connexion.query(
              "DELETE FROM personnage WHERE id = ?",
              [id],
              (err, results) => {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect("/personnages");
                }
              }
            );
          }
        });
      }
    }
  );
});

router
  .route("/:id")
  .get((req, res) => {
    const id = req.params.id;
    connexion.query(
      "SELECT personnage.id, personnage.nom AS personnage_nom, personnage.photo, personnage.description, equipe.nom AS equipe_nom FROM personnage LEFT JOIN equipe ON equipe.id = personnage.equipe_id WHERE personnage.id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(results);
          res.render("personnages/personnage-details", {
            personnage: results[0],
          });
        }
      }
    );
  })
  .put(upload.single("photo"), (req, res) => {
    const id = req.params.id;
    const { nom, description, equipe } = req.body;
    if (req.file) {
      let newPhoto = "/img/" + req.file.filename;
      connexion.query(
        "UPDATE personnage SET nom = ?, description = ?, equipe_id = ?, photo = ? WHERE id = ?",
        [nom, description, equipe, newPhoto, id],
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/personnages");
          }
        }
      );
    } else {
      connexion.query(
        "UPDATE personnage SET nom = ?, description = ?, equipe_id = ? WHERE id = ?",
        [nom, description, equipe, id],
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/personnages");
          }
        }
      );
    }  
  });

module.exports = router;
