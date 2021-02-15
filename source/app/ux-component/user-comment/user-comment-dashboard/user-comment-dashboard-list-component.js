(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusUserCommentDashboardList', {
      controller: 'otusUserCommentDashboardListCtrl as $ctrl',
      templateUrl: 'app/ux-component/user-comment/user-comment-dashboard/user-comment-dashboard-list-template.html'
    }).controller('otusUserCommentDashboardListCtrl', Controller);

  Controller.$inject = [
    'otusjs.participant.core.EventService',
    'otusjs.application.state.ApplicationStateService',
    'otusjs.application.dialog.DialogShowService',
    'otusjs.user.comment.business.UserCommentService',
    'USER_COMMENT_MANAGER_LABELS'
  ];

  function Controller(EventService, ApplicationStateService, DialogService, UserCommentService, USER_COMMENT_MANAGER_LABELS) {
    const COLOR_STAR = 'rgb(253, 204, 13)';
    var self = this;

    /* Public methods */
    self.fillSelectedComment = fillSelectedComment;
    self.cancelFillSelectedComment = cancelFillSelectedComment;
    self.deleteSelectedComment = deleteSelectedComment;
    self.showStarSelectedUserComment = showStarSelectedUserComment;
    self.saveUserComment = saveUserComment;
    self.colorStar = colorStar;
    self.getFormattedDate = getFormattedDate;

    self.$onInit = onInit;

    self.items = [];
    self.selectedCommentId = null;

    function onInit() {
      EventService.onParticipantSelected(_loadNoteAboutParticipant);
      _loadNoteAboutParticipant();
    }

    function _loadNoteAboutParticipant() {
      UserCommentService.getNoteAboutParticipant().then((arrayComment) => {
        self.items = arrayComment
      })
    }

    function showStarSelectedUserComment(userCommentId) {
      UserCommentService.showStarSelectedUserComment(userCommentId)
        .then(() => {
          UserCommentService.showMsg('successMessage');
          __loadNoteAboutParticipant();
        })
        .catch(() => {
          UserCommentService.showMsg('failureMessage');
        })
    }

    function colorStar(starSelected) {
      return starSelected ? { color: COLOR_STAR } : null;
    }

    function getFormattedDate(date) {
      return UserCommentService.getFormattedDate(date);
    }

    function _updateUserComment() {
      UserCommentService.updateUserComment(self.selectedCommentId, self.comment)
        .then(() => {
          UserCommentService.showMsg('updateSuccessMessage');
          _loadNoteAboutParticipant();
          self.selectedCommentId = null;
          self.comment = "";
        })
        .catch(() => {
          UserCommentService.showMsg('failureMessage');
        })
    }

    function saveUserComment() {
      if (self.selectedCommentId) {
        _updateUserComment();
      } else {
        UserCommentService.saveUserComment(self.comment)
          .then(() => {
            UserCommentService.showMsg('successUserCommentCreation');
            self.comment = "";
            _loadNoteAboutParticipant();
          })
          .catch(() => {
            UserCommentService.showMsg('failUserCommentCreation');
          })
      }
    }

    function fillSelectedComment(itemComment) {
      if (self.selectedCommentId) {
        UserCommentService.showMsg('conflictMessage');
        DialogService.showDialog(USER_COMMENT_MANAGER_LABELS.ATTRIBUTES_MESSAGE.confirmFillSelected)
          .then(function () {
            self.comment = itemComment.comment;
            self.selectedCommentId = itemComment._id;
          });
      } else {
        self.comment = itemComment.comment;
        self.selectedCommentId = itemComment._id;
      }
      // ApplicationStateService.activateActivityPlayer();
    }

    function cancelFillSelectedComment() {
      self.comment = "";
      self.selectedCommentId = null;
    }

    function deleteSelectedComment(commentId) {
      DialogService.showDialog(USER_COMMENT_MANAGER_LABELS.ATTRIBUTES_MESSAGE.deleteUserComment)
        .then(function () {
          UserCommentService.deleteSelectedComment(commentId)
            .then(() => {
              UserCommentService.showMsg('deleteSuccessMessage');
              _loadNoteAboutParticipant();
            })
            .catch(() => {
              UserCommentService.showMsg('failureMessage');
            })
        });
    }
  }
}());