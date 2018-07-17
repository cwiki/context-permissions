# User Permissions
This project is intended to make it easy to create and scale permissions for applications

Keywords
* actions : descriptive system actions
* roles : represent a collection of actions
* state : formatted object properties
* up : the User Permission class
* requires : the method to sanity check status
* context : represents this session/user properties
* uprm: user permission role memberships, name of the context property that roles are gather from


Configuration
* action profile : a description of all roles and actions

Include the library
``` 
const UserPermissions = require('user_permissions')
```


defines the roles/actions. Actions SHOULD NOT overlap
```
const actionProfile = {
    treasurer: [
        'manage_money', // each role has many actions. Don't dupliate actions, divide roles instead
        'allocate_expenses',
        'purchases'
    ],
    citizen: [
        'vote'
    ]
    mayor: [
        'city_key'
    ],
    
}
```

represents the client state
```
const context = {
    user: 32, // these kinds of values can be used to assert ownership or membership to objects
    location: 'tokyo',
    sub_locations: ['north', 'south', 'river'], // multi-memberships also accepted
    regions_codes: [362, 346, 123]
    uprm: {
        board_member: ['farm', 'fishing'], // these nexted values are assertions about the role
        citizen: true, // true provides no assertions
    }
}
```

create a up object
```
const up = new UserPermissions(actionProfile)
```


simple use case
```
if (up.requires('vote', context)){
    // show voting dialog
}
```


lock by fixed context property
```
if (up.requires({location: 'new york'}, context)){
    // content only shown to users with the context.location === 'new york' 
}
```


lock by action and dynamic context property
```
// this exerts that the user must have the vote action & that their location must match the objProps.location
const objProps = {
    owner: 32, 
    location: 'tokyo'
}
if (up.requires({action: 'vote', location: objProps.location}, context)){
    // the current context.location is 'tokyo' so if this objProp is 'tokyo' and the user can vote they see this 
}
```



lock with many context, only requires 1 of the context claims IF 320 OR 346
```
if (up.requires({action: 'mayor', region_codes: [320, 346]}, context)){
    // only mayors with region_codes 320 OR 346
}
```