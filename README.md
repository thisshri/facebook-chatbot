# facebook-chatbot
#### Choice based chatbot using Facebook Api


## Watch demo Video: 
[![Click to see demo](http://img.youtube.com/vi/BlA_CXItfrM/0.jpg)](http://www.youtube.com/watch?v=BlA_CXItfrM)


## Step A : Setting up the facebook page where the bot will run. 

	1. Create the facebook page.

	2. Click on “add a button” 

	3. Select “contact you” then “Send Message” and follow the instructions to complete the process. 

## Step B: Setting Up the webhook

Webhook to work with facebook messenger platform it is required to support https connection with the facebook server.
	
	1. Create the node.js app which handles the user received messages, it uses

		a. It uses Facebook  SendAPI for conversation.

		b. Facebook Messenger Profile API to set get started button 

		c. Express as the server.

	2. Webhook needs 

		a. page_token : get it from the facebook developer page,  

		b. verify_token : any keyword that will be check to verify requests between facebook and webhook

	3. Now make the local host public by using ngrok.


## Step C: Setting Up the facebook messenger platform

	1. Create developer account,
	
	2. Create app by giving name to the app.
	
	3. Setup messenger from the developer dashboard. 
	
	4. Generate Page Access Token selecting the page created on facebook. (token is used on webhook)
	
	5. Setup webhook, It requires :
	
		a. Callback URL : the url of the webhook
		
		b. Verify Token: any keyword (keyword used in the webhook server).
		
		c. Subscription Fields: select
		
		i. Messaging
		
		ii. Messaging_postbacks
		
		d. Goto app setting > basic, here provide it following information. [without providing these we can’t make the chatbot public]
		
		i. Privacy Policy URL
		
		ii. App Icon 
		
		iii. Business Use
		
	6. Goto App review and make the Chatbot app public.



Now, Test the Chatbot

	1. Run the node app you have created.
	
	2. Goto the facebook page you have created, hover on the send message button and click on test
    
	3. Now send messages as you were a user using the page.

__[Note: the chatbot will only work with the administrator / developer of the app until the app is submitted to the facebook and gets approved by them]__


### Information we can access using CallSendAPI:

    1. PSID (Page Scope ID) : It of the user for our our page, we use this ID to communicate with the user.
    2. Name
    3. First name
    4. Last name
    5. Profile Picture
    6. Locale
    7. Gender
    8. Timezone

### Other Important Things.

	1. We can use upto 3 postback buttons, link to support this statement.
	
	2. If using ngrok to make the webhook public, remember to change the webhook public address every time you restart ngrok.
	


