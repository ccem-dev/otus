(function () {
  'use strict';

  angular
    .module('otusjs.deploy')
    .provider('otusjs.deploy.LaboratoryMonitoringState', Provider);

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
      name: STATE.LABORATORY_MONITORING_DASHBOARD,
      url: '/' + STATE.LABORATORY_MONITORING_DASHBOARD,
      template: '<otus-laboratory-monitoring-dashboard layout="column" flex></otus-laboratory-monitoring-dashboard>',
      resolve: {
        resolve: _resolve
      },
      data: {
        redirect: _redirect
      }
    };

    function _resolve($q, Application, SessionContextService, DashboardContextService) {
      var deferred = $q.defer();

      Application.isDeployed()
        .then(function () {
          try {
            DashboardContextService.restore();
            SessionContextService.restore();
            deferred.resolve();
          } catch (e) {
            deferred.resolve(STATE.LOGIN);
          }
        });

      return deferred.promise;
    }

    _resolve.$inject = [
      '$q',
      'otusjs.application.core.ModuleService',
      'otusjs.application.session.core.ContextService',
      'otusjs.otus.dashboard.core.ContextService'
    ]

    function _redirect($q, Application, UserAccessPermissionService) {
      var deferred = $q.defer();

      UserAccessPermissionService.getCheckingMonitoringPermission().then(permission => {
        Application
          .isDeployed()
          .then(function () {
              try {
                if (!permission.laboratoryControlAccess) {
                  deferred.resolve(STATE.DASHBOARD);
                  return;
                }
                deferred.resolve();
              } catch (e) {
                deferred.resolve(STATE.LOGIN);
              }
            });
        });

      return deferred.promise;
    }

    _redirect.$inject = [
      '$q',
      'otusjs.application.core.ModuleService',
      'otusjs.user.business.UserAccessPermissionService'
    ];

  }
}());
