/**
 * Created by tejas on 1/19/15.
 */
Meteor.startup(function() {
    SyncedCron.add({
        name: 'Notify users about past-due actions',
        schedule: function (parser) {
            // check every day
            return parser.text('every day');
        },
        job: function () {
            var date = moment(new Date).format('YYYY-M-D');
            //if(Actions.find({dueDate: {$lt: date}}).count()){
            //    emailUsersAboutPastDueTasks()
            //}
            var past = Actions.find({dueDate: {$lt: date}}).fetch();
            var text = 'Your action item, ';
            var subject = 'Past due action item - Accountability Buddy';
            var tmpl = 'overdue-action';
            //console.log("pastDue: "+pastDueActions);
            for (var i = 0; i < past.length; i++) {
                //console.log(past[i].client);
                var user = Meteor.users.findOne({_id:past[i].client});
                var userName = user.profile.name;
                var userEmail = user.profile.email;
                var title = past[i].title;
                var from = 'no-reply@accountabilitybuddy.biz';
                sendNotify(userEmail, from, subject, text, userName, tmpl, title);
            }
        }
    });

    SyncedCron.start();

    sendNotify = function (userEmail, from, subject, text, userName, tmpl, title) {
        console.log('sendNotify called: email sent to '+userEmail);
        check([userEmail, from, subject, text, title, userName], [String]);
            Email.send({
                html: Handlebars.templates[tmpl]({ name: userName,text:text,title:title }),
                to: userEmail,
                from: from,
                replyTo: "no-reply@accountabilitybuddy.biz",
                subject: subject,
                text: text
            });
    }

});