(function() {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('tubeList', {
      controller: 'tubeListCtrl as $ctrl',
      templateUrl: 'app/ux-component/laboratory/main-panel/tube-list/tube-list-template.html',
      bindings: {
        tubeList: '=',
        tubeConfiguration: '<',
        state: '<'
      }
    }).controller('tubeListCtrl', Controller);

  Controller.$inject = [
    'otusjs.laboratory.business.participant.ParticipantLaboratoryService',
    'otusjs.otus.uxComponent.Publisher',
    'otusjs.laboratoryViewerService.LaboratoryViewerService'
 ];

  function Controller(ParticipantLaboratoryService, Publisher, LaboratoryViewerService) {
    var self = this;
    var _originalTubeList;

    /* Public Interface */
    self.$onInit = onInit;
    self.fillOriginalTubeList = fillOriginalTubeList;
    self.haveTubesChanged = haveTubesChanged;
    self.getChangedTubes = getChangedTubes;

    function onInit() {
      LaboratoryViewerService.checkExistAndRunOnInitOrBackHome(_init);
    }

    function _init() {
      _getMoments();
      self.fillOriginalTubeList();

      Publisher.unsubscribe('have-tubes-changed');
      Publisher.subscribe('have-tubes-changed', haveTubesChanged);

      Publisher.unsubscribe('get-changed-tubes');
      Publisher.subscribe('get-changed-tubes', getChangedTubes);

      Publisher.unsubscribe('fill-original-tube-list');
      Publisher.subscribe('fill-original-tube-list', fillOriginalTubeList);
    }

    function fillOriginalTubeList(tubeList){
      var currentTubeList = self.tubeList;

      if(tubeList && Object.prototype.toString.call(tubeList) === "[object Array]"){
        currentTubeList = tubeList;
      }

      _originalTubeList = [];

      currentTubeList.forEach(function(tube){
        var newTube = JSON.parse(JSON.stringify(tube));
        newTube.tube = tube;
        _originalTubeList.push(newTube);
      });
    }

    function haveTubesChanged(callbackResult){
      var hasChanged = false;
      var changedTubes = [];

      changedTubes = self.getChangedTubes();

      if(changedTubes.length) hasChanged = true;

      if(callbackResult && typeof callbackResult === "function"){
        callbackResult(hasChanged);
      }
      return hasChanged;
    }

    function getChangedTubes(callbackResult){
      var changedTubes = _originalTubeList.filter(function(originalTube){
        return (
          originalTube.tubeCollectionData.isCollected !== originalTube.tube.tubeCollectionData.isCollected
          || originalTube.tubeCollectionData.metadata !== originalTube.tube.tubeCollectionData.metadata
          || originalTube.tubeCollectionData.operator !== originalTube.tube.tubeCollectionData.operator
          || originalTube.tubeCollectionData.time !== originalTube.tube.tubeCollectionData.time
        );
      });

      changedTubes = changedTubes.map(function(originalTube){ return originalTube.tube });

      if(callbackResult && typeof callbackResult === "function"){
        callbackResult(changedTubes);
      }

      return changedTubes;
    }

    function _getMoments() {
      self.moments = [];
      //TODO remove to service - at tube creation
      self.tubeList.forEach(function(tube) {
        if (!self.moments.includes(tube.momentLabel)) {
          self.moments.push(tube.momentLabel);
        }
      });
    }
    return self;
  }


}());
