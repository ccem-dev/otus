(function() {
  'use strict';

  angular
    .module('otusjs.deploy')
    .service('otusjs.deploy.model.ActivityFacadeService', Service);

  Service.$inject = [
    'otusjs.model.activity.ActivityFacadeService'
  ];

  function Service(ActivityFacadeService) {
    var self = this;
    var _currentUser = null;

    /* Public methods */
    self.getActivity = getActivity;
    self.useActivity = useActivity;
    self.createActivity = createActivity;
    self.createQuestionFill = createQuestionFill;
    self.fillQuestion = fillQuestion;
    self.openSurveyActivity = openSurveyActivity;
    self.initializeActivitySurvey = initializeActivitySurvey;
    self.getFillingByQuestionID = getFillingByQuestionID;
    self.createActivityReview = createActivityReview;

    function getActivity() {
      return ActivityFacadeService.surveyActivity;
    }

    function useActivity(activity) {
      ActivityFacadeService.surveyActivity = activity;
      self.surveyActivity = activity;
    }

    function createActivity(template, user, participant, paperActivityData, configuration) {
      if (paperActivityData) {
        ActivityFacadeService.createPaperActivity(template, user, participant, paperActivityData, configuration);
      } else {
        ActivityFacadeService.createActivity(template, user, participant, configuration);
      }

      return getActivity();
    }

    function openSurveyActivity(user) {
      _currentUser = user;
      ActivityFacadeService.openActivitySurvey(_currentUser);
    }

    function initializeActivitySurvey() {
      ActivityFacadeService.initializeActivitySurvey();
    }

    function createQuestionFill(question, answer, metadata, comment) {
      return ActivityFacadeService.createQuestionFill(question, answer, metadata, comment);
    }

    function fillQuestion(filling) {
      ActivityFacadeService.fillQuestion(filling);
    }

    function getFillingByQuestionID(questionID) {
      return ActivityFacadeService.getFillingByQuestionID(questionID);
    }

    function createActivityReview(activityId, userReviewer, reviewDate) {

      //return ActivityFacadeService.createActivityReview(activityId, userReviewer, reviewDate);

      //TODO: OTUS-494 remover factoryFake(simulação do model) na entrega da tarefa
        var activityReview = {};
        activityReview.activityID = activityId;
        activityReview.userLogged = userReviewer;
        activityReview.reviewDate = reviewDate;
        return activityReview;
    }
  }
}());
