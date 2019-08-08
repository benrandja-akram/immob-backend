import fetch from 'node-fetch'

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

export const normalizeItem = (item) => ({
  ...item,
  category: item.title.split(' ').shift(),
  price: item.title.split(' - ').pop().split(' ').shift(),
  published: new Date(item.published),
  title: item.title.split(' - ').shift().split(' ').slice(1).join(' '),
  summary: item.summary.content.split('Ajoutée le :').shift()
})
