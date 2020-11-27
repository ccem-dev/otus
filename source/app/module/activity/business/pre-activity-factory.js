(function () {
  'use strict';

  angular
    .module('otusjs.activity.business')
    .factory('otusjs.activity.business.PreActivityFactory', Factory);

  function Factory() {
    let self = this;
    self.create = create;

    function create(user, survey, configuration, mode, externalID, stageId) {
      return new PreActivity(user, survey, configuration, mode, externalID, stageId);
    }
    return self;
  }

  function PreActivity(user, survey, configuration, mode, externalID, stageId) {
    let self = this;
    self.objectType = 'preActivity';
    self.surveyForm = survey;
    self.configuration = configuration || {};
    self.mode = mode;
    self.user = user || undefined;
    self.paperActivityData = undefined;
    self.externalID = externalID || null;
    self.preActivityValid = false;
    self.stageId = stageId;

    /* Public methods */
    self.updatePaperActivityData = updatePaperActivityData;
    self.updatePreActivityValid = updatePreActivityValid;
    self.toJSON = toJSON;


    function updatePaperActivityData(checkerData, realizationDate) {
      if (!checkerData) self.preActivityValid = false;
      else {
        self.paperActivityData = {};
        self.paperActivityData.checker = checkerData.checker;
        self.paperActivityData.realizationDate = realizationDate;
      }
    }

    function updatePreActivityValid(stateChecker, stateIdExternal) {
      if (self.surveyForm.isRequiredExternalID()) self.preActivityValid = stateChecker && stateIdExternal;
      if (stateChecker && stateIdExternal) self.preActivityValid = stateChecker;
      if (stateChecker === null && stateIdExternal) self.preActivityValid = stateIdExternal;
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
