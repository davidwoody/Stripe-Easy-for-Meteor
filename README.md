Stripe-Easy-for-Meteor
======================

Subsciptions with Stripe made easy for Meteor

## Quick Start

1. Setup your account/subscriptions on Stripe and install this package into your project.
2. Define your publishable and secret test keys from your Stripe account in `Meteor.settings`.
```
{
  "public" : {
    "Stripe" : {
      "publicKey" : "YOUR_PUBLISHABLE_KEY"
    }
  },
  "Stripe" : {
    "secretKey" : "YOUR_SECRET_KEY"
  }
}
```
3. Insert `{{> stripeEasyInputs}}` somewhere in your `<form>`.
4. In the `'submit form': function(e){` event function, making sure there is a `Meteor.user()` and handle the subscription like this:
```
var easy = StripeEasy.submitHelper(event);
easy.sub_name = "SUBSCRIPTION_ID_FROM_STRIPE"
StripeEasy.subscribe(easy, function(err, result){
  // do something
});
```

Awesome. Subscriptions are up.


## How to Use - the longer version

TODO
