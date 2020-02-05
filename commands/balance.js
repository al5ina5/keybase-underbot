const core = require('../core.js')
const settings = require('../settings.json')

exports.run = (message, bot) => {
    core.getBalance(message.sender.username, (balance) => {
        bot.chat.send(message.channel, {body: `@${message.sender.username}'s balance: **$${balance}**`})
    })
}

exports.help = 'Check your balance.'
exports.usage = `${settings.prefix}balance, ${settings.prefix}bal`
exports.alias = 'bal'