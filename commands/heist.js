const core = require('../core.js')
const strings = require('../strings.json')
const settings = require('../settings.json')
const rn = require('random-number')

var actionName = 'heist'

var inGame
var winrate
var timeout
var players = []
var reward

var timer = 60000
var playervalue = rn({min: 0.01, max: 0.2})

exports.run = (message, bot) => {
    if (!inGame) {
        inGame = true
        winrate = rn({min: 0.2, max: 0.3})
        players = []

        players.push(message.sender.username)

        bot.chat.send(message.channel, {body: `*Heist* \r\n > @${message.sender.username} has started a heist. Join the heist within ${timer / 1000} seconds to increase the win-rate and reep the rewards. Current win-rate: ${parseInt(winrate * 100)}%.`})

        timeout = setTimeout(() => {
            var rand = Math.random()
            if(rand < winrate) {
                reward = rn({min: settings.actions.heist.minwin, max: settings.actions.heist.maxwin, integer: true})

                bot.chat.send(message.channel, {body: `The heist was *won*. @${players.join(', @')} ran off with *$${reward}* each!`})
            } else {
                reward = rn({min: settings.actions.heist.maxloss, max: settings.actions.heist.minloss, integer: true})

                bot.chat.send(message.channel, {body: `*F%$K!* The heist was breached by police. All participants were caught and fined *$${Math.abs(reward)}*.`})
            }

            for (var player in players) {
                console.log(players[player] + 'won')
                core.createLedgerEntry(players[player], reward, reward > 0 ? actionName : `${actionName}-fail`, `heist with ${players.join(', ')}`)
            }

            inGame = false
        }, timer)
    } else {
        if (players.includes(message.sender.username)) {
            bot.chat.send(message.channel, {body: `@${message.sender.username} is already a part of the current heist. Heisters: ${players.join(', ')}.`})
            return
        }

        timeout.refresh()
        winrate += playervalue
        players.push(message.sender.username)
        bot.chat.send(message.channel, {body: `@${message.sender.username} joined the heist. *Win-rate increased to ${parseInt(winrate * 100)}%.* Heisters: ${players.join(', ')}.`})
    }
}

exports.help = 'Go on a collaborative heist. The more members the join the heist, the higher the chances of winning. Heisters have 60 seconds to join. Each joinee resets the clock to 60 allowing for more time to hesiters to join. Coordinate with your fellow players are pay the cost of immorality if you are caught by police.'
exports.usage = `${settings.prefix}heist`
