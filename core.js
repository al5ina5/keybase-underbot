const mysql = require('mysql')
const settings = require('./settings.json')

exports.commands = {}

var database = mysql.createConnection({
    host: settings.database.host,
    user: settings.database.user,
    database: settings.database.database,
    password: settings.database.password
})

database.connect(function(err) {
  if (err) throw err
  console.log('Connection with database established.')
})

exports.db = database

exports.createLedgerEntry = (user, amount, type, notes) => {
    var query = 'INSERT INTO ledger(user, amount, type, notes, timestamp) VALUES(?, ?, ?, ?, ?)'
    database.query(query, [user, amount, type, notes, Date.now()], (err, results, fields) => {
        if (err) console.log(err)

        console.log(`Ledger record added: ${user}, ${amount}, ${type}, ${notes}`)
    })
}

exports.getSecondsSince = (user, action, callback) => {
    var query = 'SELECT timestamp FROM ledger WHERE user=? AND type=? ORDER BY timestamp DESC LIMIT 1'
    database.query(query, [user, action], (err, results, fields) => {
        if (err) console.log(err)
        
        if (results.length) {
            var seconds = (Date.now() - results[0].timestamp) / 1000
            callback(parseInt(seconds))
        } else {
            callback(9000)
        }
    })

}

exports.getBalance = (user, callback) => {
    var query = 'SELECT SUM(amount) AS balance FROM ledger WHERE user=?' 
    database.query(query, [user], (err, results, fields) => {
        if (err) console.log(err)

        if (results[0].balance) {
            callback(results[0].balance)
        } else {
            callback(0)
        }
    })
}