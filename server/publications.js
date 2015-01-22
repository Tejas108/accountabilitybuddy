Meteor.publish('sessions',function(){
    return Sessions.find();
});

Meteor.publish('actions',function(){
        return Actions.find();
});

Meteor.publish('users',function(){
    //return Meteor.users.find({'profile.addedBy':this.userId},{sort:{'profile.name': 1}})
    return Meteor.users.find({},{sort:{'profile.name': 1}})
});

Meteor.publish('status',function(){
    return Status.find({},{sort:{dateCreated: -1}});
});

Meteor.publish('statusInactive',function(){
    return StatusInactive.find({},{sort:{dateCreated: -1}});
});

Meteor.publish('coaches',function(){
    return getCoach();
});

