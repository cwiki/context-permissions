# Context Permissions
This library is intended to be a simple and efficent tool to use when working with complex application permissions.  

### How it works
1. The request/user provides *CONTEXT* to `cp.require(action, context)`
1. **ACTION** describes the *requirments*
1. **CONTEXT** may have roles **ROLES** and/or **PROPERTIES** to fulfill the *requirements*
1. If the **CONTEXT** satisfies the **ACTION** `cp.require(action, context)` returns *true*


## Getting Started
To start using context permissions provide a new instance of ContextPermissions with a **actionProfile**.  
`const cp = new ContextPermissions(actionProfile)`

glossary
* action : descriptive system actions
* scope : specific scoping for actions
* roles : represent a collection of actions
* cp : the Context Permission instance
* requires : the method to sanity check status
* context : represents this session/user properties
* cprm: context permission role memberships, name of the context property that roles are gather from
* actionProfile : describes the **ROLE** - **ACTION** relationships


Configuration
* action profile : OPTIONAL but RECOMMENDED. 
Stored JSON variable required to enable roles.

Include the library
``` 
const UserPermissions = require('context_permissions')
```


Defines the roles/actions. Actions SHOULD NOT overlap  
*note: avoid repeating actions, instead seperate actions into more roles*
```
const actionProfile = {
    treasurer: [
        'manage_money',
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

Represents the client state
```js
const context = {
    // these kinds of values can be used to assert ownership or membership to objects
    user: 32, 
    location: 'tokyo',

    // multi-memberships also accepted
    sub_locations: ['north', 'south', 'river'], 
    regions_codes: [362, 346, 123]
    cprm: {

        // these nexted values are assertions about the role
        board_member: ['farm', 'fishing'], 

        // true provides no assertions
        citizen: true
    }
}
```

Create a cp object
```js
const cp = new ContextPermissions(actionProfile)
```


simple use case
```js
if (cp.requires('vote', context)){
    // show voting dialog
}
```


lock by fixed context property
```js
if (cp.requires({location: 'new york'}, context)){
    // content only shown to users with the context.location === 'new york' 
}
```


lock by action and dynamic context property
```js
// this exerts that the user must have the vote action 
// and that their location must match the objProps.location
const objProps = {
    owner: 32, 
    location: 'tokyo'
}
if (cp.requires({action: 'vote', location: objProps.location}, context)){
    // the current context.location is 'tokyo'
    // so if this objProp is 'tokyo' and the user can vote they see this 
}
```



lock with many context, only requires 1 of the context claims IF 320 OR 346
```js
if (cp.requires({action: 'mayor', region_codes: [320, 346]}, context)){
    // only mayors with region_codes 320 OR 346
}
```

## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors
* **Cody Wikman** - <cwiki.tucson@gmail.com>

## License
Context Permissions is provided under the MIT [LICENSE](LICENSE)