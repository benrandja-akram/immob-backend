import 'dotenv/config'
import { scrap } from './annonce-algerie'
import { insert, fetchItems } from './firestore'
import schduler from 'node-schedule'
import express from 'express'
const app = express()

app.listen(3000)
app.get('*', (req, res) => res.json(annonces))
let annonces = null
scrap()
  .then(a => {
    annonces = a
  })

fetchItems()
  .then(
    () => {
      schduler.scheduleJob('*/1 * * * *', () => {
        console.log('scraping. ... ')
        scrap()
          // .then(console.log)
          .then(insert)
          .catch(console.error)
      })
    }
  )
