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
    console.log("keyup number");
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
  inputClasses: function(){
    return StripeEasy.configurable.inputClasses;
  }
});