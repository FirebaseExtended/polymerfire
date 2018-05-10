import '../../@polymer/polymer/polymer.js';
import { FirebaseCommonBehavior } from './firebase-common-behavior.js';
import './firebase-messaging-script.js';
import { Polymer } from '../../@polymer/polymer/lib/legacy/polymer-fn.js';
var stateMap = {};

/**
 *
 * @param {Object} app
 * @param {string} method
 * @param {...*} var_args
*/
function applyAll(app, method, var_args) {
  var args = Array.prototype.slice.call(arguments, 2);
  stateMap[app.name].instances.forEach(function(el) {
    el[method].apply(el, args);
  });
}

function refreshToken(app) {
  var state = stateMap[app.name];

  app.messaging().getToken().then(function(token) {
    applyAll(app, '_setToken', token);
    applyAll(app, '_setStatusKnown', true);
    return token;
  }, function(err) {
    applyAll(app, '_setToken', null);
    applyAll(app, '_setStatusKnown', true);
    applyAll(app, 'fire', 'error', err);
    throw err;
  });
}

function activateMessaging(el, app) {
  var name = app.name;

  stateMap[name] = stateMap[name] || {messaging: app.messaging()};
  var state = stateMap[name];

  state.instances = state.instances || [];
  if (state.instances.indexOf(el) < 0) {
    state.instances.push(el);
  }

  if (!state.listener) {
    state.listener = app.messaging().onMessage(function(message) {
      state.instances.forEach(function(el) {
        el._setLastMessage(message);
        el.fire('message', {message: message});
      });
    });
  }

  if (!state.tokenListener) {
    state.tokenListener = app.messaging().onTokenRefresh(function() {
      refreshToken(app);
    });
  }

  return refreshToken(app);
}

Polymer({
  is: 'firebase-messaging',

  behaviors: [
    FirebaseCommonBehavior,
  ],

  properties: {
    /**
     * The current registration token for this session. Save this
     * somewhere server-accessible so that you can target push messages
     * to this device.
     * @type {string|null}
     */
    token: {
      type: String,
      value: null,
      notify: true,
      readOnly: true,
    },
    /**
     * True when Firebase Cloud Messaging is successfully
     * registered and actively listening for messages.
     */
    active: {
      type: Boolean,
      notify: true,
      computed: '_computeActive(statusKnown, token)',
    },
    /**
     * True after an attempt has been made to fetch a push
     * registration token, regardless of whether one was available.
     */
    statusKnown: {
      type: Boolean,
      value: false,
      notify: true,
      readOnly: true,
    },
    /**
     * The most recent push message received. Generally in the format:
     *
     *     {
     *       "from": "<sender_id>",
     *       "category": "",
     *       "collapse_key": "do_not_collapse",
     *       "data": {
     *         "...": "..."
     *       },
     *       "notification": {
     *         "...": "..."
     *       }
     *     }
     */
    lastMessage: {
      type: Object,
      value: null,
      notify: true,
      readOnly: true,
    },
    /**
     * When true, Firebase Messaging will not initialize until `activate()`
     * is called explicitly. This allows for custom service worker registration.
     */
    customSw: {
      type: Boolean,
      value: false
    },
    /**
     * True if the Push API is supported in the user's browser.
     */
    pushSupported: {
      type: Boolean,
      value: function() {
        return ('serviceWorker' in navigator && 'PushManager' in window);
      },
      notify: true,
      readOnly: true
    }
  },

  observers: [
    '_bootstrapApp(app, customSw)'
  ],

  /**
   * Requests Notifications permission and returns a `Promise` that
   * resolves if it is granted. Resolves immediately if already granted.
   */
  requestPermission: function() {
    if (!this.messaging) {
      throw new Error('firebase-messaging: No app configured!');
    }

    return this.messaging.requestPermission().then(function() {
      return refreshToken(this.app);
    }.bind(this));
  },

  /**
   * When the `custom-sw` is added to `firebase-messaging`, this method
   * must be called after initialization to start listening for push
   * messages.
   *
   * @param {ServiceWorkerRegistration=}  swreg the custom service worker registration with which to activate
   */
  activate: function(swreg) {
    this.statusKnown = false;
    this.active = false;
    this.token = null;
    if (this.app) {
      this.messaging = this.app.messaging();
      if (swreg) {
        this.messaging.useServiceWorker(swreg);
      }
      activateMessaging(this, this.app);
    } else {
      this.messaging = null;
      this.statusKnown = false;
      this.active = false;
      this.token = null;
      return;
    }
  },

  _computeActive: function(statusKnown, token) {
    return !!(statusKnown && token);
  },

  _bootstrapApp: function(app, customSw) {
    if (app && !customSw) {
      this.activate();
    }
  },
});
