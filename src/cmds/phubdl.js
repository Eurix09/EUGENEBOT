  const path = require("path");
  const axios = require("axios");

  module.exports = {
    eurix: {
      name: "phubdl",
      credits: "Eugene Aguilar && api by choru tiktokers",
      version: "1.0",
      description: "Download video from pornhub",
      permission: 0,
    },
    execute: async ({ api, event, args, reply }) => {
      const link = args.join(" ");
      if (!link) {
        return reply("Please enter a valid link");
      }

      try {
        const response = await axios.get(
          `https://apichoru.chatbotcommunity.ltd/ph/link?q=${encodeURIComponent(link)}`
        );
        const video = response.data.videoUrl;

        reply({
          body: "Here is your video",
          attachment: await axios({
            url: video,
            method: "GET",
            responseType: "stream",
          }).then((response) => response.data),
        });
      } catch (error) {
        console.error("Error fetching video:", error);
        reply("Failed to download video. Please try again later.");
      }
    },
  };