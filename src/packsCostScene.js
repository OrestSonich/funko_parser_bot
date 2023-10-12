import { Scenes } from "telegraf"
import { backMenuBtn } from "./buttons.js"
import { backMenu } from "./commands.js"
import { fetchPacksCosts } from "./funkoApiService.js"


export const packsCostScene = new Scenes.BaseScene('packsCost')

packsCostScene.enter(async ctx  => {
    await ctx.replyWithHTML(`Надішли мені назву колекції \nВ форматі - <b>steven.funko</b>`, backMenuBtn)
})
packsCostScene.hears('◀ Повернутись до головного меню', async ctx => {
    await ctx.scene.leave()
    return backMenu(ctx)
})
packsCostScene.on("text", async ctx => {
try {
    const { message_id } = await ctx.reply("Обробка...")

    const collectionName = ctx.message.text.trim().toLowerCase()
    if (/[а-я]/i.test(collectionName)){
        ctx.telegram.editMessageText(ctx.chat.id, message_id, 0, '❌ Некоректна назва колекції')
        return ctx.reply("Спробуйте ще раз:", {...backMenuBtn})
    }
    const result = fetchPacksCosts(collectionName)
    result.then(value => {
        if(value.length===0){
            ctx.telegram.editMessageText(ctx.chat.id, message_id, 0, '❌ Некоректна назва колекції')
            return ctx.reply("Спробуйте ще раз:", {...backMenuBtn})
        }
        else {
            ctx.telegram.editMessageText(ctx.chat.id,
                                         message_id,
                                         0,
                                         {text: `Collection: <b>${value[0].collection}</b>:`,
                                             parse_mode: 'html'})
            value.map((el) =>
                      {
                          ctx.replyWithPhoto({url: el.image},
                                             {caption: `Pack: ${el.name}\nCollection: ${el.collection}
Price: ${el.price} WAX\n`}
                          )
//                           ctx.reply(`Pack: ${el.name}\nCollection: ${el.collection}
// Price: ${el.price} WAX\n`)
                      })

        }
    })
}
catch (e) {
    console.log(e)
}
})


