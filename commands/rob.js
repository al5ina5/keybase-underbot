const core = require('../core.js')
const settings = require('../settings.json')
const rn = require('random-number')

var actionName = 'rob'

exports.run = (message, bot, args) => {

    core.getSecondsSince(message.sender.username, actionName, (seconds) => {
        if (seconds < settings.actions[actionName].cooldown) {
            bot.chat.send(message.channel, {body: `You must wait **${settings.actions[actionName].cooldown - seconds} seconds** before you can rob someone again.`})
        } else {
            if (!message.atMentionUsernames) {
                bot.chat.send(message.channel, {body: 'You must tag a person to rob.'})
                return
            }
        
            core.getBalance(message.atMentionUsernames[0], (balance) => {
                if (balance < 100) {
                    var amount = rn({min: settings.actions[actionName].maxloss, max: settings.actions[actionName].minloss, integer: true})
                    bot.chat.send(message.channel, {body: `You really shouldn't rob the poor. The gods have fined you *$${amount}* for being so inconsiderate.`})
        
                    core.createLedgerEntry(message.sender.username, amount, 'fined')
                } else {
                    var percentage = rn({min: 0.01, max: 0.05})
                    var amount = parseInt(balance * percentage)

                    if (Math.random() < settings.actions[actionName].rate) {

                        bot.chat.send(message.channel, {body: `Oh no! @${message.sender.username} just robbed @${message.atMentionUsernames[0]} for *$${amount} (${percentage * 100}%)*.`})
                        
                        core.createLedgerEntry(message.sender.username, amount, actionName)
                        core.createLedgerEntry(message.atMentionUsernames[0], -Math.abs(amount), 'robbed')
                        
                        // var amount = rn({min: settings.actions[actionName].minwin, max: settings.actions[actionName].maxwin, integer: true})
                    } else {
                        // var amount = rn({min: settings.actions[actionName].maxloss, max: settings.actions[actionName].minloss, integer: true})
                        
                        bot.chat.send(message.channel, {body: `You got caught stealing from @${message.atMentionUsernames[0]}. He sued you for *$${Math.abs(amount)}*.`})

                        core.createLedgerEntry(message.sender.username, -Math.abs(amount), `${actionName}-fail`)
                    }
            
                    // if (amount > 0) {
                    //     bot.chat.send(message.channel, {body: `Oh no! @${message.sender.username} just robbed @${message.atMentionUsernames[0]} for *$${amount}*.`})
                    //     core.createLedgerEntry(message.sender.username, amount, 'rob')
                    //     core.createLedgerEntry(message.atMentionUsernames[0], -Math.abs(amount), 'robbed')
                    // } else {
                    //     bot.chat.send(message.channel, {body: `You got caught stealing from @${message.atMentionUsernames[0]} and were fined $${Math.abs(amount)}.`})
                    //     core.createLedgerEntry(message.sender.username, amount, 'fined')
                    // }
                }
            })
        }
    })

}

exports.help = 'Take money from your friends or foes.'
exports.usage = `${settings.prefix}rob <tag>, ${settings.prefix}steal <tag>`
exports.alias = 'steal'