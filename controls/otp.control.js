require('dotenv').config()
const twilioService = require('./../sevices/twilio.service.js')

/**
 * @swagger
 * /api/sms/send:
 *   post:
 *     responses:
 *       200:
 *          description: OK
 *     summary: Send SMS Verify Code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *                  phone:
 *                      type: string
 *                      default: "0123456789"
 */
const SendSMSCode = async (req, res) => {
    if(req.body.phone == undefined){
        res.json({
            status: false,
            code: 404
        })

        return
    }

    let country_code = process.env.COUNTRY_CODE
    let phone = country_code + req.body.phone.substring(1, req.body.phone.length)

    console.log((new Date(Date.now())).toUTCString() + ": Handling send sms code to " + phone)

    await twilioService.SendOTPCodeSMS(phone, (reply, status) => {
        if (status) {

            console.log((new Date(Date.now())).toUTCString() + ": Sended code to " + phone + " - Successful")

            res.json({
                phone: phone,
                country_code: country_code,
                channel: reply.channel,
                isSended: true,
                lookup: reply.lookup,
                dateCreated: reply.dateCreated,
                dateUpdated: reply.dateUpdated
            })
        } else {

            console.log((new Date(Date.now())).toUTCString() + ": Sended code to " + phone + " - Failed")

            res.json({
                phone: phone,
                country_code: country_code,
                status: reply.status,
                error_code: reply.code
            })
        }
    })
}


/**
 * @swagger
 * /api/sms/verify:
 *   post:
 *     responses:
 *       200:
 *          description: OK
 *     summary: Verify Phone With SMS Code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *                  phone:
 *                      type: string
 *                      default: "0123456789"
 *                  code:
 *                      type: string
 *                      default: "12345678"
 */
const VerifySMSCode = async (req, res) => {
    if(req.body.phone == undefined || req.body.code == undefined){
        res.json({
            status: false,
            code: 404
        })

        return
    }

    let country_code = process.env.COUNTRY_CODE
    let phone = country_code + req.body.phone.substring(1, req.body.phone.length)
    let code = req.body.code

    let params = {
        phone: phone,
        code: code
    }

    console.log((new Date(Date.now())).toUTCString() + ": Handling verify " + phone)

    await twilioService.VerifyOTPCodeSMS(params, (reply, status) => {
        if (status) {

            console.log((new Date(Date.now())).toUTCString() + ": Verified " + phone + " - Successful")

            res.json({
                phone: phone,
                country_code: country_code,
                channel: reply.channel,
                status: reply.status,
                valid: reply.valid,
                dateCreated: reply.dateCreated,
                dateUpdated: reply.dateUpdated
            })
        } else {

            console.log((new Date(Date.now())).toUTCString() + ": Verified " + phone + " - Failed")

            res.json({
                phone: phone,
                country_code: country_code,
                status: reply.status,
                error_code: reply.code,
                valid: false
            })
        }
    })
}

module.exports = {
    SendSMSCode,
    VerifySMSCode
}