(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusIssueMessagesViewerComponent', {
      controller: 'issueMessagesViewerCtrl as $ctrl',
      templateUrl: 'app/ux-component/project-communication/issue-messages-viewer/issue-messages-viewer-template.html',
      bindings: {
        issueId: '<'
      }
    }).controller('issueMessagesViewerCtrl', Controller);

  Controller.$inject = [
    'ISSUE_MESSAGES_VIEWER_CONSTANTS',
    'otusjs.issueMessagesViewer.IssueMessagesViewerService',
    'otusjs.deploy.LoadingScreenService',
    'otusjs.application.dialog.DialogShowService'
  ];

  function Controller(ISSUE_MESSAGES_VIEWER_CONSTANTS, IssueMessagesViewerService, LoadingScreenService, DialogService) {
    const self = this;

    self.viewerTitle = ISSUE_MESSAGES_VIEWER_CONSTANTS.PAGE_TITLE;
    self.itemComponentName = 'otusIssueMessageItem';
    self.headerComponentName = 'otusIssueInfoHeader';
    self.replyContent = null;
    self.currStatus = null;

    self.$onInit = onInit;
    self.openReplyInput = openReplyInput;
    self.sendReply = sendReply;
    self.openStatusOptions = openStatusOptions;
    self.changeStatus = changeStatus;


    function onInit(){
      self.replying = self.changingStatus = false;
      self.items = [];
      self.itemAttributes = {};//todo

      LoadingScreenService.start();

      self.issue = IssueMessagesViewerService.getCurrIssueInfo();
      self.currStatus = self.issue.status;
      console.log(self.issue);
      console.log(self.currStatus);

      self.statusOptions = IssueMessagesViewerService.getStatusActions(self.currStatus.value);

      IssueMessagesViewerService.getAllItems()
        .then(response => {
          self.items = response;
          LoadingScreenService.finish();
        })
        .catch(error => {
          console.log(error);
          LoadingScreenService.finish();
        });
    }

    function openReplyInput(){
      self.replying = true;
    }

    function sendReply(){
      self.replying = false;
      console.log(self.replyContent)
    }

    function openStatusOptions(){
      self.changingStatus = true;
    }

    function changeStatus(){
      self.changingStatus = false;
      console.log(self.currStatus)
    }

  }

}());