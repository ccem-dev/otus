(function () {
    'use strict'

    angular
        .module('otusjs.otus.uxComponent')
        .component('otusActivityAdderCard', {
            templateUrl: 'app/ux-component/activity-adder/activity-adder-card/activity-adder-card-template.html',
            controller: Controller,
            bindings: {
                activityDtos: '=',
                checkers: '<'

            }
        });
    //binding = activityDto
    Controller.$inject = [
        '$q',
        '$timeout'
    ];

    function Controller($q, $timeout) {
        var self = this;
        self.checkerQuerySearch = checkerQuerySearch;
        self.getModeIcon = getModeIcon;

        function checkerQuerySearch(query) {
            var results = query ? self.checkers.filter(_checkerCreateFilterFor(query)) : self.checkers;
            var deferred = $q.defer();

            $timeout(function() {
                deferred.resolve(results);
            }, Math.random() * 1000, false);

            return deferred.promise;
        }

        function _checkerCreateFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(checker) {
                return checker.text.toLowerCase().indexOf(lowercaseQuery) > -1;
            };
        }

        function getModeIcon(activity){
            return activity.mode === "ONLINE" ?  "signal": "file-document"
        }
    }

})();