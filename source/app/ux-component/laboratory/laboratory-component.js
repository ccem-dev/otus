(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusLaboratory', {
      controller: Controller,
      templateUrl: 'app/ux-component/laboratory/laboratory-start.html'
    });

  Controller.$inject = [
    '$q',
    '$mdDialog',
    'otusjs.application.dialog.DialogShowService',
    'otusjs.laboratory.business.participant.ParticipantLaboratoryService',
    'otusjs.laboratory.business.unattached.UnattachedLaboratoryService',
    'otusjs.deploy.LoadingScreenService',
    'otusjs.laboratory.core.EventService',
    'otusjs.otus.uxComponent.Publisher',
    '$scope'
  ];

  function Controller($q, $mdDialog, DialogShowService, ParticipantLaboratoryService, UnattachedLaboratoryService, LoadingScreenService, EventService, Publisher, $scope) {
    var self = this;

    /* Public methods */
    self.$onInit = onInit;
    self.intializeLaboratory = intializeLaboratory;
    self.attacheLaboratory = attacheLaboratory;

    function onInit() {
      _loadSelectedParticipant();
      EventService.onParticipantSelected(_loadSelectedParticipant);
      self.hasLaboratory = false;
      self.ready = false;
      self.attacheHasErrors = false;
      ParticipantLaboratoryService.onParticipantSelected(_setupLaboratory);
      Publisher.unsubscribe('refresh-laboratory-participant');
      Publisher.subscribe('refresh-laboratory-participant', _refreshLaboratory);
      _setupLaboratory();
    }

    function _loadSelectedParticipant(participantData) {
      if (participantData) {
        self.selectedParticipant = participantData;
      } else {
        ParticipantLaboratoryService
          .getSelectedParticipant()
          .then(function (participantData) {
            self.selectedParticipant = participantData;
          });
      }
    }

    function _refreshLaboratory(currentState) {
      LoadingScreenService.start();
      self.ready = false;
      self.hasLaboratory = false;
      ParticipantLaboratoryService
        .hasLaboratory()
        .then(function (hasLaboratory) {
          self.hasLaboratory = hasLaboratory;
          self.ready = true;
          if (hasLaboratory) {
            _fetchLaboratory(currentState);
          }
          LoadingScreenService.finish();
        });
    }

    function _setupLaboratory() {
      LoadingScreenService.start();
      self.hasLaboratory = false;
      ParticipantLaboratoryService
        .hasLaboratory()
        .then(function (hasLaboratory) {
          self.hasLaboratory = hasLaboratory;
          self.ready = true;
          if (hasLaboratory) {
            _fetchLaboratory();
          }
          LoadingScreenService.finish();
        });
    }


    function intializeLaboratory() {
      LoadingScreenService.start();

      ParticipantLaboratoryService
        .initializeLaboratory()
        .then(function (laboratory) {
          if (laboratory) {
            self.hasLaboratory = true;
            self.ready = true;
            _fetchLaboratory();
          }
          LoadingScreenService.finish();
        });
    }

    function attacheLaboratory() {
      self.attacheError = null;
      LoadingScreenService.start();
      UnattachedLaboratoryService.attacheLaboratory(self.laboratoryIdentification).then(function () {
        _refreshLaboratory();
        LoadingScreenService.finish();
      }).catch(function (error) {
        self.attacheHaveErrors = true;
        if (error.data) {
          if (error.data.MESSAGE.match("Laboratory not found")){
            self.attacheError = "Laboratório não encontrado";
          } else if (error.data.MESSAGE.match("Laboratory is already attached")) {
            self.attacheError = "Laboratório já foi vinculado a um participante";
          } else if (error.data.MESSAGE.match("Invalid configuration")) {
            if (error.data.CONTENT.laboratoryCollectGroup !== error.data.CONTENT.participantCollectGroup){
              self.attacheError = "O laboratório e o participante devem pertencer ao mesmo grupo de controle de qualidade";
            }
            if (error.data.CONTENT.laboratoryFieldCenter !== error.data.CONTENT.participantFieldCenter){
              if (self.attacheError) {
                self.attacheError += " e " + "ao mesmo centro"
              } else {
                self.attacheError = "O laboratório e o participante devem pertencer ao mesmo centro";
              }
            }
          } else {
            self.attacheError = "Ocorreu um erro, entre em contato com o administrador do sistema";
          }
        } else {
          self.attacheError = "Ocorreu um erro, entre em contato com o administrador do sistema";
        }
        LoadingScreenService.finish();
      });
    }

    function _fetchLaboratory(currentState) {
      var newState = currentState ? currentState : 'main';

      self.labels = ParticipantLaboratoryService.generateLabels();
      self.labels.tubes = _orderTubesWithLabelNullAlphabetically(self.labels.tubes);
      self.participantLaboratory = ParticipantLaboratoryService.getLaboratory();
      self.state = newState;
    }

    function _orderTubesWithLabelNullAlphabetically(tubeList) {
      var sortedArrayOfNulls = _removeTubesWithOrderNull(tubeList).sort(_sortByTubeLabel);
      return _concatArrays(tubeList, sortedArrayOfNulls);
    }

    function _concatArrays(array1, array2) {
      return array1.concat(array2);
    }

    function _sortByTubeLabel(a, b) {
      // if label are equals
      if (a.label.toLowerCase() === b.label.toLowerCase()) {
        // sort by code
        return a.code > b.code;
      }
      return a.label.toLowerCase() > b.label.toLowerCase();
    }

    function _removeTubesWithOrderNull(tubeList) {
      var firstIndexOfOrderNull = tubeList.findIndex(function (tube) {
        return tube.order === null;
      });
      return tubeList.splice(firstIndexOfOrderNull, tubeList.length);
    }
  }
}());
