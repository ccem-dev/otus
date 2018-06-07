(function () {
  'use strict';

  angular
    .module('otusjs.monitoring.business')
    .service('otusjs.monitoring.business.MonitoringService', service);

  service.$inject = [
    'otusjs.monitoring.repository.MonitoringCollectionService'
  ];

  function service(MonitoringCollectionService) {
    var self = this;

    self.list = list;


    function list(){
      MonitoringCollectionService.list()
        .then(function(list){
          console.log(list);
        })
        .catch(function(e){
          console.log(e);

        });
    }
  }

}());
