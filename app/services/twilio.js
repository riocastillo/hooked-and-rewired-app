const accountSid = 'AC34b8303beb897bab0c345c5c9142ef33';
const authToken = '2100f5a26c9b2b57977f6fdd966ef73f';
const client = require('twilio')(accountSid, authToken);

//sending whatever msg we want to whatever phone number we want
function sendSMS(bodyMsg, phoneNumber) {
    //remove the dashes and replace it with empty strings, its concatonating them
    const validFormat = phoneNumber.replaceAll('-', "")
    console.log(validFormat)
    return client.messages
        .create({
            body: bodyMsg,
            messagingServiceSid: 'MG2bf25aa0de6735e9644d3ca70bcf4756',
            to: `+1${phoneNumber}`
        })
        .then(message => console.log(message.sid))
        .done();
}

//if we want to set up a daily reminder, we would create that message in the template js file, add that varialbe name to the const variable on the top of the routes page and whatever message we want to pass depending on the reason, then we can pass it in the twilio js function
//this makes the code reusable and reduces code

module.exports = {sendSMS}