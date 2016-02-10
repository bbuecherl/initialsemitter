import events from "events";

/**
 * An slight modification of nodes default event emitter module.
 * Supports setting initial event values, that are emitted to all listeners
 * when they are registered. This makes it easier to create data bindings.
 */
export default class InitialsEmitter extends events.EventEmitter {
  /**
   * Function to set an initial event value
   * @param {string} event - event name
   * @param {function|array|object} initial - initial event value
   * @returns {InitialsEmitter} this
   */
  setEventInitial(event, initial) {
    this._initials = this._initials || {};
    this._initials[event] = initial;
    this.emit(event);
    return this;
  }

  /**
   * Function to remove an initial event value
   * @param {string} event - event name
   * @returns {InitialsEmitter} this
   */
  removeEventInitial(event) {
    this._initials = this._initials || {};
    delete this._initials[event];
    return this;
  }

  /**
   * @override
   */
  addListener(event, listener, noinit) {
    return this.on(event, listener, noinit);
  }

  /**
   * @override
   */
  on(event, listener, noinit) {
    this._initials = this._initials || {};
    if (!noinit && event in this._initials) {
      let initial = this._initials[event];
      let val = typeof initial === "function" ? initial(event) : initial;
      if (Array.isArray(val)) {
        applyWithoutChangingContext(listener, val);
      } else {
        listener(val);
      }
    }
    return events.EventEmitter.prototype.on.call(this, event, listener);
  }

  /**
   * @override
   */
  emit(event, ...args) {
    this._initials = this._initials || {};
    if (args.length === 0 && event in this._initials) {
      let initial = this._initials[event];
      let val = typeof initial === "function" ? initial(event) : initial;
      if (Array.isArray(val)) {
        val.unshift(event);
        return events.EventEmitter.prototype.emit.apply(this, val);
      }
      return events.EventEmitter.prototype.emit.call(this, event, val);
    }
    return events.EventEmitter.prototype.emit.call(this, event, ...args);
  }

  /**
   * Function to mixin the initials emitter into a class that extends another
   * class already
   * @param {function} clas - class to extend with the initials emitter
   * @returns {function} clas
   */
  static mixin(clas) {
    for (var key in InitialsEmitter.prototype) {
      if (!clas.prototype[key]) {
        clas.prototype[key] = InitialsEmitter.prototype[key];
      }
    }
    return clas;
  }
}

/**
 * Simple apply function to call a function with an list of arguments, without
 * changing the context of the function.
 * @method InitialsEmitter#applyWithoutChangingContext
 */
function applyWithoutChangingContext(fn, args) {
  return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6],
      args[7], args[8], args[9])
}
