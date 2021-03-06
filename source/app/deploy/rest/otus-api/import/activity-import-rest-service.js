(function () {
  'use strict';

  angular
    .module('otusjs.deploy.rest')
    .service('otusjs.deploy.ActivityImportRestService', Service);

  Service.$inject = [
    '$q',
    'OtusRestResourceService'
  ];

  function Service($q, OtusRestResourceService) {
    var self = this;
    var _rest = null;

    /* Public methods */
    self.initialize = initialize;
    self.importActivities = importActivities;

    function initialize() {
      _rest = OtusRestResourceService.getActivityImportationResource();
    }

    function importActivities(surveyActivities, acronym, version) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      var request = $q.defer();
      _rest.importActivities({acronym: acronym,version: version}, surveyActivities)
        .$promise
        .then(function (response) {
          if (response.data && response.data.length) {
            request.resolve(response.data);
          } else {
            request.resolve([]);
          }
        }).catch(function (e) {
          request.resolve(e.data)
      });

      return request.promise;
    }
  }
}());
