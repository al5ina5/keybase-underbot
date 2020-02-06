const core = require('../core.js')
const settings = require('../settings.json')

exports.run = (message, bot) => {
    var commandList = []
    for (const command in core.commands) {
        commandList.push(`\`${settings.prefix}${command}\``)
    }

    bot.chat.send(message.channel, {body: `*Commands:* ${commandList.join(', ')} \r\n More: http://github.com/al5ina5/keybase-underbot`})
}

exports.help = 'Get a list of commands.'
exports.usage = `${settings.prefix}commands`