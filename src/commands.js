import { mainMenu } from "./buttons.js"


export const backMenu = async ctx => {
    await ctx.reply("Головне меню: ", {... mainMenu})
}

export const startPacksCost = async ctx => {
    await ctx.scene.enter("packsCost")
}

export const startParseRarity = async ctx => {
    await ctx.scene.enter('parseRarity')
}