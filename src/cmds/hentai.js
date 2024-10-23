const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  eurix: {
    name: "hentai",
    version: "1.0",
    credits: "Eugene Aguilar",
    description: "This command is not for kids",
    permission: 0,
    cooldown: 5,
  },
  execute: async function ({ api, event, reply }) {
    reply("Video is sending, please wait a minute...");

    try {
      const response = await axios.get("https://deku-rest-apis.ooguy.com/api/randhntai");
      const videos = response.data.result.map(item => item.video_1).filter(Boolean);

      if (videos.length === 0) {
        reply("No videos found.");
        return;
      }

      const randomIndex = Math.floor(Math.random() * videos.length);
      const videoUrl = videos[randomIndex];

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      const videoPath = path.join(cacheDir, "hentai.mp4");

      const videoStream = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(videoPath);

      videoStream.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: "",
            attachment: fs.createReadStream(videoPath),
          },
          event.threadID
        );
      });

      writer.on("error", (error) => {
        console.error(error);
        reply("Failed to download video. Please try again later.");
      });

    } catch (error) {
      console.error(error);
      reply("Failed to retrieve video. Please try again later. " + error.message);
    }
  },
};