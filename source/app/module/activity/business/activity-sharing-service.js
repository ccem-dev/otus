(function () {
  'use strict';

  angular.module('otusjs.activity.business')
    .service('otusjs.activity.business.ActivitySharingService', Service);

  Service.$inject = [
    'otusjs.activity.repository.ActivitySharingCollectionService',
    'otusjs.activity.business.model.ActivitySharingFactory',
    '$mdToast'
  ];

  function Service(ActivitySharingCollectionService, ActivitySharingFactory, $mdToast) {
    const self = this;

    self.getSharedURL = getSharedURL;
    self.renovateSharedURL = renovateSharedURL;
    self.deleteSharedURL = deleteSharedURL;
    self.parseActivitySharing = parseActivitySharing;
    self.copyLinkToClipboard = copyLinkToClipboard;
    self.callToast = callToast;

    function getSharedURL(activityId) {
      return ActivitySharingCollectionService.getSharedURL(activityId);
    }

    function renovateSharedURL(activitySharingId) {
      return ActivitySharingCollectionService.renovateSharedURL(activitySharingId);
    }

    function deleteSharedURL(activitySharingId) {
      return ActivitySharingCollectionService.deleteSharedURL(activitySharingId);
    }

    function parseActivitySharing(dataSharingJson) {
      try {
        let activitySharing = ActivitySharingFactory.create(dataSharingJson.activitySharing);
        activitySharing.url = dataSharingJson.url;
        return activitySharing;
      } catch (e) {
        throw new Error("Error Parse: an error occurred with shared link information")
      }
    }

    function copyLinkToClipboard(item) {
      let $temp = $("<input>");
      $("body").append($temp);
      $temp.val(item).select();
      document.execCommand("copy");
      $temp.remove();
    }

    function callToast(msg, time, theme = "default") {
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position('bottom right')
          .theme(theme)
          .hideDelay(time)
      );
    }


  }

}());