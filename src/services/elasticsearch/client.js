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

  async createIndices(index, fields, settings) {
    index = index + this.indexModifier
    return await client.indices.create({
      index,
      body: {
        settings,
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
    const operations = documentsToProceed.flatMap((document) => [
      { index: { _index: index, _id: document.id } },
      document
    ])

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
      const operations = documents.flatMap((document) => [{ index: { _index: index, _id: document.id } }, document])
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

  async getDocuments(index, ids) {
    index = index + this.indexModifier;
    let docs = []

    try{
      const response = await client.mget({
        index,
        body: {
          ids
        }
      });
      // @ts-ignore
      docs = response.docs.filter(d=>d.found).map(d=>d._source);
    }catch(e){
      console.log(e)
    }
    
    return docs
  }

  async updateDocument(index, id, document) {
    index = index + this.indexModifier
    return await client.update({ index, id, doc: document })
  }

  async deleteDocument(index, id) {
    index = index + this.indexModifier
    return await client.delete({ index, id })
  }

  async countAllDocuments(index) {
    index = index + this.indexModifier
    return await client.count({ index })
  }

  async searchDocuments(index, query, { pagination, sort }) {
    index = index + this.indexModifier
    const { limit = 10, offset = 0 } = pagination
    try {
      const searchResults = await client.search({ index, from: offset, size: limit, query, sort: sort })
      const results = searchResults.hits.hits.reduce((pv, hit) => {
        pv.push(hit._source)
        return pv
      }, [])
      const count = searchResults.hits.total
      return {
        results,
        count
      }
    } catch (e) {
      console.log(e)
      return {
        results: [],
        count: 0
      }
    }
  }
}

export default new SearchEngine(client)
