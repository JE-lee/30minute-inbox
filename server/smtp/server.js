const smtp = require('smtp-protocol')
const chalk = require('chalk')
const config = require('../config')

exports.createSmtpServer = function (){
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => reject(new Error('START SMTP SERVER TIMEOUT')), 3000)
    const smtpServer = smtp.createServer(function(req) {
      req.on('to', (to, ack) => {
        let domain = to.split('@')[1]
        if (domain !== config.host) {
          ack.reject()
        } else {
          ack.accept()
        }
      })

      req.on('message', (stream, ack) => {
        // eslint-disable-next-line no-console
        console.log('from: ' + req.from)
        // eslint-disable-next-line no-console
        console.log('to: ' + req.to)

        stream.pipe(process.stdout, { end: false })
        ack.accept()
      })

    })

    // listen in port 25
    smtpServer.listen(config.smtpPort, err => {
      if (err) reject(err)
      else {
        clearTimeout(timer)
        // eslint-disable-next-line no-console
        console.log(chalk.green(`smtp server is listening on port ${config.smtpPort}`))
        resolve(smtpServer)
      }
    })
  })
}