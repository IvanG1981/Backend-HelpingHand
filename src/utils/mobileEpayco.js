var epayco = require('epayco-sdk-node')({
  apiKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  lang: 'ES',
  test: true
})

exports.mobileEpayco = async ( req, res, next ) => {
  const description = "Voluntary contribution";
  const tax = '0';
  const tax_base = '0';
  const currency = 'COP';

  try {
    const { number, exp_year, exp_month, cvc } = req.body;

    const credit_info = {
      "card[number]": number,
      "card[exp_year]": exp_year,
      "card[exp_month]": exp_month,
      "card[cvc]": cvc
    }
    const token = await epayco.token.create( credit_info )

    const { name, last_name, email  } = req.body
    const customer_info = {
      token_card: `${token.id}`,
      name: name,
      last_name: last_name,
      email: email,
    }
    const { data }= await epayco.customers.create( customer_info );
    const customer_id = data.customerId;

    const {
      doc_type,
      doc_number,
      value,
      dues,
    } = req.body

    const payment_info = {
      ...customer_info,
      customer_id: customer_id,
      doc_type,
      doc_number,
      description,
      value,
      tax,
      tax_base,
      currency,
      dues,
    }
    const charge = await epayco.charge.create(payment_info)
    req.body = {}
    req.body = charge;
    next();
  }
  catch(err) {
    res.status(401).json( { message: err.message } )
  }
}

