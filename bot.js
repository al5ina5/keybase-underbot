const Bot = require("keybase-bot");
const fs = require("fs");
const core = require("./core.js");
const settings = require("./settings.json");

var commands = {};

fs.readdir("./commands/", (err, files) => {
  files.forEach(file => {
    // console.log(`Loading ${file}...`)
    var prop = require(`./commands/${file}`);
    core.commands[file.split(".")[0]] = prop;
  });
});

async function main() {
  const bot = new Bot();

  console.log("Starting Keybase bot...");

  await bot
    .init(settings.keybase.username, settings.keybase.paperkey)
    .catch(err => console.log(err));

  console.log(
    `Connection with Keybase established as ${bot.myInfo().username}.`
  );
  console.log(`Commands Loaded: ${Object.keys(core.commands).join(", ")}`);
  
  var commandAd = {
    advertisements: [
      {
        type: 'public',
        commands: []
      }
    ],
  }

  await bot.chat.clearCommands()
  var num = 0

  for (var i in core.commands) {
      var prep =  {
        name: i,
        description: core.commands[i].help,
        usage: core.commands[i].usage,
      }
      commandAd.advertisements[0].commands[num] = prep
      num++
  }

  await bot.chat.advertiseCommands(commandAd)

  const onMessage = message => {
    try {
      var cmd = message.content.text.body.toLowerCase().trim();
      var args = cmd.split(" ");

      if (!cmd.startsWith(settings.prefix)) return;

      // if (message.channel.name != 'underforums' || message.channel.topicName != 'gameroom') {
      //     bot.chat.send(message.channel, {
      //         body: `*Hey @${message.sender.username}!* I only work in @underforums for now. Join @underforums#gameroom to play!`
      //     })
      //     return
      // }

      console.log(`${message.sender.username}: ${cmd}`);
      for (const command in core.commands) {
        if (
          cmd.startsWith(settings.prefix + command) ||
          cmd.startsWith(settings.prefix + core.commands[command].alias)
        ) {
          core.commands[command].run(message, bot, args);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  bot.chat
    .watchAllChannelsForNewMessages(onMessage)
    .catch(err => console.log(err));
}

main();
