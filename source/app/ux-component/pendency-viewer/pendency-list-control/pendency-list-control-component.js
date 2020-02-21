(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusPendencyListControl', {
      controller:'pendencyListControlCtrl as $ctrl',
      templateUrl: 'app/ux-component/pendency-viewer/pendency-list-control/pendency-list-control-template.html',
      bindings: {
        getPendencies: '&'
      }
    }).controller('pendencyListControlCtrl', Controller);

  Controller.$inject = [];

  function Controller() {
    const self = this;

    self.clear = clear;
    //self.getPendencyList = getPendencyList;

    self.pendencyAttributes = [
      { title:'rn', translatedTitle: 'Número de Recrutamento', icon: 'account_circle'},
      { title:'acronym', translatedTitle: 'Sigla do Formulário', icon: 'description'},
      { title:'externalID', translatedTitle: 'ID Externo', icon: 'fingerprint'},
      { title:'requester', translatedTitle: 'Usuário Solicitante', icon: 'record_voice_over'},
      { title:'receiver', translatedTitle: 'Revisor Responsável', icon: 'assignment_turned_in'},
      { title:'dueDate', translatedTitle: 'Data de Vencimento', icon: 'hourglass_empty'}
    ];

    self.selectedFilters = {};

    function clear(item){
      delete self.selectedFilters[item.title];
      self.checkStates[item.title] = false;
    }



    // {
    //   "currentQuantity": 100,
    //   "quantityToGet": 50,
    //   "order": {
    //   "fields": [ "creationDate", "rn" ],
    //     "mode" : 1
    // },
    //   "filter": {
    //   "dueDate": "",
    //     "requester": ["fulano@detal"],
    //     "receiver": [],
    //     "status" : "FINALIZED or NOT_FINALIZED",
    //     "acronym": "",
    //     "rn": 123,
    //     "externalID": "12345"
    // }
    // }





  }
}());