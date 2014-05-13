# corm-can-koa

This is a simple module for generating koa-compatible middleware to add access control to particular routes using a user model loaded at `this.user` with the `can()` method attached. See [corm-can](https://github.com/Qard/corm-can) for details on how to attach the `can()` method.

# Usage

Once your user model is mounted and has the `can()` method available, you can simply do this;

```js
const can = require('corm-can-koa')

// Make an app with some sort of chainable router that populates this.params.
const app = require('koa')()
app.use(require('koa-router')(app))

// Load the user into this.user somehow
app.use(sessionUserLoader())

app.get('/users/:id', can('view', User, ':id'), function* (next) {
  // You'll only get here if you have the right permissions.
  // This will user the `id` value in this.params and the
  // User model to find and mount the record at this.model.
  // You can also do `?id` to search the query object instead.
})
```
