(function() {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusExamsLotsManagerList', {
      controller: "otusExamsLotsManagerListCtrl as $ctrl",
      templateUrl: 'app/ux-component/exam/dashboard/exam-lot/manager-list/list/exams-lots-manager-list-template.html',
      bindings: {
        selectedLots: '=',
        csvData: '='
      },
      require: {
        otusExamsLotsManager: '^otusExamsLotsManager'
      }
    }).controller("otusExamsLotsManagerListCtrl", Controller);

  Controller.$inject = [
    'otusjs.deploy.FieldCenterRestService',
    'otusjs.laboratory.business.project.exams.ExamLotService',
    '$mdToast',
    'otusjs.laboratory.core.ContextService',
    'otusjs.otus.dashboard.core.ContextService',
    '$filter',
    'otusjs.laboratoryViewerService.LaboratoryViewerService'
  ];

  function Controller(
    ProjectFieldCenterService,
    ExamLotService,
    $mdToast,
    LaboratoryContextService,
    DashboardContextService,
    $filter,
    LaboratoryViewerService) {
    var self = this;

    self.centerFilter = "";
    self.examFilter = "";
    self.realizationBeginFilter = "";
    self.realizationEndFilter = "";
    self.centers = [];
    self.lotsList = [];
    self.lotsListImutable = [];

    /* Lifecycle hooks */
    self.$onInit = onInit;
    /* Public methods */
    self.selectLot = selectLot;
    self.updateOnDelete = updateOnDelete;
    self.onFilter = onFilter;
    self.changeCenter = changeCenter;
    self.loadExamDescriptors = loadExamDescriptors;

    function onInit() {
      self.laboratoryExists = false;
      LaboratoryViewerService.checkExistAndRunOnInitOrBackHome(_init);
    }

    function _init() {
      self.laboratoryExists = true;
      ProjectFieldCenterService.loadCenters().then(function (result) {
        self.lotDataSet = [];
        self.colorSet = [];
        self.centers = $filter('orderBy')(self.centers);
        result.forEach(function (fieldCenter) {
          self.centers.push(fieldCenter.acronym)
        });
        _setUserFieldCenter();
      });
      self.otusExamsLotsManager.listComponent = self;
    }

    function loadExamDescriptors(center) {
      self.exams = [];
      ExamLotService.getAvailableExams(center).then(function (result) {
        result.forEach(function (aliquotTypes) {
          self.exams.push(aliquotTypes);
        });
      });
    }

    function _setUserFieldCenter() {
      DashboardContextService.getLoggedUser()
        .then(function(userData) {
          self.userHaveCenter = !!userData.fieldCenter.acronym;
          self.centerFilter = self.userHaveCenter ? userData.fieldCenter.acronym : LaboratoryContextService.getSelectedExamLotFieldCenter() ? LaboratoryContextService.getSelectedExamLotFieldCenter() : "";
          if(!self.centerFilter){
            self.centerFilter = self.centers[0];
          }
          loadExamDescriptors(self.centerFilter);
          LaboratoryContextService.setSelectedExamLotFieldCenter(self.centerFilter);
          self.centerFilterDisabled = userData.fieldCenter.acronym ? "disabled" : "";
          _LoadLotsList();
        });
    }

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
      ExamLotService.getLots(self.centerFilter).then(function(response) {
        self.lotsList = response;
        self.lotsListImutable = response;
        self.onFilter();
      });
    }

    function changeCenter() {
      _LoadLotsList();
    }

    function onFilter(){
      self.selectedLots = [];
      _setSessionData();
      if(self.lotsListImutable.length) {
        self.lotsList = self.lotsListImutable
          .filter(function (FilteredByCenter) {
            return _filterByPeriod(FilteredByCenter);
          })
          .filter(function (filteredByPeriod) {
            return _filterByExam(filteredByPeriod)
        });
      }
    }

    function _filterByPeriod(FilteredByCenter) {
      var lotFormattedData = $filter('date')(FilteredByCenter.realizationDate, 'yyyyMMdd');
      if (!self.realizationBeginFilter || !self.realizationEndFilter) {
        return FilteredByCenter;
      }

      var initialDateFormatted = $filter('date')(self.realizationBeginFilter, 'yyyyMMdd');
      var finalDateFormatted = $filter('date')(self.realizationEndFilter, 'yyyyMMdd');
      if(initialDateFormatted <= finalDateFormatted){
        return (lotFormattedData >= initialDateFormatted && lotFormattedData <= finalDateFormatted);
      }

      $mdToast.show(
        $mdToast.simple()
          .textContent("Datas invalidas")
          .hideDelay(4000)
      );
      return FilteredByCenter;
    }

    function _filterByExam(filteredByPeriod) {
      if (self.examFilter.length && self.examFilter !== "ALL") {
        return filteredByPeriod.aliquotName === self.examFilter;
      }
      return filteredByPeriod;
    }

    function _setSessionData(){
      if(self.centerFilter.length){
        LaboratoryContextService.setSelectedExamLotFieldCenter(self.centerFilter);
      }
      if(self.centerFilter.length){
        LaboratoryContextService.setSelectedExamType(self.examFilter);
      }
    }
  }
}());
