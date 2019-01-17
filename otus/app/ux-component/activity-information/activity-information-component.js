(function() {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusActivityInformation', {
      controller: Controller,
      templateUrl: 'app/ux-component/activity-information/activity-information-template.html',
      require: {
        otusActivityManager: '^otusActivityManager'
      }
    });

  Controller.$inject = [
    '$mdSidenav',
    'otusjs.activity.core.ContextService',
    'otusjs.otus.uxComponent.ActivityStatusItemFactory',
    '$mdDialog'
  ];

  function Controller($mdSidenav, ContextService, ActivityStatusItemFactory, $mdDialog) {
    var self = this;

    /* Public methods */
    self.show = show;
    self.activityReviewForm = activityReviewForm;
    self.DialogController = DialogController;

    /* Lifecycle hooks */
    self.$onInit = onInit;

    function onInit() {
      self.otusActivityManager.activityInfoComponent = self;

    }

    function show() {
      var activity = ContextService.getSelectedActivities()[0];
      self.activity = {};
      self.activity.details = activity.surveyForm.surveyTemplate.identity;
      self.activity.history = activity.statusHistory.getHistory().map(ActivityStatusItemFactory.create);
      self.activity.history.reverse();
      $mdSidenav('right').toggle();
    }

    function activityReviewForm() {
      self.cancel = $mdDialog.cancel;
      $mdDialog.show({
        // locals: {selectedActivity: self.selectedPaperActivity},
        templateUrl: 'app/ux-component/activity-information/activity-review-form/activity-review-form-template.html',
        parent: angular.element(document.body),
        controller: self.DialogController,
        controllerAs: "vm",
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: true
      });
    }

    function DialogController($mdDialog) {
      var self = this;
      self.activityReview = {};
      self.onInit = onInit;
      self.recordActivityReview = recordActivityReview;
      self.userLogger = ContextService.getLoggedUser();
      self.activity = ContextService.getSelectedActivities()[0];


      self.hide = function () {
        $mdDialog.hide();
      };

      self.cancel = function () {
        $mdDialog.cancel();
      };

       function recordActivityReview(){
         self.activityReview.activityID = self.activity.getID();
         self.activityReview.userLogged = self.userLogger;
         self.activityReview.reviewDate = self.reviewDate;

         console.log(self.activityReview);

       }
    }
  }
}());
