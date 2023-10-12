import { Markup } from "telegraf"


export const mainMenu = Markup.keyboard(
    [ "Саплай рідких нфт 🎭", "Ціна паків 💸"])
                                       .oneTime().resize()

export const backMenuBtn = Markup.keyboard(
    ["◀ Повернутись до головного меню"]).resize()
