(function() {
  'use strict';

  angular
    .module('otusjs.laboratory.business')
    .factory('otusjs.laboratory.business.ParticipantLaboratoryFactory', Factory);

  Factory.$inject = [];

  function Factory() {
    var self = this;

    /* Public interface */
    self.create = create;

    function create() {
      return new ToJson();
    }

    return self;
  }

  function ToJson() {
    var NONE = 'Nenhum';
    var DEFAULT = 'DEFAULT';
    var self = this;
    self.toJson = toJson;

    function toJson(participant, laboratory) {
      var json = {};

      json.recruitment_number = participant.recruitmentNumber;
      json.participant_name = _buildNameParticipantLabel(participant.name);
      json.gender = participant.sex;
      json.birthday = _convertFormatDate(new Date(participant.birthdate.value));
      json.cq_group = (laboratory.collectGroupName !== undefined && laboratory.collectGroupName !== DEFAULT) ? laboratory.collectGroupName : NONE;
      json.tubes = laboratory.tubes;
      _buildTubeLabel(json.tubes);
      return JSON.stringify(json);
    }

    function _convertFormatDate(birthdate) {
      var date = new Date(birthdate);
      return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    function _buildTubeLabel(tubes) {
      var labels = {};
      labels.GEL = 'Gel';
      labels.FLUORIDE = 'Fluoreto';
      labels.EDTA = 'EDTA';
      labels.URINE = 'Urina';
      labels.CITRATE = 'Citrato';
      labels.EDTA_DNA = 'EDTA DNA';

      labels.FASTING = 'Jejum';
      labels.MIDDLE = 'Meio';
      labels.POST_OVERLOAD = 'Pós';
      labels.NONE = '';

      tubes.forEach(function(tube) {
        tube.label = labels[tube.type] + ' ' + labels[tube.moment];
      });
    }

    function _buildNameParticipantLabel(name) {
      var result = name.split(' ');
      return result[0] + ' ' + result[result.length - 1];
    }

  }
}());
