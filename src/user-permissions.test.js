const UserPermissions = require('user-permissions')

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

var up;
beforeEach(() => {
    up = new UserPermissions(actionProfile);
})


test('require finds single uprm returns true', () => {
    // this context says that they are a user. Based on the action profile users are allowed to vote
    let userContext = { uprm: { citizen: true } };
    expect(up.requires('vote', userContext)).toEqual(true)
})

test('require does not find single uprm returns false', () => {
    // This context is empty, so they con't have the vote action
    let userContext = { uprm: {} };
    expect(up.requires('vote', userContext)).toEqual(false)
})

test('require returns true for multi matched context props', () => {
    // this userContext has a propery of region code. Both 362 and 451
    // Subsequently these action require the posession of each region code respectively
    let action = { region_code: 362 }
    let action2 = { region_code: 451 }
    let userContext = { region_code: [362, 451] }
    expect(up.requires(action, userContext)).toEqual(true)
    expect(up.requires(action2, userContext)).toEqual(true)
})

test('require returns true for single context / multi action props', () => {
    // this userContext has a propery of region code. Both 362 and 451
    // Subsequently these action require the posession of each region code respectively
    let action = { region_code: [362, 451] }
    let userContext = { region_code: 451 }
    expect(up.requires(action, userContext)).toEqual(true)
})


test('require returns false for action prop value not found', () => {
    // this userContext has a propery of region code. Both 362 and 451
    // Subsequently these action require the posession of each region code respectively
    let action = { region_code: [362, 451] }
    let userContext = { region_code: 400 }
    expect(up.requires(action, userContext)).toEqual(false)
})

test('require returns true for action and prop value matching', () => {
    // user must be a treasurer for the purchases action and have a region code of either 362, 451
    let action = { action: 'purchases', region_code: [362, 600] }
    let userContext = { uprm: {treasurer: true},  region_code: 600 }
    expect(up.requires(action, userContext)).toEqual(true)
})

test('require returns false for action, but bad prop value', () => {
    // user must be a treasurer for the purchases action and have a region code of either 362, 451
    let action = { action: 'purchases', region_code: [362, 451] }
    let userContext = { uprm: {treasurer: true},  region_code: 450 }
    expect(up.requires(action, userContext)).toEqual(false)
})


test('require returns true for objectProp value', () => {
    // user must be a treasurer for the purchases action and have a region code of either 362, 451
    const order = {
        city: 'tokyo'
    }
    const order2 = {
        city: 'miami'
    }
    let userContext = { uprm: {treasurer: true}, city: 'tokyo'}
    expect(up.requires({ action: 'purchases', city: order.city }, userContext)).toEqual(true)
    expect(up.requires({ action: 'purchases', city: order2.city }, userContext)).toEqual(false)
})

test('require returns true for UPRM scoping match', () => {
    // user must be a treasurer for the purchases action and have a region code of either 362, 451
    let action = { action: 'purchases', scope: 'fishing' }
    let userContext = { uprm: {treasurer: ['farming', 'fishing']}}
    expect(up.requires(action, userContext)).toEqual(true)
})

test('require returns false for UPRM scoping no match', () => {
    // user must be a treasurer for the purchases action and have a region code of either 362, 451
    let action = { action: 'purchases', scope: 'flying' }
    let userContext = { uprm: {treasurer: ['farming', 'fishing']}}
    expect(up.requires(action, userContext)).toEqual(false)
})