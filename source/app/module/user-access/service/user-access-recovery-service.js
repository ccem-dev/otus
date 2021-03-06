(function () {
  'use strict';

  angular
    .module('otusjs.user.access.service')
    .service('otusjs.user.access.service.UserAccessRecoveryService', Service);

  Service.$inject = [
    '$q',
    'otusjs.deploy.user.UserAccessRecoveryRestService'
  ];

  function Service($q, UserAccessRecoveryRestService) {
    var self = this;

    /* Public methods */
    self.$onInit = onInit;
    self.validateToken = validateToken;
    self.sendPasswordReset = sendPasswordReset;
    self.updatePassword = updatePassword;

    function onInit() {
      UserAccessRecoveryRestService.initialize();
    }

    function validateToken(token) {
      var deferred = $q.defer();
      UserAccessRecoveryRestService.validateToken(token)
        .then(function (response) {
          deferred.resolve(response.data);
        })
        .catch(function (e) {
          deferred.reject(e);
        })

      return deferred.promise;
    }

    function sendPasswordReset(data) {
      var deferred = $q.defer();
      UserAccessRecoveryRestService.sendPasswordReset(data)
        .then(function (response) {
          deferred.resolve(response.data);
        })
        .catch(function (e) {
          deferred.reject(e);
        })

      return deferred.promise;
    }

    function updatePassword(data) {
      var deferred = $q.defer();
      UserAccessRecoveryRestService.updatePassword(data)
        .then(function (response) {
          deferred.resolve(response.data);
        })
        .catch(function (e) {
          deferred.reject(e);
        })

      return deferred.promise;
    }
  }
}());
