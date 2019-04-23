(function () {
  'use strict';

  angular
    .module('otusjs.application.exam')
    .service('otusjs.application.exam.ExamStatusHistoryService', Service);

  Service.$inject = [];

  function Service() {
    var self = this;

    const STATUS = [
      {
        name: 'UNREALIZED',
        label: 'Não Realizado',
        color: '#CECECE',
        icon: '',
        value: 0
      },
      {
        name: 'REALIZED',
        label: 'Realizado',
        color: '#1ECE8B',
        icon: 'check_circle',
        value: 1
      }
    ];

    self.listStatus = listStatus;
    self.getStatusValue = getStatusValue;
    self.getStatusLabel = getStatusLabel;
    self.getStatusColor = getStatusColor;
    self.getLabels = getLabels;
    self.getColors = getColors;

    function listStatus() {
      return STATUS;
    }

    function getStatusValue(name) {
      if (name) {
        let search = STATUS.find(function (status) {
          return status.name == name;
        });
        let { value } = search;
        return value;
      } else {
        return null;
      }
    }

    function getStatusLabel(value = null) {
      if (value != null) {
        let search = STATUS.find(function (status) {
          return status.value == value;
        });
        let { label } = search;
        return label;
      } else {
        return "";
      }
    }

    function getStatusColor(value = null) {
      if (value != null) {
        let search = STATUS.find(function (status) {
          return status.value == value;
        });
        let { color } = search;
        return color;
      } else {
        return "";
      }
    }

    function getLabels() {
      var response = [];
      STATUS.forEach(function (status) {
        response.push(status.label);
      });
      return response;
    }

    function getColors() {
      var response = [];
      STATUS.forEach(function (status) {
        response.push(status.color);
      });
      return response;
    }

  }


}())