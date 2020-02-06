const core = require('../core.js')
const settings = require('../settings.json')
const strings = require('../strings.json')
const rn = require('random-number')

var actionName = 'quest'

exports.run = (message, bot) => {

    core.getSecondsSince(message.sender.username, actionName, (seconds) => {
        if (seconds < settings.actions[actionName].cooldown){
            bot.chat.send(message.channel, {body: `You must wait **${settings.actions[actionName].cooldown - seconds} seconds** until more quests are available.`})
            return
        }

        core.getBalance(message.sender.username, (balance) => {
            if (1000 > balance) {
                bot.chat.send(message.channel, {body: `You must have atleast $1,000 to go on a quest.`})
            } else {
                if (Math.random() < settings.actions[actionName].rate) {
                    var reward = rn({min: settings.actions[actionName].minwin, max: settings.actions[actionName].maxwin, integer: true})
                } else {
                    var reward = rn({min: settings.actions[actionName].maxloss, max: settings.actions[actionName].minloss, integer: true})
                }
        
                if (reward > 0) {
                    bot.chat.send(message.channel, {body: `✅ @${message.sender.username} completed a dangerous quest and **was rewarded $${reward}**. \r\n > ${strings[actionName].win[rn({min: 0, max: Object.keys(strings[actionName].win).length - 1, integer: true})]}`})
                } else {
                    bot.chat.send(message.channel, {body: `💔 @${message.sender.username} failed an important quest and **lost $${Math.abs(reward)}**. \r\n > ${strings[actionName].fail[rn({min: 0, max: Object.keys(strings[actionName].win).length - 1, integer: true})]}`})
                }
        
                core.createLedgerEntry(message.sender.username, reward, actionName)
            }
        })

    })
}

exports.help = 'Go on quest. High rewards. High stakes.'
exports.usage = `${settings.prefix}quest`
