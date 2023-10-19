import { Scenes } from "telegraf"
import { fetchRarityCards } from "./funkoApiService.js"
import { backMenuBtn } from "./buttons.js"
import { backMenu } from "./commands.js"


export const parseRarity = new Scenes.BaseScene('parseRarity')
parseRarity.enter(async ctx  => {
    await ctx.replyWithHTML(`Надішли мені назву колекції \nВ форматі - <b>steven.funko</b>\nЯкщо в колекції є серії, вкажи номер серії через пробіл
Наприклад <b>freddy.funko 2</b>\n(За змовчуванням - серія 1)`, {...backMenuBtn})
})
parseRarity.hears('◀ Повернутись до головного меню', async ctx => {
    await ctx.scene.leave()
    return backMenu(ctx)
})

parseRarity.on('text', async ctx => {
    try {
        const { message_id } = await ctx.reply("Обробка...");

        const collection = ctx.message.text.trim().toLowerCase();
        const [name, series] = collection.split(" ")

        if (/[а-я]/i.test(name)) {
            ctx.telegram.editMessageText(ctx.chat.id, message_id, 0, '❌ Некоректна назва колекції');
            return ctx.reply("Спробуйте ще раз:", { ...backMenuBtn });
        }

        const result = await fetchRarityCards(name, series);

        if (result.length === 0) {
            ctx.telegram.editMessageText(ctx.chat.id, message_id, 0, '❌ Некоректна назва колекції');
            return ctx.reply("Спробуйте ще раз:", { ...backMenuBtn });
        } else {
            ctx.telegram.editMessageText(ctx.chat.id, message_id, 0, {
                text: `Collection: <b>${result[0].collection.name}</b>:`,
                parse_mode: 'html'
            });

            let response = "";
            result.forEach(el => {
                response += `Name: ${el.immutable_data.name},\nRarity: <b>${el.immutable_data.rarity}</b>,\nSupply: <i>${el.issued_supply}/${el.max_supply}</i>\n\n`;
            });

            setTimeout(() => ctx.replyWithHTML(response, { ...backMenuBtn }), 500);
        }
    } catch (e) {
        console.error(e);
    }
});
