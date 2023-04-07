import {describe, expect, it, test} from "@jest/globals"
import Bot from "../src"
import path from "path"
import mongoose from "mongoose"
import connection from "../src/utils/database"

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

describe("A test to see if the bot starts and runs", () => {
    let discApiKey = process.env.DISCORD_API_KEY!
    console.log(discApiKey)
    let discClientId = process.env.DISCORD_CLIENT_ID!
    let openAiApiKey = process.env.OPENAI_API_KEY!
    let discordBotID = process.env.DISCORD_BOT_ID!

    const bot = new Bot({
        DISCORD_API_KEY: discApiKey,
        DISCORD_CLIENT_ID: discClientId,
        OPEN_API_KEY: openAiApiKey,
        MODEL: "gpt-3.5-turbo"
    })

    it("Should connect to discord api", async () => {
        await bot.login()
        bot.client.on("ready", () => {
            expect(bot.client.user?.id).toBe(discordBotID)
        })
        await bot.client.destroy()
    })

    it("Should connect to database", async () => {
        connection.on("open", () => {
            expect(mongoose.connection.readyState).toBe(1);
        });
    })
    
    
})