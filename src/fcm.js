import admin from './admin'

const fcm = admin.messaging()
const topic = 'newAnnonce'

export const notify = (notification, data) => fcm.send({
  notification,
  data,
  topic
})
