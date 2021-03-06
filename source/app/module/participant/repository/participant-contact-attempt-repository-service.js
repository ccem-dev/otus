(function () {
  'use strict';

  angular
    .module('otusjs.participant.repository')
    .service('otusjs.participant.repository.ParticipantContactAttemptRepositoryService', Service);

  Service.$inject = [
    'otusjs.participant.core.ModuleService'
  ];

  function Service(ModuleService) {
    var self = this;
    let _remoteDataSource = ModuleService.getParticipantContactAttemptRemoteStorage();

    /* Public methods */
    self.create = create;
    self.findByRnByContactTypeByPosition = findByRnByContactTypeByPosition;
    self.deleteContactAttempt = deleteContactAttempt;
    self.findAttemptConfigurationByObjectType = findAttemptConfigurationByObjectType;
    self.updateAttemptAddress = updateAttemptAddress;
    self.changeAttemptAddress = changeAttemptAddress;

    function create(attempt) {
      return _remoteDataSource.whenReady()
        .then(remoteDataSource => remoteDataSource.create(attempt))
        .then(response => response.data);
    }

    function findByRnByContactTypeByPosition(rn, contactType, position) {
      return _remoteDataSource.whenReady()
        .then(remoteDataSource => remoteDataSource.findByRnByContactTypeByPosition(rn, contactType, position))
        .then(response => response.data);
    }

    function deleteContactAttempt(id) {
      return _remoteDataSource.whenReady()
        .then(remoteDataSource => remoteDataSource.deleteContactAttempt(id))
        .then(response => response.data);
    }

    function findAttemptConfigurationByObjectType(objectType) {
      return _remoteDataSource.whenReady()
        .then(remoteDataSource => remoteDataSource.findAttemptConfigurationByObjectType(objectType))
        .then(response => response.data);
    }

    function updateAttemptAddress(rn, contactType, position, addressJson) {
      return _remoteDataSource.whenReady()
        .then(remoteDataSource => remoteDataSource.updateAttemptAddress(rn, contactType, position, addressJson))
        .then(response => response.data);
    }

    function changeAttemptAddress(rn, contactType, position) {
      return _remoteDataSource.whenReady()
        .then(remoteDataSource => remoteDataSource.changeAttemptAddress(rn, contactType, position))
        .then(response => response.data);
    }
  }
}());