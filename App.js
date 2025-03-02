const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public/static')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public/static/pug'));
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.status(200).render('home.pug');
});
app.get('/match', (req, res) => {
    res.status(200).render('match.pug');
});

app.post('/save-match-data', (req, res) => {
    const data = JSON.stringify(req.body, null, 2);
    const uniqueId = req.body.uniqueId || 'default';
    const date = new Date();
    const formattedDate = date.toISOString().replace(/:/g, '-').split('.')[0];
    const name1 = req.body.team1?.name || 'default';
    const name2 = req.body.team2?.name || 'default';

    const fileName = `${formattedDate}_${name1}_${name2}.json`;
    const filePath = path.join(__dirname, 'public/static/matchdata', fileName);

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send({ message: 'Error saving data' });
        }
        res.send({ message: 'Data saved successfully' });
    });
});

var number, toss, overs, team1, team2, commonPlayer;
var players = [];
app.post('/team', (req, res) => {
    team1 = req.body.team1;
    team2 = req.body.team2;
    number = req.body.number;
    overs = req.body.overs;
    toss = req.body.toss;

    res.status(200).render('players.pug', { team1, team2, number, overs, toss });
});
app.post('/players', (req, res) => {
    for (let i = 0; i < 2 * number; i++) {
        let playerName = `player${i + 1}`;
        players[i] = req.body[playerName];
    }
    commonPlayer = req.body.common;

    res.status(200).render('match.pug', { toss, number, players, commonPlayer });
});
app.post('/striker', (req, res) => {
    var striker = req.body.striker;
    var nonStriker = req.body.nonStriker;
    var bowler = req.body.bowler;
    res.status(200).render('start.pug', { commonPlayer, team1, team2, players, number, toss, overs, striker, nonStriker, bowler });
});
app.get('/over', (req, res) => {
    res.status(200).render('over.pug', { players, number, commonPlayer, toss, overs });
});
app.get('/data', async (req, res) => {
    try {
        const directoryPath = path.join(__dirname, 'public/static/matchdata');
        const files = await fs.readdir(directoryPath);

        const matchDataArray = [];
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const fileContents = await fs.readFile(filePath, 'utf8');
            matchDataArray.push(JSON.parse(fileContents));
        }

        res.render('showMatches', { matches: matchDataArray });
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).send('Error fetching match data');
    }
});

app.get('/matchdata', async (req, res) => {
    try {
        const directoryPath = path.join(__dirname, 'public/static/matchdata');
        const files = await fs.readdir(directoryPath);

        const matchDataArray = [];
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const fileContents = await fs.readFile(filePath, 'utf8');
            matchDataArray.push(JSON.parse(fileContents));
        }
        matchDataArray.reverse();
        res.json(matchDataArray);
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).send('Error fetching match data');
    }
});

app.listen(process.env.PORT || 1204, () => {
    console.log('Server is running on port 1204');
});
