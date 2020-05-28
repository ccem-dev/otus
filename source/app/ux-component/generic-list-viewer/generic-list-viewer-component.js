(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusGenericListViewer', {
      controller: 'genericListViewerCtrl as $ctrl',
      templateUrl: 'app/ux-component/generic-list-viewer/generic-list-viewer-template.html',
      bindings: {
        viewerService: "=",
        viewerTitle: '<',
        itemComponentName: '<',
        filtersComponentName: '<',
        showHelper: '='
      }
    }).controller('genericListViewerCtrl', Controller);

  Controller.$inject = [
    'GENERIC_LIST_VIEWER_LABELS'
  ];

  function Controller(GENERIC_LIST_VIEWER_LABELS) {
    const self = this;
    self.items = [];
    self.paginatorActive = false;
    self.GENERIC_LIST_VIEWER_LABELS = GENERIC_LIST_VIEWER_LABELS;
    self.callValidationItemsLimits = self.viewerService.callValidationItemsLimits;

    self.$onInit = onInit;
    self.getAllItems = getAllItems;

    function onInit() {
      self.searchSettings = self.viewerService.getSearchSettings();
      self.itemAttributes = self.viewerService.getItemAttributes();
      getAllItems(self.searchSettings);
    }

    function getAllItems(searchSettings) {
      self.viewerService.getAllItems(searchSettings)
        .then(data => {
          self.items = data;
          self.paginatorActive = (self.items.length > 0);
          if(self.paginatorActive){
            _prepareParametersForPagination(searchSettings);
          }
        });
    }

    function _prepareParametersForPagination(searchSettings) {
      if (self.stuntmanSearchSettings) {
        self.stuntmanSearchSettings = null;
      }
      self.stuntmanSearchSettings = angular.copy(searchSettings);
    }
  }

}());