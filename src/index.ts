import { Client, GatewayIntentBits, Interaction, Routes, StringSelectMenuBuilder } from "discord.js"
import Exception from "./utils/error"
import { Configuration, OpenAIApi } from "openai"
import fs from "fs"
import path from "path"
import mongoose, { Mongoose } from "mongoose"

export default class Bot {
    public client: Client
    public commands: {[key: string]: any}
    public openAI: OpenAIApi;
    private DISCORD_API_KEY: string;
    private DISCORD_CLIENT_ID: string

    constructor(opts: {
        [key: string]: string,
        DISCORD_API_KEY: string,
        DISCORD_CLIENT_ID: string,
        OPEN_API_KEY: string,
        MODEL: MODELS.GPT3|MODELS.GPT_4|MODELS.GPT3_5
    }) {
        this.DISCORD_API_KEY = opts.DISCORD_API_KEY;
        this.DISCORD_CLIENT_ID = opts.DISCORD_CLIENT_ID

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers
            ]
        })

        this.commands = {}

        this.openAI = new OpenAIApi(new Configuration({
            apiKey: opts.OPEN_API_KEY
        }))
    }

    login() {
        return this.client.login(this.DISCORD_API_KEY)
    }


    async registerCommands(opts: {
        commandsPath: string
        preInteraction?: (interaction: import("discord.js").Interaction) => Promise<Interaction>
        postInteraction?: (interaction: import("discord.js").Interaction) => Promise<void>
    }) {    
        let paths = fs.readdirSync(path.resolve(opts.commandsPath))
        let commandsData = []
        
        for (let path of paths) {
            let command = new (require(path).default)
            try {
                if (!command.data) {
                    throw Exception.MISSING_DATA_EXCEPTION
                } else if (!command.execute) {
                    throw Exception.MISSING_EXECUTE_EXCEPTION
                } else {
                    this.commands[command.data.name] = command
                    commandsData.push(command.data)
                }
            } catch (error) {
                console.error(error)
            }
        }

        await this.client.rest.put(Routes.applicationCommands(this.DISCORD_CLIENT_ID), {
            body: commandsData
        })

        this.client.on("interactionCreate", async interaction => {
            if (!interaction.isCommand()) {
                return
            }

            let command = this.commands[interaction.commandName]
            
            if (!command) {
                interaction.reply("Command not found")
                return
            }

            if (opts.preInteraction) {
                let newInteraction = await opts.preInteraction(interaction)
                newInteraction = await command.execute(this, newInteraction)

                if (opts.postInteraction) {
                    await opts.postInteraction(newInteraction)
                }
            } else if (opts.postInteraction) {
                let newInteraction = await command.excute(this, interaction)
                opts.postInteraction(newInteraction)
            } else {
                command.execute(this, interaction)
            }
        })
    }
}