/**
 * ProjectRemoteStorageService
 * @namespace Services
 */
(function() {
  'use strict';

  angular
    .module('otusjs.deploy')
    .service('otusjs.deploy.ProjectRemoteStorageService', Service);

  Service.$inject = [
    '$q',
    'otusjs.deploy.ExamsRestService'
  ];

  /**
   * ProjectRemoteStorageService creates a communication between the application and
   * ExamsRestService. Thus, layers above this service doesn't really know from
   * where the storage is coming, considering that a remote storage not necessarily
   * is accessed through a REST service. The interface of this service has the
   * intent of represents to the client code that it is an collection like an
   * MongoDB or IndexDB collection. If new storage sources are created, this service
   * should wrap it.
   * @see {ProjectRemoteStorageService}
   * @namespace ProjectRemoteStorageService
   * @memberof Services
   */
  function Service($q, ExamsRestService) {
    var self = this;

    self.getLots = getLots;
    self.createLot = createLot;
    self.updateLot = updateLot;
    self.deleteLot = deleteLot;

    /**
     * Exam Lot
     * @returns {Promise} promise
     * @memberof ProjectRemoteStorageService
     */
    function getLots() {
      var deferred = $q.defer();

      ExamsRestService
        .getLots()
        .then(function(response) {
          deferred.resolve(response.data);
        });

      return deferred.promise;
    }

    /**
     * Exam Lot
     * @param {(object)} lotStructure - the structure of lof
     * @returns {Promise} promise
     * @memberof ProjectRemoteStorageService
     */
    function createLot(lotStructure) {
      var deferred = $q.defer();
      ExamsRestService
        .createLot(lotStructure)
        .then(function(response){
          deferred.resolve(response.data);
        })
        .catch(function(e){
          deferred.reject(e);
        });
      return deferred.promise;
    }

    /**
     * Exam Lot
     * @param {(object)} lotStructure - the structure of lof
     * @returns {Promise} promise
     * @memberof ProjectRemoteStorageService
     */
    function updateLot(lotStructure) {
      var deferred = $q.defer();
      ExamsRestService
        .updateLot(lotStructure)
        .then(function(response){
          deferred.resolve(response.data);
        })
        .catch(function(e){
          deferred.reject(e);
        });
      return deferred.promise;
    }

    /**
     * Exam Lot
     * @param {(object)} lotCode - the code of lot
     * @returns {Promise} promise
     * @memberof ProjectRemoteStorageService
     */
    function deleteLot(lotCode) {
      var deferred = $q.defer();
      ExamsRestService
        .deleteLot(lotCode)
        .then(function(response){
          deferred.resolve(response.data);
        })
        .catch(function(e){
          deferred.reject(e);
        });
      return deferred.promise;
    }
  }
}());