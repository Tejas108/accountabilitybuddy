/**
 * Created by tejas on 11/15/14.
 */

Session.setDefault('loggedInUserId', Meteor.userId());
Session.setDefault('activeClient', null);
Session.setDefault('activeSession', null);
Session.setDefault('activeAction', null);
Session.setDefault('activeActionTitle', null);
Session.setDefault('clientName',null);
Session.setDefault('incSession',0);
Session.setDefault('sessionDeleteBtn', 'Select Session to Delete');
Session.setDefault('sessionEditBtn', 'Select Session to Edit');
Session.setDefault('isSessionDeleteBtn', 'off');
Session.setDefault('isSessionEditBtn', 'off');
Session.setDefault('isClient', false);
Session.setDefault('status', 'active');
Session.setDefault('actionStatus',null);
Session.setDefault('reasonStatus',null);


var msg = {
    // Confirm
    confirmActionDelete: "Are you sure you want to delete this Action Item?",
    confirmSessionDelete: "Are you sure you want to delete this Session?",
    confirmClientDelete: "Are you sure you want to delete this Client?",
    // Flash
    actionCreated: "Action Created!",
    actionSaved: "Action Updated!",
    actionDeleted: "Action Deleted!",
    sessionCreated: "Session Created!",
    sessionSaved: "Session Saved!",
    sessionDeleted: "Session Deleted!",
    sessionUpdated: "Session Updated!",
    statusUpdated: "Status Updated!",
    statusReset: "Status Reset!",
    clientCreated: "Client Created!",
    clientUpdated: "Client Updated!",
    clientDeleted: "Client Deleted",
    profileUpdated: "Your Profile is Updated!"
};

// Client Stuff

Template.addClientForm.events({
    'submit':function(e,t){
        e.preventDefault();
        var activeID = Meteor.userId();
        var dateCreated = moment().format('YYYY-M-D');
        var clientName = t.find('.clientName').value;
        var clientEmail = t.find('.clientEmail').value;
        var clientPhone = t.find('.clientPhone').value;
        var clientPassword = t.find('.clientPassword').value;
        var clientData = {
            username: t.find('.username').value,
            password:clientPassword,
            profile:{
                name:clientName,
                email:clientEmail,
                phone:clientPhone,
                isClient:true,
                isActive:true,
                addedBy: activeID,
                dateCreated:dateCreated,
                welcomeEmailSend:false
            }
        };

        Meteor.call('addNewClient',clientData);
        Router.go('clientList');
        FlashMessages.sendSuccess(msg.clientCreated);
        //sendEmail('newClient');
    },
    'click .cancel':function(e){
        e.preventDefault();
        Router.go('clientList');
    }
});


//Template.siteNav.helpers({
//    isClient:function(){
//        if(Meteor.user().profile.isClient){
//            return Meteor.user().profile.isClient;
//        }else{
//            return false;
//        }
//
//    }
//});

// Header Stuff
Template.siteNav.helpers({
    alertCount:function(){
        return Actions.find({alert:true}).count();
    },
    activeCount:function(){
        return Meteor.users.find({'profile.isActive':true,'profile.addedBy':Meteor.userId()}).count();
    },
    inactiveCount:function(){
        return Meteor.users.find({'profile.isActive':false, 'profile.addedBy':Meteor.userId()}).count();
    }
});

Template.siteNav.events({
    'click .logout': function(e){
        e.preventDefault();
        Meteor.logout();
        Router.go('/login');
    },
    'click .goback':function(e){
        e.preventDefault();
        history.go(-1);
    }
});


//Template.subHeaders.helpers({
//    isClient:function() {
//        if (Meteor.user()) {
//            if (Meteor.user().profile.isClient == true) {
//                //return true;
//                console.log('yes client');
//                Session.set('isClient',true);
//                return Session.get('isClient');
//            }else if(!Meteor.user().profile.isClient){
//                Session.set('isClient',true);
//                console.log('not client');
//            }
//        }
//
//    }
//});

// Retrieve Clients
Template.clientName.helpers({
    name:function(){
            var currentClient = Meteor.users.findOne({_id:Session.get('activeClient')},{'profile.addedBy':Meteor.userId()});
            return currentClient.profile.name;
        }
});

