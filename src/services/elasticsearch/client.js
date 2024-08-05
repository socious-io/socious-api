import Config from '../../config.js'
import { Client } from '@elastic/elasticsearch'

const client = new Client(Config.elasticsearch)

class SearchEngine {
  constructor(client) {
    this.client = client
  }

  async existsIndex(index) {
    return await client.indices.exists({ index })
  }

  async createIndex(index) {
    return await client.indices.create({ index })
  }

  async createIndices(index, fields) {
    return await client.indices.create({
      index,
      body: {
        mappings: {
          properties: fields
        }
      }
    })
  }

  async deleteIndex(index) {
    return await client.indices.delete({ index })
  }

  async indexDocument(index, id, document) {
    try {
      return await client.index({ index, id, document })
    } catch (e) {
      console.log(e)
    }
  }

  async updateIndexMapping(index, fields) {
    return await client.indices.putMapping({
      index,
      body: {
        properties: fields
      }
    })
  }

  async getDocument(index, id) {
    return await client.get({ index, id })
  }

  async updateDocument(index, id, document) {
    return await client.update({ index, id, doc: document })
  }

  async deleteDocument(index, id) {
    return await client.delete({ index, id })
  }

  async searchDocuments(query) {
    return await client.search({ query })
  }
}

export default new SearchEngine(client)
