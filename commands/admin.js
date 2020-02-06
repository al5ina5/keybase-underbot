const core = require('../core.js')
const settings = require('../settings.json')

exports.run = (message, bot) => {
    if (message.sender.username != 'youngseebi') {
        console.log(`${message.sender.username} is not allowed to run the +admin command.`)
        return
    }

    var commandList = []
    for (const command in core.commands) {
        commandList.push(`- \`${settings.prefix}${command}\` - ${core.commands[command].help}`)
    }

    bot.chat.send(message.channel, {body: `\`\`\`${commandList.join('\r\n')}\`\`\``})
}

exports.help = `An admin-only command reserved for test purposes.`
exports.usage = `${settings.prefix}commands`