Stripe-Easy-for-Meteor
======================

Subsciptions with Stripe made easy for Meteor.

If you are looking for a quick and simple way to add subscriptions to your Meteor app, this is a great option.

## Quick Start

1. Install this package into your project.
2. Define your publishable and secret test keys in `Meteor.settings`.
3. Insert `{{> stripeEasyInputs}}` somewhere in your `<form>`.
4. In the `'submit form'` template event function, make sure there is a `Meteor.user()` and handle the subscription like this:
```
var easy = StripeEasy.submitHelper(e);
var plan_id = "PLAN_ID_FROM_STRIPE"
StripeEasy.subscribe(easy, plan_id, function(err, result){
  // do something
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

Subscribes a new user to the specified plan_id. The callback function should have two arguments, an `error` and a `result` argument. Where `obj` is the object returned from `StripeEasy.submitHelper(e)` and `callback` is a function to call after Stripe responds.

### StripeEasy.update(plan_id, callback)

Where `plan_id` is the new plan_id to update to.

The callback function should have two arguments, an `error` and a `result` argument.

### StripeEasy.cancel(callback)

Cancels the currently logged in users subscription plan. The callback function should have two arguments, an `error` and a `result` argument.

### StripeEasy.config(obj)

Easily add CSS classes to the inputs by passing `{inputClasses: "class-name class-name"}`to the StripeEasy.config.

### Plays nicely with Bootstrap and Font-Awesome

Has some error class validation built into the input tabs, and also adds icons when bootstrap and font-awesome are added to your project.

## TODO

1. Test error cases suggested by Stripe.
2. Write more TODOs.

**License**
MIT - http://opensource.org/licenses/MIT
