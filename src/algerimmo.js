import Parser from 'rss-parser'
import cheerio from 'cheerio'

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
      const { link, content, isoDate: publishDate, title, contentSnippet: description, address, guid } = element
      const $ = cheerio.load(content)
      const image = $('img').attr('src')
      return {
        image,
        title,
        publishDate,
        description,
        link,
        address,
        guid
      }
    }
  )
  return items
}
