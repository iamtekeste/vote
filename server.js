require('dotenv').config({path: 'variables.env'});
const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
//connect to DB
mongoose.connect(process.env.DATABASE, {useMongoClient: true});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`→ ${err.message}`);
  throw err;
});

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler()

const talkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  slideLink: String,
  authorName: String,
  authorProfile: String
});
const voteSchema = new mongoose.Schema({
  talkId: mongoose.Schema.Types.ObjectId,
  userToken: String,
  vote: Number,
});
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Talk = mongoose.model('Talk', talkSchema);
const Vote = mongoose.model('Vote', voteSchema);
const User = mongoose.model('User', userSchema);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.post('/add', (req, res) => {
    let data = req.body;
    const talk = new Talk(data);
    talk.save()
        .then(talk => {
          res.json(talk);
        })
        .catch((err) => {
          console.error(`→ ${err.message}`);
          res.status(400)
          res.json(err);
        });
  });
  server.get('/', (req, res) => {

    const actualPage = '/';
    Talk.find()
        .then(talks => {
          app.render(req, res, actualPage)
        })
        .catch(err => {
          res.status(500);
          res.json(err);
        });
  });
  server.get('/api/talks', (req, res) => {
    Talk.find()
        .then(talks => {
          res.json(talks);
        })
        .catch(err => {
          res.status(500);
          res.json(err);
        });
  });
  server.get('/api/winner', (req, res) => {
      Vote.aggregate(
          [
              // Grouping pipeline
              {
                  $group: {
                    _id: "$talkId",
                    votes: { $sum: 1 }
                  }
              },
              // // Sorting pipeline
              { "$sort": { "votes": -1 } },
              // // Optionally limit results
              { "$limit": 1 }
          ]
    ).then(mostVoted => {
      if(mostVoted[0] === undefined) throw new Error('no votes yet');
      Talk.findOne({
        _id: mostVoted[0]._id
      }).then(talk => {
        console.log(mostVoted[0].votes);
        const votes = mostVoted[0].votes;
        const response = {talk: talk, votes:votes};
        res.json(response);
      }).catch(err => {
        res.status(500);
        res.json(err);
      })
    }).catch(err => {
      res.status(500);
      res.json(err);
    });
  });
  server.post('/api/vote', (req, res) => {
    const data = req.body.data;

    Talk.findOne({
      'title': data.title
    }).then(talk => {
        const newVote = new Vote({
          talkId: mongoose.Types.ObjectId(talk._id),
          vote: 1
        });
        newVote.save()
        .then(vote => {
          // we would probably send vote count
          res.json({message: 'success'});
        })
        .catch( err => {
          console.log(err.message);
          res.status(500);
          res.json(err);
        })
    });
  });

  server.post('/api/login', (req, res) => {

  });
  server.get('*', (req, res) => {
    return handle(req, res)
  });

  server.listen(3001, (err) => {
    if (err)
      throw err
    console.log('> Ready on http://localhost:3001')
  });
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
});
