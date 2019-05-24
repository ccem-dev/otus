(function () {
  'use strict';

  angular
    .module('otusjs.user.core')
    .service('otusjs.user.core.ModuleService', Service);

  Service.$inject = [
    '$q',
    'otusjs.user.core.ContextService'
  ];

  function Service($q, ContextService) {
    var self = this;

    self.DataSource = {};
    self.Proxy = {};
    self.Service = {};
    var _remoteStorage = {};
    var _userPermissionStorageDefer = $q.defer();

    /* Public methods */
    self.configureContext = configureContext;
    self.configureStorage = configureStorage;
    self.configureUserDataSource = configureUserDataSource;
    self.configureLoginProxy = configureLoginProxy;
    self.configureUserPermissionRemoteStorage = configureUserPermissionRemoteStorage;
    self.getUserPermissionRemoteStorage = getUserPermissionRemoteStorage;

    function configureContext(context) {
      ContextService.configureContext(context);
    }

    function configureStorage(storage) {
      ContextService.configureStorage(storage);
    }

    function configureStorage(storage) {
      ContextService.configureStorage(storage);
    }

    function configureUserDataSource(dataSource) {
      self.DataSource.User = dataSource;
    }

    function configureLoginProxy(proxy) {
      self.Proxy.LoginProxy = proxy;
      self.Proxy.LoginProxy.initialize();
    }

    function configureUserPermissionRemoteStorage(userPermissionRemoteStorage) {
      _remoteStorage.userPermission = userPermissionRemoteStorage;
    }

    function getUserPermissionRemoteStorage() {
      if (_remoteStorage.UserPermission) {
        _userPermissionStorageDefer = $q.defer();
        _userPermissionStorageDefer.resolve(_remoteStorage.userPermission);
      }
      return {
        whenReady: function () {
          return _userPermissionStorageDefer.promise;
        }
      };
    }
  }
}());
