const strings = require('../strings.json')
const settings = require('../settings.json')

exports.run = (message, bot) => {
    bot.chat.send(message.channel, {body: 'This is a test command used for development purposes.'})
    // console.log(message)
    // console.log(message.content.text.userMentions[0])

    if (!message.atMentionUsernames) {
        bot.chat.send(message.channel, {body: 'You must tag a person to give money to.'})
        return
    }
}

exports.help = 'This is a test command used for development purposes.'
exports.usage = `${settings.prefix}test`
