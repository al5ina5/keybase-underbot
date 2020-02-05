const core = require('../core.js')
const settings = require('../settings.json')

exports.run = (message, bot, args) => {

    var command = args[1]

    if (command.includes(settings.prefix)) {
        command = command.split(settings.prefix)[1]
    }

    console.log(command)
    
    if (core.commands[command]) {
        console.log('exists')

        var send = []
        send.push(`*${settings.prefix}${command}*`)
        send.push(`> ${core.commands[command].help}`)
        send.push(`> *Usage:* ${core.commands[command].usage}`)

        bot.chat.send(message.channel, {body: `${send.join('\r\n')}`})
    } else {
        bot.chat.send(message.channel, {body: `Uhh... I don't know that command. I can't help you with that.`})
    }
}

exports.help = 'Get detailed information on a command.'
exports.usage = `${settings.prefix}help <command>`

