(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusViewSendingExam', {
      controller: 'otusViewSendingExamCtrl as $ctrl',
      templateUrl: 'app/ux-component/exam/dashboard/exam-sending/sending-view/exam-sending-view-template.html'
    })
    .controller('otusViewSendingExamCtrl', Controller);

  Controller.$inject = [
    '$filter',
    '$mdToast',
    'otusjs.deploy.FieldCenterRestService',
    'otusjs.otus.dashboard.core.ContextService',
    'otusjs.laboratory.core.project.ContextService',
    'otusjs.laboratory.business.project.sending.SendingExamService',
    'otusjs.application.state.ApplicationStateService',
    'otusjs.deploy.LoadingScreenService',
    'otusjs.application.dialog.DialogShowService',
    'otusjs.laboratoryViewerService.LaboratoryViewerService'
  ];

  function Controller(
    $filter,
    $mdToast,
    ProjectFieldCenterService,
    DashboardContextService,
    ProjectContextService,
    SendingExamService,
    ApplicationStateService,
    LoadingScreenService,
    DialogService,
    LaboratoryViewerService) {

    const MESSAGE_LOADING = "Por favor aguarde o carregamento.<br> Esse processo pode demorar um pouco...";

    var self = this;
    self.sendingList = [];
    self.listImmutable = [];
    self.selectedSendings = [];
    self.centers = [];
    self.realizationBeginFilter = "";
    self.realizationEndFilter = "";
    self.centerFilter = "";

    /* Public methods */
    self.$onInit = onInit;
    self.examSendingView = examSendingView;
    self.deleteSending = deleteSending;
    self.onFilter = onFilter;
    self.dynamicDataTableChange = dynamicDataTableChange;

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
        _loadList();
      });
    }

    function examSendingView() {
      self.action = ProjectContextService.setExamSendingAction('view');
      ProjectContextService.setFileStructure(self.selectedSendings[0].toJSON());
      ApplicationStateService.activateExamResultsVisualizer();
      self.selectedSendings = [];
    }

    function _setUserFieldCenter() {
      DashboardContextService.getLoggedUser()
        .then(function (userData) {
          self.userHaveCenter = !!userData.fieldCenter.acronym;
          self.centerFilter = self.userHaveCenter ? userData.fieldCenter.acronym : ProjectContextService.getFieldCenterInSendingExam() ? ProjectContextService.getFieldCenterInSendingExam() : "";
          self.centerFilterDisabled = userData.fieldCenter.acronym ? "disabled" : "";
          if (!self.centerFilter) {
            self.centerFilter = self.centers[0];
          }
          ProjectContextService.setFieldCenterInSendingExam(self.centerFilter);
        });
    }

    function deleteSending() {
      DialogService.showConfirmationDialog(
        'Confirmação para exclusão de arquivos',
        'Atenção: Os arquivos selecionados serão excluídos.',
        'Confirmação de exclusão')
        .then(function () {
          LoadingScreenService.changeMessage(MESSAGE_LOADING);
          LoadingScreenService.start();
          _removeRecursive(self.selectedSendings, function () {
            _loadList();
            LoadingScreenService.finish();
          });
        });
    }

    function _removeRecursive(array, callback) {
      SendingExamService.deleteSendedExams(array[0].examSendingLot._id).then(function () {
        if (array.length === 1) {
          callback();
        } else {
          array.splice(0, 1);
          _removeRecursive(array, callback);
        }
      }).catch(function (e) {
        _showToast("Não foi possível excluir o envio " + array[0]._id + ".");
        callback();
      });
    }

    function dynamicDataTableChange(change) {
      if (change.type === 'select' || change.type === 'deselect') {
        _selectedSend(change.element);
      }
    }

    function _selectedSend(send) {
      var activityIndex = self.selectedSendings.indexOf(send);
      if (activityIndex > -1) {
        self.selectedSendings.splice(activityIndex, 1);
      } else {
        self.selectedSendings.push(send);
      }
    }

    function onFilter() {
      self.selectedSendings = [];
      LoadingScreenService.changeMessage(MESSAGE_LOADING);
      LoadingScreenService.start();
      _setSessionData();
      if (self.listImmutable.length) {
        self.sendingList = self.listImmutable
          .filter(function (filteredByCenter) {
            return _filterByCenter(filteredByCenter);
          })
          .filter(function (filteredByPeriod) {
            return _filterByPeriod(filteredByPeriod);
          });
      }
      if (self.updateDataTable)
        self.updateDataTable(self.sendingList);
      LoadingScreenService.finish();
    }

    function _filterByCenter(filteredByCenter) {
      return filteredByCenter.examSendingLot.fieldCenter.acronym === self.centerFilter;
    }

    function _filterByPeriod(filteredByCenter) {
      var formattedData = $filter('date')(filteredByCenter.examSendingLot.realizationDate, 'yyyyMMdd');
      if (!self.realizationBeginFilter || !self.realizationEndFilter) {
        return filteredByCenter;
      }

      var initialDateFormatted = $filter('date')(self.realizationBeginFilter, 'yyyyMMdd');
      var finalDateFormatted = $filter('date')(self.realizationEndFilter, 'yyyyMMdd');
      if (initialDateFormatted <= finalDateFormatted) {
        return (formattedData >= initialDateFormatted && formattedData <= finalDateFormatted);
      }
      _showToast("Filtro de datas com intervalo inválido");
      return filteredByCenter;
    }

    function _loadList() {
      self.sendingList = [];
      self.listImmutable = [];
      LoadingScreenService.changeMessage(MESSAGE_LOADING);
      LoadingScreenService.start();
      SendingExamService.getSendedExams().then(function (response) {
        response.forEach(function (lot) {
          self.sendingList.push(SendingExamService.loadExamSendingFromJson(lot, {}));
          self.listImmutable.push(SendingExamService.loadExamSendingFromJson(lot, {}));
        });
        self.onFilter();
        LoadingScreenService.finish();
      });
    }

    function _setSessionData() {
      if (self.centerFilter.length) {
        ProjectContextService.setFieldCenterInSendingExam(self.centerFilter);
      }
    }

    function _showToast(msg) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .hideDelay(3000)
      );
    }

  }
}());
