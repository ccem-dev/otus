describe('otusUserCommentAboutParticipantDashboardListCtrl Test', function () {

  let Mock = {};
  let Injections = [];
  let controller = {};

  beforeEach(function () {
    angular.mock.module('otusjs.otus');

    angular.mock.inject(function ($injector, $controller, $rootScope, $q) {
      Injections.$element = Mock.element;
      Injections.DashboardService = $injector.get('otusjs.otus.dashboard.service.DashboardService');
      Injections.EventService = $injector.get('otusjs.otus.dashboard.core.EventService');
      Injections.UserCommentAboutParticipantService = $injector.get('otusjs.user.comment.business.UserCommentAboutParticipantService');
      Injections.DialogShowService = $injector.get('otusjs.application.dialog.DialogShowService');
      Injections.USER_COMMENT_MANAGER_LABELS = $injector.get('USER_COMMENT_MANAGER_LABELS');
      Injections.ApplicationStateService = $injector.get('otusjs.application.state.ApplicationStateService');

      mockInitialize($rootScope, $q);

      controller = $controller('otusUserCommentAboutParticipantDashboardListCtrl', Injections);
    });
  });

  it('controller existence check', function () {
    expect(controller).toBeDefined();
  });

  it('should verify properties definition', function () {
    expect(controller.$onInit).toBeDefined();
    expect(controller.fillSelectedComment).toBeDefined();
    expect(controller.cancelFillSelectedComment).toBeDefined();
    expect(controller.deleteSelectedComment).toBeDefined();
    expect(controller.showStarSelectedUserCommentAboutParticipant).toBeDefined();
    expect(controller.saveUserCommentAboutParticipant).toBeDefined();
    expect(controller.colorStar).toBeDefined();
    expect(controller.getFormattedDate).toBeDefined();
    expect(controller.viewPlusUserCommentAboutParticipant).toBeDefined();
  });

  describe('Methods Suite Test', function () {

    beforeEach(function () {
      spyOn(Injections.EventService, "onParticipantSelected");
      spyOn(Injections.DashboardService, "getSelectedParticipant").and.returnValue(Mock.deferredResolve.promise);
      spyOn(Injections.DialogShowService, "showDialog").and.returnValue(Mock.deferredResolve.promise);
    });

    it('onInitMethod should initialized the controller variables', function () {
      controller.selectedParticipant = Mock.participant;

      controller.$onInit();

      Mock.scope.$digest();

      expect(Injections.EventService.onParticipantSelected).toHaveBeenCalledTimes(1);
      expect(controller.selectedParticipant.recruitmentNumber).toEqual(Mock.participant.recruitmentNumber);
    });

    it('fillSelectedCommentMethod should initialized the controller variables', function () {
      controller.fillSelectedComment(Mock.userCommentsAboutParticipant[0]);
      Mock.scope.$digest();
      expect(Injections.DialogShowService.showDialog).toHaveBeenCalledTimes(1);
      expect(controller.comment).toEqual(Mock.userCommentsAboutParticipant[0].comment)
      expect(controller.selectedComment).toEqual(Mock.userCommentsAboutParticipant[0])
    });

    it('fillSelectedCommentMethod should initialized the controller variables and selected comment', function () {
      spyOn(Injections.UserCommentAboutParticipantService, "showMsg").and.callThrough();

      controller.selectedComment = Mock.userCommentsAboutParticipant[0];
      controller.fillSelectedComment(Mock.userCommentsAboutParticipant[1]);
      Mock.scope.$digest();
      expect(Injections.DialogShowService.showDialog).toHaveBeenCalledTimes(1);
      expect(Injections.UserCommentAboutParticipantService.showMsg).toHaveBeenCalledTimes(1);
      expect(controller.comment).toEqual(Mock.userCommentsAboutParticipant[1].comment)
      expect(controller.selectedComment).toEqual(Mock.userCommentsAboutParticipant[1])
    });

    it('cancelSelectedCommentMethod should initialized the cancel selected comment', function () {
      controller.cancelFillSelectedComment();
      Mock.scope.$digest();
      expect(controller.comment).toEqual("")
      expect(controller.selectedComment).toBeNull();
    });

    it('deleteSelectedCommentMethod should initialized the delete selected', function () {
      spyOn(Injections.UserCommentAboutParticipantService, "deleteSelectedComment").and.returnValue(Promise.resolve());

      controller.deleteSelectedComment(Mock.userCommentsAboutParticipant[0]._id);
      Mock.scope.$digest();
      expect(Injections.DialogShowService.showDialog).toHaveBeenCalledTimes(1);
      expect(Injections.UserCommentAboutParticipantService.deleteSelectedComment).toHaveBeenCalledTimes(1);
      expect(Injections.UserCommentAboutParticipantService.deleteSelectedComment).toHaveBeenCalledWith(Mock.userCommentsAboutParticipant[0]._id);

    });

    it('showStarSelectedUserCommentAboutParticipantMethod should initialized the show starred selected', function () {
      spyOn(Injections.UserCommentAboutParticipantService, 'showStarSelectedUserCommentAboutParticipant').and.returnValue(Mock.deferredResolve.promise)
      spyOn(Injections.UserCommentAboutParticipantService, "showMsg").and.callThrough();

      controller.showStarSelectedUserCommentAboutParticipant(Mock.userCommentsAboutParticipant[0]);

      Mock.scope.$digest();

      expect(Injections.UserCommentAboutParticipantService.showStarSelectedUserCommentAboutParticipant).toHaveBeenCalledTimes(1);
      expect(Injections.UserCommentAboutParticipantService.showStarSelectedUserCommentAboutParticipant).toHaveBeenCalledWith(Mock.userCommentsAboutParticipant[0]._id, Mock.starred);
      expect(Injections.UserCommentAboutParticipantService.showMsg).toHaveBeenCalledTimes(1);
    });

    it('saveUserCommentAboutParticipantMethod should initialized the save', function () {
      let userComment = {
        comment: Mock.userCommentsAboutParticipant[0].comment,
        recruitmentNumber: Mock.participant.recruitmentNumber
      }
      controller.comment = Mock.userCommentsAboutParticipant[0].comment;
      controller.selectedParticipant = Mock.participant;

      spyOn(Injections.UserCommentAboutParticipantService, 'saveUserCommentAboutParticipant').and.returnValue(Mock.deferredResolve.promise);
      spyOn(Injections.UserCommentAboutParticipantService, "getNoteAboutParticipant").and.returnValue(Mock.deferredResolve.promise);
      spyOn(Injections.UserCommentAboutParticipantService, "showMsg").and.callThrough();

      controller.saveUserCommentAboutParticipant();

      Mock.scope.$digest();

      expect(Injections.UserCommentAboutParticipantService.saveUserCommentAboutParticipant).toHaveBeenCalledTimes(1);
      expect(Injections.UserCommentAboutParticipantService.saveUserCommentAboutParticipant).toHaveBeenCalledWith(userComment);
      expect(Injections.UserCommentAboutParticipantService.getNoteAboutParticipant).toHaveBeenCalledTimes(1);
      expect(Injections.UserCommentAboutParticipantService.showMsg).toHaveBeenCalledTimes(1);
    });

    it('saveUserCommentAboutParticipantMethod should initialized the save and updateUserComment', function () {
      controller.comment = Mock.userCommentsAboutParticipant[0].comment;
      controller.selectedComment = Mock.userCommentsAboutParticipant[0];

      spyOn(Injections.UserCommentAboutParticipantService, 'updateUserCommentAboutParticipant').and.returnValue(Promise.resolve());

      controller.saveUserCommentAboutParticipant();

      expect(Injections.UserCommentAboutParticipantService.updateUserCommentAboutParticipant).toHaveBeenCalledTimes(1);
      expect(Injections.UserCommentAboutParticipantService.updateUserCommentAboutParticipant).toHaveBeenCalledWith(Mock.userCommentsAboutParticipant[0]);
    });

    it('colorStarMethod should initialized the controller variable for color', function () {
      expect(controller.colorStar(Mock.userCommentsAboutParticipant[2].starred)).toEqual(Mock.color);
    });

    it('getFormattedDateMethod should initialized the.userCommentsAboutParticipantformate ISO', function () {
      spyOn(Injections.UserCommentAboutParticipantService, 'getFormattedDate').and.returnValue(Promise.resolve());

      controller.getFormattedDate(Mock.userCommentsAboutParticipant[0].creationDate);
      expect(Injections.UserCommentAboutParticipantService.getFormattedDate).toHaveBeenCalledTimes(1);
      expect(Injections.UserCommentAboutParticipantService.getFormattedDate).toHaveBeenCalledWith(Mock.userCommentsAboutParticipant[0].creationDate);
    });

    it('viewPlusUserCommentAboutParticipantMethod should initialized the state userCommentAboutParticipant', function () {
      spyOn(Injections.ApplicationStateService, 'userCommentAboutParticipant').and.callThrough();

      controller.viewPlusUserCommentAboutParticipant();

      expect(Injections.ApplicationStateService.userCommentAboutParticipant).toHaveBeenCalledTimes(1);
    });

  });

  function mockInitialize($rootScope, $q) {
    Mock.element = angular.element('<div></div>');
    Mock.scope = $rootScope.$new();
    Mock.deferred = $q.defer();
    Mock.deferredResolve = $q.defer();
    Mock.color = { color: 'rgb(253, 204, 13)' };
    Mock.showMoreIcon = { icon: 'visibility', tooltip: 'Ocultar Detalhes' };
    Mock.showMoreIcon2 = { icon: 'visibility_off', tooltip: 'Mostrar Detalhes' };
    Mock.participant = { recruitmentNumber: '02' };
    Mock.starred = false;
    Mock.userCommentsAboutParticipant = Test.utils.data.userCommentsAboutParticipant;
    Mock.deferredResolve.resolve();
    Mock.deferred.resolve(Mock.userCommentsAboutParticipant);
  }

});
