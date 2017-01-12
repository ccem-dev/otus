(function() {
  'use strict';

  angular
    .module('otusjs.deploy', [
      'otus.client',
      'otus.domain.client',
      'otusjs',
      'otusjs.player.core',
      'otusjs.player.component'
    ])
    .value('OtusLocalStorage', [
      'otusjs.activity.storage.ActivityStorageService',
      'otusjs.activity.storage.SurveyStorageService',
      'otusjs.participant.storage.ParticipantStorageService',
      'otusjs.user.storage.UserStorageService'
    ])
    .run(Runner);

  Runner.$inject = [
    '$injector',
    'otusjs.deploy.StorageLoaderService',
    'otusjs.deploy.OtusApiService',
    'otusjs.deploy.BootstrapService'
  ];

  function Runner($injector, StorageLoaderService, OtusApiService, BootstrapService) {
    loadOtusRestApi(OtusApiService);
    loadOtusDb(StorageLoaderService)
      .then(function() {
        BootstrapService.run();
        notifyModuleLoad($injector);
      });
  }

  function loadOtusRestApi(OtusApiService) {
    OtusApiService.initializeResources();
  }

  function loadOtusDb(StorageLoaderService) {
    var OTUS_DB = 'otus';

    StorageLoaderService.initializeSessionStorage();

    if (StorageLoaderService.dbExists(OTUS_DB)) {
      return StorageLoaderService.loadLocalStorage(OTUS_DB);
    } else {
      return StorageLoaderService.createLocalStorage(OTUS_DB);
    }
  }

  function loadDataSources(DataSourceLoaderService) {
    return DataSourceLoaderService.initializeDataSources();
  }

  function notifyModuleLoad($injector) {
    var currentModule = angular.module('otusjs.deploy');
    var application = $injector.get('otusjs.application.core.ModuleService');
    application.notifyModuleLoad(currentModule.name);
    application.finalizeDeploy();
    console.info('Deploy module ready.');
  }
}());
