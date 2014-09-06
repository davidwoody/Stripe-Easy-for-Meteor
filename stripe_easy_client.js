StripeEasy = {};

// SUBSCRIBE: needs an object with number, cvc, exp_month,
_.extend(StripeEasy, {
  // obj.number
  // obj.cvc
  // obj.exp_month
  // obj.exp_year
  // obj.sub_name
  subscribe: function (obj, callback) {
    if(!Meteor.user()){
      return console.warn("A logged in user is required before calling StripeEasy.subscribe method");
    }

    if(!callback){
      return console.warn("Please provide a callback function for the StripeEasy.subscribe method");
    }

    Stripe.card.createToken({
      number: obj.number,
      cvc: obj.cvc,
      exp_month: obj.exp_month,
      exp_year: obj.exp_year
    }, function(status, response){
      console.log("STATUS: " + status);
      if(response.error){
        console.warn(response.error);
        return alert(response.error);
      } else {
        console.log("RESPONSE: ");
        console.log(response);
        var token = response.id;
        Meteor.call("stripeEasySubscribe", token, obj.sub_name, callback);
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
    inputClasses: "", //default, update to input-lg or input-sm  
  },
  

  // configure options: inputSize: 
  config: function(obj){
    _.extend(StripeEasy.configurable, obj);
  }, //config

});

// if there is not a publishable key set
if(!Meteor.settings || !Meteor.settings.public || !Meteor.settings.public.Stripe || !Meteor.settings.public.Stripe.publicKey){
  console.warn("Stripe publishable key is not set in Meteor.settings.public");
} else {
  Stripe.setPublishableKey(Meteor.settings.public.Stripe.publicKey);
}

// TEST WHETHER STRIPE IS DEFINED OR NOT
if(typeof Stripe === "undefined"){
  console.warn("Stripe is not defined");
}