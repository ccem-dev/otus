(function () {
  'use strict';

  angular
    .module('otusjs.activity.business')
    .service('otusjs.activity.business.ActivityImportService', Service);

  Service.$inject = [
    'otusjs.activity.repository.ActivityRepositoryService'
  ];

  function Service(ActivityRepositoryService) {
    const ERROR = "error";
    const RECRUITMENT_NUMBER_ERROR = "Número de recrutamento inválido! ";
    const CATEGORY_ERROR = "Categoria {error} inválida! ";
    const INTERVIEWER_ERROR = "Usuário {error} inválido! ";
    const PAPER_INTERVIEWER_ERROR = "Aferidor {error} inválido! ";
    const QUESTION_FILL_ERROR = "Questão {error} deveria estar preenchida! ";
    var structureActivity = {
      rn: '',
      acronym: '',
      name: '',
      error: '',
      category: '',
      isValid: 'Inválido'
    };
    var self = this;

    /* Public methods */
    self.importActivities = importActivities;
    self.getAnsweredActivityError = getAnsweredActivityError;
    self.getActivityError = getActivityError;

    function importActivities(surveyActivities, acronym, version) {
      return ActivityRepositoryService.importActivities(surveyActivities, acronym, version);
    }

    function getAnsweredActivityError(activity, acronym, name) {
      try {
        if (!activity.isValid) {
          return {
            rn: activity.participantData.recruitmentNumber,
            acronym: acronym,
            name: name,
            error: activity.error,
            category: activity.category.label,
            isValid: "Inválido"
          };
        }
      } catch (e) {
        return structureActivity;
      }
    }

    function getActivityError(response, activity) {
      try {
        var _activity = angular.copy(structureActivity);
        _activity.error = "";
        _activity.rn = response["recruitmentNumberValidationResult"].recruitmentNumber;
        _activity.acronym = activity.surveyTemplate.identity.acronym;
        _activity.name = activity.surveyTemplate.identity.name;
        _activity.category = response["categoryValidationResult"].category;

        if (!response["recruitmentNumberValidationResult"].isValid) {
          _activity.error = _activity.error.concat(RECRUITMENT_NUMBER_ERROR)
        }

        if (!response["categoryValidationResult"].isValid) {
          let _error = CATEGORY_ERROR;
          _error = _error.replace(ERROR, response["categoryValidationResult"].category);
          _activity.error = _activity.error.concat(_error);
        }

        if (!response["interviewerValidationResult"].isValid) {
          let _error = INTERVIEWER_ERROR;
          _error = _error.replace(ERROR, response["interviewerValidationResult"].email);
          _activity.error = _activity.error.concat(_error);
        }

        if (response.hasOwnProperty("paperInterviewerValidationResult")) {
          if (!response["paperInterviewerValidationResult"].isValid) {
            let _error = PAPER_INTERVIEWER_ERROR;
            _error = _error.replace(ERROR, response["paperInterviewerValidationResult"].email);
            _activity.error = _activity.error.concat(_error);
          }
        }

        if (response.hasOwnProperty("questionFillValidationResult")) {
          let _error = QUESTION_FILL_ERROR;
          let customID = activity.surveyTemplate.getItemByTemplateID(response["questionFillValidationResult"].questionId).customID;
          if (response["questionFillValidationResult"].shouldBeFilled) {
            _error = _error.replace(ERROR, customID);
          } else {
            _error = _error.replace(ERROR, customID);
            _error = _error.replace("{" + customID + "}", "{" + customID + "} não")
          }
          _activity.error = _activity.error.concat(_error);
        }

        return _activity;
      } catch (e) {
        return structureActivity
      }
    }

  }
}());
