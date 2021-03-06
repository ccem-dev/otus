(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .controller('otusDashboardHomeDisplayCtrl', Controller);

  Controller.$inject = [
    '$q',
    'otusjs.otus.dashboard.core.EventService',
    'otusjs.otus.dashboard.core.ContextService',
    'otusjs.application.state.ApplicationStateService',
    'otusjs.user.business.UserAccessPermissionService',
    'otusjs.laboratory.business.participant.ParticipantLaboratoryService',
    'otusjs.deploy.LoadingScreenService'
  ];

  function Controller($q, EventService, ContextService, ApplicationStateService, UserAccessPermissionService, ParticipantLaboratoryService, LoadingScreenService) {
    var self = this;
    self.participantsReady = false;

    self.laboratoryChecking;
    self.userAccessToLaboratory;
    self.userAccessToMonitoring;
    self.userAccessToParticipant;
    self.userAccessToActivity;

    /* Lifecycle hooks */
    self.$onInit = onInit;
    /* Public methods */
    self.setFocus = setFocus;
    self.sendingExam = sendingExam;
    self.examsDashboard = examsDashboard;
    self.startMonitoring = startMonitoring;
    self.laboratoryMonitoring = laboratoryMonitoring;
    self.sampleTransportDashboard = sampleTransportDashboard;
    self.managerParticipantsDashboard = managerParticipantsDashboard;
    self.activateActivityFlagsReport = activateActivityFlagsReport;
    self.laboratoryActivityFlagsReport = laboratoryActivityFlagsReport;
    self.unattachedLaboratory = unattachedLaboratory;
    self.activatePendencyViewer = activatePendencyViewer;
    self.activateOfflineActivitySynchronize = activateOfflineActivitySynchronize;
    self.activateIssueViewer = activateIssueViewer;
    self.activateLaboratoryMaterialManager = activateLaboratoryMaterialManager;

    function onInit() {
      _loadLoggedUser();
      EventService.onLogin(_loadLoggedUser);
      _fetchPermissions();
      _onResize();
      window.addEventListener("resize",_onResize);
    }

    function _onResize() {
      self.showAllParticipantsButtoninsideSearch = window.innerWidth >= 501;
    }

    function _fetchPermissions() {
      LoadingScreenService.start();
      $q.all([
          _getCheckingExist(),
          _checkingLaboratoryPermission(),
          _checkingMonitoringPermission(),
          _checkingParticipantPermission(),
          _checkingActivityPermission()
        ])
        .then(LoadingScreenService.finish)
        .catch(LoadingScreenService.finish)
    }

    function activateOfflineActivitySynchronize() {
      ApplicationStateService.activateOfflineActivitySynchronize();
    }

    function startMonitoring() {
      ApplicationStateService.activateMonitoring();
    }

    function unattachedLaboratory() {
      ApplicationStateService.activateUnattachedLaboratory();
    }

    function setFocus() {
      setTimeout(function () {
        document.querySelector('#participantSearchAutoCompleteId').focus();
      }, 0);
    }

    function sampleTransportDashboard() {
      ApplicationStateService.activateSampleTransportation();
    }

    function managerParticipantsDashboard() {
      ApplicationStateService.activateParticipantsList();
    }

    function examsDashboard() {
      ApplicationStateService.activateExamsLotsManagerList();
    }

    function activateActivityFlagsReport() {
      ApplicationStateService.activateActivityFlagsReport();
    }

    function laboratoryActivityFlagsReport() {
      ApplicationStateService.laboratoryActivityFlagsReport();
    }

    function sendingExam() {
      ApplicationStateService.activateExamSending();
    }

    function laboratoryMonitoring() {
      ApplicationStateService.activateLaboratoryMonitoring();
    }

    function activateLaboratoryMaterialManager() {
      ApplicationStateService.activateLaboratoryMaterialManager();
    }

    function _loadLoggedUser(userData) {
      if (userData) {
        self.loggedUser = userData;
      } else {
        ContextService
          .getLoggedUser()
          .then(function (userData) {
            self.loggedUser = userData;
          });
      }
    }

    function _getCheckingExist() {
      return ParticipantLaboratoryService.getCheckingExist()
        .then(function (response) {
          self.laboratoryChecking = response;
        });
    }

    function _checkingLaboratoryPermission() {
      return UserAccessPermissionService.getCheckingLaboratoryPermission().then(response => {
        self.userAccessToLaboratory = response;
      });
    }

    function _checkingMonitoringPermission() {
      return UserAccessPermissionService.getCheckingMonitoringPermission().then(response => {
        self.userAccessToMonitoring = response;
      });
    }
    function _checkingParticipantPermission() {
      return UserAccessPermissionService.getCheckingParticipantPermission().then(response => {
        self.userAccessToParticipant = response;
      });
    }
    function _checkingActivityPermission() {
      return UserAccessPermissionService.getCheckingActivityPermission().then(response => {
        self.userAccessToActivity = response;
      });
    }

    function activatePendencyViewer() {
      ApplicationStateService.activatePendencyViewer();
    }

    function activateIssueViewer() {
      ApplicationStateService.activateIssueViewer();
    }
  }
}());
