const usersController = require('express').Router();

const db = require('../../models');
const { JWTVerifier } = require('../../lib/passport');
const jwt = require('jsonwebtoken');
const sendGrid = require('../../lib/emailSendgrid');


usersController.post('/', (req, res) => {
  const { email, password } = req.body;
  sendGrid("welcome", email);
  db.User.create({ email, password })
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

usersController.get('/me', JWTVerifier, (req, res) => {
  res.json(req.user);
});

usersController.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.User.findOne({ where: { email } })
    .then(user => {
      if (!user || !user.comparePassword(password)) {
        return res.status(401).send("Unauthorized");
      }

      res.json({
        token: jwt.sign({ sub: user.id }, process.env.JWT_SECRET),
        user
      });
    });
});


usersController.post('/invite', (req, res) => {
  if(!req.body.email){
    return res
            .status(404)
            .send(`No email was given`)
  }
  sendGrid("invitefriend", req.body.email)
  res.send(req.body.email + ` was sent an invitation`)
})

// get searched email
// working
usersController.get('/search/:email', (req, res) => {
  // const { email } = req.body;
  console.log(req.params.email)
  db.User.findOne({ where: {
    email: req.params.email 
  }})
    .then(user => {
      if(!user){
        return res
          .status(404)
          .send(`A User with the email of ${user} could not be found.`)
      }

      return res.json(user);
    })
})



// get all of the people that the user is following
usersController.get("/follows", JWTVerifier, (req, res) => {
  
  db.User.findByPk(req.user.id)
    .then((user)=> {
      if (!user) {
        return res
          .status(404)
          .send(`User with id ${req.user.id} not found.`);
      }

      console.log(user)
      return user.getFollowers();
    })
    .then(followers => res.json(followers))
    .catch(err=> console.log(err));
    
});



// add to the people a user is following
usersController.post("/follows", JWTVerifier, (req, res)=> {
  
  db.User.findByPk(req.user.id)
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send(`User with id ${req.user.id} not found.`);
      }
      // is not a function
      console.log(user);
      return user.addFollowers(req.body.userFollowie);
    })
    .then(user => res.json(user))
    .catch((err) => console.log(err));

})



// remove a userFollowie for a user
usersController.delete("/follows/delete", JWTVerifier, (req, res) => {
  
  db.User.findByPk(req.user.id)
    .then(User => {
      if (!User) {
        return res
          .status(404)
          .send(`User with id ${req.user.id} not found.`);
      }
      
      return User.removeFollowers(req.body.userFollowie);
    })
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => console.log(err));

});

module.exports = usersController;
