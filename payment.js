const stripe = require('stripe')(
  'sk_test_51M5Ka2LQaOCNi3AqRtBUIWHmYhP2NyTLmiMWDnDwmZCX8jegvz8TQTLj9H7E5S9qMZFDdwsL0UhSzjVBd9wUolzU00BRWCddL7',
);

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
    },
  });

  try {
    const charge = await stripe.payouts.create(
      {
        amount: 2000,
        currency: 'usd',
        description:
          'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
      },
      {stripeAccount: account.id},
    );
  } catch (e) {
    console.log(e);
  }
};

main()
  .then(() => {
    process.exit(1);
  })
  .catch((ex) => {
    console.error(ex);
    process.exit(1);
  });
