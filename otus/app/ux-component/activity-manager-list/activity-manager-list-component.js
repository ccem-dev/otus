(function() {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusActivityList', {
      controller: Controller,
      templateUrl: 'app/ux-component/activity-aliquot-manager-list/activity-aliquot-manager-list-template.html',
      require: {
        otusActivityManager: '^otusActivityManager'
      }
    });

  Controller.$inject = [
    'otusjs.activity.business.ParticipantActivityService',
    'otusjs.activity.core.EventService',
    'otusjs.otus.uxComponent.ActivityItemFactory',
    'otusjs.deploy.LoadingScreenService'
  ];

  function Controller(ActivityService, EventService, ActivityItemFactory, LoadingScreenService) {
    var self = this;
    var _selectedActivities = [];
    self.activities = [];
    self.isListEmpty = true;

    self.orderByField = 'name';
    self.reverseSort = false;
    /* Public methods */
    self.selectActivity = selectActivity;
    self.update = update;
    self.changeSort = changeSort;

    /* Lifecycle hooks */
    self.$onInit = onInit;

    function selectActivity(activityItem) {
      var activityIndex = _selectedActivities.indexOf(activityItem.activity);
      if (activityIndex > -1) {
        _selectedActivities.splice(activityIndex, 1);
        activityItem.isSelected = false;
      } else {
        _selectedActivities.push(activityItem.activity);
        activityItem.isSelected = true;
      }
      ActivityService.selectActivities(_selectedActivities);
    }

    function update() {
      _loadActivities();
    }

    function onInit() {
      EventService.onParticipantSelected(_loadActivities);
      self.isListEmpty = true;
      self.otusActivityManager.listComponent = self;
      _loadActivities();
    }

    function _loadActivities() {
      LoadingScreenService.start();
      ActivityService
        .listAll()
        .then(function(activities) {
          self.activities = activities
            .filter(_onlyNotDiscarded)
            .map(ActivityItemFactory.create);

          self.isListEmpty = !self.activities.length;
          _selectedActivities = [];
          ActivityService.selectActivities(_selectedActivities);
          LoadingScreenService.finish();
        });
    }

    function _onlyNotDiscarded(activity) {
      return !activity.isDiscarded;
    }

    function changeSort(field,order) {
      self.orderByField = field;
      self.reverseSort = order;
    }
  }
}());
