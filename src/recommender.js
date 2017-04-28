/**
 * Returns a list of categories and their related subtopics
 * @param  {Array<CategoriesListened>} listenMatrix [description]
 * @param  {Array} subtopics An array of subtopics
 * @return {Object<Array>} Categories mapped to their related subtopics (sorted)
 */
const calculateRecommendations = (listenMatrix, subtopics) => {
    // define what a counter looks like
    const counters = subtopics.reduce((output, topic) => {
        output[topic] = 0;
        return output;
    }, {});

    // assign the counter map to every subtopic
    const subtopicCounters = subtopics.reduce((output, topic) => {
        output.set(topic, Object.assign({}, counters));
        return output;
    }, (new Map()));

    const users = Object.keys(listenMatrix);

    // iterate through each subtopic and find related categories from every user
    for (let [topic, counter] of subtopicCounters.entries()) {
        users.forEach((user) => {
            if (listenMatrix[user][topic]) {
                for (let potentialTopic in listenMatrix[user]) {
                    if (listenMatrix[user][potentialTopic]) {
                        counter[potentialTopic]++;
                    }
                }
            }
        });
    }

    const sortedRelatedSubtopics = {};

    // sort and filter identity matrix
    for (let [topic, counter] of subtopicCounters.entries()) {
        const values = [];
        // converting to a different format to make it easier to sort
        for (let key in counter) {
            values.push({ key, value: counter[key] });
        }
        sortedRelatedSubtopics[topic] = values
            .sort((a, b) => b.value - a.value)
            // filter out this key and any that have 0 values
            .filter((obj) => obj.key !== topic && obj.value !== 0 )
            // let's just get an array of topics now
            .map((obj) => obj.key);
    }

    return sortedRelatedSubtopics;
};

/**
 * Generates a matrix of users -> subtopics listened to
 * @param  {Array<Listen>} listens A full or partial listen history
 * @param  {Array<Subtopic>} subtopics A list of all subtopics
 * @return {Array<CategoriesListened>} The user -> subtopic map listened map
 */
const buildListenMatrix = (listens, subtopics) => {
    return listens.reduce((usersToSubCategories, listen) => {
        // if this users hasn't been seen before init their dictionary with subtopics
        if (!usersToSubCategories[listen.user]) {
            usersToSubCategories[listen.user] = subtopics;
        }

        // replace the dictionary for the user with a new dictionary
        // containing the new state of the subtopic.
        usersToSubCategories[listen.user] = Object.assign(
            {},
            usersToSubCategories[listen.user],
            {
                [listen.subtopic]: true,
            }
        );

        return usersToSubCategories;
    }, {});
};

module.exports = {
    buildListenMatrix,
    calculateRecommendations
};
