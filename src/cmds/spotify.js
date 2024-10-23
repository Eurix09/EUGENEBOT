const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  eurix: {
    name: "spotify",
    version: "1.1.1",
    permission: 0,
    credits: "Eugene Aguilar",
    description: "Play Music With Spotify",
    cooldown: 5,
    usages: "[search]",
  },

  execute: async function ({ reply, args }) {
    try {
      const query = args.join(" ");
      if (!query) {
        return reply(`${global.config.prefix} ${this.eurix.name} ${this.eurix.usages}`);
      }

      // Fetch metadata from the API
      const metadataResponse = await axios.post('https://spotydown.media/api/get-metadata', {
        url: query
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Fetch download URL
      const downloadResponse = await axios.post('https://spotydown.media/api/download-track', {
        url: query
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const trackData = metadataResponse.data.apiResponse.data[0];
      const { album, artist, name: title, cover_url: coverImage } = trackData;
      const mp3Url = downloadResponse.data.file_url;

      // Define paths for saving the files
      const mp3Path = path.join(__dirname, "cache", `spotify_${title}.mp3`);
      const imgPath = path.join(__dirname, "cache", `spotify_${title}.jpg`);

      // Ensure the cache directory exists
      if (!fs.existsSync(path.join(__dirname, "cache"))) {
        fs.mkdirSync(path.join(__dirname, "cache"));
      }

      // Fetch and save the mp3 file and image
      const mp3 = await axios.get(mp3Url, { responseType: "arraybuffer" });
      const img = await axios.get(coverImage, { responseType: "arraybuffer" });

      fs.writeFileSync(mp3Path, Buffer.from(mp3.data));
      fs.writeFileSync(imgPath, Buffer.from(img.data));

      // Reply with music title and album cover
      reply({ body: `Music Title: ${title}\nArtist: ${artist}\nAlbum: ${album}`, attachment: fs.createReadStream(mp3Path) });
      reply({ body: `Album cover for ${title}`, attachment: fs.createReadStream(imgPath) });

    } catch (error) {
      console.error("Error: ", error.message);
      reply(`An error occurred: ${error.message}`);
    }
  }
};