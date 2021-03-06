(function () {
  'use strict';

  angular
    .module('otusjs.laboratory.business.configuration')
    .service('otusjs.laboratory.business.configuration.LaboratoryConfigurationService', Service);

  Service.$inject = [
    '$q',
    'otusjs.laboratory.repository.LaboratoryRepositoryService',
    'otusjs.laboratory.configuration.LaboratoryConfigurationService'
  ];

  function Service($q, LaboratoryRepositoryService, LaboratoryConfigurationService) {
    var self = this;
    /* Public methods */
    self.getCheckingExist = getCheckingExist;
    self.getLaboratoryDescriptors = getLaboratoryDescriptors;
    self.fetchAliquotsDescriptors = fetchAliquotsDescriptors;
    self.getQualityControlGroupNames = getQualityControlGroupNames;
    self.getTubeMedataDataByType = getTubeMedataDataByType;
    self.getLotReceiptMetadata = getLotReceiptMetadata;

    /* Laboratory Configuration */

    function getCheckingExist() {
      var defer = $q.defer();
      LaboratoryRepositoryService.getCheckingExist().then(function (response) {
        defer.resolve(response.data);
      }, function (e) {
        defer.resolve(false);
      });

      return defer.promise;
    }

    function getLaboratoryDescriptors() {
      var defer = $q.defer();
      var labConfigInitialized = LaboratoryConfigurationService.checkLaboratoryConfiguration();

      if (labConfigInitialized) {
        defer.resolve(labConfigInitialized);
      } else {
        _fetchLaboratoryConfiguration()
          .then(function (laboratoryConfiguration) {
            LaboratoryConfigurationService.initializeLaboratoryConfiguration(laboratoryConfiguration);
            defer.resolve(LaboratoryConfigurationService.checkLaboratoryConfiguration());
          });
      }
      return defer.promise;
    }

    function getQualityControlGroupNames() {
      var defer = $q.defer();

      LaboratoryRepositoryService.getLaboratoryDescriptors()
        .then(function (response) {
          let names = [];
          response.data.collectGroupConfiguration.groupDescriptors.forEach(function (descriptor) {
            if (descriptor.type === "QUALITY_CONTROL" || descriptor.type === "DEFAULT"){
              names.push(descriptor.name)
            }
          });
          defer.resolve(names);
        }, function (e) {
          defer.reject(e);
        });

      return defer.promise;
    }

    function _fetchLaboratoryConfiguration() {
      var defer = $q.defer();
      LaboratoryRepositoryService.getLaboratoryDescriptors()
        .then(function (response) {
          defer.resolve(response.data);
        }, function (e) {
          defer.reject(e);
        });

      return defer.promise;
    }

    /* Aliquots Descriptors */

    function fetchAliquotsDescriptors() {
      var defer = $q.defer();
        _fetchConfiguration()
          .then(function (configuration) {
            LaboratoryConfigurationService.initializeLaboratoryConfiguration(configuration);
            defer.resolve(LaboratoryConfigurationService.checkAliquotsDescriptors());
          });
      return defer.promise;
    }

    function _fetchConfiguration() {
      var defer = $q.defer();
      LaboratoryRepositoryService.getLaboratoryDescriptors()
        .then(function (response) {
          defer.resolve(response.data);
        }, function (e) {
          defer.reject(e);
        });

      return defer.promise;
    }

    function _fetchTubesDescriptors() {
      var defer = $q.defer();
      LaboratoryRepositoryService.getAliquotsDescriptors()
        .then(function (response) {
          defer.resolve(response.data);
        }, function (e) {
          defer.reject(e);
        });

      return defer.promise;
    }

    function getTubeMedataDataByType(tubeType) {
      return LaboratoryRepositoryService.getTubeMedataDataByType(tubeType);
    }

    function getLotReceiptMetadata() {
      return LaboratoryRepositoryService.getLotReceiptMetadata();
    }

  }

}());
