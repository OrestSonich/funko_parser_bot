import 'dotenv/config'
import { Composer, Markup, Scenes, session, Telegraf } from 'telegraf'
import { packsCostScene } from "./packsCostScene.js"
import { mainMenu } from "./buttons.js"
import { backMenu, startPacksCost, startParseRarity } from "./commands.js"
import { parseRarity } from "./parseRarityScene.js"
import { fetchPacksCosts } from "./funkoApiService.js"
const TOKEN = process.env.TOKEN
const bot = new Telegraf(TOKEN)


const stage = new Scenes.Stage([packsCostScene, parseRarity])
bot.use(session())
bot.use(stage.middleware())
bot.hears('Саплай рідких нфт 🎭', startParseRarity)
bot.hears('Ціна паків 💸', startPacksCost)

bot.start( async ctx => {
 try{
  await ctx.replyWithPhoto({source: '\wax.webp'})
  await ctx.reply("Привіт, я бот для парсингу фанко 👋\nЩоб почати натисни на потрібну кнопку ⬇",
                  {... mainMenu})
 }
 catch (e){
  console.error(e)
 }
})

bot.command('info', async ctx => {
 await fetchPacksCosts()
 return ctx.replyWithHTML(`Цей бот створений для аналізу <b>funko pop nft</b>
<i>Автор:</i> @sonichorest, <a href="https://github.com/OrestSonich">GitHub</a>\n
Перезапустити бота - /start
Відкрити меню - /menu`, {disable_web_page_preview: true})
})

bot.command('menu', async ctx => {
 backMenu(ctx)
})





bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

