(function() {
  'use strict';

  angular
    .module('otusjs.deploy')
    .provider('otusjs.deploy.ExamLotDashboardState', Provider);

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
      name: STATE.EXAM_DASHBOARD,
      url: '/' + STATE.EXAM_DASHBOARD,
      template: '<otus-exam-dashboard layout="column" flex></otus-exam-dashboard>',
      data: {
        redirect: _redirect
      },
      resolve:{
        stateData: _loadStateData
      }
    };

    function _loadStateData(SessionContextService, ContextService, Application) {
      Application
        .isDeployed()
        .then(function() {
          try {
            SessionContextService.restore();
            ContextService.restore();
          } catch (e) {
            console.log(e);
          }
        });
    }

    function _redirect($q, Application) {
      var deferred = $q.defer();

      Application
        .isDeployed()
        .then(function() {
          try {
            deferred.resolve();
          } catch (e) {
            deferred.resolve(STATE.LOGIN);
          }
        });

      return deferred.promise;
    }

    _redirect.$inject = [
      '$q',
      'otusjs.application.core.ModuleService'
    ];

    _loadStateData.$inject = [
      'otusjs.application.session.core.ContextService',
      'otusjs.laboratory.core.project.ContextService',
      'otusjs.application.core.ModuleService'
    ];
  }
}());
