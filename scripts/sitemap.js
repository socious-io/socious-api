import Project from '../src/models/project/index.js'
import { SitemapStream, streamToPromise } from 'sitemap'
import { createWriteStream } from 'fs'

const [, , sitemapDest = './sitemap.xml'] = process.argv

async function main() {
  const writeStream = createWriteStream(sitemapDest)
  const sitemap = new SitemapStream({ hostname: 'https://socious.io' })

  // Listen to the sitemap stream and convert it to a promise
  const sitemapPromise = streamToPromise(sitemap).then((data) => {
    console.log(data.toString())
  })

  // Pipe the sitemap stream to write stream
  sitemap.pipe(writeStream)

  const projects = await Project.all({
    limit: 100,
    offset: 0,
    filter: { other_party_title: null },
    sort: '-created_at'
  })

  // Write initial URLs
  sitemap.write({ url: '/jobs', changefreq: 'daily', priority: 1 })

  // Loop through projects and add them to the sitemap
  for (const p of projects) {
    sitemap.write({ url: `/jobs/${p.id}`, changefreq: 'daily', priority: 1 })
  }

  // Close the sitemap stream
  sitemap.end()

  // Wait for the sitemap stream to finish
  await sitemapPromise
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
