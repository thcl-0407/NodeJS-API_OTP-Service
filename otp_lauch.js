const express = require('express')
const app = express()
const cors = require('cors')
var timeout = require('connect-timeout')
const dotenv = require('dotenv')
const otpControl = require('./controls/otp.control.js')

//Initial Dotenv
dotenv.config()

app.use(express.json())
app.use(cors())

//Routing
app.post('/api/send/sms', timeout('20s'),otpControl.SendSMSCode)
app.post('/api/verify/sms', timeout('20s'),otpControl.VerifySMSCode)

app.listen(process.env.PORT, ()=>{
    console.log('Starting on port: ' + process.env.PORT)
})