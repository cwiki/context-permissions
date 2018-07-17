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

const context = {
    user: 32,
    location: 'tokyo',
    sub_locations: ['north', 'south', 'river'],
    regions_codes: [362, 346, 123],
    uprm: {
        board_member: ['farm', 'fishing'],
        citizen: true,
    }
}


var up;
beforeEach(() => {
    up = new UserPermissions(actionProfile);
})


test('verifies the user has the vote action', () => {
    let context = {uprm:{vote: true}};
    expect(up.requires('vote', context)).toBeTruthy()
})

test('verifies the user does not have vote', () => {
    let context = {uprm:{}};
    expect(up.requires('vote', context)).toBeFalsy()
})