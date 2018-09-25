const webpush = require('web-push')

webpush.setVapidDetails(process.env.WEBSITE_URL, process.env.VAPIDKEY_PUBLIC, process.env.VAPIDKEY_PRIVATE)

exports.sendPushNotification = function (subscription, payload) {

  if (process.env.NODE_ENV === 'test') {
    console.log("Automatic testing of push notifications disabled")
  } else {
    webpush.sendNotification(subscription, payload).catch(error => {
      console.error(error.stack)
    })
  }

}
