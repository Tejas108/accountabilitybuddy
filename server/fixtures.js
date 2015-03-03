/**
 * Created by tejas on 11/15/14.
 */

if(Meteor.users.find().count() == 0){
    Meteor.users.insert({
        email: '1@1.com',
        password: 'letmein',
        profile:{
            name: 'Bilbo Baggins',
            phone: '5038883531',
            isClient: true,
            isActive: true,
            dateCreated: moment().format('YYYY-M-D')
        }

    });
    Meteor.users.insert({
        email: '2@2.com',
        password: 'letmein',
        profile:{
            name: 'frodo Baggins',
            phone: '5038883531',
            isClient: true,
            isActive: true,
            dateCreated: moment().format('YYYY-M-D')
        }

    });
    Meteor.users.insert({
        email: '3@4.com',
        password: 'letmein',
        profile:{
            name: 'Gandalf',
            phone: '5038883531',
            isClient: true,
            isActive: true,
            dateCreated: moment().format('YYYY-M-D')
        }

    });
}

if(Status.find().count() == 0){
    Status.insert({
        optionValue: '',
        text: 'Set A Status For This Action'
    });
    Status.insert({
        optionValue: 'hold',
        text: 'Put on Hold'
    });
    Status.insert({
        optionValue: 'phone',
        text: 'Call Me ASAP'
    });
    Status.insert({
        optionValue: 'schedule',
        text: 'Schedule an Appointment'
    });
    Status.insert({
        optionValue: 'time',
        text: 'I Need More Time'
    });
    Status.insert({
        optionValue: 'complete',
        text: 'Completed'
    });
}

if(StatusInactive.find().count() == 0){
    StatusInactive.insert({
        optionValue: '',
        text: 'Set A Status For This Action'
    });
    StatusInactive.insert({
        optionValue: 'hold',
        text: 'Put on Hold'
    });
    StatusInactive.insert({
        optionValue: 'phone',
        text: 'Call Me ASAP'
    });
    StatusInactive.insert({
        optionValue: 'schedule',
        text: 'Schedule an Appointment'
    });
    StatusInactive.insert({
        optionValue: 'time',
        text: 'I Need More Time'
    });
    StatusInactive.insert({
        optionValue: 'complete',
        text: 'Completed'
    });
}