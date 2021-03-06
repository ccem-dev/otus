(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusActivityAdder', {
      controller: 'otusActivityAdderCtrl as $ctrl',
      templateUrl: 'app/ux-component/activity-adder/activity-adder-template.html',
      bindings: {
        checkers: '<'
      }
    }).controller('otusActivityAdderCtrl', Controller);

  Controller.$inject = [
    'ACTIVITY_MANAGER_LABELS',
    '$q',
    '$timeout',
    '$element',
    'otusjs.activity.business.ParticipantActivityService',
    'otusjs.application.state.ApplicationStateService',
    'otusjs.activity.business.GroupActivityService',
    'otusjs.application.dialog.DialogShowService',
    'otusjs.deploy.LoadingScreenService',
    'otusjs.stage.business.StageService',
    'STATE'
  ];

  function Controller(ACTIVITY_MANAGER_LABELS, $q, $timeout, $element,
    ParticipantActivityService, ApplicationStateService, GroupActivityService, DialogService, LoadingScreenService, StageService, STATE) {
    const ALL_OPTION = "Todos";
    const STAGE_NULL = "Nenhuma Etapa";

    let self = this;

    self.surveys = [];
    self.activities = [];
    self.selectedSurveys = [];
    self.statePreview = false;
    self.processing = true;
    self.mode = ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.ONLINE.name;
    self.selectSingleActivity = false;
    self.iconMode = "";
    self.optionModes = [];
    self.configuration = {};
    self.paperActivityCheckerData = null;
    self.preActivities = [];
    self.selectionOptions = [];
    self.btnAddPreActivitiesDisable = true;
    self.stage = {};
    self.optionStages = [];
    self.hasStage = true;

    /* Public methods */
    self.$onInit = onInit;
    self.addPreActivities = addPreActivities;
    self.saveActivities = saveActivities;
    self.surveyQuerySearch = surveyQuerySearch;
    self.resetPreActivities = resetPreActivities;
    self.clearSearchTerm = clearSearchTerm;
    self.addPreActivitiesGroup = addPreActivitiesGroup;
    self.disabledGroups = disabledGroups;
    self.displayGridLarge = displayGridLarge;
    self.displayGridSmall = displayGridSmall;
    self.monitoringSearchTextChange = monitoringSearchTextChange;
    self.selectedItemChange = selectedItemChange;


    function onInit() {
      LoadingScreenService.start();
      _loadCategories();
      _loadOptionModes();
      _loadSurveys();
      _loadSurveysGroup();
      _loadStages();
      $element.find('#search').on('keydown', function (ev) {
        ev.stopPropagation();
      });
    }

    function _loadOptionModes() {
      self.optionModes = [
        {
          mode: ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.ONLINE.name,
          label: ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.ONLINE.label
        },
        {
          mode: ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.PAPER.name,
          label: ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.PAPER.label
        },
        {
          mode: ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.AUTOFILL.name,
          label: ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.AUTOFILL.label
        }
      ]
    }

    function _loadCategories() {
      ParticipantActivityService
        .listAllCategories()
        .then(response => self.categories = response);
    }

    function _loadSurveys() {
      ParticipantActivityService.listAvailables()
        .then(surveys => {
          self.surveys = angular.copy(surveys);
          if (surveys.length) {
            self.isListEmpty = false;
          }
        }).then(LoadingScreenService.finish());
    }

    function _loadSurveysGroup() {
      self.selectedGroups = [];
      self.selectedGroupsResult = [];
      self.groupList = [];
      self.selectionOptions = [];
      GroupActivityService.getSurveyGroupsByUser().then(function (data) {
        self.surveysGroups = data;
        self.groupList = self.surveysGroups.getGroupNames();

        if (self.groupList.length > 0) {
          self.selectionOptions.push(ALL_OPTION);
        }

        self.selectionOptions = self.selectionOptions.concat(self.groupList);
      });
    }

    function _loadStages() {
      self.hasStage = true;
      StageService.getAllStages()
        .then(stages => {
          if (!stages || stages.length === 0) {
            self.hasStage = false;
          }
          self.optionStages.push({ name: STAGE_NULL });
          self.optionStages = self.optionStages.concat(stages);
        })
        .catch(err => {
          console.error(err);
          self.hasStage = false;
        });
    }

    function clearSearchTerm() {
      self.searchTerm = '';
    }

    function displayGridLarge() {
      if (window.innerWidth < 1400) {
        return '1:1.5';
      }
      return '1:1.05';
    }

    function displayGridSmall() {
      if (window.innerWidth < 680) {
        return '1:1.7';
      }
      return '3:4';
    }

    function disabledGroups(index) {
      let disabledResult;
      if (!self.selectedGroups.length) {
        disabledResult = false;
      } else if (self.selectedGroups.includes(ALL_OPTION) && index > 0) {
        disabledResult = true
      } else {
        disabledResult = (!self.selectedGroups.includes(ALL_OPTION) && index === 0 && !self.searchTerm);
      }
      return disabledResult;
    }

    function addPreActivitiesGroup(item) {
      self.activities = [];
      self.selectedGroups = [];
      self.selectedGroupsResult = [];
      self.selectedGroupsResult = item.includes(ALL_OPTION) ? self.groupList.slice(0) : item;
      self.processing = false;

      _filterActivities();

      $timeout(() => {
        self.processing = true;
      }, 2000);

      self.activities.forEach(activity => {
        addPreActivities(activity);
      });
    }

    function addPreActivities(survey) {
      let preActivity = ParticipantActivityService.createPreActivity(
        survey,
        angular.copy(self.configuration),
        angular.copy(self.mode),
        angular.copy(self.paperActivityCheckerData),
        angular.copy(self.stage)
      );

      self.preActivities.unshift(preActivity);
      self.searchText = '';
      self.btnAddPreActivitiesDisable = true;
    }

    function surveyQuerySearch(query) {
      self.selectedGroupsResult = self.selectedGroupsResult.concat(self.groupList);
      _filterActivities();

      let results = query ? self.activities.filter(_activityCreateFilterFor(query)) : self.activities;
      let deferred = $q.defer();

      $timeout(() => {
        deferred.resolve(results);
      }, Math.random() * 1000, false);

      return deferred.promise;
    }

    function _filterActivities() {
      self.selectedSurveys = [];
      self.selectedGroupsResult.forEach(groupName => {
        self.selectedSurveys = self.selectedSurveys.concat(self.surveysGroups.getGroupSurveys(groupName));
      });
      self.selectedSurveys = self.selectedSurveys.filter(function (item, position) {
        return self.stage.surveyAcronyms ? self.stage.surveyAcronyms.includes(item) : true && self.selectedSurveys.indexOf(item) === position;
      });

      self.activities = self.surveys.filter(function (activity) {
        return self.selectedSurveys.includes(activity.acronym)
      });
    }

    function _activityCreateFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(survey) {
        return survey.name.toLowerCase().indexOf(lowercaseQuery) > -1 ||
          survey.acronym.toLowerCase().indexOf(lowercaseQuery) > -1;
      };
    }

    function resetPreActivities() {
      DialogService.showConfirmationDialog(
        'Cancelamento da Lista de Formulários',
        'Deseja sair do Gerenciador de Atividades ?',
        'Confirmação de cancelamento')
        .then(() => self.preActivities = [])
        .then(() => _loadStateActivity());
    }

    function _loadStateActivity() {
    let toStage = ApplicationStateService.getCurrentStateStorage()

    if (toStage == STATE.PARTICIPANT_ACTIVITY_STAGE) {
      ApplicationStateService.activateParticipantActivityStage()
    } else {
      ApplicationStateService.activateParticipantActivities()
    }
    }

    function saveActivities() {
      if (allActivitiesAreValid()) {
        DialogService.showConfirmationDialog(
          'Salvar Lista de Formulários',
          'Deseja adicionar os itens ao participante?',
          'Confirmação de exclusão')
          .then(() => ParticipantActivityService.saveActivities(self.preActivities));
      } else {
        DialogService.showWarningDialog(
          'Pendência de Informações',
          'Detecção de Formulários Incompletos',
          'Retorne para lista e preencha os campos obrigatórios',
          'Aviso de formulários inválidos'
        );
      }
    }

    function allActivitiesAreValid() {
      return self.preActivities.every(_checkFilledInput);
    }

    function _checkFilledInput(preActivity) {
      return preActivity.preActivityValid = preActivity.preActivityValid ||
        preActivity.mode === ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.AUTOFILL.name ||
        (preActivity.mode === ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.ONLINE.name && !preActivity.surveyForm.isRequiredExternalID());
    }

    function monitoringSearchTextChange(state) {
      self.addStateValid = state;
    }

    function selectedItemChange(item) {
      if (item) {
        self.btnAddPreActivitiesDisable = false;
      }
    }

  }
}());
