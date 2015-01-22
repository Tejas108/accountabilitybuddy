Meteor.methods({
    addNewClient:function(clientData) {
        Accounts.createUser(clientData);
        Meteor.users.find().observe({
            added:function(user){

                if(!user.profile.welcomeEmailSend){
                    var text = "Welcome to your Accountability Buddy!";
                    Email.send({
                        html: Handlebars.templates['newClient']({ name: user.username,text:text }),
                        from: "noreply@accountabilitybuddy.biz",
                        to: user.profile.email,
                        subject: "Welcome to your Accountability Buddy",
                        text: "Welcome !"
                    });
                    Meteor.users.update({_id:user._id},{$set:{'profile.welcomeEmailSend':true}});
                }else {
                    return false
                }
            }
        })

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
    updateActions:function(id,actionData){
        Actions.update(id, {$set:actionData});
    },
    deleteActions:function(activeAction){
        Actions.remove(activeAction);
    },
    updateSessions:function(id,sessionsData){
        Sessions.update(id, {$set:sessionsData});
    },
    deleteSessions:function(id){
        Sessions.remove({clientID:id});
        Actions.remove({client:id});
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
    }
});