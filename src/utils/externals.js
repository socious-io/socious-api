import axios from 'axios'
import Config from '../config.js'

class DiscordMessenger {
  constructor(webhook) {
    this.webhook = webhook
  }

  async send({ title, detailObject }) {
    try {
      await axios.post(this.webhook, {
        content: `
        ${title}:
        \`\`\`
        ${Object.keys(detailObject)
          .map((detailKey) => `${detailKey}: ${detailObject[detailKey]}`)
          .join('\n')}
        \`\`\`
      `
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
}

export const discordDisputeMessenger = new DiscordMessenger(Config.discordDisputeWebhook)
