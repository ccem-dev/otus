(function () {
  'use strict';

  angular
    .module('otusjs.deploy.monitoring')
    .service('otusjs.deploy.monitoring.MonitoringRestService', Service);

  Service.$inject = [
    'OtusRestResourceService'
  ];

  function Service(OtusRestResourceService) {
    const UNINITIALIZED_REST_ERROR_MESSAGE = 'REST resource is not initialized.';
    var self = this;
    var _rest = null;

    /* Public methods */
    self.initialize = initialize;
    self.list = list;
    self.find = find;
    self.listAcronyms = listAcronyms;
    self.listCenters = listCenters;
    self.getActivitiesProgressReport = getActivitiesProgressReport;
    self.getStatusOfActivities = getStatusOfActivities;
    self.defineActivityWithDoesNotApplies = defineActivityWithDoesNotApplies;
    self.deleteNotAppliesOfActivity = deleteNotAppliesOfActivity;
    self.getStatusOfExams = getStatusOfExams;
    self.defineExamWithDoesNotApplies = defineExamWithDoesNotApplies;
    self.deleteNotAppliesOfExam = deleteNotAppliesOfExam;
    self.getExamsName = getExamsName;
    self.getExamsProgressReport = getExamsProgressReport;

    function initialize() {
      _rest = OtusRestResourceService.getOtusMonitoringResource();
    }

    function list() {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.list().$promise;
    }

    function find(acronym) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.find({ 'acronym': acronym }).$promise;
    }

    function listAcronyms() {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.listAcronyms().$promise;
    }

    function listCenters() {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.listCenters().$promise;
    }

    function getActivitiesProgressReport(center) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.getActivitiesProgressReport(center).$promise;
    }

    function getStatusOfActivities(recruitmentNumber) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.getStatusOfActivities({
        rn: recruitmentNumber
      }).$promise;
    }

    function defineActivityWithDoesNotApplies(data) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.defineActivityWithDoesNotApplies({}, data).$promise;
    }

    function deleteNotAppliesOfActivity(rn, acronym) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.deleteNotAppliesOfActivity({
        rn: rn,
        acronym: acronym
      }).$promise;
    }

    function getStatusOfExams(recruitmentNumber) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.getStatusOfExams({
        rn: recruitmentNumber
      }).$promise;
    }

    function defineExamWithDoesNotApplies(data) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.defineExamWithDoesNotApplies({}, data).$promise;
    }

    function deleteNotAppliesOfExam(data) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.deleteNotAppliesOfExam({}, data).$promise;
    }

    function getExamsName(center) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.getExamsFlagReportLabels(center).$promise;
    }

    function getExamsProgressReport(center) {
      if (!_rest) {
        throw new Error(UNINITIALIZED_REST_ERROR_MESSAGE);
      }
      return _rest.getExamsFlagReport(center).$promise;
    }

  }
}());
