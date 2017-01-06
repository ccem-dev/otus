(function() {
  'use strict';

  angular
    .module('otusjs.application.dependency', [
      /* Angular modules */
      'ngMaterial',
      'ngMessages',
      'ngAnimate',
      /* 3rd-party modules */
      'ui.router',
      'ui.mask',
      'passwordControl'
    ])
    .run(function($injector) {
      var currentModule = angular.module('otusjs.application.dependency');
      var application = $injector.get('otusjs.application.core.ModuleService');
      application.notifyModuleLoad(currentModule.name);
      console.info('Dependency module ready.');
    });

}());
