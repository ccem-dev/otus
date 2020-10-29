(function () {
  'use strict';

  angular
    .module('otusjs.laboratory.business.participant')
    .service('otusjs.laboratory.business.participant.ParticipantLaboratoryService', Service);

  Service.$inject = [
    '$q',
    'otusjs.laboratory.repository.LaboratoryRepositoryService',
    'otusjs.laboratory.core.ContextService',
    'otusjs.laboratory.business.participant.LaboratoryLabelFactory',
    'otusjs.laboratory.core.EventService',
    'otusjs.laboratory.participant.ParticipantLaboratoryFactory',
    'otusjs.laboratory.business.configuration.LaboratoryConfigurationService',
    'otusjs.laboratory.business.participant.LaboratoryLabelAliquotFactory'
  ];

  function Service($q, LaboratoryRepositoryService, ContextService, LaboratoryLabelFactory, EventService, ParticipantLaboratoryFactory, LaboratoryConfigurationService,LaboratoryLabelAliquotFactory) {
    var self = this;
    var _participantLaboratory;
    var _laboratoryConfiguration;

    _init();

    self.initializeLaboratory = initializeLaboratory;
    self.getSelectedParticipant = getSelectedParticipant;
    self.hasLaboratory = hasLaboratory;
    self.getLaboratory = getLaboratory;
    self.onParticipantSelected = onParticipantSelected;
    self.generateLabels = generateLabels;
    self.getLoggedUser = getLoggedUser;
    self.updateLaboratoryParticipant = updateLaboratoryParticipant;
    self.updateAliquots = updateAliquots;
    self.convertStorageAliquot = convertStorageAliquot;
    self.updateTubeCollectionData = updateTubeCollectionData;
    self.deleteAliquot = deleteAliquot;
    self.getCheckingExist = getCheckingExist;
    self.setData = setData;
    self.getData = getData;
    self.getLaboratoryByParticipant = getLaboratoryByParticipant;
    self.generateLabelsAliquots = generateLabelsAliquots;

    function _init() {
      _laboratoryConfiguration = null;
      self.listTubes = [];
    }

    function onParticipantSelected(listener) {
      EventService.onParticipantSelected(listener);
    }

    function initializeLaboratory() {
      var request = $q.defer();
      getSelectedParticipant()
        .then(function (participant) {
          self.participant = participant;
          _getLaboratoryDescriptors()
            .then(function () {
              return LaboratoryRepositoryService
                .initializeLaboratory(participant)
                .then(function (laboratory) {
                  _participantLaboratory = ParticipantLaboratoryFactory.fromJson(laboratory, getLoggedUser(), self.participant);
                  request.resolve(laboratory);
                });
            });
        });
      return request.promise;
    }

    function hasLaboratory() {
      var request = $q.defer();

      getSelectedParticipant()
        .then(function (participant) {
          _getLaboratoryDescriptors()
            .then(function () {
              LaboratoryRepositoryService
                .getLaboratory(participant)
                .then(function (laboratory) {
                  self.participant = participant;
                  if (laboratory !== 'null') {
                    _participantLaboratory = ParticipantLaboratoryFactory.fromJson(laboratory, getLoggedUser(), self.participant);
                    request.resolve(true);
                  } else {
                    request.resolve(false);
                  }
                });
            });
        });

      return request.promise;
    }

    function getSelectedParticipant() {
      return ContextService.getSelectedParticipant();
    }

    function setData(dataKey, dataValue) {
      return ContextService.setData(dataKey, dataValue)
    }

    function getData(dataKey){
      return ContextService.getData(dataKey)
    }

    function getCurrentUser() {
      return ContextService.getCurrentUser();
    }

    function getLaboratory() {
      return _participantLaboratory;
    }

    function getLoggedUser() {
      return ContextService.getCurrentUser();

    }
    function updateLaboratoryParticipant() {
      return LaboratoryRepositoryService.updateLaboratoryParticipant(JSON.stringify(_participantLaboratory));

    }
    function updateTubeCollectionData(updateStructure) {
      return LaboratoryRepositoryService.updateTubeCollectionData(JSON.stringify(updateStructure));

    }

    function updateAliquots(updateStructure) {
      return LaboratoryRepositoryService.updateAliquots(updateStructure);
    }

    function convertStorageAliquot(aliquot) {
      return LaboratoryRepositoryService.convertStorageAliquot(aliquot);
    }

    function deleteAliquot(aliquotCode) {
      return LaboratoryRepositoryService.deleteAliquot(aliquotCode);
    }

    function getLaboratoryByParticipant(recruitmentNumber, ParticipantManagerService) {
      var request = $q.defer()
      const participant = ParticipantManagerService.getParticipant(recruitmentNumber)
      _getLaboratoryDescriptors()
        .then(() => {
          LaboratoryRepositoryService
            .getLaboratory(participant)
            .then((laboratory) => {
              self.participant = participant
              if (laboratory !== 'null') {
                _participantLaboratory = ParticipantLaboratoryFactory.fromJson(laboratory, getLoggedUser(), participant);
                request.resolve(_participantLaboratory);
              } else {
                request.resolve(false);
              }
            }, function (e) {
              request.reject(e);
            })
        })
      return request.promise
    }

    function generateLabels() {
      return LaboratoryLabelFactory.create(self.participant, angular.copy(_participantLaboratory));
    }
    function generateLabelsAliquots() {
      return LaboratoryLabelAliquotFactory.create(self.participant, angular.copy(_participantLaboratory));
    }

    function getCheckingExist() {
      return LaboratoryConfigurationService.getCheckingExist();
    }

    function _getLaboratoryDescriptors() {
      return LaboratoryConfigurationService.getLaboratoryDescriptors();
    }
  }
}());
