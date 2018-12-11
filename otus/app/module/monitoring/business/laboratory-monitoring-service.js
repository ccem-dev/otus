(function () {
  'use strict';

  angular
    .module('otusjs.monitoring.business')
    .service('otusjs.monitoring.business.LaboratoryMonitoringService', Service);

  Service.$inject = [
    '$q',
    'otusjs.deploy.LoadingScreenService',
    'otusjs.monitoring.repository.MonitoringCollectionService'
  ];

  function Service($q, LoadingScreenService, MonitoringCollectionService) {
    var self = this;
    /* Public methods */
    self.getDataOfPendingResultsByAliquots = getDataOfPendingResultsByAliquots;
    self.getDataQuantitativeByTypeOfAliquots = getDataQuantitativeByTypeOfAliquots;
    self.getDataOrphanByExams = getDataOrphanByExams;
    self.getDataOfStorageByAliquots = getDataOfStorageByAliquots;
    self.getDataOfResultsByExam = getDataOfResultsByExam;
    self.downloadCSVFileOfPendingResultsByAliquots = downloadCSVFileOfPendingResultsByAliquots;
    self.downloadCSVFileOfQuantitativeByTypeOfAliquots = downloadCSVFileOfQuantitativeByTypeOfAliquots;
    self.downloadCSVFileOfOrphansByExam = downloadCSVFileOfOrphansByExam;
    self.downloadCSVFileOfStorageByAliquots = downloadCSVFileOfStorageByAliquots;
    self.downloadCSVFileOfResultsByExam = downloadCSVFileOfResultsByExam;

    function getDataOfPendingResultsByAliquots() {
      var defer = $q.defer();
      MonitoringCollectionService.getDataOfPendingResultsByAliquots().then(function (response) {
        defer.resolve(response);
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function getDataQuantitativeByTypeOfAliquots() {
      var defer = $q.defer();
      MonitoringCollectionService.getDataQuantitativeByTypeOfAliquots().then(function (response) {
        defer.resolve(response);
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function getDataOrphanByExams() {
      var defer = $q.defer();
      MonitoringCollectionService.getDataOrphanByExams().then(function (response) {
        console.log(response);
        defer.resolve(response);
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function getDataOfStorageByAliquots() {
      var defer = $q.defer();
      MonitoringCollectionService.getDataOfStorageByAliquots().then(function (response) {
        defer.resolve(response);
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function getDataOfResultsByExam() {
      var defer = $q.defer();
      MonitoringCollectionService.getDataOfResultsByExam().then(function (response) {
        defer.resolve(response);
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function downloadCSVFileOfPendingResultsByAliquots() {
      var defer = $q.defer();
      LoadingScreenService.changeMessage("Por favor, aguarde! Estamos gerando o arquivo para download.");
      LoadingScreenService.start();
      MonitoringCollectionService.getDataToCSVOfPendingResultsByAliquots().then(function (response) {
        _buildCSVFile(response).then(function (result) {
          if (result) {
            var name = "monitoramento-laboratorial-resultados-pendentes-".concat(new Date().toLocaleDateString());
            alasql('SELECT * INTO CSV("' + name + '.csv",{headers:true}) FROM LAB_MONITORING');
            alasql("DROP TABLE IF EXISTS LAB_MONITORING");
            LoadingScreenService.finish();
          }
        }).catch(function (e) {
          throw new Error(e);
        }).finally(function () {
          LoadingScreenService.finish();
        });
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function downloadCSVFileOfQuantitativeByTypeOfAliquots() {
      var defer = $q.defer();
      LoadingScreenService.changeMessage("Por favor, aguarde! Estamos gerando o arquivo para download.");
      LoadingScreenService.start();
      MonitoringCollectionService.getDataToCSVOfQuantitativeByTypeOfAliquots().then(function (response) {
        _buildCSVFile(response).then(function (result) {
          if (result) {
            var name = "monitoramento-laboratorial-quantitativo-".concat(new Date().toLocaleDateString());
            alasql('SELECT * INTO CSV("' + name + '.csv",{headers:true}) FROM LAB_MONITORING');
            alasql("DROP TABLE IF EXISTS LAB_MONITORING");
            LoadingScreenService.finish();
          }
        }).catch(function (e) {
          throw new Error(e);
        }).finally(function () {
          LoadingScreenService.finish();
        });
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function downloadCSVFileOfOrphansByExam() {
      var defer = $q.defer();
      LoadingScreenService.changeMessage("Por favor, aguarde! Estamos gerando o arquivo para download.");
      LoadingScreenService.start();
      MonitoringCollectionService.getDataToCSVOfOrphansByExam().then(function (response) {
        _buildCSVFile(response).then(function (result) {
          if (result) {
            var name = "monitoramento-laboratorial-exames-orfaos-".concat(new Date().toLocaleDateString());
            alasql('SELECT * INTO CSV("' + name + '.csv",{headers:true}) FROM LAB_MONITORING');
            alasql("DROP TABLE IF EXISTS LAB_MONITORING");
            LoadingScreenService.finish();
          }
        }).catch(function (e) {
          throw new Error(e);
        }).finally(function () {
          LoadingScreenService.finish();
        });
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function downloadCSVFileOfStorageByAliquots() {
      var defer = $q.defer();
      LoadingScreenService.changeMessage("Por favor, aguarde! Estamos gerando o arquivo para download.");
      LoadingScreenService.start();
      MonitoringCollectionService.getDataToCSVOfStorageByAliquots().then(function (response) {
        _buildCSVFile(response).then(function (result) {
          if (result) {
            var name = "monitoramento-laboratorial-armazenamento-".concat(new Date().toLocaleDateString());
            alasql('SELECT * INTO CSV("' + name + '.csv",{headers:true}) FROM LAB_MONITORING');
            alasql("DROP TABLE IF EXISTS LAB_MONITORING");
            LoadingScreenService.finish();
          }
        }).catch(function (e) {
          throw new Error(e);
        }).finally(function () {
          LoadingScreenService.finish();
        });
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function downloadCSVFileOfResultsByExam() {
      var defer = $q.defer();
      LoadingScreenService.changeMessage("Por favor, aguarde! Estamos gerando o arquivo para download.");
      LoadingScreenService.start();
      MonitoringCollectionService.getDataToCSVOfResultsByExam().then(function (response) {
        _buildCSVFile(response).then(function (result) {
          if (result) {
            var name = "monitoramento-laboratorial-resultados-exame".concat(new Date().toLocaleDateString());
            alasql('SELECT * INTO CSV("' + name + '.csv",{headers:true}) FROM LAB_MONITORING');
            alasql("DROP TABLE IF EXISTS LAB_MONITORING");
            LoadingScreenService.finish();
          }
        }).catch(function (e) {
          throw new Error(e);
        }).finally(function () {
          LoadingScreenService.finish();
        });
      }).catch(function () {
        defer.reject()
      });
      return defer.promise;
    };

    function _buildCSVFile(data) {
      return $q(function (resolve, reject) {
        alasql("CREATE TABLE IF NOT EXISTS LAB_MONITORING(CODIGO INT, CENTRO STRING, TIPO STRING, CONDICAO STRING)");
        if (Array.isArray(data) && data.length > 0) {
          try {
            data.forEach(function (line) {
              alasql("INSERT INTO LAB_MONITORING VALUES(" + line.code + ",'" + line.fieldCenter + "','" + line.type + "','" + line.condition + "')");
            });
          } catch (e) {
            reject(e);
          }
          resolve(true);
        } else {
          reject(false);
        }
      });
    };
  }
}());
