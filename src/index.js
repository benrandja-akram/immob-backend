import 'dotenv/config'
import { scrap } from './annonce-algerie'
import { insert } from './firebase'

scrap().then(
  feed => insert(feed)
).catch(console.error)
