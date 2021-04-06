require('dotenv').config()
const twilioService = require('./../sevices/twilio.service.js')

//Send SMS Code To Number Phone
const SendSMSCode = async (req, res) => {
    let country_code = req.body.country_code
    let phone = country_code + req.body.phone.substring(1, req.body.phone.length)

    await twilioService.SendOTPCodeSMS(phone, (reply, status) => {
        if(status){
            res.json({
                phone: phone,
                country_code: country_code,
                channel: reply.channel,
                isSended: true,
                lookup: reply.lookup,
                dateCreated: reply.dateCreated,
                dateUpdated: reply.dateUpdated
            })
        }else{
            res.json({
               phone: phone,
               country_code: country_code,
               status: reply.status,
               error_code: reply.code
            })
        }
    })
}

//Verify SMS Code
const VerifySMSCode = async (req, res) => {
    let country_code = req.body.country_code
    let phone = country_code + req.body.phone.substring(1, req.body.phone.length)
    let code = req.body.code

    let params = {
        phone: phone,
        code: code
    }

    await twilioService.VerifyOTPCodeSMS(params, (reply, status) => {
        if(status){
            res.json({
                phone: phone,
                country_code: country_code,
                channel: reply.channel,
                status: reply.status,
                valid: reply.valid,
                dateCreated: reply.dateCreated,
                dateUpdated: reply.dateUpdated
            })
        }else{
            res.json({
               phone: phone,
               country_code: country_code,
               status: reply.status,
               error_code: reply.code
            })
        }
    })
}

module.exports = {
    SendSMSCode,
    VerifySMSCode
}