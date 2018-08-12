const { ContextPermissions } = require('context-permissions')

const actionProfile = {
    treasurer: [
        'manage_money',
        'allocate_expenses',
        'purchases'
    ],
    citizen: [
        'vote'
    ],
    mayor: [
        'city_key'
    ],

}

let cp;
beforeEach(() => {
    cp = new ContextPermissions(actionProfile);
})


test('require finds single cprm returns true', () => {
    // this context says that they are a user. Based on the action profile users are allowed to vote
    let userContext = { cprm: { citizen: true } };
    expect(cp.requires('vote', userContext)).toEqual(true)
})

test('require does not find single cprm returns false', () => {
    // This context is empty, so they con't have the vote action
    let userContext = { cprm: {} };
    expect(cp.requires('vote', userContext)).toEqual(false)
})

test('require returns true for multi matched context props', () => {
    // this userContext has a propery of region code. Both 362 and 451
    // Subsequently these action require the posession of each region code respectively
    let action = { region_code: 362 }
    let action2 = { region_code: 451 }
    let userContext = { region_code: [362, 451] }
    expect(cp.requires(action, userContext)).toEqual(true)
    expect(cp.requires(action2, userContext)).toEqual(true)
})

test('require returns true for single context / multi action props', () => {
    // this userContext has a propery of region code. Both 362 and 451
    // Subsequently these action require the posession of each region code respectively
    let action = { region_code: [362, 451] }
    let userContext = { region_code: 451 }
    expect(cp.requires(action, userContext)).toEqual(true)
})


test('require returns false for action prop value not found', () => {
    // this userContext has a propery of region code. Both 362 and 451
    // Subsequently these action require the posession of each region code respectively
    let action = { region_code: [362, 451] }
    let userContext = { region_code: 400 }
    expect(cp.requires(action, userContext)).toEqual(false)
})

test('require returns true for action and prop value matching', () => {
    // user must be a treasurer for the purchases action and have a region code of either 362, 451
    let action = { action: 'purchases', region_code: [362, 600] }
    let userContext = { cprm: { treasurer: true }, region_code: 600 }
    expect(cp.requires(action, userContext)).toEqual(true)
})

test('require returns false for action, but bad prop value', () => {
    // user must be a treasurer for the purchases action and have a region code of either 362, 451
    let action = { action: 'purchases', region_code: [362, 451] }
    let userContext = { cprm: { treasurer: true }, region_code: 450 }
    expect(cp.requires(action, userContext)).toEqual(false)
})


test('require returns true for objectProp value', () => {
    const order = {
        city: 'tokyo'
    }
    const order2 = {
        city: 'miami'
    }
    let userContext = { cprm: { treasurer: true }, city: 'tokyo' }
    expect(cp.requires({ action: 'purchases', city: order.city }, userContext)).toEqual(true)
    expect(cp.requires({ action: 'purchases', city: order2.city }, userContext)).toEqual(false)
})

test('require returns true for cprm scoping match', () => {
    let action = { action: 'purchases', scope: 'fishing' }
    let userContext = { cprm: { treasurer: ['farming', 'fishing'] } }
    expect(cp.requires(action, userContext)).toEqual(true)
})

test('require returns false for cprm scoping no match', () => {
    let action = { action: 'purchases', scope: 'flying' }
    let userContext = { cprm: { treasurer: ['farming', 'fishing'] } }
    expect(cp.requires(action, userContext)).toEqual(false)
})

test('allows multiple actions to be passed ot require, acts as a OR operation', () => {
    // adding the ability to pass an array of actions as a or statement
    let action = ['purchases', { city: 'tokyo' }]
    let userContext = { cprm: { treasurer: true } }
    expect(cp.requires(...action, userContext)).toEqual(true)
    expect(cp.requires(...action.reverse(), userContext)).toEqual(true)
})
