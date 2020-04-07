const challengesController = require("express").Router();

const db = require("../../models");
const { JWTVerifier } = require('../../lib/passport');

// searches for last five challenges
challengesController.get("/:UserId", JWTVerifier, (req, res) => {
  db.Challenge.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    where: req.params.UserId
  })
    .then(challenges => res.json(challenges))
    .catch((err) => console.log(err));
});

// get current challenge
challengesController.get("/", JWTVerifier, (req, res) => {
  db.Challenge.findAll({
    limit: 1,
    order: [['createdAt', 'DESC']],
    where: req.params.UserId
  })
    .then()
    .then(challenges => res.json(challenges))
    .catch((err) => console.log(err));
});

// ASK T.A ABOUT THIS
// post challenge 
// must pass UserId 
challengesController.post("/", JWTVerifier, (req, res) => {
  db.Challenge.create({ UserId: req.user.id })
    .then(challenges => res.json(challenges))
    .catch((err) => console.log(err));
});

// Add actions to a challenge
// Add JWTVerifier back in later
challengesController.put("/:id", (req, res) => {
  console.log(req.body.actions);

  db.Challenge.findByPk(req.params.id)
    .then((challenge) => {
      if (!challenge) {
        return res
          .status(404)
          .send(`Challenge with id ${req.params.id} not found.`);
      }

      return challenge.setActions(req.body.actions);
    })
    .then((updatedChallenge) => res.json(updatedChallenge))
    .catch((err) => console.log(err));
});

// update challenge score


// delete an action from a challenge
// challengesController.get("/", JWTVerifier, (req, res) => {
//   db.Challenge.findAll()
//     .then(challenges => res.json(challenges))
//     .catch((err) => console.log(err));
// });

// delete an entire challenge
// challengesController.get("/", JWTVerifier, (req, res) => {
//   db.Challenge.findAll()
//     .then(challenges => res.json(challenges))
//     .catch((err) => console.log(err));
// });

module.exports = challengesController;