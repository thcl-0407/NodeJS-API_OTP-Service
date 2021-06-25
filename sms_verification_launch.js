const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
var timeout = require('connect-timeout')
const dotenv = require('dotenv')
const otpControl = require('./controls/otp.control.js')
const swaggerUI = require('swagger-ui-express')
const swaggerDoc = require('swagger-jsdoc')

//Initial Dotenv
dotenv.config()

app.use(express.json())
app.use(cors())

const options = {
    definition: {
        openapi: "3.0.1",
        info: {
          title: 'SMS Verificarion',
          version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:" + process.env.PORT
            }
        ],
        host: "http://localhost: " + process.env.PORT
      },
      apis: ['./*.js', './controls/*.js'],
}

const uiOptions = {
    customSiteTitle: "SMS Verification",
    explorer: true
}

const swaggerSpecs = swaggerDoc(options)

//Routing
app.use('/doc', swaggerUI.serve)
app.use('/doc', swaggerUI.setup(swaggerSpecs, uiOptions))

app.get('/', (req, res)=>{
    res.redirect('/doc')
})

app.post('/api/sms/send', timeout('20s'), otpControl.SendSMSCode)
app.post('/api/sms/verify', timeout('20s'),otpControl.VerifySMSCode)

app.listen(process.env.PORT, ()=>{
    console.log((new Date(Date.now())).toUTCString() + ': Starting on port: ' + process.env.PORT)
})