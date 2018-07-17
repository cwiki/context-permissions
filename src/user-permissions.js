class UserPermissions {

    constructor(actionProfile) {
        const map = new Map()
        for (let role in actionProfile) {
            actionProfile[role].forEach(action => map.set(action, role))
        }
        this.profile = map
    }

    /**
     * 
     * @param {*} action the requested action. May be a string or object containg many requirements
     * @param {*} context the user text 
     */
    requires(action, context) {
        return (typeof action === 'string') ? this._shallowResolve(action, context) : this._deepResolve(action, context)
    }


    // resolve simple actions by confirm the context has the action as a property
    _shallowResolve(action, context) {
        let requiredRole = this.profile.get(action)
        return (context.uprm && context.uprm[requiredRole]) ? true : false
    }

    // performs deep resolve for properties and multi action
    _deepResolve(action, context) {
        // role checking
        if (action.action) {
            if (!this._shallowResolve(action.action, context)) {
                return false
            }
        }
        // checking each of the actions FAIL if any false
        for (let act in action) {
            if (act === 'action'){
                continue
            }
            // if not exists false
            if (!context[act]) {
                return false
            }
            if (!this._contextFoundInAction(action[act], context[act])) {
                return false
            }
        }
        return true
    }

    _contextFoundInAction(actionValue, contextValue) {
        let av = [].concat(actionValue)
        let cv = [].concat(contextValue)
        let ans = cv.reduce((accum, v) => {
            if (av.includes(v)) {
                accum = true
            }
            return accum
        }, false)
        return ans
    }
}

module.exports = UserPermissions