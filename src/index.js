import 'dotenv/config'
import { scrap as scrapAnnonceAlgerie } from './annonce-algerie'
import { insert, fetchItems } from './firestore'
import schduler from 'node-schedule'
import express from 'express'
import { scrapAll as scrapAlgeriImmo } from './algerimmo'
import _ from 'lodash'

let annonces = null

const app = express()
app.listen(3000)
app.get('*', (req, res) => res.json(annonces))

fetchItems()
  .then(
    () => {
      schduler.scheduleJob('*/3 * * * *', () => {
        console.log('scraping. ... ')
        Promise.all(
          [
            scrapAlgeriImmo(),
            scrapAnnonceAlgerie()
          ]
        )
          .then(
            items => (annonces = _.flatten(items))
          )
          .then(insert)
          .catch(console.error)
      })
    }
  )
