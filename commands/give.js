const core = require('../core.js')
const settings = require('../settings.json')

exports.run = (message, bot, args) => {

    if (!message.atMentionUsernames) {
        bot.chat.send(message.channel, {body: 'You must tag a person to give money to.'})
        return
    }

    var amount = parseInt(args[2])

    if (!amount) {
        bot.chat.send(message.channel, {body: `You must enter an amount to give @${message.atMentionUsernames[0]}.`})
        return
    }
    
    if (isNaN(amount)) {
        bot.chat.send(message.channel, {body: `Your must enter a numerical value to give.`})
        return
    }

    core.getBalance(message.sender.username, (balance) => {
        if (amount > balance) {
            bot.chat.send(message.channel, {body: `You can't give @${message.atMentionUsernames[0]} *$${amount}* because you don't even have $${amount}.`})
            return
        } else {
            bot.chat.send(message.channel, {body: `How kind. @${message.sender.username} gave @${message.atMentionUsernames[0]} *$${amount}*.`})

            core.createLedgerEntry(message.sender.username, -Math.abs(amount), 'give')
            core.createLedgerEntry(message.atMentionUsernames[0], amount, 'give')
        }
    })

}

exports.help = 'Give money to your friends or foes.'
exports.usage = `${settings.prefix}give <tag> <amount>`
