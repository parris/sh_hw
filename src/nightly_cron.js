const fs = require('fs');

const {
    buildListenMatrix,
    calculateRecommendations,
} = require('./recommender');

const listens = require('../data/listens.json');
const subtopics = require('../data/subtopics.json');

const subtopicIds = subtopics.map((topic) => topic.id);

const listenMatrix = buildListenMatrix(
    listens,
    subtopicIds
        .reduce((output, key) => {
            output[key] = false;
            return output;
        }, {})
);

const recs = calculateRecommendations(listenMatrix, subtopicIds);

const dateISO = (new Date()).toISOString().split('T')[0];
const recsFile = `${__dirname}/../data/${dateISO}.json`;
fs.writeFileSync(recsFile, JSON.stringify(recs));

const latestFile = `${__dirname}/../data/latest.js`;
fs.writeFileSync(latestFile, `module.exports = require('./${dateISO}.json');`);

process.exit();
