const crypto = require('crypto')
const builder = require('xmlbuilder')
const dateFormat = require('dateformat');
 
const transactionDate = dateFormat(new Date(), 'yyyy-mm-dd"T"hh:MM:ss.l')
console.log(transactionDate)

//configuration

const shared_secret = ''
const enterprise_id = ''
const client_id = ''

const hmac = crypto.createHmac('sha256', shared_secret)

// requester
const enterpriseID = enterprise_id
const clientID = client_id
const transNo = Date.now()
const environment = 'ECommerce'
const version = 20
//
const requester = {enterpriseID, clientID, transNo, environment, version}

const purchaseDescription = '112233445566778899MDD'
const transactionTime = transactionDate
const authType = 'AuthOnly'
const authenticate = true
const currencyCode = 'EUR'
const paymentMethod = 'UserSelect'
const purchaseAmount = 1000
const storeResultPage = 'https://127.0.0.1'

const misc = {purchaseDescription, transactionTime, authType, authenticate, currencyCode, paymentMethod, purchaseAmount, storeResultPage}

//billingAddress
const firstName = 'James'
const lastName = 'Bond'
const line1 = '77 The Barn'
const line2 = 'Town'
const city = 'London City'
const county = 'London'
const postcode = 'NG78HT'
const country = 'GBR'
//
const billingAddress = {firstName, lastName, line1, line2, city, county, country, postcode}

const stringLine = `${enterpriseID}${clientID}${transNo}${transactionTime}${purchaseAmount}${line1}${postcode}${authType}`

data = hmac.update(stringLine)

gen_hmac = data.digest('hex')

console.log(createXML(gen_hmac, requester, misc, billingAddress))


function createXML(hmac, requester, misc, billingAddress) {
  const obj = {
    'soapenv:Envelope': {
      '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
      '@xmlns:emis': 'http://services.thelogicgroup.biz/EMIS_WEBPAYMENT_3_0',
      'soapenv:Header': '',
      'soapenv:Body': {
        'emis:beginWebPayment': {
          arg0: {
            requester: {
              authToken: hmac,
              enterpriseID: requester.enterpriseID,
              clientID: requester.clientID,
              transNo: requester.transNo,
              environment: requester.environment,
              version: requester.version,
            },
            purchaseDescription: misc.purchaseDescription,
            transactionTime: misc.transactionTime,
            authType: misc.authType,
            authenticate: misc.authenticate,
            currencyCode: misc.currencyCode,
            paymentMethod: misc.paymentMethod,
            purchaseAmount: misc.purchaseAmount,
            billingAddress: {
              firstName: billingAddress.firstName,
              lastName: billingAddress.lastName,
              line1: billingAddress.line1,
              line2: billingAddress.line2,
              city: billingAddress.city,
              county: billingAddress.county,
              postcode: billingAddress.postcode,
              country: billingAddress.country,
            },
            storeResultPage: misc.storeResultPage
          }
        }
      }
    }
  }

  return builder.create(obj).end({ pretty: true})
}