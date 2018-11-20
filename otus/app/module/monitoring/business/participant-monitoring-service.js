(function () {
  'use strict';

  angular
    .module('otusjs.monitoring.business')
    .service('otusjs.monitoring.business.ParticipantMonitoringService', Service);

  Service.$inject = [
    '$filter',
    'otusjs.monitoring.repository.MonitoringCollectionService'
  ];

  function Service($filter, MonitoringCollectionService) {
    const CREATED = 'CREATED';
    const SAVED = 'SAVED';
    const FINALIZED = 'FINALIZED';
    const DOES_NOT_APPLY = 'DOES_NOT_APPLY';
    const UNDEFINED = 'UNDEFINED';
    const MULTIPLE = 'MULTIPLE';
    const AMBIGUITY = 'AMBIGUITY';
    const AMBIGUITY_STATE_DESCRIPTION = 'Atividade definida como não se aplica, porém, existe atividade(s) adicionada(s) ao participante!';
    const MULTIPLE_STATE_DESCRIPTION = 'Existe mais de uma atividade adicionada ao participante! Status e datas descritas abaixo:';

    var self = this;
    /* Public methods */
    self.getStatusOfActivities = getStatusOfActivities;
    self.defineActivityWithDoesNotApplies = defineActivityWithDoesNotApplies;
    self.buildActivityStatus = buildActivityStatus;

    function getStatusOfActivities(recruitmentNumber) {
      return _buildDataToView(MonitoringCollectionService.getStatusOfActivities(recruitmentNumber));
    };

    function defineActivityWithDoesNotApplies(recruitmentNumber, observation, activity) {
      var data = {
        "recruitmentNumber": recruitmentNumber,
        "acronym": activity.acronym,
        "observation": observation
      };

      return MonitoringCollectionService.defineActivityWithDoesNotApplies(data);
    };

    function buildActivityStatus(data) {
      if (data.doesNotApply) {
        if (data.activities.length == 0) {
          return {
            'acronym': data.acronym,
            'name': data.name,
            'status': DOES_NOT_APPLY,
            'observation': data.doesNotApply ? data.doesNotApply.observation : undefined
          };
        } else {
          return {
            'acronym': data.acronym,
            'name': data.name,
            'status': AMBIGUITY,
            'description': AMBIGUITY_STATE_DESCRIPTION,
            'observation': data.doesNotApply ? data.doesNotApply.observation : undefined
          };
        }
      } else if (data.activities.length == 0) {
        return {
          'acronym': data.acronym,
          'name': data.name,
          'status': UNDEFINED
        };
      } else if (data.activities.length > 1) {
        var information = [];
        data.activities.filter(function (activity) {
          information.push({
            'status': _buildStatusToPTbr(activity.statusHistory.name),
            'date': $filter('date')(activity.statusHistory.date, 'dd/MM/yyyy')
          });
        });
        return {
          'acronym': data.acronym,
          'name': data.name,
          'status': MULTIPLE,
          'description': MULTIPLE_STATE_DESCRIPTION,
          'information': information
        };
      } else if (data.activities.length == 1) {
        switch (data.activities[0].statusHistory.name) {
          case CREATED:
            return {
              'acronym': data.acronym,
              'name': data.name,
              'status': CREATED,
              'date': $filter('date')(data.activities[0].statusHistory.date, 'dd/MM/yyyy')
            };
          case SAVED:
            return {
              'acronym': data.acronym,
              'name': data.name,
              'status': SAVED,
              'date': $filter('date')(data.activities[0].statusHistory.date, 'dd/MM/yyyy')
            };
          case FINALIZED:
            return {
              'acronym': data.acronym,
              'name': data.name,
              'status': FINALIZED,
              'date': $filter('date')(data.activities[0].statusHistory.date, 'dd/MM/yyyy')
            };
        }
      }
      return data;
    };

    function _buildDataToView(response) {
      if (!response)
        return;
      var data = [];
      response.filter(function (activity) {
        data.push(buildActivityStatus(activity));
      });
      return data;
    };

    function _buildStatusToPTbr(status) {
      switch (status) {
        case CREATED:
          return 'Criado';
        case SAVED:
          return 'Salvo';
        case FINALIZED:
          return 'Finalizado';
      }
    };

  }
}());
