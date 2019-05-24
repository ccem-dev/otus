(function () {
  'use strict';

  angular
    .module('otusjs.deploy')
    .service('otusjs.deploy.UserDataSourceService', Service);

  Service.$inject = [
    '$q',
    'otusjs.deploy.user.UserRestService',
    'otusjs.user.storage.UserStorageService',
    'otusjs.deploy.user.UserAccessPermissionRestService',
    'otusjs.application.session.core.ContextService'
  ];

  function Service($q, UserRestService, UserStorageService, UserAccessPermissionRestService, ContextService) {
    var self = this;
    var _loadingDefer = null;

    /* Public methods */
    self.up = up;
    self.getData = getData;
    self.listIndexers = listIndexers;

    function up() {
      _loadingDefer = $q.defer();
      _initializeSources();
      _loadData();
      return _loadingDefer.promise;
    }

    function listIndexers() {
      return UserStorageService.getCollection().find();
    }

    function getData() {
    }

    function _initializeSources() {
      UserRestService.initialize();
      UserAccessPermissionRestService.initialize();
    }

    function _loadData() {
      UserRestService
        .listIdexers()
        .then(function (response) {
          UserStorageService.getCollection().clear();
          UserStorageService.getCollection().insert(response.data);
          UserStorageService.save();
          _loadingDefer.resolve();
        });

      ContextService.getLoggedUser()
        .then(loggedUser => {
          UserAccessPermissionRestService.getAllPermission({email: loggedUser.email})
            .then(response => {

            })
        })

    }
  }
}());
