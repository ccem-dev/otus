(function() {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('monitoringOverviewVisualizationComponent', {
      controller: Controller,
      templateUrl: 'app/ux-component/otus-monitoring/visualizations/monitoring-overview-visualization-template.html',
      bindings: {
        selectedLots: '=',
        csvData: '=',
        questionnaireData: '=',
        createQuestionnaireLineChart: '=',
        centers: '='
      }
    });

  Controller.$inject = [
    '$filter'
  ];

  function Controller($filter) {
    var self = this;

    /* Lifecycle hooks */
    self.$onInit = onInit;
    /* public functions */
    self.createLineChart = createLineChart;

    function onInit() {
      self.centers = $filter('orderBy')(self.centers);
      self.createQuestionnaireLineChart = createLineChart;
    }

    function _convertDateList(qData) {
      if (qData) {
        var dates = angular.copy(qData.dates);
        dates = dates.map(function(date) {
          return new Date(date);
        });
        qData.dates = [];
        dates.forEach(function(elem) {
          let month = String(elem.getMonth() + 1);
          qData.dates.push(String(month.concat('/', elem.getFullYear())));
        });
        return qData.dates;
      }
    }

    function createLineChart(qData) {
      qData.dates = _convertDateList(qData);
      if (!self.lineChart) {
        var ctx = document.getElementById("myLineChart");
        self.lineChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: qData.dates,
            datasets: qData.data
          },
          options: {
            showTooltips: false,
            responsive: true,
            maintainAspectRatio: false,
            title: {
              display: true,
              fontSize: 20,
              text: 'Número de Atividades Finalizadas de Cada Centro por Mês'
            },
            scales: {
              xAxes: [{
                stacked: false
              }],
              yAxes: [{
                stacked: false,
                ticks: {
                  beginAtZero: false
                }
              }]
            }
          }
        });
      } else {
        self.lineChart.config.data.labels = (qData.dates);
        self.lineChart.data.datasets = (qData.data);
        self.lineChart.update();
      }
    }

  }
}());