Template.clientList.helpers({
    client:function(){
        return Meteor.users.find({'profile.isActive':true,'profile.addedBy':Meteor.userId()})
    }
});

Template.clientListInactive.helpers({
    client:function(){
        return Meteor.users.find({'profile.isActive':false,'profile.addedBy':Meteor.userId()})
    }
});

Template.clientRow.events({
    'click .clientRow':function(){
        Session.set('activeClient', this._id);
        var activeClient = Session.get('activeClient');
        Router.go('clientShow',{_id: activeClient});
    }
});

Template.clientRow.helpers({
    status:function(){
        return Session.get('status');
    }
});

Template.editClientForm.helpers({
    client:function(){
        var id = Session.get('activeClient');
        return Meteor.users.findOne({_id:id},{'profile.addedBy':Meteor.userId()});
    }
});

Template.editClientForm.events({
    'click .save':function(e,t){
        e.preventDefault();
        var id = Session.get('activeClient');
        var activeID = Meteor.userId();
        var user = Meteor.users.findOne({_id:id});
        var status = user.profile.isActive;
        var date = moment().format('YYYY-M-D');
        var clientName = t.find('.name').value;
        var clientEmail = t.find('.email').value;
        var clientPhone = t.find('.phone').value;
        var clientStatus = $('#isActive option:selected').val();
        if(clientStatus === "true"){
            clientStatus = true;
            if(status !== clientStatus){
                sendEmail('statusActive');
                Session.set('statusChange', true);
            }else {
                Session.set('statusChange', false);
            }
        }else if(clientStatus === "false"){
            clientStatus = false;
            var alert = false;
            if(status !== clientStatus){
                sendEmail('statusInactive');
                Session.set('statusChange', true);
            }else {
                Session.set('statusChange', false);
            }
        }

        var clientData = {
                'profile.name':clientName,
                'profile.email':clientEmail,
                'profile.phone':clientPhone,
                'profile.updated_at':date,
                'profile.isActive':clientStatus,
                'profile.hasAlert':alert
        };
        Meteor.call('updateClient', id,clientData);
        if(!Session.get('statusChange')){
            sendEmail('updateProfile');
            Session.set('statusChange',false);
        }

        Router.go('clientShow');
        FlashMessages.sendSuccess(msg.clientUpdated);
    },
    'click .cancel':function(e){
        e.preventDefault();
        Router.go('clientList');
    },
    'click .delete':function(e){
        e.preventDefault();
        var id = Session.get('activeClient');
        bootbox.confirm(msg.confirmClientDelete,function(result){
            if(result === true){
                Meteor.call('deleteSessions',id);
                Meteor.call('deleteClient',id);
                FlashMessages.sendSuccess(msg.clientDeleted);
                Router.go('clientList');
            }
        });
    }
});

Template.viewProfile.helpers({
    viewProfile:function(){
        return Meteor.users.findOne(Meteor.userId());
    }
});

Template.viewProfile.events({
    'click .edit':function(e){
        e.preventDefault();
        Router.go('editProfile');
    }
});

Template.editProfileForm.helpers({
    profile:function(){
        return Meteor.users.findOne(Meteor.userId());
    }
});

Template.editProfileForm.events({
    'click .save':function(e,t){
        e.preventDefault();
        var id = Meteor.userId();
        var username = t.find('.username').value;
        var name = t.find('.name').value;
        var email = t.find('.email').value;
        var phone = t.find('.phone').value;
        var date = moment().format('YYYY-M-D');
        var userData = {
            username:username,
            'profile.name':name,
            'profile.email':email,
            'profile.phone':phone,
            'profile.updated_at':date

        };
        Meteor.call('updateUser', id, userData);
        FlashMessages.sendSuccess(msg.profileUpdated);
        Bender.go('viewProfile');
    }
});

// Check if client or not
//Template.appHome.helpers({
//    isClient:function() {
//        if (Meteor.user()) {
//            if (Meteor.user().profile.isClient) {
//                return Meteor.user().profile.isClient
//            }else{
//                return false;
//            }
//        }
//
//    }
//});

