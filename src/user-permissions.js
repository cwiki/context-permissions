class UserPermissions {

    requires(action, context) {
        return context.uprm.vote
    }

}

module.exports = UserPermissions