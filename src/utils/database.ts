import mongoose, { mongo } from "mongoose"
import AutoIncrementFactory from "mongoose-sequence"

const userSchema = new mongoose.Schema({
    discord_id: { type: String, required: true },
    tokens: { type: Number, default: 0 }
})

const messageSchema = new mongoose.Schema({
    requestUser: { type: String, required: true },
    message_content: { type: String, required: true },
    gpt_message: { type: Boolean, required: true }
})

const conversationSchema = new mongoose.Schema({
    tokens: { type: Number, default: 0 },
    channel_id: { type: String, required: true },
    original_message_id: { type: String, required: true },
    messages: [messageSchema]
})

const guildSchema = new mongoose.Schema({
    guild_id: { type: String, required: true },
    tokens: { type: Number, default: 0 },
    conversations: [conversationSchema]
})

const User = mongoose.model("User", userSchema)



export { User }

mongoose.connect("mongodb://root:examplepassword@mongo:27017/gptdb")

const autoIncrementConversations = AutoIncrementFactory(messageSchema)

export default mongoose.connection 