Meteor.methods({
    addNewClient:function(clientData) {
        Accounts.createUser(clientData);

        //var user = Meteor.users.findOne({_id:clientData._id});
        //console.log(user._id);

        //Meteor.users.find({'profile.welcomeEmailSend':false}).observe({
        //    added:function(user){
        //        //var welcomeSent = this.profile.welcomeEmailSend;
        //        //if(!welcomeSent && user.profile.isClient && user.profile.isActive){
        //        //    var text = "Welcome to your Accountability Buddy, your account has been set up! Log in at the link below.";
        //        //    Email.send({
        //        //         html: Handlebars.templates['newClient']({ name: user.profile.name, username: user.username, password: user.profile.password, text:text }),
        //        //        from: "no-reply@accountabilitybuddy.biz",
        //        //        to: user.profile.email,
        //        //        subject: "Welcome to your Accountability Buddy",
        //        //        text: text
        //        //    });
        //        //    Meteor.users.update({_id:user._id},{$set:{'profile.welcomeEmailSend':true,'profile.password':""}});
        //        //}else {
        //        //    return false;
        //        //}
        //    }
        //})

    },
    updateClient:function(id,clientData){
        Meteor.users.update({_id:id}, {$set:clientData});
    },
    updateUser:function(id, userData){
        Meteor.users.update({_id:id},{$set:userData});
    },
    deleteClient:function(id){
        Meteor.users.remove(id);
    },
    updateProfile:function(id,profileData){
        Meteor.users.update({_id:id}, {$set:profileData});
    },
    insertAction:function(actionData){
       Actions.insert(actionData);
    },
    updateActions:function(id,actionData){
        Actions.update(id, {$set:actionData});
    },
    deleteActions:function(id){
        Actions.remove(id);
    },
    insertSession:function(sessionsData){
        Sessions.insert(sessionsData);
    },
    updateSessions:function(id,sessionsData){
        Sessions.update(id, {$set:sessionsData});
    },
    deleteSessions:function(id){
        Sessions.remove({clientID:id});
        Actions.remove({client:id});
    },
    deleteSingleSession:function(id){
        Sessions.remove(id);
        Actions.remove({sessionID:id});
    },
    updateActionStatus:function(id,statusData){
        Actions.update(id, {$set:statusData});
    },
    updateClientAlerts:function(id, profileData){
        Meteor.users.update({_id:id}, {$set:profileData});
    },
    removeClientAlert:function(id, profileData){
        Meteor.users.update({_id:id}, {$set:profileData});
    },
    sendEmail: function (userId, userEmail, from, subject, text, userName, tmpl, title) {
        check([userEmail, from, subject, text, title, userName], [String]);
        this.unblock();
        if (this.userId == userId) {
            Email.send({
                html: Handlebars.templates[tmpl]({ name: userName,text:text,title:title }),
                to: userEmail,
                from: from,
                replyTo: "no-reply@accountabilitybuddy.biz",
                subject: subject,
                text: text
            });
            console.log('sendEmail called');

        }
    },
    sendCoachEmail: function (userId, userEmail, from, subject, text, userName, coachName, tmpl, title,status,statusReason) {
        //check([userEmail, from, subject, text], [String]);
        this.unblock();
        if (this.userId == userId) {
            Email.send({
                html: Handlebars.templates[tmpl]({ name: coachName, clientname:userName, text:text,title:title,status:status,reason:statusReason }),
                to: userEmail,
                from: from,
                replyTo: from,
                subject: subject,
                text: text
            });

        }
    },
    removeAllUsers:function(){
        Meteor.users.remove({});
    }
});

