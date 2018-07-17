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

// const userContext = {
//     user: 32,
//     location: 'tokyo',
//     sub_locations: ['north', 'south', 'river'],
//     regionscodes: [362, 346, 123],
//     uprm: {
//         board_member: ['farm', 'fishing'],
//         citizen: true,
//     }
// }


var up;
beforeEach(() => {
    up = new UserPermissions(actionProfile);
})


test('require finds single uprm returns true', () => {
    // this context says that they are a user. Based on the action profile users are allowed to vote
    let userContext = { uprm: { citizen: true } };
    expect(up.requires('vote', userContext)).toBeTruthy()
})

test('require does not find single uprm returns true', () => {
    // This context is empty, so they con't have the vote action
    let userContext = { uprm: {} };
    expect(up.requires('vote', userContext)).toBeFalsy()
})

test('require returns true for multi matched context props', () => {
    // this userContext has a propery of region code. Both 362 and 451
    // Subsequently these action require the posession of each region code respectively
    let action = { region_code: 362 }
    let action2 = { region_code: 451 }
    let userContext = { region_code: [362, 451] }
    expect(up.requires(action, userContext)).toBeTruthy()
    expect(up.requires(action2, userContext)).toBeTruthy()
})

test('require returns true for single context / multi action props', () => {
    // this userContext has a propery of region code. Both 362 and 451
    // Subsequently these action require the posession of each region code respectively
    let action = { region_code: [362, 451] }
    let userContext = { region_code: 451 }
    expect(up.requires(action, userContext)).toBeTruthy()
})


test('require returns false for action prop value not found', () => {
    // this userContext has a propery of region code. Both 362 and 451
    // Subsequently these action require the posession of each region code respectively
    let action = { region_code: [362, 451] }
    let userContext = { region_code: 400 }
    expect(up.requires(action, userContext)).toBeFalsy()
})