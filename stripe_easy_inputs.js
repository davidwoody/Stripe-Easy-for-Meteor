var validInput = function(e, bool){
  if(bool){
    $(e.target).closest(".form-group").removeClass("has-error");
  } else {
    $(e.target).closest(".form-group").addClass("has-error");
  }
};

Template.stripeEasyInputs.events({
  'blur [name="number"]':function (e) {
    var val = $(e.target).val();
    var valid = Stripe.card.validateCardNumber(val);
    validInput(e, valid);
  },
  'blur [name="expire"]': function(e){
    var val = $(e.target).val().split("/");
    if(val[1] && val[1].length === 2){
      val[1] = "20" + val[1];
    }
    var valid = Stripe.card.validateExpiry(val[0], val[1]);
    validInput(e, valid);
  },
  'keyup [name="cvc"]': function(e){
    var val = $(e.target).val();
    var valid = Stripe.card.validateCVC(val);
    validInput(e, valid);
  }
});


Template.stripeEasyInputs.helpers({
  inputClasses: function () {
    return StripeEasy.configurable.inputClasses;
  },
  errorClasses: function () {
    return StripeEasy.configurable.errorClasses;
  },
  stripeEasyErrors: function () {
    var error = Session.get('stripeEasyError');
    if(error.reason){
      return error.reason;
    } else if(error.message){
      return error.message;
    } else if(error) {
      return 'Something went wrong. Please double check your inputs';
    }
  },
  hasError: function () {
    var error = Session.get('stripeEasyError');
    if(error){
      return true;
    }
  },
});

Template.stripeEasyInputs.destroyed = function () {
   Session.set('stripeEasyError', null);
};