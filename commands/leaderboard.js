const core = require('../core.js')
const settings = require('../settings.json')

exports.run = (message, bot) => {
    var query = 'SELECT user,SUM(amount) AS balance FROM ledger GROUP BY user ORDER BY balance DESC LIMIT 10'
    core.db.query(query, [message.sender.username], (err, results, fields) => {
        if (err) console.log(err)

        var leaderboard = []
        var num = 0
        results.forEach(player => {
            num++
            leaderboard.push(`> ${num}. **$${player.balance}**: ${player.user}`)
        });

        bot.chat.send(message.channel, {body: `**Leaderboard** \r\n ${leaderboard.join('\r\n')}`})
        
        console.log(results)
    })
}

exports.help = 'View the leaderboard.'
exports.usage = `${settings.prefix}leaderboard, ${settings.prefix}lb`
exports.alias = 'lb'