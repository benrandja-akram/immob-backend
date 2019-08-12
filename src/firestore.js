import admin from './admin'
import pascal from 'pascal-case'
import _ from 'lodash'
import { notify } from './fcm'

const db = admin.firestore()

export let items = null

export const fetchItems = () => new Promise(
  (resolve, reject) => {
    db.collection('annonces')
      .onSnapshot(
        snapshot => {
          items = snapshot.docs.map(doc => doc.data())
          resolve(items)
          snapshot.docChanges().forEach(
            change => {
              const doc = change.doc.data()
              const body = {
                id: doc.id,
                title: doc.title
              }
              if (change.type === 'added') {
                // notify({
                //   title: 'New annonce',
                //   body: doc.title
                // }, body)
              }
            }
          )
        }
      )
  }
)

export const insert = (docs) => {
  console.log('processing inserting in prgress')
  if (!_.differenceBy(docs, items, 'id').length) {
    return console.log('same docs')
  }
  console.log('inserting new data')
  return Promise.all(
    docs.map(
      doc => db.collection('annonces').doc(pascal(doc.id)).set(doc)
    )
  )
}
