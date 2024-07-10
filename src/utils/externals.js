import axios from 'axios'
import Config from '../config.js'

class DiscordMessenger {
  constructor(webhook) {
    this.webhook = webhook
  }

  async send(content) {
    try {
      await axios.post(this.webhook, {
        content
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  async sendWithTitleAndProperties({ title, detailObject }) {
    const flatProperties = Object.keys(detailObject)
      .map((detailKey) => `${detailKey}: ${detailObject[detailKey]}`)
      .join('\n')

    try {
      await axios.post(this.webhook, {
        content: `
        ${title}:
        \`\`\`\n${flatProperties}\n\`\`\`
      `
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
}

export const discordDisputeMessenger = new DiscordMessenger(Config.discordDisputeWebhook)
