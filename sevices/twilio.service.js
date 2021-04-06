require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceID = process.env.TWILIO_SERVICE_ID
const client = require('twilio')(accountSid, authToken);

function SendOTPCodeSMS(phone, callback){
    client.verify.services(serviceID)
    .verifications
    .create({to: phone, channel: 'sms'})
    .then(verification => callback(verification, true)).catch(error => callback(error, false));
}

function VerifyOTPCodeSMS(params, callback){
    client.verify.services(serviceID)
      .verificationChecks
      .create({to: params.phone, code: params.code})
      .then(verification_check => callback(verification_check, true)).catch(error => callback(error, false));
}

module.exports = {
    SendOTPCodeSMS,
    VerifyOTPCodeSMS
}