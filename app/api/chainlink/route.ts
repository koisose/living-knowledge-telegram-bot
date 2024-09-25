
export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { Bot, webhookCallback, InlineKeyboard } from 'grammy'
import { askTool } from '~~/apa/gaianet';
import { chainlinkTools } from '~~/apa/chainlink';
import { searchENS } from '~~/apa/ens';
const token = process.env.CHAINLINKAI_BOT

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.')

const bot = new Bot(token)
bot.command("start", async (ctx) => {
    return ctx.reply("WELCOME TO CHAINLINK CCIP AI CHATBOT POWERED BY GAIANET AI");
});
bot.on('message', async (ctx) => {
    console.log(ctx.message.text)
    const messageText=ctx.message.text;
    const whatTool = await askTool(messageText as string,chainlinkTools)
    const whatFunction = await whatTool.json()
    if ((whatFunction as any).choices[0].message.tool_calls) {
        console.log((whatFunction as any).choices[0].message.tool_calls)
        // if ((whatFunction as any).choices[0].message.tool_calls[0].function.name === "faucet") {
        //     const keyboard = new InlineKeyboard().url('Launch Faucet', "https://ethglobal.com/faucet");
        //     return ctx.reply('Launch faucet', { reply_markup: keyboard, reply_parameters: { message_id: ctx.msg.message_id } })
        // }
    }
})

export const POST = webhookCallback(bot, 'std/http')