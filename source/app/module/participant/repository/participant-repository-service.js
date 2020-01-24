(function() {
  'use strict';

  angular
    .module('otusjs.participant.repository')
    .service('otusjs.participant.repository.ParticipantRepositoryService', Service);

  Service.$inject = [
    'otusjs.participant.core.ModuleService'
  ];

  function Service(ModuleService) {
    var self = this;

    /* Public methods */
    self.listIdexers = listIdexers;
    self.create = create;
    self.getAllowNewParticipants = getAllowNewParticipants;
    self.getFollowUps = getFollowUps;
    self.activateFollowUpEvent = activateFollowUpEvent;

    function get() {}

    function list() {}

    function create(participant) {
      var _dataSource = ModuleService.DataSource.Participant;
      if (_dataSource) {
        return _dataSource.create(participant);
      }
    }

    function getFollowUps(recruitmentNumber) {
      var _dataSource = ModuleService.DataSource.Participant;
      if (_dataSource) {
        return _dataSource.getFollowUps(recruitmentNumber);
      }
    }

    function activateFollowUpEvent(recruitmentNumber, event) {
      var _dataSource = ModuleService.DataSource.Participant;
      if (_dataSource) {
        return _dataSource.activateFollowUpEvent(recruitmentNumber, event);
      }
    }

    function getAllowNewParticipants() {
      var _dataSource = ModuleService.DataSource.Participant;
      if (_dataSource) {
        return _dataSource.getAllowNewParticipants();
      }
    }

    function remove() {}

    function update() {}

    function listIdexers() {
      var _dataSource = ModuleService.DataSource.Participant;
      if (_dataSource) {
         return _dataSource.listIndexers();
      }
    }
  }
}());
