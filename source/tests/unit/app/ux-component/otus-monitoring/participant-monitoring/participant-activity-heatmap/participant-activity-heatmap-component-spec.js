describe('otusParticipantHeatmap test', function() {
  var Mock = {};
  var ctrl;
  var Injections = {};
  var participant = {};
  const COLOR = {
    CREATED: '#ff6f69',
    FINALIZED: '#88d8b0',
    SAVED: '#ffeead',
    DOES_NOT_APPLY: '#cecece',
    UNDEFINED: '#ffffff',
    MULTIPLE: '#ffcc5c',
    AMBIGUITY: '#bae1ff'
  };

  beforeEach(function() {
    angular.mock.module('otusjs.otus.uxComponent');

    Mock.LoadingScreenService = {
      start: function () {},
      finish: function () {}
    };

    Mock.$mdDialog = {
      show: function () {
        return Promise.resolve({doesNotApply:true})
      }
    };

    Mock.DashboardService = {
      getSelectedParticipant: function () {
        return Promise.resolve();
      }
    };

    Mock.EventService = {
      onParticipantSelected: function () {
        return Promise.resolve();
      }
    };

    Mock.ParticipantMonitoringService = {
      defineActivityWithDoesNotApplies: function () {
        if(ctrl.selectedParticipant.recruitmentNumber === 122346){
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      },
      deleteNotAppliesOfActivity: function () {
        if(ctrl.selectedParticipant.recruitmentNumber === 122346){
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      },
      buildActivityStatus: function () {
        return [];
      }
    };

    Mock.ApplicationStateService = {
      getCurrentState: function () {}
    };

    angular.mock.module(function ($provide) {
      $provide.value('otusjs.deploy.LoadingScreenService', Mock.LoadingScreenService);
      $provide.value('otusjs.otus.dashboard.core.EventService', Mock.EventService);
      $provide.value('$mdDialog', Mock.$mdDialog);
      $provide.value('otusjs.application.state.ApplicationStateService', Mock.ApplicationStateService);
      $provide.value('otusjs.otus.dashboard.service.DashboardService', Mock.DashboardService);
      $provide.value('otusjs.monitoring.business.ParticipantMonitoringService', Mock.ParticipantMonitoringService);
      $provide.value('$scope', {});
    });

    inject(function(_$injector_, _$controller_) {

      Injections = {
        $scope: _$injector_.get('$scope'),
        $mdDialog: _$injector_.get('$mdDialog'),
        $mdToast: _$injector_.get('$mdToast'),
        LoadingScreenService: _$injector_.get('otusjs.deploy.LoadingScreenService'),
        EventService: _$injector_.get('otusjs.otus.dashboard.core.EventService'),
        ApplicationStateService: _$injector_.get('otusjs.application.state.ApplicationStateService'),
        DashboardService: _$injector_.get('otusjs.otus.dashboard.service.DashboardService'),
        ParticipantMonitoringService: _$injector_.get('otusjs.monitoring.business.ParticipantMonitoringService')
      };

      ctrl = _$controller_('otusParticipantHeatmapCtrl', Injections);
    });
  });

  describe('onInit method', () => {
    beforeEach(() => {
      spyOn(ctrl, '$onInit').and.callThrough();
      spyOn(Injections.EventService, 'onParticipantSelected').and.callThrough();
      spyOn(Injections.DashboardService, 'getSelectedParticipant').and.callThrough();
      ctrl.$onInit();
    });

    it('should be defined', () => {
        expect(ctrl.$onInit).not.toBeNull();
        expect(ctrl.$onInit).toHaveBeenCalled();
        expect(ctrl.showActivitySignal).toBeFalsy();
        expect(Injections.EventService.onParticipantSelected).toHaveBeenCalled();
    });

    it('should call EventService.onParticipantSelected', () => {
      expect(Injections.EventService.onParticipantSelected).toHaveBeenCalled();
    });

    it('should call EventService.onParticipantSelected', () => {
      expect(Injections.DashboardService.getSelectedParticipant).toHaveBeenCalled();
    });

    it('should set null to selectedParticipant ', () => {
      expect(ctrl.selectedParticipant).toBe(null)
    });

    it('should fill legends', () => {
      expect(ctrl.legends[0].label).toBe("Criada");
      expect(ctrl.legends[0].color).toBe(COLOR.CREATED);
      expect(ctrl.legends[1].label).toBe("Salva");
      expect(ctrl.legends[1].color).toBe(COLOR.SAVED);
      expect(ctrl.legends[2].label).toBe("Finalizada");
      expect(ctrl.legends[2].color).toBe(COLOR.FINALIZED);
      expect(ctrl.legends[3].label).toBe("Não será realizada");
      expect(ctrl.legends[3].color).toBe(COLOR.DOES_NOT_APPLY);
      expect(ctrl.legends[4].label).toBe("Nenhuma atividade");
      expect(ctrl.legends[4].color).toBe(COLOR.UNDEFINED);
      expect(ctrl.legends[5].label).toBe("Múltiplas atividades");
      expect(ctrl.legends[5].color).toBe(COLOR.MULTIPLE);
      expect(ctrl.legends[6].label).toBe("Ambiguidade");
      expect(ctrl.legends[6].color).toBe(COLOR.AMBIGUITY);
    });

  });

  describe('selectParticipant method', () => {
    beforeEach(() => {
      participant.name = "teste";
      ctrl.selectParticipant(participant);
    });

    it('should set Participant', () => {
      expect(ctrl.selectedParticipant).toBe(participant);
    });
  });

  describe('showObservation method', () => {
    beforeEach(() => {
      spyOn(ctrl, 'showObservation').and.callThrough();
      spyOn(Injections.$mdDialog, 'show').and.callThrough();
      spyOn(Injections.ParticipantMonitoringService, 'defineActivityWithDoesNotApplies').and.callThrough();
      spyOn(Injections.LoadingScreenService, 'start').and.callThrough();
      spyOn(Injections.LoadingScreenService, 'finish').and.callThrough();
      participant.recruitmentNumber = 122346;
      ctrl.selectParticipant(participant);
      ctrl.showObservation();
    });

    it('should call $mdDialog.show', () => {
      expect(Injections.$mdDialog.show).toHaveBeenCalled();
    });

    it('should start and finish LoadingScreenService', () => {
      Injections.$mdDialog.show().then(function () {
       expect(Injections.LoadingScreenService.start).toHaveBeenCalled();
       Injections.ParticipantMonitoringService.defineActivityWithDoesNotApplies().then(function () {
         expect(Injections.LoadingScreenService.finish).toHaveBeenCalled();
       });
      });
    });

    it('should call Injections.ParticipantMonitoringService.defineActivityWithDoesNotApplies', () => {
      Injections.$mdDialog.show().then(function () {
        expect(Injections.ParticipantMonitoringService.defineActivityWithDoesNotApplies).toHaveBeenCalled();
      });
    });
  });

  describe('getCurrentState method', () => {
    beforeEach(() => {
      spyOn(Injections.ApplicationStateService, 'getCurrentState').and.callThrough();
      ctrl.getCurrentState();
    });

    it('should set Participant', () => {
      expect(Injections.ApplicationStateService.getCurrentState).toHaveBeenCalled();
    });
  });

});

