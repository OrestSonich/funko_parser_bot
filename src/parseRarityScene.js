import { Scenes } from "telegraf"
import { fetchRarityCards } from "./funkoApiService.js"
import { backMenuBtn } from "./buttons.js"
import { backMenu } from "./commands.js"


export const parseRarity = new Scenes.BaseScene('parseRarity')
parseRarity.enter(async ctx  => {
    await ctx.replyWithHTML(`Надішли мені назву колекції \nВ форматі - <b>steven.funko</b>`, {...backMenuBtn})
})
parseRarity.hears('◀ Повернутись до головного меню', async ctx => {
    await ctx.scene.leave()
    return backMenu(ctx)
})

parseRarity.on('text', async ctx => {
    try {
        const { message_id } = await ctx.reply("Обробка...")

        const collectionName = ctx.message.text.trim().toLowerCase()
        if (/[а-я]/i.test(collectionName)){
            ctx.telegram.editMessageText(ctx.chat.id, message_id, 0, '❌ Некоректна назва колекції')
            return ctx.reply("Спробуйте ще раз:", {...backMenuBtn})
        }

        const result = fetchRarityCards(collectionName)
        result.then(value => {
            if(value.length===0){
                ctx.telegram.editMessageText(ctx.chat.id, message_id, 0, '❌ Некоректна назва колекції')
                return ctx.reply("Спробуйте ще раз:", {...backMenuBtn})
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

                setTimeout(()=> ctx.replyWithHTML(response, {...backMenuBtn}), 500)
            }
        })
    }
    catch (e) {
        console.error(e)
    }
})
