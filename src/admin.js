import admin from 'firebase-admin'

const serviceAccount = process.env.FCM

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: 'https://immob-7ba99.firebaseio.com'
})

export default admin
