"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * An slight modification of nodes default event emitter module.
 * Supports setting initial event values, that are emitted to all listeners
 * when they are registered. This makes it easier to create data bindings.
 */

var InitialsEmitter = function (_events$EventEmitter) {
  _inherits(InitialsEmitter, _events$EventEmitter);

  function InitialsEmitter() {
    _classCallCheck(this, InitialsEmitter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(InitialsEmitter).apply(this, arguments));
  }

  _createClass(InitialsEmitter, [{
    key: "setEventInitial",

    /**
     * Function to set an initial event value
     * @param {string} event - event name
     * @param {function|array|object} initial - initial event value
     * @returns {InitialsEmitter} this
     */
    value: function setEventInitial(event, initial) {
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

  }, {
    key: "removeEventInitial",
    value: function removeEventInitial(event) {
      this._initials = this._initials || {};
      delete this._initials[event];
      return this;
    }

    /**
     * @override
     */

  }, {
    key: "addListener",
    value: function addListener(event, listener, noinit) {
      return this.on(event, listener, noinit);
    }

    /**
     * @override
     */

  }, {
    key: "on",
    value: function on(event, listener, noinit) {
      this._initials = this._initials || {};
      if (!noinit && event in this._initials) {
        var initial = this._initials[event];
        var val = typeof initial === "function" ? initial(event) : initial;
        if (Array.isArray(val)) {
          applyWithoutChangingContext(listener, val);
        } else {
          listener(val);
        }
      }
      return _events2.default.EventEmitter.prototype.on.call(this, event, listener);
    }

    /**
     * @override
     */

  }, {
    key: "emit",
    value: function emit(event) {
      var _events$EventEmitter$;

      this._initials = this._initials || {};

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (args.length === 0 && event in this._initials) {
        var initial = this._initials[event];
        var val = typeof initial === "function" ? initial(event) : initial;
        if (Array.isArray(val)) {
          val.unshift(event);
          return _events2.default.EventEmitter.prototype.emit.apply(this, val);
        }
        return _events2.default.EventEmitter.prototype.emit.call(this, event, val);
      }
      return (_events$EventEmitter$ = _events2.default.EventEmitter.prototype.emit).call.apply(_events$EventEmitter$, [this, event].concat(args));
    }

    /**
     * Function to mixin the initials emitter into a class that extends another
     * class already
     * @param {function} clas - class to extend with the initials emitter
     * @returns {function} clas
     */

  }], [{
    key: "mixin",
    value: function mixin(clas) {
      for (var key in InitialsEmitter.prototype) {
        if (!clas.prototype[key]) {
          clas.prototype[key] = InitialsEmitter.prototype[key];
        }
      }
      return clas;
    }
  }]);

  return InitialsEmitter;
}(_events2.default.EventEmitter);

/**
 * Simple apply function to call a function with an list of arguments, without
 * changing the context of the function.
 * @method InitialsEmitter#applyWithoutChangingContext
 */


exports.default = InitialsEmitter;
function applyWithoutChangingContext(fn, args) {
  return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
}
