const core = require('../core.js')
const settings = require('../settings.json')

var rate = 250

exports.run = (message, bot) => {
    
    console.log(message.content.text.payments)

    if (!message.content.text.payments) {
        bot.chat.send(message.channel, {body: 'To purchase points with XLM, send me XLM like this: `+buy +[amount]XLM@underbot`, `+buy +10XLM@underbot`'})
        return
    }

    var txid = message.content.text.payments[0].result.sent

    bot.chat.send(message.channel, {body: `Validating payment...`})

    setTimeout(() => {
        bot.wallet.history('GCBSUEZMC3S6D5PC3TSWPHF72DORMHAUJO5Q4QLSMMM72LLFBH3MG5ZO').then(transactions => {
            for (var i in transactions) {
                if (transactions[i].txId == txid) {
                    bot.chat.send(message.channel, {body: `Thanks for the tip @${message.sender.username}! You've been granted *$${parseInt(transactions[i].amount * rate)}*.`})

                    core.createLedgerEntry(message.sender.username, parseInt(transactions[i].amount * rate), 'tip', `tipped ${transactions[i].amount} XLM (${transactions[i].txId})`)
                    break
                }
            }
        })
    }, 5000)

}

exports.help = 'Tip the bot and you might just be rewarded!'
exports.usage = `${settings.prefix}buy +[amount]XLM@underbot, ${settings.prefix}buy +10XLM@underbot`
exports.alias = 'buy'