//Sessions
Template.createSessionForm.events({
    'click .addSession':function(e,t){
        e.preventDefault();
        var sessionData = {
            title: t.find('.stitle').value,
            description: t.find('.sdescription').value,
            clientID: Session.get('activeClient'),
            coachID: Meteor.userId(),
            dateCreated:moment().format('YYYY-M-D')
        };
        Sessions.insert(sessionData);
        Router.go('clientShow');
        FlashMessages.sendSuccess(msg.sessionCreated);

    },
    'click .cancelSession':function(e){
        e.preventDefault();
        Router.go('clientShow');
    }
});

Template.editSessionForm.helpers({
    sessionItem:function(){
        return Sessions.findOne(Session.get('activeSession'))
    }
});

Template.editSessionForm.events({
    'click .editSession':function(e,t){
        e.preventDefault();
        var sessionData = {
            title: t.find('.stitle').value,
            description: t.find('.sdescription').value
        };
        Meteor.call('updateSessions', this._id, sessionData);
        Router.go('clientShow');
        FlashMessages.sendSuccess(msg.sessionUpdated);
        Session.set('sessionEditBtn', 'Select Session to Edit');
    },
    'click .cancelSession':function(e){
        e.preventDefault();
        Router.go('clientShow');
    }
});

Template.clientProfile.helpers({
    name:function(){
        var currentClient = Meteor.users.findOne({_id:Session.get('activeClient')},{'profile.addedBy':Meteor.userId()});
        return currentClient.profile.name;
    },
    sessions:function(){
        //return Sessions.find({clientID:Session.get('activeClient')});
        return Sessions.find({clientID:Session.get('activeClient')},{sort:{title: -1}}).map(function(session, index) {
            session.inc = index;
            return session;
        });
    },
    actionItem:function(){
        var sessionID = Session.get('activeSession');
        return Actions.find({sessionID:sessionID},{sort:{dateCreated: -1}})
    },
    sessionDeleteBtn:function(){
        return Session.get('sessionDeleteBtn');
    },
    sessionEditBtn:function(){
        return Session.get('sessionEditBtn');
    },
    clientEditBtn:function(){
        return Session.get('activeClient');
    }

});

Template.clientProfile.events({
    'click .sessionItem':function(e){
        e.preventDefault();
        Session.set('activeSession',null);
        Session.set('activeSession', this._id);
    },
    'click .actionText':function(){
        var isClient = Meteor.users.find({'profile.isClient':Meteor.userId()});
        Session.set('activeAction',null);
        Session.set('activeAction', this._id);
        if(isClient == true){
            Session.set('isClient', true);
            Router.go('showAction', {_id:this._id});
        }else {
            Router.go('editAction', {_id:this._id});
        }
    },
    'click .sessionDelete':function(e){
        var id = $(e.currentTarget).attr("data");
        bootbox.confirm(msg.confirmSessionDelete,function(result){
            if(result === true){
                Sessions.remove({_id: id});
                FlashMessages.sendSuccess(msg.sessionDeleted);
                Session.set('sessionDeleteBtn', 'Select Session to Delete')
            }

        });
    },
    'click .showDeleteBtn':function(){
        Session.set('isSessionDeleteOn','on');
        $('.showEditBtn').prop('disabled',function(){
            return ! $(this).prop('disabled');
        });
            $('.sessionDelete').each(function(){
                $(this).toggle();
            });

        if(Session.get('sessionDeleteBtn') == 'Select Session to Delete'){
            Session.set('sessionDeleteBtn', 'Cancel Session Delete');
        }else if(Session.get('sessionDeleteBtn') == 'Cancel Session Delete') {
            Session.set('sessionDeleteBtn', 'Select Session to Delete');
        }
    },
    'click .createAction':function(e){
        var id = $(e.currentTarget).attr("data");
        Session.set('activeSession', id);
        Router.go('/createAction');
    },
    'click .inlineDeleteActionBtn':function(e){
        var id = $(e.currentTarget).attr("data");
        bootbox.confirm(msg.confirmActionDelete,function(result){
            if(result === true){
                Actions.remove({_id: id});
                FlashMessages.sendSuccess(msg.actionDeleted);
            }
        });
    },
    'click .sessionEdit':function(e){
        var id = $(e.currentTarget).attr("data");
        Session.set('activeSession', id);
        Router.go('editSession', {_id:id});
    },
    'click .showEditBtn':function(){
        Session.set('isSessionEditOn','on');
        $('.showDeleteBtn').prop('disabled',function(){
            return ! $(this).prop('disabled');
        });
            $('.sessionEdit').each(function(){
                $(this).toggle();
            });
        if(Session.get('sessionEditBtn') == 'Select Session to Edit'){
            Session.set('sessionEditBtn', 'Cancel Session Edit');
        }else if(Session.get('sessionEditBtn') == 'Cancel Session Edit'){
            Session.set('sessionEditBtn', 'Select Session to Edit');
        }
    },
    'click .editClient':function(e){
        var id = $(e.currentTarget).attr("data");
        Router.go('editClient', {_id:id});
    }
});



