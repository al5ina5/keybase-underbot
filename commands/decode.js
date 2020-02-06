const core = require('../core.js')
const settings = require('../settings.json')
const rn = require('random-number')

var actionName = 'decode'

var correctNumber = rn({min: 1, max: 10, integer: true})
var reward

exports.run = (message, bot, args) => {
    console.log(`Decode number: ${correctNumber}`)

    if (!args[1]) {
        bot.chat.send(message.channel, {body: 'You must enter a number between *1* and *10* to try to decode with.'})
        return
    }

    var number = parseInt(args[1])

    if (isNaN(number)) {
        bot.chat.send(message.channel, {body: `*${args[1]}* isn't a valid number to try to decode with.`})
        return
    }

    if (number < 1 || number > 10) {
        bot.chat.send(message.channel, {body: 'You must enter a number between *1* and *10* to try to decode with.'})
        return
    }

    if (number != correctNumber) {
        reward = rn({min: settings.actions.decode.maxloss, max: settings.actions.decode.minloss, integer: true})
        core.createLedgerEntry(message.sender.username, reward, `${actionName}-fail`, `zapped for bad decode`)

        bot.chat.send(message.channel, {body: `*ZAPPED!* You were zapped while decoding and lost *$${Math.abs(reward)}*.`})
        return
    }
    reward = rn({min: settings.actions.decode.minwin, max: settings.actions.decode.maxwin, integer: true})
    core.createLedgerEntry(message.sender.username, reward, actionName, correctNumber)

    bot.chat.send(message.channel, {body: `*Decoded successfully.* @${message.sender.username} has l337 h4ck!ng skillz. You get to keep *$${reward}*!`})
    correctNumber = rn({min: 1, max: 10, integer: true})
    console.log(`Decode number: ${correctNumber}`)
}

exports.help = 'Use a number between 1 and 10 to decode successfully and win (big?) but risk zapping yourself in the process.'
exports.usage = `${settings.prefix}decode <1-10>, ${settings.prefix}decode 3`