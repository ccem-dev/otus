(function () {
  'use strict';

  angular
    .module('otusjs.laboratory.business.project.sending')
    .service('otusjs.laboratory.business.project.sending.SendingExamService', service);

  service.$inject = [
    '$q',
    'otusjs.laboratory.exam.sending.ExamSendingLotService',
    'otusjs.laboratory.repository.ProjectRepositoryService'
  ];

  function service($q, ExamSendingLotService, ProjectRepositoryService) {
    var self = this;

    /* Public methods */
    self.createExamSending = createExamSending;
    self.loadExamSendingFromJson = loadExamSendingFromJson;
    self.getExamList = getExamList;
    self.getSendedExamById = getSendedExamById;
    self.getSendedExams = getSendedExams;
    self.createSendExam = createSendExam;
    self.deleteSendedExams = deleteSendedExams;

    function createExamSending() {
      return ExamSendingLotService.createExamSending();
    }

    function loadExamSendingFromJson(examResultLot, examResults) {
      return ExamSendingLotService.buildExamSendingFromJson(examResultLot, examResults);
    }

    function getExamList() {
      return ExamSendingLotService.getExamList();
    }

    function getSendedExamById(id) {
      var deferred = $q.defer();

      ProjectRepositoryService.getSendedExamById(id)
        .then(function (response) {
          deferred.resolve(response);
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function getSendedExams() {
      var deferred = $q.defer();

      ProjectRepositoryService.getSendedExams()
        .then(function (response) {
          deferred.resolve(response);
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function createSendExam(sendStructure) {
      var deferred = $q.defer();
      ProjectRepositoryService.createSendExam(sendStructure)
        .then(function (response) {
          deferred.resolve(response);
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function deleteSendedExams(send) {
      var deferred = $q.defer();

      ProjectRepositoryService.deleteSendedExams(send)
        .then(function (response) {
          deferred.resolve(JSON.parse(response));
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }
  }
}());