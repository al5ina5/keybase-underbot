const core = require('../core.js')
const settings = require('../settings.json')
const strings = require('../strings.json')
const rn = require('random-number')

var actionName = 'heist'

exports.run = (message, bot) => {

    core.getSecondsSince(message.sender.username, actionName, (seconds) => {
        if (seconds < settings.actions[actionName].cooldown){
            bot.chat.send(message.channel, {body: `You must wait **${settings.actions[actionName].cooldown - seconds} seconds** until you go on another heist.`})
            return
        }

        if (Math.random() < settings.actions[actionName].rate) {
            var reward = rn({min: settings.actions[actionName].minwin, max: settings.actions[actionName].maxwin, integer: true})
        } else {
            var reward = rn({min: settings.actions[actionName].maxloss, max: settings.actions[actionName].minloss, integer: true})
        }

        if (reward > 0) {
            bot.chat.send(message.channel, {body: `✅ @${message.sender.username} went on a heist and **made off with $${reward}**. \r\n > ${strings[actionName].win[rn({min: 0, max: Object.keys(strings[actionName].win).length - 1, integer: true})]}`})
        } else {
            bot.chat.send(message.channel, {body: `💔 @${message.sender.username} went on a heist and **lost $${Math.abs(reward)}**. \r\n > ${strings[actionName].fail[rn({min: 0, max: Object.keys(strings[actionName].win).length - 1, integer: true})]}`})
        }

        core.createLedgerEntry(message.sender.username, reward, actionName)

    })
}

exports.help = 'Go on heist—at your own risk.'
exports.usage = `${settings.prefix}heist`
