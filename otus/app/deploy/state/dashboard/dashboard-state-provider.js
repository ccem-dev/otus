(function() {
  'use strict';

  angular
    .module('otusjs.deploy')
    .provider('otusjs.deploy.DashboardState', Provider);

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
      parent: STATE.SESSION,
      name: STATE.DASHBOARD,
      url: '/' + STATE.DASHBOARD,
      template: '<otus-dashboard layout="column" flex></otus-dashboard>'
    };
  }
}());
