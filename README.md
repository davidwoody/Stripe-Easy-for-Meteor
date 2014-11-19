Stripe-Easy-for-Meteor
======================

Subsciptions with Stripe made easy for Meteor.

If you are looking for a quick and simple way to add subscriptions to your Meteor app, this is a great option.

## Quick Start

1. Install this package into your project `meteor add woody:stripe-easy`.
2. Define your publishable and secret test keys in `Meteor.settings`.
3. Insert `{{> stripeEasyInputs}}` somewhere in your `<form>`.
4. In the `'submit form'` template event function, make sure there is a `Meteor.user()` and handle the subscription like this:
```
var easy = StripeEasy.submitHelper(e);
var plan_id = "PLAN_ID_FROM_STRIPE"
StripeEasy.subscribe(easy, plan_id, function(err, result){
  if(err){
    Session.set('stripeEasyError', err); // show error to user
  } else {
    //do something
  }
});
```

Awesome. Subscriptions are up.


## How to Use - the longer version

1. Sign up for an account at Stripe - https://stripe.com/
2. Open up your dashboard and create some subscription plans. **Make note of the plan id** for each plan you make. You will need this in Step 6 - https://dashboard.stripe.com/
3. Find your Stripe **test** api keys - https://dashboard.stripe.com/account/apikeys
4. Set up your test keys by A) creating a `settings.json` file in the root of your project directory, B) copy/paste the code below replacing the placeholder text with your appropriate keys. C) Startup Meteor with those setting by running `meteor --settings settings.json` in your terminal.
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
5. Include the `{{> stripeEasyInputs}}` template inside of a form tag.
```
<form>
  {{> stripeEasyInputs}}
  <button type="submit">Submit</button>
</form>
```
6. Handle the submit event on the form. Note that the StripeEasy functions require a `Meteor.user()`. So assuming you either already have a user logged in or your call `Meteor.createUser` first, you would handle the event as follows:
```
'submit form': function (e) {
  e.preventDefault();
  // make sure there is a Meteor.user() or wrap the following inside the Meteor.createUser callback function
  var easy = StripeEasy.submitHelper(e);
  var plan_id = "STRIPE_PLAN_ID"; // set however you want, via Session variable or a part of the form.
  StripeEasy.subscribe(easy, plan_id, function(err, result){
    if(err){
      Session.set('stripeEasyError', err); // show error to user
    }
    // if no error, will return the newly created customer object from Stripe
  });
},
```
7. To update a subscription you would do the following inside of an event:
```
var plan_id = "UPDATE_TO_THIS_PLAN_ID";
StripeEasy.update(plan_id, function(err, result){
  // result will be the updated subscription object from Stripe
});
```

## API - StripeEasy - (client)

**Note:** A `Meteor.user()` is required for these functions to work.

### StripeEasy.submitHelper(e)

Returns an object to pass to `StripeEasy.subscribe()`. Where `e` is a jQuery submit form event.

### StripeEasy.subscribe(obj, plan_id, callback)

Where `obj` is the object returned from `StripeEasy.submitHelper(e)`.

The callback function should have two arguments, an `error` and a `result` argument. On success, it subscribes the curretnly logged in user to the specified plan_id and will modify the user's `profile.stripe` to have a `customerId` and a `subscription` property.

### StripeEasy.update(plan_id, callback)

Where `plan_id` is the new plan_id to update to.

The callback function should have two arguments, an `error` and a `result` argument. On success, will update the currently logged in user's `profile.stripe.subscription` property with the new subscription and return the subscription object.

### StripeEasy.cancel(callback)

Cancels the currently logged in users subscription plan. The callback function should have two arguments, an `error` and a `result` argument. On success, will update the currently logged in user's `profile.stripe.subscription` property.

### StripeEasy.config(obj)

Easily add CSS classes to the inputs and error div by passing `{inputClasses: "input-lg custom-class-name", errorClasses: 'class-name'}`to the StripeEasy.config function.

### Errors

If an error occurs when a user is attempting to subscribe (i.e. incorrect credit card number) the error is stored in the session variable `stripeEasyError`. You can access this via `Session.get('stripeEasyError')`.

If `stripeEasyInputs` is being used, an alert will be shown to the user if there is a `stripeEasyError`. Test an error out by using one of the defined error card numbers on [Stripe](https://stripe.com/docs/testing). 


### Plays nicely with Bootstrap and Font-Awesome

Has bootstrap error class validation built into the `stripeEasyInputs` on blur, and also adds icons when bootstrap and font-awesome are added to your project.

## TODO

1. Test error cases suggested by Stripe.
2. Write some tests.
3. Write more TODOs.

**License**
MIT - http://opensource.org/licenses/MIT
