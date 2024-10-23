const fs = require("fs");
const path = require("path");

module.exports = {
    eurix: {
        name: "teach",
        version: "1.0.2",
        credits: "Eugene Aguilar",
        description: "Teach SimSimi",
        usages: "<ask> | <answer>",
        cooldown: 5,
        category: "AI"
    },

    execute: async function ({ api, event, args }) {
        try {
            const input = args.join(" ");
            const [ask, answer] = input.split(" | ");

            if (!ask || !answer) {
                return api.sendMessage(
                    "Please use the correct format: <ask> | <answer>",
                    event.threadID,
                    event.messageID
                );
            }

            let filePath = path.join(__dirname, "cache", "sim.json");

            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify({}));
            }

            let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

            if (!data[ask]) {
                data[ask] = [];
            }

            data[ask].push(answer);

            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

            return api.sendMessage(`I've learned: "${ask}" -> "${answer}"`, event.threadID, event.messageID);
        } catch (error) {
            api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
            console.log(error);
        }
    }
};