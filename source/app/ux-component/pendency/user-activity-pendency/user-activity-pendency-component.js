(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusUserActivityPendency', {
      controller: 'userActivityPendencyCtrl as $ctrl',
      templateUrl: 'app/ux-component/pendency/user-activity-pendency/user-activity-pendency-template.html',
      bindings:{

      }
    }).controller('userActivityPendencyCtrl', Controller);

  Controller.$inject = [
    'otusjs.otus.uxComponent.UserActivityPendencyService'
  ];

  function Controller(UserActivityPendencyService) {
    const self = this;

    self.$onInit = onInit;
    self.createUserActivityPendency = createUserActivityPendency;

    function onInit() {}

    function createUserActivityPendency(){
      UserActivityPendencyService.createUserActivityPendency()
      console.log("create pendency")
    }


  }



}());