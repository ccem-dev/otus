(function () {
  'use strict';

  angular
    .module('otusjs.deploy.rest')
    .service('otusjs.deploy.ActivityRestService', Service);

  Service.$inject = [
    '$q',
    'OtusRestResourceService'
  ];

  function Service($q, OtusRestResourceService) {
    let self = this;
    let _rest = null;
    let _followUpRest;

    /* Public methods */
    self.initialize = initialize;
    self.update = update;
    self.list = list;
    self.save = save;
    self.remove = remove;
    self.updateCheckerActivity = updateCheckerActivity;
    self.addActivityRevision = addActivityRevision;
    self.getActivityRevisions = getActivityRevisions;
    self.getById = getById;
    self.createFollowUpActivity = createFollowUpActivity;
    self.reopen = reopen;
    self.getAllByStageGroup = getAllByStageGroup;
    self.discardActivity = discardActivity;

    function initialize() {
      _rest = OtusRestResourceService.getActivityResource();
      _followUpRest = OtusRestResourceService.getFollowUpResourceFactory();
    }

    function update(activity) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.update({ id: activity._id, rn: activity.participantData.recruitmentNumber }, activity).$promise;
    }

    function reopen(activity) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.update({ id: activity.getID(), rn: activity.participantData.recruitmentNumber }, activity).$promise;
    }

    function updateCheckerActivity(rn, checkerUpdated) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.updateCheckerActivity({ rn }, checkerUpdated).$promise;
    }

    function save(data) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.create({ rn: data.participantData.recruitmentNumber }, data).$promise;
    }

    function list(recruitmentNumber) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }

      let request = $q.defer();

      _rest
        .listAll({ rn: recruitmentNumber })
        .$promise
        .then(function (response) {
          if (response.data && response.data.length) {
            request.resolve(response.data);
          } else {
            request.resolve([]);
          }
        });

      return request.promise;
    }

    function remove(data) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.remove(data).$promise;
    }

    function addActivityRevision(activityRevision, activity) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.addActivityRevision({ rn: activity.participantData.recruitmentNumber }, activityRevision).$promise;
    }

    function getActivityRevisions(activityID, activity) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      let request = $q.defer();
      _rest.getActivityRevisions({ id: activityID, rn: activity.participantData.recruitmentNumber })
        .$promise
        .then(function (response) {
          if (response.data && response.data.length) {
            request.resolve(response.data);
          } else {
            request.resolve([]);
          }
        });

      return request.promise;
    }

    function getById(ActivityId, rn) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }

      let request = $q.defer();
      _rest.getById({ rn: rn, id: ActivityId })
        .$promise
        .then(function (response) {
          if (response.data) {
            request.resolve([response.data]);
          } else {
            request.resolve([]);
          }
        });

      return request.promise;
    }

    function createFollowUpActivity(activity) {
      if (!_followUpRest) {
        throw new Error('REST resource is not initialized.');
      }
      return _followUpRest.createFollowUpActivity({ rn: activity.participantData.recruitmentNumber }, activity).$promise;
    }

    function getAllByStageGroup(recruitmentNumber) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }

      return _rest.getAllByStageGroup({ rn: recruitmentNumber }).$promise;
    }

    function discardActivity(activityId, recruitmentNumber) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }

       return _rest.discard({ id: activityId, rn: recruitmentNumber }).$promise;
    }

  }
}());
