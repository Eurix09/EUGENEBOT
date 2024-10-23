const axios = require("axios");

module.exports = {
    eurix: {
        name: "google",
        version: "1.0.0",
        credits: "Eugene Aguilar",
        description: "Searches Google for the provided query.",
        permission: 0,
        usages: "[query]",
        cooldown: 5,
    },

    execute: async function ({ api, event, args, reply }) {
        if (args.length === 0) {
            return reply("Please provide a search query.");
        }

        const query = args.join(" ");

const myHeaders = {
        'apikey': '9alo4KELNeoXwFG1mGUnKTa7NDkj32P0'
    };

    try {
        const response = await axios.get(`https://api.apilayer.com/google_search?q=${encodeURIComponent(query)}`, {
            headers: myHeaders
        });

            const data = response.data;

            if (data && data.organic && data.organic.length > 0) {
                let message = `Search results for "${query}":\n\n`;
                data.organic.slice(0, 5).forEach((result, index) => {
                    message += `${index + 1}. ${result.title}\n${result.link}\n${result.description}\n\n`;
                });

                reply(message);
            } else {
                reply("No results found.");
            }
        } catch (error) {
            console.error("Error fetching search results: ", error);
            reply("There was an error fetching the search results.");
        }
    }
};
