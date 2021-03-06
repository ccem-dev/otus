(function () {
  'use strict';

  angular
    .module('otusjs.deploy')
    .service('otusjs.deploy.ParticipantModuleBootstrap', Service);

  Service.$inject = [
    '$q',
    'otusjs.participant.core.ModuleService',
    'otusjs.application.context.ContextFactory',
    'otusjs.application.storage.StorageService',
    'otusjs.deploy.ParticipantDataSourceService',
    'otusjs.deploy.ParticipantContactRestService',
    'otusjs.deploy.ParticipantContactAttemptRestService',

  ];

  function Service($q, ModuleService, ContextFactory, StorageService, ParticipantDataSourceService, ParticipantContactRestService, ParticipantContactAttemptRestService) {
    var self = this;

    /* Public methods */
    self.bootstrap = bootstrap;
    self.configureContext = configureContext;
    self.configureStorage = configureStorage;
    self.configureParticipantDataSource = configureParticipantDataSource;

    function bootstrap() {
      var deferred = $q.defer();
      configureContext(ContextFactory);
      configureStorage(StorageService.session);
      configureParticipantDataSource(ParticipantDataSourceService);
      ModuleService.configureRemoteStorage(ParticipantContactRestService);
      ModuleService.configureAttemptRemoteStorage(ParticipantContactAttemptRestService);
      return deferred.promise;
    }

    function configureContext(context) {
      ModuleService.configureContext(context);
    }

    function configureStorage(storage) {
      ModuleService.configureStorage(storage);
    }

    function configureParticipantDataSource(dataSource) {
      return ModuleService.configureParticipantDataSourceService(dataSource);
    }
  }
}());
