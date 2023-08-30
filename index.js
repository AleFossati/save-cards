var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mercadopago = require('mercadopago')
mercadopago.configurations.setAccessToken("YOUR-ACCESS-TOKEN");

var app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 3001

app.get('/', (req, res) => {
  res.send(`it's running`)
})

app.get('/bricks', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/bricks.html'))
})

const searchCustomer = async (email) => {
  try {
    const response = await mercadopago.customers.search({
      qs: { email }
    })
    return response?.body?.results[0]
  }
  catch(error) {
    throw `Search customer failed: ${error}`
  }
}

app.post('/process_payment', async (req, res) => {
  try {
    const { payer, token, issuer_id } = req.body
    
    console.log('create payment')
    const payment = await mercadopago.payment.save(req.body)
    
    let customer;
    console.log('create customer')
    try {
      customer = await mercadopago.customers.create({
        email: payer.email
      })

    } catch(e) {
      if (e.cause && e.cause[0].description === 'the customer already exist') {
        console.log('search customer')
        customer = await searchCustomer(payer.email)
      } else {
        throw e
      }
    }
    
    console.log('saving card to customer')
    const card = await mercadopago.card.create({
      token,
      customer_id: customer.id,
      issuer_id: Number(issuer_id),
      payment_method_id: payment.payment_method_id
    })

    /*
      ####### WARNING #######
      This data being retrieved to the frontend is here just for test purposes.
      THIS IS NOT SAFE AND SHOULD NOT BE RETURNED IN REAL CASE SCENARIOS.
    */
    res.status(200).json({
      payment,
      customer,
      card,
      status: 'approved'
    })
  }
  catch(err) {
    console.log(err)
    res.status(400).json({error: err});
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on http://localhost:${PORT}`)
})