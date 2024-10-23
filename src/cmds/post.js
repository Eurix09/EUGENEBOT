const fs = require("fs");
const axios = require("axios");

module.exports = {
  eurix: {
    name: "post",
    version: "1.0.0",
    credits: "Eugene Aguilar",
    permission: 2,
    description: "Creates a post from user input.",
  },
  execute: async function ({ api, event, args, reply }) {
    const post = args.join(" ");
api.createPost(post,)
  }
};