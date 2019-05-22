const Koa = require('koa')
const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const PassThrough = require('stream').PassThrough
const smtp = require('./smtp/server')

const indexPath = path.resolve(__dirname, './index.html')

const app = new Koa()
const router = new Router()

router.get('/', async (ctx) => {
  ctx.set('Content-Type', 'text/html')
  ctx.body = fs.createReadStream(indexPath, 'utf8').pipe(new PassThrough())
})

app.use(router.routes())
  .use(router.allowedMethods())


async function main(){
  await smtp.createSmtpServer()
  const port = 4000
  app.listen(4000, err => {
    if(err) throw err
    // eslint-disable-next-line no-console
    console.log(chalk.green(`server listening on port ${port}`))
  })
}

main()

