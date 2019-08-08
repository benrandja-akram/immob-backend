import admin from './admin'
import pascal from 'pascal-case'
import _ from 'lodash'
import { notify } from './fcm'
import { normalizeItems, normalizeItem } from './annonce-algerie'

const db = admin.firestore()

export let items = null

export const fetchItems = () => new Promise(
  (resolve, reject) => {
    db.collection('annonces')
      .onSnapshot(
        snapshot => {
          items = normalizeItems(snapshot.docs.map(doc => doc.data()))
          resolve(items)
          snapshot.docChanges().forEach(
            change => {
              const doc = change.doc.data()
              console.log({ doc })
              const body = {
                id: doc.id,
                title: doc.title
              }
              if (change.type === 'added') {
                notify({
                  title: 'New annonce',
                  body: doc.title
                }, body)
              }
            }
          )
        }
      )
  }
)

export const insert = (docs) => {
  if (_.differenceBy(docs, items, 'id')) {
    return console.log('same docs')
  }
  return Promise.all(
    docs.map(
      doc => db.collection('annonces').doc(pascal(doc.id)).set(doc)
    )
  )
}
