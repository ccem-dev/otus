(function(){
  'use strict';

  angular.module('otusjs.otus.uxComponent')
    .component('otusParticipantUpdateContact', {
      controller: 'participantUpdateContactCtrl as $ctrl',
      templateUrl: 'app/ux-component/participants-manager/contact/participant-update-contact/participant-update-contact-template.html',
      bindings: {
        contact: '=',
        type: '@'
      }
    }).controller('participantUpdateContactCtrl', Controller);

  Controller.$inject = ['ParticipantContactValues'];

  function Controller(ParticipantContactValues) {
    const self = this;
    self.ParticipantContactValues = ParticipantContactValues;

    self.addContactInput = addContactInput;

    function addContactInput() {
      for (let key in self.contact){
        if(self.contact[key] === null){
         self.contact[key]= {value: {}}
         break;
        }
      }
    }
  }
}());