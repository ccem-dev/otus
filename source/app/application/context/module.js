(function() {
  'use strict';

  angular
    .module('otusjs.application.context', [])
    .run(runner);

    runner.$inject = [
      '$injector'
    ];

    function runner($injector) {
      var currentModule = angular.module('otusjs.application.context');
      var application = $injector.get('otusjs.application.core.ModuleService');
      application.notifyModuleLoad(currentModule.name);
      console.info('Context module ready.');
    }

}());
