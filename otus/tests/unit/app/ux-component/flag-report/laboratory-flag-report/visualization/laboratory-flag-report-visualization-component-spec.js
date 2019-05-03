describe('otusLaboratoryFlagReportVisualizationComponentCtrl Test', function () {
  var Mock = {};
  var controller;
  var Injections = {};
  var FLAG_REPORT = "flag-report";

  beforeEach(function () {
    mockInjections();
    angular.mock.module('otusjs.otus.uxComponent', function ($provide) {
      $provide.value("otusjs.application.exam.ExamStatusHistoryService", Mock.ExamStatusHistoryService);
    });

    inject(function (_$controller_) {
      Injections = {
        STATE: Mock.STATE,
        ExamStatusHistoryService: Mock.ExamStatusHistoryService
      };
      controller = _$controller_('otusLaboratoryFlagReportVisualizationComponentCtrl', Injections);
    });
  });

  describe('onInit method', () => {
    beforeEach(function () {
      spyOn(controller, '$onInit').and.callThrough();
      spyOn(controller, 'constructor').and.callThrough();

      controller.examsData = Mock.examsData;
      controller.legendRange = Mock.legendRange;
      controller.$onInit();
    });

    it('should onInit be defined', function () {
      expect(controller.$onInit).toBeDefined();
      expect(controller.$onInit).toHaveBeenCalled();
      expect(controller.$onInit).not.toBeNull();
    });

    xit('should VerifyBrowserService.verify to have been called', function () {
      expect(controller.constructor).toHaveBeenCalled();
    });
  });


  function mockInjections() {
    Mock.ExamStatusHistoryService = {
      getStatusColor: () => { }
    };

    Mock.examsData = {
      columns: [["C", "A1"], ["C", "A2"]],
      data: [[1, 1], [1, 0]],
      index: [123456, 123457]
    };

    Mock.legendRange = {};
  };

});