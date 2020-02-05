const strings = require('../strings.json')
const settings = require('../settings.json')

exports.run = (message, bot) => {
    bot.chat.send(message.channel, {body: '[This is a test command used for development purposes.](https://github.com/al5ina5/keybase-underbot)'})
}

exports.help = 'This is a test command used for development purposes.'
exports.usage = `${settings.prefix}test`
