const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/gully');
    console.log('connected to database');
}

const loginSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    confpassword: String
});

const kitten = mongoose.model('cric', loginSchema);

const app = express();
app.use('/static', express.static('static'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'static/pug'));
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.status(200).render('login.pug');
});
app.get('/match', (req, res) => {
    res.status(200).render('match.pug');
});
app.get('/drtyhj98765rtjjkh0ygg8fsthsfddwgrbeyt345252752', (req, res) => {
    res.status(200).render('home.pug');
});

app.post('/auth/signup', (req,res) => {
    const userData = new kitten(req.body);
    userData.save()
    .then(() => {
        res.status(200).render('home.pug');
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Internal Server Error');
    });
});

app.post('/auth/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password
    kitten.findOne({username: username, password: password})
    .then(user => {
        if(user){
            res.status(200).render('home.pug');
        }
        else{
            res.status(404).send('User not found');
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Internal Server Error');
    });
});
var number;
var toss, overs;
var players = [];
app.post('/team', (req,res) => {
    const team1 = req.body.team1;
    const team2 = req.body.team2;
    number = req.body.number;
    overs = req.body.overs;
    toss = req.body.toss;

    res.status(200).render('players.pug',  { team1, team2, number, overs, toss });
});
app.post('/players', (req,res) => {
    
    for(let i = 0; i<2*number; i++){
        let playerName = `player${i+1}`;
        players[i] = req.body[playerName];
    }
    
    const commonPlayer = req.body.common;
    console.log(number);
    console.log(players);
    console.log(commonPlayer); 
    
    res.status(200).render('match.pug',  { number, players, commonPlayer });
}
);
app.post('/striker', (req,res) => {
    var striker = req.body.striker;
    var nonStriker = req.body.nonStriker;
    var bowler = req.body.bowler;
    res.status(200).render('start.pug',  {players, number, toss, overs, striker, nonStriker, bowler });

});
app.listen(1204, () => {
    console.log('Server is running on port 1204');
});