const { expect } = require('chai');

const {
    buildListenMatrix,
    calculateRecommendations,
} = require('./recommender');

const listensFixture = [
    { 'user': 'user a', 'subtopic': '1' },
    { 'user': 'user a', 'subtopic': '4' },
    { 'user': 'user a', 'subtopic': '5' },
    { 'user': 'user b', 'subtopic': '1' },
    { 'user': 'user b', 'subtopic': '3' },
    { 'user': 'user b', 'subtopic': '5' },
    { 'user': 'user c', 'subtopic': '2' },
    { 'user': 'user c', 'subtopic': '3' },
    { 'user': 'user c', 'subtopic': '5' },
];

const subtopics = { '1': false, '2': false, '3': false, '4': false, '5': false };

(function testBuildMatrix() {
    const matrix = buildListenMatrix(listensFixture, subtopics);
    expect(matrix['user a']['1']).to.be.equal(true);
    expect(matrix['user a']['2']).to.be.equal(false);
    expect(matrix['user a']['4']).to.be.equal(true);
    expect(matrix['user b']['1']).to.be.equal(true);
})();

(function testCreateRecommendations() {
    const matrix = buildListenMatrix(listensFixture, subtopics);
    const recs = calculateRecommendations(matrix, Object.keys(subtopics));
    expect(recs['1'][0]).to.be.equal('5');
    expect(recs['3'][0]).to.be.equal('5');
    expect(recs['5'][0]).to.be.equal('1');

    expect(recs['1'].length).to.be.equal(3);
    expect(recs['2'].length).to.be.equal(2);
    expect(recs['3'].length).to.be.equal(3);
    expect(recs['4'].length).to.be.equal(2);
    expect(recs['5'].length).to.be.equal(4);
})();

process.exit();
