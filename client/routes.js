Router.configure({
    layoutTemplate: 'layoutMain'
});

Router.route('/',function(){
        if (Meteor.userId()) {
            this.render('appHome');
        }
},{
        name:'home'
    }

);

Router.route('/about',function(){
        this.render('aboutPage');
    },{
        name:'aboutPage'
    }
);

Router.route('/app',function(){
        this.render('appHome');
    },{
        name:'appHome'
    }
);

Router.route('/sessions',function(){
        this.render('sessionsList');
    }, {
        name: 'sessionList'
    }
);

Router.route('/client',function(){
        this.render('clientProfile');
    }, {
        name: 'clientShow'
    }
);

Router.route('/activeClients',function(){
        this.render('clientList');
    }, {
        name: 'clientList'
    }
);

Router.route('/inactiveClients',function(){
        this.render('clientListInactive');
    }, {
        name: 'clientListInactive'
    }
);

Router.route('/addClient',function(){
        this.render('addClientForm');
    }, {
        name: 'addClient'
    }
);

Router.route('/editClient',function(){
        this.render('editClientForm');
    }, {
        name: 'editClient'
    }
);

Router.route('/viewProfile',function(){
        this.render('viewProfile');
    }, {
        name: 'viewProfile'
    }
);

Router.route('/editProfile',function(){
        this.render('editProfileForm');
    }, {
        name: 'editProfile'
    }
);

Router.route('/createSession',function(){
        this.render('createSessionForm');
    }, {
        name: 'createSession'
    }
);

Router.route('/editSession',function(){
        this.render('editSessionForm');
    }, {
        name: 'editSession'
    }
);

Router.route('/createAction',function(){
        this.render('createActionForm');
    }, {
        name: 'createAction'
    }
);

Router.route('/showAction',function(){
        this.render('showAction');
    }, {
        name: 'showAction'
    }
);

Router.route('/editAction',function(){
        this.render('editActionForm');
    }, {
        name: 'editAction'
    }
);

//Router.map('/signup',function(){
//        this.render('signup');
//    }
//);
//
//Router.route('/login',function(){
//        this.render('login');
//   }
//);

//Router.onBeforeAction(requireLogin, {except: ['home']});