// Action Items
Template.showAction.helpers({
    actionItem:function(){
        return Actions.findOne(Session.get('activeAction'));
    }
});

Template.createActionForm.events({
    'click .addAction':function(e,t){
        e.preventDefault();
        var date = moment(t.find('#datepicker').value).format('YYYY-M-D');

        var actionData = {
            title: t.find('.atitle').value,
            description: t.find('.adescription').value,
            sessionID: Session.get('activeSession'),
            client:Session.get('activeClient'),
            dueDate: date
        };
        Session.set('activeActionTitle', actionData.title);
        Actions.insert(actionData);
        Router.go('clientShow');
        FlashMessages.sendSuccess(msg.actionCreated);
        sendEmail('newAction');
    },
    'click .cancelAction':function(e){
        e.preventDefault();
        Router.go('clientShow');
    }
});

Template.createActionForm.rendered = function(){
    $('#datepicker').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        autoclose: true,
        todayHighlight: true
    });
};

Template.editActionForm.helpers({
    actionItem:function(){
        return Actions.findOne(Session.get('activeAction'));
    }
});

Template.editActionForm.events({
    'click .editAction':function(e,t){
        e.preventDefault();
        var resetStatus = $('#resetStatus option:selected').val();
        var alert = false;
        var reason;
        var status;

        if(resetStatus === "yes"){
            alert = false;
            reason = "";
            status = "";
            statusVal = "";
            var profileData = {
                'profile.hasAlert': false
            };
            Meteor.call('removeClientAlert', Session.get('activeClient'), profileData);
            FlashMessages.sendSuccess(msg.statusReset);
        }else if(resetStatus === "no"){
            alert = true;
        }
        var date = moment(t.find('#datepicker').value).format('YYYY-M-D');
        var actionData = {
            title: t.find('.atitle').value,
            description: t.find('.adescription').value,
            alert: alert,
            status_reason: reason,
            status: status,
            //statusVal: statusVal,
            updated_at: date,
            dueDate: date
        };
        Session.set('activeActionTitle', actionData.title);
        Meteor.call('updateActions', this._id, actionData);
        Router.go('clientShow');
        FlashMessages.sendSuccess(msg.actionSaved);
        sendEmail('updateAction');
    },
    'click .deleteAction':function(e){
        e.preventDefault();
        var profileData = {
            'profile.hasAlert':false
        };

        bootbox.confirm(msg.confirmActionDelete,function(){
            Router.go('clientShow');
            Meteor.call('deleteActions',Session.get('activeAction'));
            Meteor.call('updateClientAlerts',Session.get('activeClient'),profileData);
        });
    },
    'click .cancelAction':function(e){
        e.preventDefault();
        Router.go('clientShow');
    }

});

Template.editActionForm.rendered = function(){
    $('#datepicker').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        autoclose: true,
        todayHighlight: true
    });
};

// Client's View page stuff

