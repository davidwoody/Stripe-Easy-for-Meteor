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
  stripeEasySubscribe: function(token, planId){
    if(!this.userId){
      throw new Meteor.Error(401, "Not an authorized user.");
    }

    var Future = Npm.require("fibers/future");
    var future = new Future();

    var user = Meteor.users.findOne({_id: this.userId});
    var email = user.emails[0].address;
    console.log(email);

    var bound = Meteor.bindEnvironment(function(err, customer){
      if(err) {
        console.warn(err);
        future.return(new Meteor.Error(500, err));
      }
      else {
        console.log(customer);
        console.log(customer.id);
        console.log(planId);
        // update the user object
        Meteor.users.update({_id: user._id}, {$set: {"profile.stripe.id": customer.id, "profile.stripe.planId": planId}});
        future.return();
      }
    });
    
    Stripe.customers.create({
      card: token,
      plan: planId,
      email: email
    }, bound);
    
    return future.wait();
  }
});