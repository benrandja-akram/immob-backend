// import 'dotenv/config'

import Parser from 'rss-parser'
import cheerio from 'cheerio'
import _ from 'lodash'
import pascal from 'pascal-case'

const parser = new Parser({
  customFields: {
    item: ['address']
  }
})

export async function scrap (url, category, type) {
  const feed = await parser.parseURL(url)

  const items = feed.items.map(
    (element) => {
      const { link, content, isoDate: published, title, contentSnippet: summary, address, guid: id } = element
      const $ = cheerio.load(content)
      const image = $('img').attr('src') || null
      const item = {
        id: pascal(id),
        image,
        title,
        published: new Date(published),
        summary,
        link,
        address,
        wilaya: title.split('- Wilaya de ').pop(),
        surface: (summary.match(/\d+( )?m/i) || [null])[0] || null,
        contact: (summary.match(/0[567][\d- ]+/i) || [null])[0] || null,
        category,
        type
      }
      const annonce = {}
      for (const key in item) {
        if (typeof item[key] !== 'undefined') annonce[key] = item[key]
      }
      return annonce
    }
  )
  return items
}

// const category = check(title, [
//   'Vente', 'Echange', 'Location vacances', 'Location'
// ])
// const type = check(title, [
//   'Terrain', 'Terrain Agricole', 'Appart', 'Maison'
// ])

export const rss = [
  {
    url: 'https://www.algerimmo.com/rss/?category=achat-vente-maison&type=0&location=',
    category: 'Vente',
    type: 'Maison'
  },
  {
    url: 'https://www.algerimmo.com/rss/?category=achat-vente-appartement&type=0&location=',
    category: 'Vente',
    type: 'Appart'
  },
  {
    url: 'https://www.algerimmo.com/rss/?category=achat-vente-terrain&type=0&location=',
    category: 'Vente',
    type: 'Terrain'
  },
  {
    url: 'https://www.algerimmo.com/rss/?category=location-maison&type=0&location=',
    category: 'Location',
    type: 'Maison'
  },
  {
    url: 'https://www.algerimmo.com/rss/?category=location-appartement&type=0&location=',
    category: 'Location',
    type: 'Appart'
  },
  {
    url: 'https://www.algerimmo.com/rss/?category=appartement-de-vacances&type=0&location=',
    category: 'Location vacances',
    type: 'Maison'
  }
]

export const scrapAll = () => Promise.all(
  rss.map(
    ({ url, category, type }) => scrap(url, category, type)
  )
).then(
  items => _.flatten(items)
)

// address
// "ouled moussa"
// category
// "Vente"
// contact
// "05 "
// id
// "https://www.algerimmo.com/achat-vente/achat-vente-appartement/appartement-a-vendre-ouled-moussa-f4-2147.htm"
// image
// null
// link
// "https://www.algerimmo.com/achat-vente/achat-vente-appartement/appartement-a-vendre-ouled-moussa-f4-2147.htm"
// published
// November 15, 2018 at 12:05:40 PM UTC+1
// summary
// "Je mets a vendre un joli appartement F4 ( 03 chambres + salon et salle à manger.....) + GARAGE de plus de 40 m2 , a ouled moussa cooperative ALI KHODJA ,d'une superficie de 135 m2 spacieuse ,construction anti-sismique ,trés ensoleillée ,deux façades avec des vues degagées ,accès auto route est-ouest facile à 05 minutes ,batiment et endroit trés propre et calme..Adequat pour habitation ou pour une fonction libérale.... j'accepte l'echange par un niveau de villa ( wilaya d'alger coté est) avec rajout d'argent toute proposition sera étudiée."
// surface
// "40 m"
// (string)
// title
// "Offre - appartement a vendre ouled moussa f4 - Wilaya de Boumerdès"
// type
// "Appart"
// wilaya
// "Boumerdès"