Template.clientSessionsList.helpers({
    sessions:function(){
        return Sessions.find({clientID:Meteor.userId()},{sort:{dateAdded: -1}}).map(function(session, index) {
            session.inc = index;
            return session;
        });
    },
    actionItem:function(){
        var sessionID = Session.get('activeSession');
        var actions= Actions.find({sessionID:sessionID},{sort:{dateCreated: -1}});
        return actions
    },
    overdueNotice:function(){
        var today = new Date();
    }
});

Template.statusList.helpers({
   statusItem:function(){
       return Status.find();
   }
});

Template.statusList.events({

   'click .save':function(e,t){
       e.preventDefault();
       var thisRow = $(e.currentTarget).parent();
       var status = thisRow.find('#status');
       //console.log($(e.currentTarget));
       var currentStatus = $(e.currentTarget).parent().find("#status option:selected").val();
       var currentStatusReason = $(e.currentTarget).parent().find('#statusReason').val();

       if(currentStatus === "" || currentStatusReason === ""){
           return false;
       }else{
           var statusText = $(e.currentTarget).parent().find("#status option:selected").text();
           var statusVal = $(e.currentTarget).parent().find("#status option:selected").val();
           status.hide();
           $(e.currentTarget).hide();
           //$(e.currentTarget).next().html("Action Item Status: <strong>" + statusText + "</strong>");
           //$('.itemStatus').show();

           var id = $(e.currentTarget).attr('data');
           var date = moment().format('YYYY-M-D');
           var statusData = {
               status:statusText,
               statusVal:statusVal,
               updated_at:date,
               alert:true,
               'status_reason': t.find('#statusReason').value
           };
           Session.set('actionStatus',statusData.status);
           Session.set('reasonStatus',statusData.status_reason);
           FlashMessages.sendSuccess(msg.statusUpdated);
           sendCoachEmail('updateStatus');
           Meteor.call('updateActionStatus', id, statusData);
           var profileData = {
               'profile.hasAlert': true
           };
           Meteor.call('updateClientAlerts', Meteor.userId(), profileData);
       }

   }
});

Template.statusListInactive.helpers({
    statusItem:function(){
        return StatusInactive.find();
    }
});

Template.statusListInactive.events({

    'click .save':function(e,t){
        e.preventDefault();
        var thisRow = $(e.currentTarget).parent();
        var status = thisRow.find('#status');
        //console.log($(e.currentTarget));
        var currentStatus = $(e.currentTarget).parent().find("#status option:selected").val();
        var currentStatusReason = $(e.currentTarget).parent().find('#statusReason').val();

        if(currentStatus === "" || currentStatusReason === ""){
            return false;
        }else{
            var statusText = $(e.currentTarget).parent().find("#status option:selected").text();
            var statusVal = $(e.currentTarget).parent().find("#status option:selected").val();
            status.hide();
            $(e.currentTarget).hide();
            //$(e.currentTarget).next().html("Action Item Status: <strong>" + statusText + "</strong>");
            //$('.itemStatus').show();

            var id = $(e.currentTarget).attr('data');
            var date = moment().format('YYYY-M-D');
            var statusData = {
                status:statusText,
                statusVal:statusVal,
                updated_at:date,
                alert:true,
                'status_reason': t.find('#statusReason').value
            };
            Meteor.call('updateActionStatus', id, statusData);
            var profileData = {
                'profile.hasAlert': true,
                'profile.isActive': true
            };
            Meteor.call('updateClientAlerts', Meteor.userId(), profileData);
        }

    }
});

Template.clientSessionsList.events({
    'click .sessionItem':function(e){
        e.preventDefault();
        Session.set('activeSession',null);
        Session.set('activeSession', this._id);
    },
    'click .clientActionText':function(e,t){
        e.preventDefault();
        Session.set('activeAction',null);
        //$(e.currentTarget).next('.actionDescriptionStatus p').show();
        var activeAction = this._id;
        Session.set('activeAction', activeAction);
        $(e.currentTarget).parent().parent().parent().find('.actionDescriptionStatus').fadeToggle('fast'); //TODO: Find better way for this
    }
});

// Coach landing page
Template.appHome.helpers({
    client:function(){
        return Meteor.users.find({'profile.hasAlert':true,'profile.addedBy':Meteor.userId()});
    },
    alertCount:function(){
        return Actions.find({client:Session.get('clientHasAlert'),alert:true}).count();
    }
});

