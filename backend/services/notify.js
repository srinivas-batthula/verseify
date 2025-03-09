const dotenv = require('dotenv').config({path:'./config.env'})
const webPush = require('web-push')



                                        //To create New VAPID keys...
// const vapidKeys = webPush.generateVAPIDKeys();
// console.log('Public Key:', vapidKeys.publicKey);
// console.log('Private Key:', vapidKeys.privateKey);

const publicVapidKey = process.env.VAPID_PUBLIC_KEY + ''
const privateVapidKey = process.env.VAPID_PRIVATE_KEY + ''
webPush.setVapidDetails('mailto:srinivasb.temp@gmail.com', publicVapidKey, privateVapidKey)


const pushNotify = async (body) => {
    if(body.subscription==='' || body.title==='' || body.body===''){
        return {success: false, 'details':'Invalid Details!'}
    }

    const notificationPayload = JSON.stringify({
        title: body.title,
        body: body.body,
        icon: body.icon || '/path/to/default/icon.png',
        url: body.url || process.env.HOME,
    })
    try {
        await webPush.sendNotification(body.subscription, notificationPayload)
        return {success: true ,'details':'Notification Sent successfully!'}
    }
    catch (err){
        // console.log(err)
        return {success: false, 'details':'Failed to send Notification!', error: err}
    }
}




module.exports = { pushNotify }
