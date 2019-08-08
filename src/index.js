import 'dotenv/config'
import { scrap } from './annonce-algerie'
import { insert, fetchItems } from './firestore'
import schduler from 'node-schedule'

fetchItems()
  .then(
    () => {
      schduler.scheduleJob('*/1 * * * *', () => {
        console.log('scraping. ... ')
        scrap()
          .then(insert)
          .catch(console.error)
      })
    }
  )
