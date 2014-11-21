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
      throw new Meteor.Error(401, "No userId found by stripeEasySubscribe method");
    }

    var Future = Npm.require("fibers/future");
    var future = new Future();

    var user = Meteor.users.findOne({_id: this.userId});
    var services = user.services;
    var email = null;

    if(user && services){
      if(services.facebook && services.facebook.email){
        email = services.facebook.email;
      } else if(services.google && services.google.email){
        email = services.google.email;
      } else if(user.emails && user.emails[0] && user.emails[0].address){
        email = user.emails[0].address;
      } else {
        throw new Meteor.Error(400, "stripeEasySubscribe Method was unable to find an email address for the signed in user");
      }
    } else {
      throw new Meteor.Error(400, "No services found on user object");
    }

    var bound = Meteor.bindEnvironment(function(err, customer){
      if(err) {
        console.warn(err);
        future.throw(new Meteor.Error(400, err.message));
      }
      else {
        // console.log(customer);
        // console.log(customer.id);
        // console.log("subscription data!!!!!");
        // console.log(customer.subscriptions.data[0]);
        // update the user object
        Meteor.users.update({_id: user._id}, {$set: {"stripe.customerId": customer.id, "stripe.subscription": customer.subscriptions.data[0]}});
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
        future.throw(new Meteor.Error(400, err.message));
      }
      else {
        // console.log(subscription);
        Meteor.users.update({_id: user._id}, {$set: {"stripe.subscription": subscription}});
        future.return(subscription);
      }
    });

    Stripe.customers.updateSubscription(
      user.stripe.customerId,
      user.stripe.subscription.id,
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
        future.throw(new Meteor.Error(400, err.message));
      }
      else {
        // console.log(subscription);
        Meteor.users.update({_id: user._id}, {$set: {"stripe.subscription": subscription}});
        future.return(subscription);
      }
    });

    Stripe.customers.cancelSubscription(
      user.stripe.customerId,
      user.stripe.subscription.id,
      bound
    );

    return future.wait();
  }
});
