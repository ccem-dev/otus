(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusUserCommentAboutParticipantDashboardList', {
      controller: 'otusUserCommentAboutParticipantDashboardListCtrl as $ctrl',
      templateUrl: ' app/ux-component/user-comment/user-comment-about-participant-dashboard/user-comment-about-participant-dashboard-list-template.html'
    }).controller('otusUserCommentAboutParticipantDashboardListCtrl', Controller);

  Controller.$inject = [
    '$element',
    'otusjs.participant.core.EventService',
    'otusjs.application.state.ApplicationStateService',
    'otusjs.application.dialog.DialogShowService',
    'otusjs.user.comment.business.UserCommentAboutParticipantService',
    'USER_COMMENT_MANAGER_LABELS'
  ];

  function Controller($element, EventService, ApplicationStateService, DialogService, UserCommentAboutParticipantService, USER_COMMENT_MANAGER_LABELS) {
    const COLOR_STAR = 'rgb(253, 204, 13)';
    const LIMIT = 5;
    const SKIP = 0;

    var self = this;

    /* Public methods */
    self.fillSelectedComment = fillSelectedComment;
    self.cancelFillSelectedComment = cancelFillSelectedComment;
    self.deleteSelectedComment = deleteSelectedComment;
    self.showStarSelectedUserCommentAboutParticipant = showStarSelectedUserCommentAboutParticipant;
    self.saveUserCommentAboutParticipant = saveUserCommentAboutParticipant;
    self.colorStar = colorStar;
    self.getFormattedDate = getFormattedDate;
    self.viewPlusUserCommentAboutParticipant = viewPlusUserCommentAboutParticipant;

    self.$onInit = onInit;

    self.items = [];
    self.selectedComment = null;
    self.stuntmanSearchSettings = {};
    self.recruitmentNumber = null;

    function onInit() {
      EventService.onParticipantSelected(_loadNoteAboutParticipantDashboard);
      _loadNoteAboutParticipantDashboard();
    }

    function _loadNoteAboutParticipantDashboard() {
      self.recruitmentNumber = UserCommentAboutParticipantService.getSelectedParticipant().recruitmentNumber
      self.stuntmanSearchSettings = {
        currentQuantity: SKIP,
        quantityToGet: LIMIT,
        recruitmentNumber: self.recruitmentNumber
      }

      UserCommentAboutParticipantService.getNoteAboutParticipant(self.stuntmanSearchSettings).then((arrayComment) => {
        self.items = arrayComment
      })
    }

    function viewPlusUserCommentAboutParticipant() {
      ApplicationStateService.userCommentAboutParticipant();
    }

    function showStarSelectedUserCommentAboutParticipant(userCommentAboutParticipant) {
      let starred = userCommentAboutParticipant.starred ? false : true;
      UserCommentAboutParticipantService.showStarSelectedUserCommentAboutParticipant(userCommentAboutParticipant._id, starred)
        .then(() => {
          userCommentAboutParticipant.starred = starred //note com a chave de identificação que do angular permite atualizar campos
          starred = null;
          UserCommentAboutParticipantService.showMsg('successMessage');
        })
        .catch(() => {
          UserCommentAboutParticipantService.showMsg('failureMessage');
        })
    }

    function colorStar(starSelected) {
      return starSelected ? { color: COLOR_STAR } : null;
    }

    function getFormattedDate(date) {
      return UserCommentAboutParticipantService.getFormattedDate(date);
    }

    function _updateUserCommentAboutParticipant() {
      self.selectedComment.comment = self.comment;
      UserCommentAboutParticipantService.updateUserCommentAboutParticipant(self.selectedComment)
        .then(() => {
          UserCommentAboutParticipantService.showMsg('updateSuccessMessage');
          _loadNoteAboutParticipantDashboard();
          self.selectedComment = null;
          self.comment = "";
        })
        .catch(() => {
          UserCommentAboutParticipantService.showMsg('failureMessage');
        })
    }

    function saveUserCommentAboutParticipant() {
      if (self.selectedComment) {
        _updateUserCommentAboutParticipant();
      } else {
        UserCommentAboutParticipantService.saveUserCommentAboutParticipant({ comment: self.comment, recruitmentNumber: self.recruitmentNumber })
          .then(() => {
            UserCommentAboutParticipantService.showMsg('successUserCommentAboutParticipantCreation');
            self.comment = "";
            _loadNoteAboutParticipantDashboard();
          })
          .catch(() => {
            UserCommentAboutParticipantService.showMsg('failUserCommentAboutParticipantCreation');
          })
      }
    }

    function fillSelectedComment(itemComment) {
      if (self.selectedComment && self.selectedComment._id !== itemComment._id) {
        UserCommentAboutParticipantService.showMsg('conflictMessage');
        DialogService.showDialog(USER_COMMENT_MANAGER_LABELS.ATTRIBUTES_MESSAGE.confirmFillSelected)
          .then(function () {
            self.comment = itemComment.comment;
            self.selectedComment = itemComment;
            $element.find('#focus-textarea').focus();
          });
      } else {
        DialogService.showDialog(USER_COMMENT_MANAGER_LABELS.ATTRIBUTES_MESSAGE.confirmEditSelected)
          .then(function () {
            self.comment = itemComment.comment;
            self.selectedComment = itemComment;
            $element.find('#focus-textarea').focus();
          });
      }
    }

    function cancelFillSelectedComment() {
      self.comment = "";
      self.selectedComment = null;
    }

    function deleteSelectedComment(commentId) {
      DialogService.showDialog(USER_COMMENT_MANAGER_LABELS.ATTRIBUTES_MESSAGE.deleteUserCommentAboutParticipant)
        .then(function () {
          UserCommentAboutParticipantService.deleteSelectedComment(commentId)
            .then(() => {
              UserCommentAboutParticipantService.showMsg('deleteSuccessMessage');
              _loadNoteAboutParticipantDashboard();
            })
            .catch(() => {
              UserCommentAboutParticipantService.showMsg('failureMessage');
            })
        });
    }
  }
}());