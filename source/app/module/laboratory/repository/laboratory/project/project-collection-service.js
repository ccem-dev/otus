/**
 * ProjectCollectionService
 * @namespace Services
 */
(function () {
  'use strict';

  angular
    .module('otusjs.laboratory.repository')
    .service('otusjs.laboratory.repository.ProjectCollectionService', Service);

  Service.$inject = [
    '$q',
    'otusjs.laboratory.core.ModuleService'
  ];

  /**
   * ProjectCollectionService represents to application the activity collection. It abstracts to
   * other layers the storage implementation.
   * @namespace ProjectCollectionService
   * @memberof Services
   */
  function Service($q, ModuleService) {
    var self = this;
    var _remoteStorage = ModuleService.getLaboratoryRemoteStorage();
    var _projectRemoteStorage = ModuleService.getProjectRemoteStorage();

    //Laboratory Project Public Methods
    self.getAliquots = getAliquots;
    self.getAliquot = getAliquot;
    self.getAliquotConfiguration = getAliquotConfiguration;
    self.getAliquotsByCenter = getAliquotsByCenter;
    self.getAliquotDescriptors = getAliquotDescriptors;
    self.getAvailableExams = getAvailableExams;
    self.getLots = getLots;
    self.getLotAliquots = getLotAliquots;
    self.createLot = createLot;
    self.updateLot = updateLot;
    self.deleteLot = deleteLot;
    self.getSendedExamById = getSendedExamById;
    self.getSendedExams = getSendedExams;
    self.createSendExam = createSendExam;
    self.deleteSendedExams = deleteSendedExams;

    function getLotAliquots(id) {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          return remoteStorage
            .getLotAliquots(id)
            .then(function (aliquots) {
              request.resolve(aliquots);
            });
        });

      return request.promise;
    }

    function getAliquots() {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          return remoteStorage
            .getAliquots()
            .then(function (aliquots) {
              request.resolve(aliquots);
            });
        });

      return request.promise;
    }

    function getAliquot(aliquotFilter) {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          return remoteStorage
            .getAliquot(aliquotFilter)
            .then(function (aliquot) {
              request.resolve(aliquot);
            })
            .catch(error => {
              request.reject(error);
              });
        });

      return request.promise;
    }

    function getAliquotConfiguration() {
      var request = $q.defer();

      _remoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          return remoteStorage
            .getAliquotConfiguration()
            .then(function (aliquots) {
              request.resolve(aliquots);
            });
        });

      return request.promise;
    }

    function getAliquotDescriptors() {
      var request = $q.defer();

      _remoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          return remoteStorage
            .getAliquotDescriptors()
            .then(function (descriptors) {
              request.resolve(descriptors);
            });
        });

      return request.promise;
    }

    function getAliquotsByCenter(lotCode) {
      var request = $q.defer();

      _remoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          return remoteStorage
            .getAliquotsByCenter(lotCode)
            .then(function (aliquots) {
              request.resolve(aliquots);
            });
        });

      return request.promise;
    }

    /* exam lot */

    /**
     * get exam lot.
     * @memberof ProjectCollectionService
     */
    function getLots(centerAcronym) {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          return remoteStorage
            .getLots(centerAcronym)
            .then(function (lots) {
              request.resolve(lots);
            });
        });

      return request.promise;
    }

    /**
     * Create the exam lot.
     * @param {(object)} lotStructure - structure of exam lot
     * @memberof ProjectCollectionService
     */
    function createLot(lotStructure) {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          remoteStorage
            .createLot(lotStructure)
            .then(function (data) {
              request.resolve(data);
            })
            .catch(function (e) {
              request.reject(e);
            });
        });

      return request.promise;
    }

    /**
     * Update the exam lot.
     * @param {(object)} lotStructure - structure of exam lot
     * @memberof ProjectCollectionService
     */
    function updateLot(lotStructure) {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          remoteStorage
            .updateLot(lotStructure)
            .then(function (data) {
              request.resolve(data);
            })
            .catch(function (e) {
              request.reject(e);
            });
        });

      return request.promise;
    }

    /**
     * Delete the exam lot.
     * @param {(object)} lotCode - code of exam lot
     * @memberof ProjectCollectionService
     */
    function deleteLot(lotCode) {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          remoteStorage
            .deleteLot(lotCode)
            .then(function (data) {
              request.resolve(data);
            })
            .catch(function (e) {
              request.reject(e);
            });
        });

      return request.promise;
    }

    /* sending exam */

    /**
     * get Sended exams by id.
     * @param {(object)} id - code of sended exam
     * @memberof ProjectCollectionService
     */
    function getSendedExamById(id) {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          return remoteStorage
            .getSendedExamById(id)
            .then(function (data) {
              request.resolve(data);
            });
        });

      return request.promise;
    }


    /**
    * get Sended exams.
    * @memberof ProjectCollectionService
    */
    function getSendedExams() {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          return remoteStorage
            .getSendedExams()
            .then(function (lots) {
              request.resolve(lots);
            });
        });

      return request.promise;
    }

    /**
     * Create the send exam.
     * @param {(object)} sendStructure - structure of send exam
     * @memberof ProjectCollectionService
     */
    function createSendExam(sendStructure) {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          remoteStorage
            .createSendExam(sendStructure)
            .then(function (data) {
              request.resolve(data);
            })
            .catch(function (e) {
              request.reject(e);
            });
        });

      return request.promise;
    }

    /**
     * Delete the send exam.
     * @param {(object)} sendedExamCode - code of exam lot
     * @memberof ProjectCollectionService
     */
    function deleteSendedExams(sendedExamCode) {
      var request = $q.defer();

      _projectRemoteStorage
        .whenReady()
        .then(function (remoteStorage) {
          remoteStorage
            .deleteSendedExams(sendedExamCode)
            .then(function (data) {
              request.resolve(data);
            })
            .catch(function (e) {
              request.reject(e);
            });
        });

      return request.promise;
    }

    function getAvailableExams(center) {
      var request = $q.defer();

      _projectRemoteStorage
      .whenReady()
      .then(function (remoteStorage) {
        return remoteStorage
        .getAvailableExams(center)
        .then(function (descriptors) {
          request.resolve(descriptors);
        });
      });

      return request.promise;
    }

  }
}());
