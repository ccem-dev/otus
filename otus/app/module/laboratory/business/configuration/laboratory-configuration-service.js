(function() {
  'use strict';

  angular
    .module('otusjs.laboratory.business.configuration')
    .service('otusjs.laboratory.business.configuration.LaboratoryConfigurationService', Service);

  Service.$inject = [
     'otusjs.laboratory.configuration.LaboratoryConfigurationService',
     'otusjs.laboratory.repository.ParticipantLaboratoryRepositoryService',
    '$q',
  ];

  function Service(LaboratoryConfigurationService, ParticipantLaboratoryRepositoryService, $q) {
    var self = this;

    self.getLaboratoryDescriptors = getLaboratoryDescriptors;
    self.getAliquotsDescriptors = getAliquotsDescriptors;

    onInit();

    function onInit() {
      // LaboratoryConfigurationService.reset(); // TODO: CHECK IF NEEDED
    }


    /*Laboratory Descriptors*/
    //takes nothing, returns promise
    function getLaboratoryDescriptors() {
      var defer = $q.defer();
      var _laboratoryConfiguration = LaboratoryConfigurationService.getLaboratoryConfiguration();

      if (_laboratoryConfiguration) {
        defer.resolve(_laboratoryConfiguration);
      } else {
        _fetchLaboratoryConfiguration()
          .then(function(laboratoryConfiguration) {
            LaboratoryConfigurationService.initializeLaboratoryConfiguration(laboratoryConfiguration);
            defer.resolve(LaboratoryConfigurationService.getLaboratoryConfiguration());
          });
      }
      return defer.promise;
    }

    function _fetchLaboratoryConfiguration() {
      var defer = $q.defer();
      ParticipantLaboratoryRepositoryService.getLaboratoryDescriptors()
        .then(function(response) {
          defer.resolve(response.data);
        }, function(e) {
          defer.reject(e);
        });

      return defer.promise;
    }

    /*Aliquots Descriptors*/
    function getAliquotsDescriptors() {
      var defer = $q.defer();
      var _aliquotsDescriptors = LaboratoryConfigurationService.getAliquotsDescriptors();

      if (_aliquotsDescriptors) {
        defer.resolve(_aliquotsDescriptors);
      } else {
        _fetchAliquotsDescriptors()
          .then(function(aliquotsDescriptors) {
            LaboratoryConfigurationService.initializeAliquotsDescriptors(aliquotsDescriptors);
            defer.resolve(LaboratoryConfigurationService.getAliquotsDescriptors());
          });
      }
      return defer.promise;
    }

    function _fetchAliquotsDescriptors() {
      var defer = $q.defer();
      ParticipantLaboratoryRepositoryService.getAliquotsDescriptors() // TODO: implement
        .then(function(response) {
          defer.resolve(response.data);
        }, function(e) {
          defer.reject(e);
        });

      return defer.promise;
    }
  }

}());
