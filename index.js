module.exports = function (action, target, id, options) {
  options = options || {}

  options.mount = options.mount || 'model'

  // A message function can be given to generate error messages
  options.message = options.message || function (action, target, id) {
    return 'You are not allowed to ' + action + ' ' + target + ' ' + id
  }

  // Return the middleware function
  return function* (next) {
    // String id values could be special
    if (typeof id === 'string') {
      var prop = id.substr(1, id.length - 1)

      // If it starts with a colon, search params
      if (id[0] === ':') {
        id = this.params[prop]

      // If it starts with a question mark, search query
      } else if (id[0] === '?') {
        id = this.query[prop]
      }
    }

    // Use model class and id to find record
    var model = yield target.findById(id)
    this[options.mount] = model

    // Run the check on the request user, throwing if failed
    if ( ! (yield this.user.can(action, model))) {
      this.throw(401, options.message(action, target, id))
    }
  }
}
