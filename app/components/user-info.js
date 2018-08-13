Encompass.UserInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-info',
  isEditing: false,
  authorized: null,

  canEdit: Ember.computed('user.id', function () {
    let user = this.get('user');
    console.log('user is', user);
    let creator = user.get('createdBy.content.id');
    console.log('creator id is', creator);
    let currentUserId = this.get('currentUser').get('id');
    console.log('currentUserId is', currentUserId);
    let accountType = this.get('currentUser').get('accountType');
    let isAdmin = accountType === 'A';

    let canEdit = (creator === currentUserId ? true : false) || isAdmin;
    return canEdit;
  }),

  lastSeenDate: function () {
      var last = this.get('lastSeen');
      if (last) {
        return moment(last).fromNow();
      }
      return 'never';
    }.property('lastSeen'),

    tourDate: function () {
      var date = this.get('seenTour');
      if (date) {
        return moment(date).fromNow();
      }
      return 'no';
    }.property('user.seenTour'),

    authorizedBy: function () {
      let isAuth = this.get('user.isAuthorized');
      let authBy = this.get('user.authorizedBy');
      if (isAuth && !authBy) {
        let user = this.get('user');
        user.set('authorizedBy', this.get('currentUser'));
      }
    }.observes('user.isAuthorized'),

    actions: {
      editUser: function () {
        this.set('isEditing', true);
        let user = this.get('user');
        let isAuth = user.get('isAuthorized');
        this.set('authorized', isAuth);
      },

      saveUser: function () {
        let currentUser = this.get('currentUser');
        let newDate = new Date();
        let user = this.get('user');
        user.set('lastModifiedBy', currentUser);
        user.set('lastModifiedDate', newDate);

      //if is authorized is now true, then we need to set the value of authorized by to current user
        user.save();
        this.set('isEditing', false);
      },

      clearTour: function () {
        this.set('user.seenTour', null);
      },

      doneTour: function () {
        this.set('user.seenTour', new Date());
      }
    }
});

