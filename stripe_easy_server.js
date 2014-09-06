// if there is not a secret key set
if(!Meteor.settings || !Meteor.settings.Stripe || !Meteor.settings.Stripe.secretKey){
  console.warn("Stripe secret key is not set in Meteor.settings");
} else {
  var Stripe = Npm.require('stripe')(Meteor.settings.Stripe.secretKey);
}


// TEST WHETHER STRIPE IS DEFINED OR NOT
if(typeof Stripe === "undefined"){
  console.warn("Stripe is not defined");
}


Meteor.methods({
  stripeEasySubscribe: function(token, plan_id){
    if(!this.userId){
      throw new Meteor.Error(401, "Not an authorized user.");
    }

    var Future = Npm.require("fibers/future");
    var future = new Future();

    var user = Meteor.users.findOne({_id: this.userId});
    var email = user.emails[0].address;

    var bound = Meteor.bindEnvironment(function(err, customer){
      if(err) {
        console.warn(err);
        future.return(new Meteor.Error(400, err.message));
      }
      else {
        console.log(customer);
        console.log(customer.id);
        console.log("subscription data!!!!!");
        console.log(customer.subscriptions.data[0]);
        // update the user object
        Meteor.users.update({_id: user._id}, {$set: {"profile.stripe.customerId": customer.id, "profile.stripe.subscription": customer.subscriptions.data[0]}});
        future.return(customer);
      }
    });
    
    Stripe.customers.create({
      card: token,
      plan: plan_id,
      email: email
    }, bound);
    
    return future.wait();
  }, // stripeEasySubscribe
  stripeEasyUpdate: function(plan_id){
    if(!this.userId){
      throw new Meteor.Error(401, "Not an authorized user.");
    }

    var Future = Npm.require("fibers/future");
    var future = new Future();
    var user = Meteor.users.findOne({_id: this.userId});

    var bound = Meteor.bindEnvironment(function(err, subscription){
      if(err) {
        console.warn(err);
        future.return(new Meteor.Error(500, err));
      }
      else {
        console.log(subscription);
        Meteor.users.update({_id: user._id}, {$set: {"profile.stripe.subscription": subscription}});
        future.return(subscription);
      }
    });

    Stripe.customers.updateSubscription(
      user.profile.stripe.customerId,
      user.profile.stripe.subscription.id,
      { plan: plan_id },
      bound
    );

    return future.wait();
  },

  stripeEasyCancel: function(){
    if(!this.userId){
      throw new Meteor.Error(401, "Not an authorized user.");
    }

    var Future = Npm.require("fibers/future");
    var future = new Future();
    var user = Meteor.users.findOne({_id: this.userId});

    var bound = Meteor.bindEnvironment(function(err, subscription){
      if(err) {
        console.warn(err);
        future.return(new Meteor.Error(400, err.message));
      }
      else {
        console.log(subscription);
        Meteor.users.update({_id: user._id}, {$set: {"profile.stripe.subscription": subscription}});
        future.return(subscription);
      }
    });

    Stripe.customers.cancelSubscription(
      user.profile.stripe.customerId,
      user.profile.stripe.subscription.id,
      bound
    );

    return future.wait();
  }
});