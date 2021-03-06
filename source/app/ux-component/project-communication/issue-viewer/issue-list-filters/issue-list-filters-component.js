(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusIssuesListFilters', {
      controller: 'issueListFiltersCtrl as $ctrl',
      templateUrl: 'app/ux-component/project-communication/issue-viewer/issue-list-filters/issue-list-filters-template.html',
      bindings: {
        searchSettings: '=',
        itemAttributes: '<',
        paginatorActive: '='
      }
    }).controller('issueListFiltersCtrl', Controller);

  Controller.$inject = [
    'dragulaService',
    'otusjs.issueViewer.IssueViewerService'
  ];

  function Controller(dragulaService, IssueViewerService) {
    const self = this;
    const ISSUE_ORDER_FIELD = {
      CREATION_DATE: 'creationDate',
      CENTER: 'center',
      RECRUITMENT_NUMBER: 'rn'
    };

    self.LABELS = IssueViewerService.LABELS;

    self.$onInit = onInit;
    self.getDefaultOrderFields = getDefaultOrderFields;
    self.changeInputViewState = changeInputViewState;
    self.clear = clear;
    self.clearAll = clearAll;
    self.allStatus = allStatus;
    self.changePaginationViewState = changePaginationViewState;
    self.viewerServiceGetChecker = IssueViewerService.getChecker;

    function onInit(){
      clearAll();
      self.showCenterFilter = !IssueViewerService.center;
      self.statusLabels = {};
      Object.entries(self.LABELS.STATUS).forEach( ([key,status]) => self.statusLabels[key] = status.filterLabel);

      if(self.showCenterFilter){
        IssueViewerService.loadCenters().then(function (result) {
          self.centers = angular.copy(result).map(center => center.acronym).sort();
        });
      }
    }

    function getDefaultOrderFields(){
      return Object.values(ISSUE_ORDER_FIELD);
    }

    function clear(item) {
      delete self.searchSettings.filter[item.title];
      self.inputViewState[item.title] = false;
    }

    function clearAll() {
      self.inputViewState = IssueViewerService.getInputViewState();
      self.searchSettings = IssueViewerService.getSearchSettings();
    }

    function changeInputViewState(item) {
      let key = (item.title === 'name' ? 'rn' : item.title);
      self.inputViewState[key] = true;
    }

    function allStatus() {
      delete self.searchSettings.filter.status;
    }

    function changePaginationViewState() {
      self.paginatorActive = false;
    }

  }
}());
