(function() {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusSampleTransportationLotInfoSidenav', {
      controller: Controller,
      templateUrl: 'app/ux-component/sample-transportation/manager-list/lot-info-sidenav/lot-info-sidenav-template.html',
      bindings: {
        selectedLot: '<'
      },
      require: {
        otusSampleTransportationManagerList: '^otusSampleTransportationManagerList'
      }
    });

  Controller.$inject = [
    '$mdSidenav',
    'otusjs.laboratory.business.project.transportation.MaterialTransportationService'
  ];

  function Controller($mdSidenav, MaterialTransportationService) {
    var self = this;

    /* Lifecycle hooks */
    self.$onInit = onInit;

    /* Public methods */
    self.show = show;

    function onInit() {
      self.otusSampleTransportationManagerList.lotInfoComponent = self;
      self.selectedLot.aliquotList.forEach(function(aliquot) {
        aliquot.containerLabel = MaterialTransportationService.getContainerLabelToAliquot(aliquot);
      }, this);
      self.materialList = self.selectedLot.aliquotList.concat(self.selectedLot.getTubeForDynamicTable());
    }

    function show() {
      $mdSidenav('right').toggle();
    }
  }
}());
