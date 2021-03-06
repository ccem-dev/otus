(function () {
  'use strict'

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusActivityAdderCard', {
      templateUrl: 'app/ux-component/activity-adder/activity-adder-card/activity-adder-card-template.html',
      controller: Controller,
      bindings: {
        preActivities: '=',
        checkers: '<',
        preActivity: '='
      }
    }).controller('otusActivityAdderCardCtrl', Controller);

  Controller.$inject = [
    '$q',
    '$timeout',
    '$mdColors',
    'ACTIVITY_MANAGER_LABELS'
  ];

  function Controller($q, $timeout, $mdColors, ACTIVITY_MANAGER_LABELS) {
    var self = this;
    self.realizationDate = new Date();

    /* Public methods */
    self.checkerQuerySearch = checkerQuerySearch;
    self.getModeIcon = getModeIcon;
    self.checkerSelectedItemChange = checkerSelectedItemChange;
    self.deletePreActivity = deletePreActivity;
    self.getAcronym = getAcronym;
    self.updateExternalID = updateExternalID;
    self.updateRealizationDate = updateRealizationDate;
    self.monitoringCheckerFormSearchTextChange = monitoringCheckerFormSearchTextChange;
    self.styleHeader = styleHeader;
    self.validateExternalIdTruthy = validateExternalIdTruthy;
    self.validateExternalIdFalsy = validateExternalIdFalsy;
    self.validateTypeActivity = validateTypeActivity;
    self.validateTypeActivityPaper = validateTypeActivityPaper;

    function validateExternalIdTruthy() {
      return self.preActivity.surveyForm.isRequiredExternalID();
    }

    function validateExternalIdFalsy() {
      return !self.preActivity.surveyForm.isRequiredExternalID();
    }

    function validateTypeActivity() {
      return self.preActivity.mode === ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.ONLINE.name || self.preActivity.mode === ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.AUTOFILL.name;
    }

    function validateTypeActivityPaper() {
      return self.preActivity.mode === ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.PAPER.name;
    }

    function styleHeader() {
      return self.preActivity.mode === ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.AUTOFILL.name ?
        { 'background': $mdColors.getThemeColor('default-accent') } :
        { 'background': $mdColors.getThemeColor('default-primary') };
    }

    function checkerQuerySearch(query) {
      let results = query ? self.checkers.filter(_checkerCreateFilterFor(query)) : self.checkers;
      let deferred = $q.defer();

      $timeout(function () {
        deferred.resolve(results);
      }, Math.random() * 1000, false);

      return deferred.promise;
    }

    function _checkerCreateFilterFor(query) {
      let lowercaseQuery = angular.lowercase(query);
      return function filterFn(checker) {
        return checker.text.toLowerCase().indexOf(lowercaseQuery) > -1;
      };
    }

    function checkerSelectedItemChange(checker) {
      if (checker) {
        self.preActivity.updatePaperActivityData(checker, self.realizationDate);
        self.checkerForm.autocompleteChecker.$setValidity("", true);
        self.preActivity.updatePreActivityValid(self.checkerForm.$valid, self.externalIdForm.$valid);
      }
    }

    function getModeIcon() {
      if (self.preActivity.mode === ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.AUTOFILL.name) return ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.AUTOFILL.icon;
      return self.preActivity.mode === ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.ONLINE.name ? ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.ONLINE.icon : ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.PAPER.icon;
    }

    function getAcronym() {
      return self.preActivity.surveyForm.surveyTemplate.identity.acronym;
    }

    function deletePreActivity() {
      self.preActivities.splice(self.preActivities.indexOf(self.preActivity), 1);
    }

    function monitoringCheckerFormSearchTextChange() {
      self.checkerForm.autocompleteChecker.$setValidity('', false);
      self.preActivity.updatePreActivityValid(false);
    }

    function updateExternalID(externalID) {
      self.preActivity.externalID = externalID;
      if (self.preActivity.mode === ACTIVITY_MANAGER_LABELS.ACTIVITY_ATTRIBUTES.MODE.PAPER.name) self.preActivity.updatePreActivityValid(self.checkerForm.$valid, self.externalIdForm.$valid);
      else self.preActivity.updatePreActivityValid(null, self.externalIdForm.$valid);
    }

    function updateRealizationDate(updatedDate) {
      self.realizationDate = updatedDate;
      _cleanCheckerSearchText();
    }

    function _cleanCheckerSearchText() {
      self.checkerSearchText = "";
    }
  }

})();
