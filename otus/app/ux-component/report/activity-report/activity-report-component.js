(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusActivityReport', {
      controller: 'activityReportCtrl as $ctrl',
      templateUrl: 'app/ux-component/report/activity-report/activity-report-template.html',
      bindings: {
        selectedParticipant: '<',
        showVisualizationButton: '<',
        statusSelectedActivity: '<'
      }
    }).controller('activityReportCtrl', Controller);

  Controller.$inject = [
    'otusjs.otus.uxComponent.ActivityReportService',
    '$mdToast'
  ];

  function Controller(ActivityReportService, $mdToast) {
    const self = this;
    self.loadActivityReport = loadActivityReport;
    self.generateActivityReport = generateActivityReport;
    self.pendingActivityReport = pendingActivityReport;
    self.$onInit = onInit;

    function onInit() {
      self.activityReportReady = false;
      self.activityReportInfo =  false;
    }

    function loadActivityReport() {
      let reportResult = ActivityReportService.loadActivityReport(self.selectedParticipant);
      reportResult.then(value => {
          value.report.missingDataSources.length || value.report.missingOptionalDataSources.length ?
            _missingActivityReportArtifacts(value) :
            _enableActivityReportArtifacts(value)
        }).catch(error => {
          _toastFoundError(error.data.MESSAGE);
      })
    }

    function _enableActivityReportArtifacts(reportResultValues) {
      self.activityReportReady = reportResultValues.activityReportReady;
      self.activityReportInfo = reportResultValues.activityReportInfo;
      self.report = reportResultValues.report

    }

    function _missingActivityReportArtifacts(reportResultValues) {
      self.activityReportReady = false;
      self.activityReportInfo = true;
      self.report = reportResultValues.report
    }

    function generateActivityReport(report) {
      ActivityReportService.generateActivityReport(report);
      self.activityReportReady = false;
    }

    function pendingActivityReport() {
      ActivityReportService.infoPendingReportAlert(self.report);
      self.activityReportInfo = false
    }

    function _toastFoundError(message) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .hideDelay(4000)
      );
    }

  }
}());