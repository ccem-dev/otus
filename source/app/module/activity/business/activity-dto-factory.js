(function () {
    'use strict';

    angular
        .module('otusjs.activity.business')
        .factory('otusjs.activity.business.ActivityDtoFactory', Factory);

    Factory.$inject = [];

    function Factory() {
        var self = this;
        self.create = create;


        function create(survey, configuration, mode, user){
            let activityDto = new ActivityDto(survey, configuration, mode, user);
            return activityDto;
        }
        return self;
    }

    function ActivityDto(survey, configuration, mode, user) {
        let self = this;
         self.updatePaperActivityData = updatePaperActivityData;

        self.OBJECT_TYPE = 'ActivityDto';
        self.surveyForm = survey;
        self.configuration = configuration || {};
        //self.configuration.externalID = configuration.externalID || null;
        self.mode = mode;
        mode === 'ONLINE' ? self.user = user : self.user = null;
        self.paperActivityData = null;


        function updatePaperActivityData(checkerData, realizationDate) {
            self.paperActivityData = {}
            self.paperActivityData.checker = checkerData.checker;
            self.paperActivityData.realizationDate = realizationDate;
        }
    }





})();