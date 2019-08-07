import admin from 'firebase-admin'
import pascal from 'pascal-case'

const serviceAccount = process.env.FCM

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: 'https://immob-7ba99.firebaseio.com'
})

const db = admin.firestore()

export const insert = (docs) => {
  return Promise.all(
    docs.map(
      doc => db.collection('annonces').doc(pascal(doc.id)).set(doc)
    )
  )
}
