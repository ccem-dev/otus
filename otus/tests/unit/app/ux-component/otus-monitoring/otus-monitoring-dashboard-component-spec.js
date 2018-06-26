describe('otusMonitoringDashboardComponent test', function() {
  var Mock = {};
  var $controller;
  var ctrl;
  var Injections = {};


  beforeEach(function() {
    angular.mock.module('otusjs.otus.uxComponent');
  });

  beforeEach(function() {
    Mock.ProjectFieldCenterService = {
      loadCenters: () => {
        return Promise.resolve(mockCenters());
      }
    }

    Mock.MonitoringService = {
      listAcronyms: () => {
        return Promise.resolve(mockListAcronyms());
      },
      find: (query) => {
        return Promise.resolve(mockFind());
      },
      listCenters: () => {
        return Promise.resolve(mockListCenters());
      },
    };

    Mock.LoadingScreenService = {
      start: () => {
        return Promise.resolve();
      },
      finish: () => {
        return Promise.resolve();
      }
    };

    Mock.MonitorParseData = {
      init: (a, b, c, d) => {},
      create: (a, b, c, d) => {},
    };

    Mock.MonitoringCenterFactory = {
      create: (data) => {
        return new MonitoringCenter(data);
        function MonitoringCenter(data) {
          var self = this;

          self.objectType = 'MonitoringCenter';
          self.name = data.name || null;
          self.goal = data.goal || null;
          self.backgroundColor = data.backgroundColor || null;
          self.borderColor = data.borderColor || null;
        }
      }
    };
    angular.mock.module(function($provide) {
      $provide.value('otusjs.deploy.FieldCenterRestService', Mock.ProjectFieldCenterService);
      $provide.value('otusjs.monitoring.business.MonitoringService', Mock.MonitoringService);
      $provide.value('otusjs.deploy.LoadingScreenService', Mock.LoadingScreenService);
      $provide.value('otusMonitorParseDataFactory', Mock.MonitorParseData);
      $provide.value('otusjs.model.monitoring.MonitoringCenterFactory', Mock.MonitoringCenterFactory);
    });
  });

  beforeEach(function() {

    inject(function(_$injector_, _$controller_) {
      $controller = _$controller_;
      Injections = {
        ProjectFieldCenterService: Mock.ProjectFieldCenterService,
        MonitoringService: Mock.MonitoringService,
        LoadingScreenService: Mock.LoadingScreenService,
        MonitorParseData: Mock.MonitorParseData,
        MonitoringCenterFactory: Mock.MonitoringCenterFactory,
        $mdDialog: _$injector_.get('$mdDialog'),
        $q: _$injector_.get('$q')
      };
      ctrl = $controller('otusMonitoringDashboardCtrl', Injections);
    });
  });


  describe('onInit method', () => {
    var originalTimeout;
    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      spyOn(ctrl, '$onInit').and.callThrough();
      ctrl.$onInit();
    });

    it('should onInit be defined', (done) => {
      expect(ctrl.$onInit).toHaveBeenCalled();
      setTimeout(function() {
        done();
      }, 1000)
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

  });


  function mockCenters() {
    return JSON.parse('[' +
      '{"name":"Minas Gerais","code":3,"acronym":"MG","country":null,"state":null,"address":null,"complement":null,"zip":null,"phone":null,"backgroundColor":"rgba(255, 99, 132, 0.2)","borderColor":"rgba(255, 99, 132, 1)","goal":3025},' +
      '{"name":"Sao Paulo","code":6,"acronym":"SP","country":null,"state":null,"address":null,"complement":null,"zip":null,"phone":null,"backgroundColor":"rgba(54, 162, 235, 0.2)","borderColor":"rgba(54, 162, 235, 1)","goal":4895},' +
      '{"name":"Rio Grande do Sul","code":5,"acronym":"RS","country":null,"state":null,"address":null,"complement":null,"zip":null,"phone":null,"backgroundColor":"rgba(75, 192, 192, 0.2)","borderColor":"rgba(75, 192, 192, 1)","goal":1999},' +
      '{"name":"Rio de Janeiro","code":4,"acronym":"RJ","country":null,"state":null,"address":null,"complement":null,"zip":null,"phone":null,"backgroundColor":"rgba(127, 190, 102, 0.2)","borderColor":"rgba(127, 190, 102, 1)","goal":1745},' +
      '{"name":"Espirito Santo","code":2,"acronym":"ES","country":null,"state":null,"address":null,"complement":null,"zip":null,"phone":null,"backgroundColor":"rgba(153, 102, 255, 0.2)","borderColor":"rgba(153, 102, 255, 1)","goal":1024},' +
      '{"name":"Bahia","code":1,"acronym":"BA","country":null,"state":null,"address":null,"complement":null,"zip":null,"phone":null,"backgroundColor":"rgba(255, 163, 102, 0.2)","borderColor":"rgba(255, 163, 102, 1)","goal":1945}]');

  }

  function mockListCenters() {
    return JSON.parse('[{"name":"Minas Gerais","goal":17,"backgroundColor":"rgba(255, 99, 132, 0.2)","borderColor":"rgba(255, 99, 132, 1)"},' +
      '{"name":"Sao Paulo","goal":20,"backgroundColor":"rgba(54, 162, 235, 0.2)","borderColor":"rgba(54, 162, 235, 1)"},' +
      '{"name":"Rio Grande do Sul","goal":17,"backgroundColor":"rgba(75, 192, 192, 0.2)","borderColor":"rgba(75, 192, 192, 1)"},' +
      '{"name":"Rio de Janeiro","goal":19,"backgroundColor":"rgba(127, 190, 102, 0.2)","borderColor":"rgba(127, 190, 102, 1)"},' +
      '{"name":"Espirito Santo","goal":20,"backgroundColor":"rgba(153, 102, 255, 0.2)","borderColor":"rgba(153, 102, 255, 1)"},' +
      '{"name":"Bahia","goal":8,"backgroundColor":"rgba(255, 163, 102, 0.2)","borderColor":"rgba(255, 163, 102, 1)"}]');
  }

  function mockListAcronyms() {
    return ["ANTC", "PASC", "TVSC", "HMPD", "PSEC", "EAIC", "HOCC", "AFID", "HVSD", "SONC", "DISC", "DORC", "FORC", "SPPC", "CFUC", "CURC", "TCLEC", "USGC", "VOPC", "MONC", "ACTDC", "BIOC", "MSKC", "DSOC", "ACTA", "RETC", "ECGC", "CSI", "ISG", "CSJ", "CSP", "MULC", "FRC", "DIEC", "RCPC", "MEDC", "MED2", "MED3", "CISE"];
  }

  function mockFind() {
    return JSON.parse('[{"fieldCenter":"SP","month":1,"year":2015,"acronym":"ANTC","sum":"5","meta":{"revision":0,"created":0,"version":0},"$loki":4},{"fieldCenter":"SP","month":4,"year":2016,"acronym":"ANTC","sum":"5","meta":{"revision":0,"created":0,"version":0},"$loki":3},{"fieldCenter":"SP","month":12,"year":2016,"acronym":"ANTC","sum":"5","meta":{"revision":0,"created":0,"version":0},"$loki":2},{"fieldCenter":"RJ","month":12,"year":2017,"acronym":"ANTC","sum":"2","meta":{"revision":0,"created":0,"version":0},"$loki":1}]');
  }


});
