import fetch from 'node-fetch'
import _ from 'lodash'

const url = 'https://feedly.com/v3/streams/contents?streamId=feed%2Fhttp%3A%2F%2Fwww.annonce-algerie.com%2Fupload%2Fflux%2Frss_1.xml&count=20000&ranked=newest&similar=true'

export const scrap = () => fetch(url).then(
  res => {
    if (res.ok) return res.json()
    throw new Error('not ok')
  }
).then(
  json => normalizeItems(json.items)
)

export const normalizeItems = (items) => items.map(normalizeItem)

export const normalizeItem = (item) => _.pick({
  ...item,
  // category: item.title.split(' ').shift(),
  // type: item.title.split(' ')[1].replace('.', ''),
  ...detectType(item.title),
  wilaya: (item.title.split('à')[1] || '').split(' ')[1] || null,
  price: item.title.split(' - ').pop().split(' ').shift() || null,
  published: new Date(item.published),
  image: (item.visual && ((item.visual.url == 'none') ? null : item.visual.url)) || null,
  title: item.title.split(' - ').shift().split(' ').slice(1).join(' ').replace('.', '') || null,
  summary: item.summary.content.split('Ajoutée le :').shift() || null,
  surface: (item.summary.content.match(/\d+( )?m/i) || [null])[0] || null,
  contact: (item.summary.content.match(/0[567]\d{8}/i) || [null])[0] || null
}, [
  'id', 'title', 'published', 'summary', 'image', 'type', 'category', 'wilaya', 'price', 'surface', 'contact'
])

export function detectType (title = '') {
// Vente, Echange, Location, Location pour vacances.
  const category = check(title, [
    'Vente', 'Echange', 'Location vacances', 'Location'
  ])
  const type = check(title, [
    'Terrain', 'Terrain Agricole', 'Appart', 'Maison'
  ])
  return {
    type, category
  }
}
function check (title, strs) {
  for (const s of strs) {
    if (title.includes(s)) {
      return s
    }
  }
  return null
}
