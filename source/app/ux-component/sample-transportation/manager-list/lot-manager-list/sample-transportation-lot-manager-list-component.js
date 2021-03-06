(function() {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusSampleTransportationLotManagerList', {
      controller: Controller,
      templateUrl: 'app/ux-component/sample-transportation/manager-list/lot-manager-list/sample-transportation-lot-manager-list-template.html',
      bindings: {
        selectedLots: '='
      },
      require: {
        otusSampleTransportationManagerList: '^otusSampleTransportationManagerList'
      }
    });

  Controller.$inject = [
    'otusjs.deploy.LoadingScreenService',
    'otusjs.deploy.FieldCenterRestService',
    'otusjs.deploy.LocationPointRestService',
    'otusjs.laboratory.business.project.transportation.MaterialTransportationService',
    '$mdToast',
    'otusjs.laboratory.core.ContextService',
    'otusjs.otus.dashboard.core.ContextService',
    '$filter',
    'otusjs.model.locationPoint.LocationPointFactory'
  ];

  function Controller(LoadingScreenService, ProjectFieldCenterService, LocationPointRestService, MaterialTransportationService, $mdToast, laboratoryContextService, dashboardContextService, $filter, LocationPointFactory) {
    var self = this;

    //TODO: Colors for the aliquots types in the charts, the colors will be dynamic in the future
    var color = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
      "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
      "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E",
      "#9E9E9E", "#000000", "#B71C1C", "#880E4F", "#4A148C", "#311B92",
      "#1A237E", "#0D47A1", "#01579B", "#006064", "#004D40", "#1B5E20"
    ];

    /* Lifecycle hooks */
    self.$onInit = onInit;

    self.view = 'Cards';
    self.limit = 3;
    self.show = self.limit;
    self.page = 2;
    self.centerFilter = "";
    self.shipmentBeginFilter = "";
    self.shipmentEndFilter = "";
    self.centers = [];
    self.lotsList = [];
    self.lotsListImutable = [];
    self.locationFilters = {
      origin: '',
      destination: ''
    };

    self.showMore = showMore;

    function showMore() {
      self.show += self.limit;

    }
    /* Public methods */
    self.selectLot = selectLot;
    self.updateOnDelete = updateOnDelete;
    self.onFilter = onFilter;

    function onInit() {
      self.originLocationPoints = [];
      self.destinationLocationPoints = [];
      LocationPointRestService.getLocationPoints().then(function (response) {
        if (response.data) {
          var result = response.data;
          if (result.transportLocationPoints) {
            self.destinationLocationPoints = angular.copy(LocationPointFactory.fromArray(response.data.transportLocationPoints));
          }
        }
      });

      LocationPointRestService.getUserLocationPoint().then(function (response) {
        self.originLocationPoints = LocationPointFactory.fromArray(response.data.transportLocationPoints);
      });

      LocationPointRestService.getUserLocationPoint().then(function (response) {
        self.userLocationsPoints = LocationPointFactory.fromArray(response.data.transportLocationPoints);
        self.userLocationsPoints = self.userLocationsPoints.filter(userLocation => userLocation._id != null);
      });

      self.otusSampleTransportationManagerList.listComponent = self;
    }

    self.percentOfReceived = function (received, total) {
      if(received === 0) {
        return 0;
      }
      return Math.trunc((received / total) * 100);
    }

    self.getLots = function () {

      if (self.locationFilters.origin || self.locationFilters.destination){
        _LoadLotsList();
      } else {
        var msgPontoInvalido = "Ponto de localização invalido";
        $mdToast.show(
          $mdToast.simple()
            .textContent(msgPontoInvalido)
            .hideDelay(4000)
        )
      }
    };

    function selectLot(lot) {
      var activityIndex = self.selectedLots.indexOf(lot);
      if (activityIndex > -1) {
        self.selectedLots.splice(activityIndex, 1);
        lot.isSelected = false;
      } else {
        self.selectedLots.push(lot);
        lot.isSelected = true;
      }
    }

    function updateOnDelete() {
      _LoadLotsList();
    }

    function _LoadLotsList() {
      LoadingScreenService.changeMessage('Aguarde o carregamento dos lotes de transporte.');
      LoadingScreenService.start();
      _chooseLotsEndpoint(self.locationFilters).then(function(response) {
        self.lotsList = response;
        self.lotsListImutable = response || [];
        self.onFilter();
        _setChartData();
        LoadingScreenService.finish();
      }).catch(function () {
        LoadingScreenService.finish();
      });
    }

    function _chooseLotsEndpoint({ origin, destination }) {
      if(origin) {
        if (destination) return MaterialTransportationService.getLots(origin, destination)
        else return MaterialTransportationService.getLotsByOrigin(origin)
      } else return MaterialTransportationService.getLotsByDestination(destination)
    }

    function onFilter() {
      self.selectedLots = [];
      self.show = self.limit;
      if (self.lotsListImutable.length) {
        self.lotsList = self.lotsListImutable.filter(function(lotFilter) {
          var lotFormatedData = $filter('date')(lotFilter.shipmentDate, 'yyyyMMdd');
          if (self.shipmentBeginFilter && self.shipmentEndFilter) {
            var initialDateFormated = $filter('date')(self.shipmentBeginFilter, 'yyyyMMdd');
            var finalDateFormated = $filter('date')(self.shipmentEndFilter, 'yyyyMMdd');
            if (initialDateFormated <= finalDateFormated) {
              return (lotFormatedData >= initialDateFormated && lotFormatedData <= finalDateFormated);
            } else {
              var msgDataInvalida = "Datas invalidas";

              $mdToast.show(
                $mdToast.simple()
                .textContent(msgDataInvalida)
                .hideDelay(4000)
              );
              return lotFilter;
            }
          } else {
            return lotFilter;
          }
        });
        _setChartData();
      }
    }

    function _setChartData() {
      self.lotsList.forEach(function(lot) {
        lot.chartAliquotDataSet.backgroundColor = color;
        lot.chartTubeDataSet.backgroundColor = color;
      });
    }
  }
}());
