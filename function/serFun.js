const fs = require('fs');
const chalk = require('chalk')
const moment = require('moment')
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')

//function chache

const uncache = (module = '.') => {
return new Promise((resolve, reject) => {
try {
delete require.cache[require.resolve(module)]
resolve()
} catch (e) {
reject(e)
}
})
}

const nocache = (module, cb = () => { }) => {
console.log(`Module ${module} sedang diperhatikan terhadap perubahan`)
fs.watchFile(require.resolve(module), async () => {
await uncache(require.resolve(module))
cb(module)
})
}
// Auto Update Server
require('../mbot')
nocache('../mbot', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))


require('../index')
nocache('../index', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))

require('./bot_function')
nocache('./bot_function', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))

//connection status & data server
  const status_Connection = async (mbot, update, connectToWhatsApp) => {  
console.log('Connection update:', update)
if (update.connection === 'open') 
console.log("Connected with " + mbot.user.id)
else if (update.connection === 'close')
connectToWhatsApp()
.catch(err => console.log(err))
}



module.exports = { uncache, nocache, status_Connection}