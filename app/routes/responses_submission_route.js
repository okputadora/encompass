Encompass.ResponsesSubmissionRoute = Encompass.AuthenticatedRoute.extend({
  utils: Ember.inject.service('utility-methods'),
  queryParams: {
    responseId: {
      refreshModel: true
    }
  },

  beforeModel(transition) {
    let responseId = transition.queryParams.responseId;
    if (this.get('utils').isValidMongoId(responseId)) {
      this.set('response', this.modelFor('responses').findBy('id', responseId));
    } else {
      this.set('response', null);
    }

  },
  model(params) {
    if (!params.submission_id) {
      return null;
    }

    return this.get('store').findRecord('submission', params.submission_id)
    .then((submission) => {
      let wsIds = submission.hasMany('workspaces').ids();
      let wsId = wsIds.get('firstObject');
      return Ember.RSVP.hash({
        submission,
        workspace: this.get('store').findRecord('workspace', wsId),
      });
    })
    .then((hash) => {
      return Ember.RSVP.hash({
        submission: hash.submission,
        workspace: hash.workspace,
        submissions: hash.workspace.get('submissions'),
      });
    })
    .then((hash) => {
      let studentSubmissions = hash.submissions.filterBy('student', hash.submission.get('student'));

      let associatedResponses = this.modelFor('responses').filter((response) => {
        let subId = response.belongsTo('submission').id();
        return subId === hash.submission.get('id');
      });
      let response = this.get('response');
      if (!this.get('response')) {
        response = associatedResponses
          .filterBy('responseType', 'mentor')
          .sortBy('createDate').get('lastObject');
      }

      return {
        submission: hash.submission,
        workspace: hash.workspace,
        submissions: studentSubmissions,
        responses: associatedResponses,
        response: response,
      };

    });
  },

  redirect(model, transition) {
    if (!model) {
      this.transitionTo('responses');
    }
  },
  actions: {
    toResponseSubmission(subId) {
      this.transitionTo('responses.submission', subId);
    },
    toResponse(submissionId, responseId) {
      this.transitionTo('responses.submission', submissionId, {queryParams: {responseId: responseId} });
    },
    toResponses() {
      this.transitionTo('responses');
    },
    toNewResponse: function(submissionId, workspaceId) {
      this.transitionTo('responses.new.submission', submissionId, {queryParams: {workspaceId: workspaceId}});
    }
  },

  renderTemplate() {
    this.render('responses/response');
  }
});