if(Meteor.isClient) {
    Session.setDefault('appName', 'Accountability Buddy');

    Template.siteNav.helpers({
        appName:function(){
            return Session.get('appName');
        }
    });
    //if(Meteor.user().profile.isClient){
    //    console.log("is client");
    //}else{
    //    console.log("is coach");
    //}

    Template.addClientForm.rendered = function (){
        $('#addUserForm').parsley({trigger: 'change'});
    };

    Template.editClientForm.rendered = function (){
        $('#editUserForm').parsley({trigger: 'change'});
    };

    //Template.createActionForm.rendered = function (){
    //    $('#newActionForm').parsley({trigger: 'change'});
    //};

    //Template.editActionForm.rendered = function (){
    //    $('#editActionForm').parsley({trigger: 'change'});
    //};



    UI.registerHelper('equals', function (a, b) {
        return a === b;
    });

    UI.registerHelper('pastDue',function(a){
       if(moment(a).format('YYYY/D/M') < moment().format('YYYY/D/M')){
           return 'past-due'
       }
    });

    UI.registerHelper('date', function (a){
        return moment(a).format('M/D/YYYY');
    });

    FlashMessages.configure({
        autoHide: true,
        hideDelay: 2000,
        autoScroll: true
    });

    Meteor.startup(function(){

    });

}

if(Meteor.isServer){
    //Meteor.users.allow({
    //    insert:function(userId){
    //        return true;
    //    }
    //});

    Meteor.startup(function(){
        process.env.MAIL_URL="smtp://tejas.monteverdi%40gmail.com:fordyl0307@smtp.gmail.com:465/";
    });

}

SinglePageLogin.config({
    loginTitle: '',
    signupTitle: '',
    forgotPasswordTitle: 'Retrieve password',
    canRetrievePassword: true,
    passwordSignupFields: 'USERNAME_ONLY',
    forbidClientAccountCreation: false,
    routeAfterLogin: '/app',
    routeAfterSignUp: '/editProfile',
    routeAfterLogout: '/',
    forceLogin: true,
    exceptRoutes: ['home', 'appHome']
});

getCoach = function(id){
    return Meteor.users.findOne({_id:id})
    //console.log('get coaches called');
};