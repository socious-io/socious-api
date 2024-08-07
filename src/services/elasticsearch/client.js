import Config from '../../config.js'
import { Client } from '@elastic/elasticsearch'

const client = new Client(Config.elasticsearch)

class SearchEngine {
  constructor(client) {
    this.client = client
    this.indexModifier = Config.env == 'production' ? '' : '_dev'
  }

  async existsIndex(index) {
    index = index + this.indexModifier
    return await client.indices.exists({ index })
  }

  async createIndex(index) {
    index = index + this.indexModifier
    return await client.indices.create({ index })
  }

  async createIndices(index, fields) {
    index = index + this.indexModifier
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
    index = index + this.indexModifier
    return await client.indices.delete({ index })
  }

  async indexDocument(index, id, document) {
    index = index + this.indexModifier
    try {
      return await client.index({ index, id, document })
    } catch (e) {
      console.log(e)
    }
  }

  async chunkedBulkIndexDocuments(index, documents, { chunks = 1000 } = {}) {
    index = index + this.indexModifier

    const documentsToProceed = documents.slice(0, chunks - 1)
    const remainingDocuments = documents.slice(chunks)
    const operations = documentsToProceed.flatMap((document) => [{ index: { _index: index } }, document])

    try {
      await client.bulk({ operations })
      if (remainingDocuments.length > 0)
        return await this.chunkedBulkIndexDocuments(index, remainingDocuments, { chunks })
    } catch (e) {
      console.log(e)
    }
  }

  async bulkIndexDocuments(index, documents) {
    index = index + this.indexModifier
    try {
      const operations = documents.flatMap((document) => [{ index: { _index: index } }, document])
      return await client.bulk({ refresh: true, operations })
    } catch (e) {
      console.log(e)
    }
  }

  async updateIndexMapping(index, fields) {
    index = index + this.indexModifier
    return await client.indices.putMapping({
      index,
      body: {
        properties: fields
      }
    })
  }

  async getDocument(index, id) {
    index = index + this.indexModifier
    return await client.get({ index, id })
  }

  async updateDocument(index, id, document) {
    index = index + this.indexModifier
    return await client.update({ index, id, doc: document })
  }

  async deleteDocument(index, id) {
    index = index + this.indexModifier
    return await client.delete({ index, id })
  }

  async searchDocuments(query) {
    return await client.search({ query })
  }
}

export default new SearchEngine(client)
