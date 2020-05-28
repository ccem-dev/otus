(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('issueViewerComponent', {
      controller: 'issueViewerCtrl as $ctrl',
      templateUrl: 'app/ux-component/project-communication/issue-viewer/issue-viewer-template.html',
      bindings: {}
    }).controller('issueViewerCtrl', Controller);

  Controller.$inject = [
    '$mdDialog',
    'otusjs.issueViewer.IssueViewerService'
  ];

  function Controller($mdDialog, IssueViewerService) {
    const self = this;
    self.paginatorActive = false;
    self.viewerTitle = IssueViewerService.LABELS.PAGE_TITLE;
    self.viewerService = IssueViewerService;
    self.itemComponentName = 'otusIssueItem';
    self.filtersComponentName = 'otusIssueListFilters';
    self.HelperDialogController = HelperDialogController;

    self.showHelper = function() {
      $mdDialog.show({
        controller: self.HelperDialogController,
        controllerAs: "vm",
        templateUrl: 'app/ux-component/project-communication/issue-viewer/issue-viewer-helper-template.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true
      })
    };

    function HelperDialogController() {
      const self = this;
      self.cancel = $mdDialog.cancel;
      self.data = Object.values(IssueViewerService.LABELS.ISSUE_ATTRIBUTES)
        .filter(obj => obj.TITLE !== IssueViewerService.LABELS.ISSUE_ATTRIBUTES.STATUS.TITLE);
    }
  }

}());