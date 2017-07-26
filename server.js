require('dotenv').config({path: 'variables.env'});
const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
const Talk = mongoose.model('Talk', talkSchema);
const Vote = mongoose.model('Vote', voteSchema);
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

  server.get('*', (req, res) => {
    return handle(req, res)
  });

  server.listen(3000, (err) => {
    if (err)
      throw err
    console.log('> Ready on http://localhost:3000')
  });
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
});
