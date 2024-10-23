const axios = require("axios");
const fs = require("fs");
const path = require("path");

let isEnabled = false;

module.exports = {
    eurix: {
        name: "sim",
        version: "4.3.7",
        permission: 0,
        credits: "Eugene Aguilar",
        description: "Talk with SimSimi",
        usages: "<ask> on/off",
        cooldown: 2,
        category: "AI"
    },

    execute: async function ({ api, event, args }) {
        try {
            if (args[0] === "off") {
                isEnabled = false;
                return api.sendMessage("SimSimi is now turned off.", event.threadID, event.messageID);
            } else if (args[0] === "on") {
                isEnabled = true;
                return api.sendMessage("SimSimi is now turned on.", event.threadID, event.messageID);
            } else {
                const ask = args.join(" ");
                if (!ask) {
                    return api.sendMessage(
                        `Wrong format\nUse: ${global.config.prefix}sim <on/off>\nOr ${global.config.prefix}sim <ask>`,
                        event.threadID,
                        event.messageID
                    );
                }

                const filePath = path.join(__dirname, "cache", "sim.json");
                const data = JSON.parse(fs.readFileSync(filePath, "utf-8")); // Ensure utf-8 encoding
                const query = ask.toLowerCase();

                if (data.hasOwnProperty(query)) {
                    const randomIndex = Math.floor(Math.random() * data[query].length);
                    const responseData = data[query][randomIndex];
                    return api.sendMessage(responseData, event.threadID, event.messageID);
                } else {
                    return api.sendMessage("I don't understand what you're saying. Can you please teach me?", event.threadID, event.messageID);
                }
            }
        } catch (error) {
            api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
            console.log(error);
        }
    },

    onChat: async function ({ api, event }) {
        try {
            if (!isEnabled) return;

            const message = event.body.toLowerCase(); // Use the message from event
            const filePath = path.join(__dirname, "cache", "sim.json");
            const data = JSON.parse(fs.readFileSync(filePath, "utf-8")); // Ensure utf-8 encoding

            if (data.hasOwnProperty(message)) {
                const randomIndex = Math.floor(Math.random() * data[message].length);
                const result = data[message][randomIndex];
                return api.sendMessage(result, event.threadID, event.messageID);
            } else {
                return api.sendMessage("I don't understand what you're saying. Can you please teach me?", event.threadID, event.messageID);
            }
        } catch (error) {
            api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
            console.log(error);
        }
    }
};