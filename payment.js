const stripe = require('stripe')('sk_test_51L8MQWFiHSKRe5D1tH0t3GioOvqdQbVZY27cOkcvwGts7LNPW8Ric1pkLZZk0R1lToYaFE20oM7mHFJBhFYMJB6r00mXaXXUZZ');


const main = async () => {

  const account = await stripe.accounts.create({
    country: 'US',
    type: 'standard',
    external_account: {
      object: 'bank_account',
      country: 'US',
      currency: 'usd',
      account_holder_name: 'Jenny Rosen',
      account_holder_type: 'individual',
      routing_number: '110000000',
      account_number: '000123456789',
    }
  });


  const charge = await stripe.payouts.create({
    amount: 2000,
    currency: 'usd',
    description: 'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
  }, {stripeAccount: account.id});


  console.log(charge, '-------------------------')

}



main()
  .then(() => {
    process.exit(1);
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });
