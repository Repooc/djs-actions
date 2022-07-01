const core = require('@actions/core');
const github = require('@actions/github');
const { WebhookClient } = require("discord.js");
const BuildMessage = require('./lib/BuildMessage');

// Setup Data
const data = {

    // Webhook Data
    webhook_ID: core.getInput("id"),
    webhook_TOKEN: core.getInput("token"),

    // Webhook Options
    avatar: core.getInput("avatar"),
    username: core.getInput("username"),
    content: core.getInput("content"),

    // Embed Options
    title: core.getInput("title"),
    url: core.getInput("url"),
    description: core.getInput("description"),

    author: (core.getInput("author")) ? {
        name: core.getInput("author"),
        iconURL: core.getInput("author_icon"),
        url: core.getInput("author_url")
    } : null,

    footer: (core.getInput("footer")) ? {
        text: core.getInput("footer"),
        iconURL: core.getInput("footer_icon"),
    } : null,

    image: (core.getInput("image")) ? {
        url: core.getInput("image")
    } : null,

    thumbnail: (core.getInput("thumbnail")) ? {
        url: core.getInput("thumbnail")
    } : null,

    timestamp: core.getInput("timestamp"),
    color: core.getInput("color"),

    fields: (core.getInput("fields") && typeof(core.getInput("fields") === "object")) ? JSON.parse(core.getInput("fields")) : null,
};

try {
    core.debug("Loading Client...");

    const Client = new WebhookClient({id: data.webhook_ID, token: data.webhook_TOKEN});
    core.info("Configuration");
    core.info(JSON.stringify(data));
    core.info("core.getInput('fields')")
    core.info(core.getInput("fields"))
    core.info("JSON.parse(core.getInput('fields'))")
    core.info(JSON.parse(core.getInput("fields")))
    delete data.webhook_TOKEN;
    delete data.webhook_ID;

    const ResultMessage = BuildMessage(data);
    if(data.content) {
        core.info('Sending content message');
        Client.send(data.content, ResultMessage);
    } else {
        core.info('Sending embed message');
        Client.send(ResultMessage);
    }

} catch (error) {
    core.setFailed("[Discord.js]: ", error)
}
