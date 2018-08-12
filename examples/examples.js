const assert = require('assert')
const { ContextPermissions } = require('../index')
let testResult
// include context permissions as a package in projects


// This should be supplied from you application. 
// It's should be a description of actions and roles allowed to perform them.

const ActionProfile = {
    blacksmith: [
        'make-sword',
        'sharpen-weapon'
    ],
    leatherworker: [
        'skin-creature',
        'make-armor-kit'
    ],
    crafter: [
        'use-workbench'
    ],
    fisherman: [
        'fish',
        'cook-fish'
    ],
    playable: [
        'attack',
        'eat',
        'sleep'
    ]
}

// In this examplew e will use Players
function Warrior(name) {
    return {
        name,
        // the cprm property represents CONTEXT PERMISSION ROLES MEMERSHIPS
        cprm:
        {
            blacksmith: true,
            crafter: true,
            playable: true
        },
        strength: 250,
        weapon: 'sword'
    }
}

function Leatherworker(name) {
    return {
        name,
        cprm:
        {
            leatherworker: true,
            crafter: true,
            playable: true
        },
        strength: 150,
        weapon: 'dagger'
    }
}

/**
 * 1. Basic CPRM
 * 2. Combination CPRM
 * 3. CPRM & Context
 */


// create a new permission object with the action profile
const cp = new ContextPermissions(ActionProfile);
const Player1 = Warrior('Jimmy')
const Player2 = Leatherworker('Stanley')

/**
 * Example 1 Basic CPRM
 * First let's sharpen a weapon
 * Only Player1 have the CPRM role of "blacksmith" that grants the sharpen weapon action
 */
testResult = cp.requires('sharpen-weapon', Player1) // true
assert.strictEqual(true, testResult)

testResult = cp.requires('sharpen-weapon', Player2) // false
assert.strictEqual(false, testResult)


/**
 * Example 2 Combination CPRM
 * Player one can still sharpen weapons AND he is allowed to use workbenches
 * Granted by blacksmith & crafter respectively
 * 
 * Conversely Player two is a crafter but not a blacksmith. So he is not allowed to use the workbench
 */
let sharpenWeaponWithWorkBench = ['sharpen-weapon', 'use-workbench']
testResult = cp.requires(...sharpenWeaponWithWorkBench, Player1) // true
assert.strictEqual(true, testResult)


testResult = cp.requires(['sharpen-weapon', 'use-workbench'], Player2) // false
assert.strictEqual(false, testResult)

/**
 * Example 3 CPRM & Context
 * Here we have a workbench that is only usable for daggers
 */
const WorkbenchForDaggers = { action: 'use-workbench', weapon: 'dagger' }

testResult = cp.requires(WorkbenchForDaggers, Player1) // false
assert.strictEqual(false, testResult)

/**
 * Example 4 CPRM for Player1 Only (jimmy)
 * Here we have a workbench that is only usable for daggers
 */
const JimmysWorkbench = { action: 'use-workbench', name: 'Jimmy' }

testResult = cp.requires(JimmysWorkbench, Player1) // true
assert.strictEqual(true, testResult)

testResult = cp.requires(JimmysWorkbench, Player2) // false
assert.strictEqual(false, testResult)
