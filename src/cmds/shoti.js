const fs = require("fs");
const path = require("path");
const axios = require("axios");

const filePath = path.join(__dirname, "cache", "shoti.json");
const videoPath = path.join(__dirname, "cache", "shoti.mp4");

module.exports = {
  eurix: {
    name: "shoti", 
    version: "1.0.0",
    credits: "Eugene Aguilar",
    description: "Generate random shoti",
    permission: "user",
    usages: "[shoti]",
    cooldown: 10,
    category: "other",
  },
  execute: async function ({ api, args, event, reply }) {
    if (args[0] === "ea_add") {
      const god = ["61562844636633"];
      if (!god.includes(event.senderID)) {
        return reply("You are not authorized");
      }

      const url = args.slice(1).join(" ");

      if (!url) {
        return reply("Missing URL");
      }

      if (!url.includes("https://vt.tiktok.com/")) {
        return reply("Invalid URL");
      }

      try {
        const shoti = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "[]";
        let data = JSON.parse(shoti);

        if (data.includes(url)) {
          return reply("URL already exists in the list: " + url);
        }

        data.push(url);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        reply("URL added successfully: " + url);
      } catch (error) {
        console.error("Error:", error.message);
        reply("Error saving URL");
      }
    } else {
      try {
        const eabab = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "[]";
        const data = JSON.parse(eabab);

        if (data.length === 0) {
          return reply("No URLs available");
        }

        const amen = data[Math.floor(Math.random() * data.length)];
        const response = await axios.get(`https://tikwm.com/api/?url=${amen}`);
        const username = response.data.data.author.unique_id;
        const nickname = response.data.data.author.nickname;
        const videoUrl = response.data.data.play;
        const title = response.data.data.title || "No title available";

        console.log(`Successfully sent shoti to ${event.senderID}\nUsername: ${username}\nNickname: ${nickname}\nTitle: ${title}\nVideo URL: ${videoUrl}`);

        // Download video and save it as cache/shoti.mp4
        const videoStream = await axios({
          url: videoUrl,
          method: 'GET',
          responseType: 'stream',
        });

        const writer = fs.createWriteStream(videoPath);
        videoStream.data.pipe(writer);

        writer.on('finish', () => {
          reply({
            body: `🎥 Title: ${title}\n👤 Author: ${username} (${nickname})`,
            attachment: fs.createReadStream(videoPath) // Send the downloaded video
          });
        });

        writer.on('error', (err) => {
          console.error("Error saving video:", err.message);
          reply("Error downloading the video");
        });

      } catch (error) {
        console.error("Error:", error.message);
        reply("Error fetching data from the API");
      }
    }
  }
};