(function() {
  'use strict';

  angular.module('otusjs.otus.uxComponent')
    .component('otusCrashReport', {
      controller: Controller,
      templateUrl: 'app/ux-component/crash-report/crash-report-component.html',
      transclude: true
    });

  Controller.$inject = [
    'otusjs.application.crash.CrashReportService',
    '$mdToast'
  ];

  function Controller(Service, $mdToast) {
    var self = this;
    self.saveToCrashReport = saveToCrashReport;

    const timeShowMsg = 3000;

    function saveToCrashReport() {
      var errorDataReport = Service.getErrorList();
      if (errorDataReport.length) {
        var dataReportJSON = 'data:text/json;charset=utf-8,' + errorDataReport;
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var downloadElement = document.createElement('a');

        downloadElement.setAttribute('href', dataReportJSON);
        downloadElement.setAttribute('download', 'bug-report-' + day + '-' + month + '-' + year + '.json');
        downloadElement.setAttribute('target', '_blank');
        document.body.appendChild(downloadElement);
        downloadElement.click();
      } else {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Não houve incidentes no sistema.')
          .position('bottom right')
          .hideDelay(timeShowMsg)
        );
      }
    }
  }
}());
