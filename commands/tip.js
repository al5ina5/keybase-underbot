const core = require('../core.js')
const settings = require('../settings.json')

var rate = 250

exports.run = (message, bot) => {
    
    console.log(message.content.text.payments)

    if (!message.content.text.payments) {
        bot.chat.send(message.channel, {body: `To purchase points with XLM, send me XLM like this: \`+buy +[amount]XLM@underverse\`, \`+buy +10XLM@underverse\``})
        return
    }

    if (message.content.text.payments[0].username != 'underverse') {
        bot.chat.send(message.channel, {body: `*Uh...* did you mean to send that tip to me? :(`})
        return
    }

    if (message.content.text.payments[0].result.error) {
        bot.chat.send(message.channel, {body: `**Your payment failed. :(**\`\`\`${message.content.text.payments[0].result.error}\`\`\``})
        return
    }

    var txid = message.content.text.payments[0].result.sent

    bot.chat.send(message.channel, {body: `Validating payment...`})

    setTimeout(() => {
        bot.wallet.history('GDXYVS22G7W37QA653FEZVOMJAQNKGVQ5XUD5NOPT7Z7XXFQHZPXC3DV').then(transactions => {
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
exports.usage = `${settings.prefix}buy +[amount]XLM@underverse, ${settings.prefix}buy +10XLM@underverse`
exports.alias = 'buy'