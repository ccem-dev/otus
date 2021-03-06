(function() {
  'use strict';

  angular
    .module('otusjs.deploy')
    .provider('otusjs.deploy.SignupState', Provider);

  Provider.$inject = [
    'STATE'
  ];

  function Provider(STATE) {
    var self = this;

    self.$get = [provider];

    function provider() {
      return self;
    }

    self.state = {
      parent: STATE.ACCESS,
      name: STATE.SIGNUP,
      url: '/' + STATE.SIGNUP,
      templateUrl: 'app/ux-component/user-signup/signup.html',
      controller: 'otusjs.otus.uxComponent.SignupController as $ctrl'
    };
  }
}());
