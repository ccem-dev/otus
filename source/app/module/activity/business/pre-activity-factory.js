(function () {
  'use strict';

  angular
    .module('otusjs.activity.business')
    .factory('otusjs.activity.business.PreActivityFactory', Factory);

  function Factory() {
    let self = this;
    self.create = create;

    function create(user, survey, configuration, mode, externalID, stage) {
      return new PreActivity(user, survey, configuration, mode, externalID, stage);
    }
    return self;
  }

  function PreActivity(user, survey, configuration, mode, externalID, stage) {
    let self = this;
    self.objectType = 'preActivity';
    self.surveyForm = survey;
    self.configuration = configuration || {};
    self.mode = mode;
    self.user = user || undefined;
    self.paperActivityData = undefined;
    self.externalID = externalID || null;
    self.preActivityValid = false;
    self.stage = stage; // object {_id, name, surveyAcronyms}

    /* Public methods */
    self.updatePaperActivityData = updatePaperActivityData;
    self.updatePreActivityValid = updatePreActivityValid;
    self.getStageId = getStageId;
    self.toJSON = toJSON;


    function updatePaperActivityData(checkerData, realizationDate) {
      if (!checkerData) {
        self.preActivityValid = false;
      }
      else {
        self.paperActivityData = {};
        self.paperActivityData.checker = checkerData.checker;
        self.paperActivityData.realizationDate = realizationDate;
      }
    }

    function updatePreActivityValid(stateChecker, stateIdExternal) {
      if (self.surveyForm.isRequiredExternalID()) {
        self.preActivityValid = stateChecker && stateIdExternal;
      }
      if(stateIdExternal){
        self.preActivityValid = (stateChecker ? stateChecker : stateIdExternal);
      }
    }

    function getStageId(){
      return self.stage ? self.stage._id : null;
    }

    function toJSON() {
      return {
        objectType: self.objectType,
        surveyForm: self.surveyForm,
        configuration: self.configuration,
        mode: self.mode,
        user: self.user,
        paperActivityData: self.paperActivityData,
        externalID: self.externalID,
        preActivityValid: self.preActivityValid,
        stage: self.stage
      };
    }
  }
})();
