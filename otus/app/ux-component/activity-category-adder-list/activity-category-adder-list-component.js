(function() {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusActivityCategoryAdderList', {
      controller: Controller,
      templateUrl: 'app/ux-component/activity-category-adder-list/activity-category-adder-list-template.html',
      bindings: {
        onActivitySelection: '&'
      }
    });

  Controller.$inject = [
    'otusjs.activity.business.ParticipantActivityService',
    'otusjs.application.state.ApplicationStateService'
  ];

  function Controller(ActivityService, ApplicationStateService) {
    var self = this;

    self.returnToParticipantActivities = returnToParticipantActivities;
    /* Lifecycle hooks */
    self.$onInit = onInit;

    function onInit() {
      self.categories = ["normal","repetição"];
      _loadActivities();
    }

    function _loadActivities() {
      self.activities = ActivityService.getActivitiesSelection();
      console.log(self.activities);
      if(self.activities === undefined || self.activities.length<1){
        returnToParticipantActivities();
      }


    }

    function returnToParticipantActivities() {
      ApplicationStateService.activateParticipantActivities();
    }


  }
}());
