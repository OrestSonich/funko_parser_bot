import 'dotenv/config'
import { Telegraf } from 'telegraf'
import { fetchRarityCards } from "./funkoApiService.js"
const TOKEN = process.env.TOKEN
const bot = new Telegraf(TOKEN)

bot.start( async ctx => {
 try{
  await ctx.replyWithPhoto({source: '\wax.webp'})
  await ctx.reply("Привіт, я бот для парсингу фанко 👋\nЩоб почати роботу обери /parse")
  console.log(ctx.message.chat.id)
 }
 catch (e){
  console.error(e)
 }
})

bot.command('parse', async ctx => {
 await ctx.replyWithHTML(`Надішли мені назву колекції \nВ форматі - <b>steven.funko</b>`)
})

bot.on('text', async ctx => {
 try {
  const collectionName = ctx.message.text.trim().toLowerCase()
  const { message_id } = await ctx.reply("Обробка...")
  const result = fetchRarityCards(collectionName)
  result.then(value => {
   if(value.length===0){
    return ctx.telegram.editMessageText(ctx.chat.id, message_id, 0, '❌ Некоректна назва колекції')
   } else {
    ctx.telegram.editMessageText(ctx.chat.id,
                                 message_id,
                                 0,
                                 {text: `Collection: <b>${value[0].collection.name}</b>:`,
                                  parse_mode: 'html'})
    let response = "";
    value.map((el) => response += (`Name: ${el.immutable_data.name},
Rarity: <b>${el.immutable_data.rarity}</b>,
Supply: <i>${el.max_supply}/${el.issued_supply}</i>\n\n`))

    setTimeout(()=> ctx.replyWithHTML(response), 500)
   }
  })
 }
 catch (e) {
  console.error(e)
 }
})



bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

