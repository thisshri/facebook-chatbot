'use strict';

const PAGE_ACCESS_TOKEN = "EAAD9NJ20tEIBAHVQw1BBm5D5DOpN0GfqcW7Nn8U8ZBX86iwODHzDWj3vQZCMR9sZA8M2cLEhSMbtVACkmv6OpQZCniddOBhzBZB6A0uF0IrnrBG8EDuKxVpmjn4HtT1ScyYZAikOdddQavmQP4YKAqoxZCW2gion9oYmFJG1mPX3AZDZD";


// Imports dependencies and set up http server
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json()); // creates express http server
const request = require('request');

const RES_MENU = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Whom do you want to buy for?",
            "buttons": [
                {
                    "type": "postback",
                    "title": "Men",
                    "payload": "plMen"
                        },
                {
                    "type": "postback",
                    "title": "Women",
                    "payload": "plWomen"
                        }
                    ]
        }
    }
};
const RES_GS = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Welcome!",
                    "image_url": "https://via.placeholder.com/350x150",
                    "subtitle": "Welcome to our page. ",
                    "default_action": {
                        "type": "web_url",
                        "url": "https://google.com",
                        "webview_height_ratio": "tall",
                    },
                    "buttons": [
                        {
                            "type": "web_url",
                            "url": "https://google.com",
                            "title": "View Website"
              }, {
                            "type": "postback",
                            "title": "Start Chatting",
                            "payload": "plMenu"
              }
            ]
          }
        ]
        }
    }
};



// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {
    console.log("=== === === === === === THE REQUEST BODY === === === === === === =");
    console.log(JSON.stringify(req.body, null, " "));

    console.log("=== === === === === === END OF REQUEST BODY === === === === === === =");

    let body = req.body;

    body.entry.forEach(function (entry) {
        // Gets the body of the webhook event

        //console.log(JSON.stringify(entry, null, " "));

        let webhook_event = entry.messaging[0];
        let sender_psid = webhook_event.sender.id;

        if (entry.messaging[0].message) {
            console.log("\n\n text message rec \n\n");
            handleMessage(sender_psid, webhook_event.message.text);
        }
        if (entry.messaging[0].postback) {

            console.log("\n\n postback rec message rec \n\n");
            handlePostback(sender_psid, webhook_event.postback);

        }
    });



    res.status(200).send('EVENT_RECEIVED');

});


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "shrikant"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});


// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    //send greeting postback
    if (received_message === 'hi' || received_message === 'menu') {
        response = RES_MENU;
    } else if (received_message === 'GS') {
        response = RES_GS;

    } else {
        response = {
            "text": "Sorry, I didn't get what you said, Please type 'menu' to go to the Menu"
        }
    }

    callSendAPI(sender_psid, response);

}

// Handles Messaging postbacks events
function handlePostback(sender_psid, received_postback) {

    let response;
    const payload = received_postback.payload;

    if (payload === 'plGettingStarted') {
        response = RES_GS; // GETTING STARTED.
    } else if (received_postback.payload === 'plMen') {
        // attach menu to the message.

        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": " We currently offer following items.",
                    "buttons": [
                        {
                            'type': 'postback',
                            'title': 'Trouser',
                            'payload': 'plMTrouser'
                        },
                        {
                            'type': 'postback',
                            'title': 'Footware',
                            'payload': 'plMFootware'
                        },
                        {
                            'type': 'postback',
                            'title': 'Back To Main Menu',
                            'payload': 'plMenu'
                        }
                    ]
                }
            }
        };


    } else if (received_postback.payload === 'plWomen') { // attach menu to the message.
        response = {
            'attachment': {
                'type': 'template',
                'payload': {
                    'template_type': 'button',
                    'text': 'What are you looking for?',
                    'buttons': [
                        {
                            'type': 'postback',
                            'title': 'Jeans',
                            'payload': 'plWJeans'
                        },
                        {
                            'type': 'postback',
                            'title': 'Accessories',
                            'payload': 'plWAccessories'
                        },
                        {
                            'type': 'postback',
                            'title': 'Back To Main Menu',
                            'payload': 'plMenu'
                        }
                    ]
                }
            }
        };

    } else if (payload === 'plMenu') {
        response = RES_MENU;

    } else {
        response = {
            "text": "We have no item in this category."
        }
    }

    callSendAPI(sender_psid, response);


}



// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('IN REQUEST: message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
} // send response


// to set welcome screen and get started btn.
function callMessengerAPI() {
    let request_body = {
        "get_started": {
            "payload": "plGettingStarted"
        },
        "greeting": [
            {
                "locale": "default",
                "text": "Hello {{user_first_name}}!, Welcome to our page!"
          }
        ]
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messenger_profile",
        "qs": {
            "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('IN call messenger api : message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
} // send response




// Sets server port and logs message on success
app.listen(process.env.PORT || 3001, () => console.log('webhook is listening'));

callMessengerAPI();
