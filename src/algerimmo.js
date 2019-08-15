import 'dotenv/config'

import Parser from 'rss-parser'
import cheerio from 'cheerio'
import { detectType } from './annonce-algerie'
import { insert } from './firestore'

const parser = new Parser({
  customFields: {
    item: ['address']
  }
})

export async function scrap (query = '?category=&type=0&location=') {
  const url = 'https://www.algerimmo.com/rss/' + query

  const feed = await parser.parseURL(url)

  const items = feed.items.map(
    (element) => {
      console.log({ element })
      const { link, content, isoDate: published, title, contentSnippet: summary, address, guid: id } = element
      const $ = cheerio.load(content)
      const image = $('img').attr('src') || null
      const item = {
        id,
        image,
        title,
        published: new Date(published),
        summary,
        link,
        address,
        wilaya: title.split('- Wilaya de ').pop(),
        surface: (summary.match(/\d+( )?m/i) || [null])[0] || null,
        contact: (summary.match(/0[567][\d- ]+/i) || [null])[0] || null,
        ...detectType(summary)
      }
      const annonce = {}
      for (const key in item) {
        if (typeof item[key] !== 'undefined')annonce[key] = item[key]
      }
      return annonce
    }
  )
  return items
}

scrap().then(
  items => insert(items)
).then(
  _ => console.log('inserted ...')
)
