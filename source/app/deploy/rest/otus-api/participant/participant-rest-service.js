(function () {
  'use strict';

  angular
    .module('otusjs.deploy')
    .service('otusjs.deploy.ParticipantRestService', Service);

  Service.$inject = [
    'OtusRestResourceService'
  ];

  function Service(OtusRestResourceService) {
    var self = this;
    var _rest, _followUpRest, _passwordRecoveryRest = null;

    /* Public methods */
    self.initialize = initialize;
    self.list = list;
    self.create = create;
    self.update = update;
    self.getByRecruitmentNumber = getByRecruitmentNumber;
    self.getFollowUps = getFollowUps;
    self.activateFollowUpEvent = activateFollowUpEvent;
    self.deactivateFollowUpEvent = deactivateFollowUpEvent;
    self.requestPasswordReset = requestPasswordReset;
    self.requestPasswordResetLink = requestPasswordResetLink;
    self.updateLoginEmail = updateLoginEmail;
    self.removeEmailByParticipantId = removeEmailByParticipantId;
    self.getEmailByParticipantId = getEmailByParticipantId;

    function initialize() {
      _rest = OtusRestResourceService.getParticipantResource();
      _followUpRest = OtusRestResourceService.getFollowUpResourceFactory();
      _passwordRecoveryRest = OtusRestResourceService.getParticipantPasswordResetResource();
    }

    function getByRecruitmentNumber(rn) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.getByRecruitmentNumber({rn}).$promise;
    }

    function list() {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.list().$promise;
    }

    function create(participant) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.create({}, participant).$promise;
    }

    function update(participant) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.update({}, participant).$promise;
    }

    function updateLoginEmail(id, email) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.editEmail({id}, {email}).$promise;
    }

    function removeEmailByParticipantId(id) {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.removeEmailByParticipantId({id}).$promise;
    }

     function getEmailByParticipantId(id) {
       if (!_rest) {
        throw new Error('REST resource is not initialized.');
       }
       return _rest.getEmailByParticipantId(id).$promise;
   }

    function getFollowUps(recruitmentNumber) {
      return _followUpRest.listParticipantsFollowUps({rn: recruitmentNumber}).$promise;
    }

    function activateFollowUpEvent(recruitmentNumber, event) {
      return _followUpRest.activateFollowUpEvent({
        rn: recruitmentNumber
      }, event).$promise;
    }

    function deactivateFollowUpEvent(followUpId) {
      return _followUpRest.deactivateFollowUpEvent({
        followUpId: followUpId
      }).$promise;
    }

    function requestPasswordReset(email) {
      if (!_passwordRecoveryRest) {
        throw new Error('REST resource is not initialized.');
      }
      return _passwordRecoveryRest.requestRecovery({userEmail:email}).$promise;
    }

    function requestPasswordResetLink(email) {
      if (!_passwordRecoveryRest) {
        throw new Error('REST resource is not initialized.');
      }
      return _passwordRecoveryRest.requestRecoveryLink({userEmail:email}).$promise;
    }
  }
}());
