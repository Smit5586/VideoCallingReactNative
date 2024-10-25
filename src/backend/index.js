const admin = require("firebase-admin");
const fastify = require("fastify")({ logger: true, keepAliveTimeout: 5000 });
const util = require("util");

// Zastąp "path/to/serviceAccountKey.json"
const serviceAccount = require("./videosdkdemo-b56da-firebase-adminsdk-nx7yk-b7ef6d1a23.json");

const delay = util.promisify(setTimeout);

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Remote Push Notification
async function sendAlarmNotification(token, meetingId, name) {
    return admin.messaging().send({
        token,
        // notification: {
        //     body: "Please join the meeting",
        //     title: `Meeting(${meetingId}) is started`,
        // },
        data: {
            type: "alarmNotification",
            meetingId: meetingId,
            title: `Meeting(${meetingId}) is started`,
            body: "Please join the meeting",
            name: name
        },
        android: {
            priority: "high"
        },
        // "content_available": true
    });
}

// Partial Push Notification
async function sendPartialNotification(token) {
    return admin.messaging().send({
        token,
        data: {
            type: "partial_notification",
            notifee: JSON.stringify({
                body: "I'm your push notification",
                android: {
                    channelId: "default",
                },
            }),
        },
    });
}

// Declare a notification route
fastify.post("/notifications", async (request) => {
    await delay(5000);
    await sendPartialNotification(JSON.parse(request.body).token);
    return "OK";
});

// Declare a alarm route
fastify.post("/alarm", async (request) => {
    console.log("alarm request", request.body);
    await delay(5000);
    await sendAlarmNotification(JSON.parse(request.body).token, JSON.parse(request.body).meetingId, JSON.parse(request.body).name);
    return "OK";
});

// Run the server
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        fastify.log.info(`Server is running on http://localhost:3000`);
    } catch (err) {
        console.log("BACKEND ERROR", err);
        fastify.log.error(err);
        process.exit(1);
    }
};
start();