Template.appHome.events({
    'click .client .client-alert-title':function(e,t){
        var id = $(e.currentTarget).attr('data');
        $('ul.actionList').hide();
        Session.set('activeClient', null);
        Session.set('activeClient', id);
        Session.set('clientHasAlert',null);
        Session.set('clientHasAlert', id);
        $(e.currentTarget).parent().find('ul.actionList').fadeToggle();
    }
});


Template.actionAlerts.helpers({
    alerts:function(){
        return Actions.find({client:Session.get('clientHasAlert'),alert:true},{sort:{'updated_at':1}});
    }
});

Template.actionAlerts.events({
    'click .edit':function(e){
        e.preventDefault();
        Session.set('activeAction',null);
        Session.set('activeAction', this._id);
        Router.go('editAction', {_id:this._id});
    }
});



//Email

var emailMsg = {
    //Coach-to-Client
    updateAction: "Your coach has updated the action, ",
    newAction: "Your coach has assigned a new action item, ",
    newClient: "Welcome to your Accountability Buddy! Your coach has set up your account and you can now log in at the link below.",
    updateProfile: "Your coach has updated your profile. Log in to your account to ensure the changes are correct.",
    clientStatusActive: "Your coach has changed your client status to active.",
    clientStatusInactive: "Your coach has changed your client status to inactive.",
    //Client-to-Coach
    clientUpdatedAction: "has updated the action, "
};


function sendEmail(action){
    var clientId = Session.get('activeClient');
    var user = Meteor.users.findOne({_id:clientId});
    var userName = user.profile.name;
    var userEmail = user.profile.email;
    var coachId = user.profile.addedBy;
    var coach = Meteor.users.findOne({_id:coachId});
    //var test = getCoach();
    //var testEmail = test.profile.email;

    var coachEmail = coach.profile.email;
    var title = "";
    //console.log(coachEmail);
    var actionTitle;
    var from = "no-reply@accountabilitybuddy.biz";
    var subject = "Notice from Accountability Buddy";
    switch(action) {
        case 'updateAction':
            var text = emailMsg.updateAction;
            var title = Session.get('activeActionTitle');
            var tmpl = 'actions';
            break;
        case 'newAction':
            var text = emailMsg.newAction;
            var title = Session.get('activeActionTitle');
            var tmpl = 'actions';
            break;
        case 'newClient':
            var text = emailMsg.newClient;
            var tmpl = 'newclient';
            break;
        case 'updateProfile':
            var text = emailMsg.updateProfile;
            var tmpl = 'default';
            break;
        case 'statusActive':
            var text = emailMsg.clientStatusActive;
            var tmpl = 'default';
            break;
        case 'statusInactive':
            var text = emailMsg.clientStatusInactive;
            var tmpl = 'default';
            break;
    }
//console.log(userEmail, from, subject, text, userName, tmpl, title);
    Meteor.call('sendEmail', Meteor.userId(), userEmail, from, subject, text, userName, tmpl, title);
}

function sendCoachEmail(action){
    var clientId = Meteor.userId();
    var user = Meteor.users.findOne({_id:clientId});
    var userName = user.profile.name;
    var userEmail = user.profile.email;
    var coachId = user.profile.addedBy;
    //var coach = Meteor.users.findOne({_id:coachId});
    var coach = Meteor.users.findOne({_id:coachId});
    var coachEmail = coach.profile.email;
    var coachName = coach.profile.name;
    //console.log(coachEmail);
    var actionTitle;
    var from = "no-reply@accountabilitybuddy.biz";
    var subject = "Notice from Accountability Buddy";
    switch(action) {
        case 'updateStatus':
            var text = emailMsg.clientUpdatedAction;
            var title = Session.get('activeActionTitle');
            var status = Session.get('actionStatus');
            var statusReason = Session.get('reasonStatus');
            var tmpl = 'client-actions';
            break;
    }

    Meteor.call('sendCoachEmail', Meteor.userId(), coachEmail, from, subject, text, userName, coachName, tmpl, title, status, statusReason);
}

