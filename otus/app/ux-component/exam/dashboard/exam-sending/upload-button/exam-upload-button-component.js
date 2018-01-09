(function() {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusExamUploadAddButton', {
      controller: Controller,
      templateUrl: 'app/ux-component/exam/dashboard/exam-sending/upload-button/exam-upload-button-template.html'
    });

  Controller.$inject = [
    '$q',
    '$element',
    '$mdToast',
    'otusjs.application.session.core.ContextService',
    'otusjs.application.state.ApplicationStateService',
    'otusjs.laboratory.core.project.ContextService'
  ];

  function Controller($q, $element, $mdToast, SessionContextService, ApplicationStateService, ProjectContextService) {
    var self = this;
    var timeShowMsg = 3000;
    var fr = new FileReader();

    self.$onInit = onInit;
    self.upload = upload;
    // self.validateFile = validateFile;

    function onInit() {
      fr.onload = receivedText;
      self.fileData = {};

      self.input = $($element[0].querySelector('#fileInput'));
      self.input.on('change', function(e) {
        self.fileData.name = e.target.files[0].name;
        self.fileData.realizationDate = new Date();
        self.fileData.operator = SessionContextService.getData('loggedUser').email;
        if(_validateFileToUpload(e.target.files[0])){
          fr.readAsText(e.target.files[0]);
        }
      });
    }

    function upload() {
      self.input.click();
    }

    function _validateFileToUpload(file){
      console.log(file);
      if(!_typeIsValid(file.type)){

      } else if (_structureIsValid()) {

      }
      return true;
    }

    function _typeIsValid(type){
      return type == "application/json";
    }

    function _structureIsValid(results) {

    }

    function receivedText(e) {
      console.log(e);
      var lines = e.target.result;
      self.fileData.results = JSON.parse(lines);
      ProjectContextService.setFileStructure(self.fileData);
      // ApplicationStateService.activateExamResultsVisualizer();
    }


    function _toastError() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Selecione um tipo de aliquota')
          .hideDelay(timeShowMsg)
      );
    }
  }
}());
