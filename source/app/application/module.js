(function () {
  'use strict';

  angular
    .module('otusjs.application', [
      'otusjs.application.dependency',
      'otusjs.application.environment',
      'otusjs.application.storage',
      'otusjs.application.session',
      'otusjs.application.context',
      'otusjs.application.core',
      'otusjs.application.crash',
      'otusjs.application.activity',
      'otusjs.application.color',
      'otusjs.application.dialog',
      'otusjs.application.state',
      'otusjs.application.http',
      'otusjs.application.locale',
      'otusjs.application.verifyBrowser',
      'otusjs.application.exam'
    ])
    .run(function () {
      console.info('Application module ready.');
    });

}());
