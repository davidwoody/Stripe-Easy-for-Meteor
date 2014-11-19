// TEST WHETHER STRIPE IS DEFINED OR NOT
if(typeof Stripe === "undefined"){
  console.warn("Stripe is not defined");
}

// if there is not a publishable key set
if(!Meteor.settings || !Meteor.settings.public || !Meteor.settings.public.Stripe || !Meteor.settings.public.Stripe.publicKey){
  console.warn("Stripe publishable key is not set in Meteor.settings.public");
} else {
  Stripe.setPublishableKey(Meteor.settings.public.Stripe.publicKey);
}


StripeEasy = {};

// SUBSCRIBE: needs an object with number, cvc, exp_month,
_.extend(StripeEasy, {
  // obj.number
  // obj.cvc
  // obj.exp_month
  // obj.exp_year
  // plan_id
  subscribe: function (obj, plan_id, callback) {
    if(!Meteor.user()){
      return console.warn("A logged in user is required before calling StripeEasy.subscribe method");
    }

    if(!callback){
      return console.warn("Please provide a callback function for the StripeEasy.subscribe method");
    }

    Stripe.setPublishableKey(Meteor.settings.public.Stripe.publicKey);

    Stripe.card.createToken(obj, function(status, response){
      if(response.error){
        console.log("STATUS: " + status);
        console.warn(response.error);
        return Session.set('stripeEasyError', response.error);
      } else {
        var token = response.id;
        Meteor.call("stripeEasySubscribe", token, plan_id, callback);
      }
    });
  }, //subscribe

  // SUBMIT HELPER: needs the jQuery event object from form submit
  // returns what is needed for the subscribe method except for the sub_name
  submitHelper: function(e){
    var values = {};
    $(e.target).find("input").each(function(){
      var input = $(this);
      var obj = {};
      obj[input.attr("name")] = input.val();

      _.extend(values, obj);
    });

    var exp_month = values.expire.split('/')[0];
    var exp_year = values.expire.split('/')[1];
    if(exp_year && exp_year.length === 2){
      exp_year = "20" + exp_year;
    }

    return {
      number: values.number,
      cvc: values.cvc,
      exp_month: exp_month,
      exp_year: exp_year
    };
  }, //submitHelper

  configurable: {
    inputClasses: '', //default, update to input-lg or input-sm
    errorClasses: '', //default, add a custom class
  },


  // configure options: inputSize:
  config: function(obj){
    _.extend(StripeEasy.configurable, obj);
  }, //config

  update: function(plan_id, callback){
    if(!Meteor.user()){
      return console.warn("A logged in user is required before calling StripeEasy.update method");
    }

    if(!callback){
      return console.warn("Please provide a callback function for the StripeEasy.update method");
    }
    Meteor.call('stripeEasyUpdate', plan_id, callback);
  }, //update

  cancel: function(callback){
    if(!callback){
      return console.warn("Please provide a callback function for the StripeEasy.cancel method");
    }
    Meteor.call('stripeEasyCancel', callback);
  }, //cancel

});
