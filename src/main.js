const http = require('http');
const url = require('url');

const subtopics = require('../data/subtopics');
const latestRecommendations = require('../data/latest');

const subtopicsIdsToNames = subtopics.reduce((o, topic) => {
    o[topic.id] = topic.name;
    return o;
}, {});
const subtopicsNamesToIds = subtopics.reduce((o, topic) => {
    o[topic.name] = topic.id;
    return o;
}, {});

const hostname = '127.0.0.1';
const port = 3191;

const error404 = (res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/json');
    res.end(JSON.stringify({ error: 'Not Found' }));
}

const server = http.createServer((req, res) => {
    const parsedURL = url.parse(req.url, true);

    if (!parsedURL.query.subtopic) {
        error404(res);
        return;
    }

    // should this be a the topic id or name?
    const subtopicId = subtopicsNamesToIds[parsedURL.query.subtopic];

    if (
        parsedURL.pathname === '/recommendations' &&
        latestRecommendations[subtopicId]
    ) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/json');

        res.end(JSON.stringify({
            'subtopic': parsedURL.query.subtopic,
            'recommendations': latestRecommendations[subtopicId]
                .map((topicId) => {
                    // am I returning names or ids... ill just return both
                    return {
                        id: topicId,
                        name: subtopicsIdsToNames[topicId],
                    };
                }),
        }));
    } else {
        error404(res);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
