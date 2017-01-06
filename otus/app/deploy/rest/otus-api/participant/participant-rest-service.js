(function() {
  'use strict';

  angular
    .module('otusjs.deploy')
    .service('otusjs.deploy.ParticipantRestService', Service);

  Service.$inject = [
    'OtusRestResourceService'
  ];

  function Service(OtusRestResourceService) {
    var self = this;
    var _rest = null;

    /* Public methods */
    self.initialize = initialize;
    self.listIdexers = listIdexers;

    function initialize() {
      _rest = OtusRestResourceService.getParticipantResource();
    }

    function list() {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.list().$promise;
    }

    function listIdexers() {
      if (!_rest) {
        throw new Error('REST resource is not initialized.');
      }
      return _rest.list().$promise;
    }
  }
}());
