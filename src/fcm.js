import admin from './admin'

const fcm = admin.messaging()
const topic = 'newAnnonce'

export const notify = (notification, data) => fcm.send({
  // notification,
  data,
  topic
}).then(console.log)
  .then(_ => console.log('notified ....'))

notify(null, {
  id: 'HttpsWwwAlgerimmoComAchatVenteAchatVenteAppartementAppartementHautDeGammeFrangeMaritime_2133Htm',
  title: 'those title',
  contentText: 'content text text akram'
})
// .then(_ => process.exit(0))
