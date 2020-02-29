(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusPendecyListFilters', {
      controller: 'pendencyListFiltersCtrl as $ctrl',
      templateUrl: 'app/ux-component/pendency-viewer/pendency-list-control/pendency-list-filters/pendency-list-filters-template.html',
      bindings: {
        searchSettings: '='
      }
    }).controller('pendencyListFiltersCtrl', Controller);

  Controller.$inject = ['dragulaService'];

  function Controller(dragulaService) {
    const self = this;

    self.chanceInputViewState = chanceInputViewState;
    self.clear = clear;
    self.allStatus = allStatus;
    self.insertCriteria = insertCriteria;

    self.inputViewState = {
      rn: false,
      acronym: false,
      requester: false,
      receiver: false,
      dueDate: false,
      externalID: false,
      sortingCriteria: false
    };

    self.pendencyAttributes = [
      {title: 'rn', translatedTitle: 'Número de Recrutamento', icon: 'account_circle'},
      {title: 'acronym', translatedTitle: 'Sigla do Formulário', icon: 'description'},
      {title: 'externalID', translatedTitle: 'ID Externo', icon: 'fingerprint'},
      {title: 'requester', translatedTitle: 'Usuário Solicitante', icon: 'record_voice_over'},
      {title: 'receiver', translatedTitle: 'Revisor Responsável', icon: 'assignment_turned_in'},
      {title: 'dueDate', translatedTitle: 'Data de Vencimento', icon: 'hourglass_empty'}
    ];

    function clear(item) {
      delete self.searchSettings.filter[item.title];
      self.inputViewState[item.title] = false;
    }

    function chanceInputViewState(item){
      self.inputViewState[item.title] = true;
    }

    function allStatus() {
      delete self.searchSettings.filter.status;
    }

    function insertCriteria() {
      self.inputViewState['sortingCriteria'] = true;
      self.searchSettings.order.fields = ["dueDate","rn", "acronym", "externalID", "requester", "receiver"];
    }
  }
}());