import '../../@polymer/polymer/polymer.js';
import { FirebaseCommonBehavior } from './firebase-common-behavior.js';
import './firebase-auth-script.js';
import { Polymer } from '../../@polymer/polymer/lib/legacy/polymer-fn.js';

Polymer({

  is: 'firebase-auth',

  behaviors: [
    FirebaseCommonBehavior
  ],

  properties: {
    /**
     * [`firebase.Auth`](https://firebase.google.com/docs/reference/js/firebase.auth.Auth) service interface.
     */
    auth: {
      type: Object,
      computed: '_computeAuth(app)',
      observer: '__authChanged'
    },

    /**
     * Default auth provider OAuth flow to use when attempting provider
     * sign in. This property can remain undefined when attempting to sign
     * in anonymously, using email and password, or when specifying a
     * provider in the provider sign-in function calls (i.e.
     * `signInWithPopup` and `signInWithRedirect`).
     *
     * Current accepted providers are:
     *
     * ```
     * 'facebook'
     * 'github'
     * 'google'
     * 'twitter'
     * ```
     */
    provider: {
      type: String,
      notify: true
    },

    /**
     * True if the client is authenticated, and false if the client is not
     * authenticated.
     */
    signedIn: {
      type: Boolean,
      computed: '_computeSignedIn(user)',
      notify: true
    },

    /**
     * The currently-authenticated user with user-related metadata. See
     * the [`firebase.User`](https://firebase.google.com/docs/reference/js/firebase.User)
     * documentation for the spec.
     */
    user: {
      type: Object,
      readOnly: true,
      value: null,
      notify: true
    },

    /**
     * When true, login status can be determined by checking `user` property.
     */
    statusKnown: {
      type: Boolean,
      value: false,
      notify: true,
      readOnly: true,
      reflectToAttribute: true
    }

  },

  /**
   * Authenticates a Firebase client using a new, temporary guest account.
   *
   * @return {Promise} Promise that handles success and failure.
   */
  signInAnonymously: function() {
    if (!this.auth) {
      return Promise.reject('No app configured for firebase-auth!');
    }

    return this._handleSignIn(this.auth.signInAnonymously());
  },

  /**
   * Authenticates a Firebase client using a custom JSON Web Token.
   *
   * @return {Promise} Promise that handles success and failure.
   */
  signInWithCustomToken: function(token) {
    if (!this.auth) {
      return Promise.reject('No app configured for firebase-auth!');
    }
    return this._handleSignIn(this.auth.signInWithCustomToken(token));
  },

  /**
   * Authenticates a Firebase client using an oauth id_token.
   *
   * @return {Promise} Promise that handles success and failure.
   */
  signInWithCredential: function(credential) {
    if (!this.auth) {
      return Promise.reject('No app configured for firebase-auth!');
    }
    return this._handleSignIn(this.auth.signInWithCredential(credential));
  },

  /**
   * Authenticates a Firebase client using a popup-based OAuth flow.
   *
   * @param  {?String} provider Provider OAuth flow to follow. If no
   * provider is specified, it will default to the element's `provider`
   * property's OAuth flow (See the `provider` property's documentation
   * for supported providers).
   * @return {Promise} Promise that handles success and failure.
   */
  signInWithPopup: function(provider) {
    return this._attemptProviderSignIn(this._normalizeProvider(provider), this.auth.signInWithPopup);
  },

  /**
   * Authenticates a firebase client using a redirect-based OAuth flow.
   *
   * @param  {?String} provider Provider OAuth flow to follow. If no
   * provider is specified, it will default to the element's `provider`
   * property's OAuth flow (See the `provider` property's documentation
   * for supported providers).
   * @return {Promise} Promise that handles failure. (NOTE: The Promise
   * will not get resolved on success due to the inherent page redirect
   * of the auth flow, but it can be used to handle errors that happen
   * before the redirect).
   */
  signInWithRedirect: function(provider) {
    return this._attemptProviderSignIn(this._normalizeProvider(provider), this.auth.signInWithRedirect);
  },

  /**
   * Authenticates a Firebase client using an email / password combination.
   *
   * @param  {!String} email Email address corresponding to the user account.
   * @param  {!String} password Password corresponding to the user account.
   * @return {Promise} Promise that handles success and failure.
   */
  signInWithEmailAndPassword: function(email, password) {
    return this._handleSignIn(this.auth.signInWithEmailAndPassword(email, password));
  },

  /**
   * Creates a new user account using an email / password combination.
   *
   * @param  {!String} email Email address corresponding to the user account.
   * @param  {!String} password Password corresponding to the user account.
   * @return {Promise} Promise that handles success and failure.
   */
  createUserWithEmailAndPassword: function(email, password) {
    return this._handleSignIn(this.auth.createUserWithEmailAndPassword(email, password));
  },

  /**
   * Sends a password reset email to the given email address.
   *
   * @param  {!String} email Email address corresponding to the user account.
   * @return {Promise} Promise that handles success and failure.
   */
  sendPasswordResetEmail: function(email) {
    return this._handleSignIn(this.auth.sendPasswordResetEmail(email));
  },
  
  /**
   * Unauthenticates a Firebase client.
   *
   * @return {Promise} Promise that handles success and failure.
   */
  signOut: function() {
    if (!this.auth) {
      return Promise.reject('No app configured for auth!');
    }

    return this.auth.signOut();
  },

  _attemptProviderSignIn: function(provider, method) {
    provider = provider || this._providerFromName(this.provider);
    if (!provider) {
      return Promise.reject('Must supply a provider for popup sign in.');
    }
    if (!this.auth) {
      return Promise.reject('No app configured for firebase-auth!');
    }

    return this._handleSignIn(method.call(this.auth, provider));
  },

  _providerFromName: function(name) {
    switch (name) {
      case 'facebook': return new firebase.auth.FacebookAuthProvider();
      case 'github': return new firebase.auth.GithubAuthProvider();
      case 'google': return new firebase.auth.GoogleAuthProvider();
      case 'twitter': return new firebase.auth.TwitterAuthProvider();
      default: this.fire('error', 'Unrecognized firebase-auth provider "' + name + '"');
    }
  },

  _normalizeProvider: function(provider) {
    if (typeof provider === 'string') {
      return this._providerFromName(provider);
    }
    return provider;
  },

  _handleSignIn: function(promise) {
    return promise.catch(function(err) {
      this.fire('error', err);
      throw err;
    }.bind(this));
  },

  _computeSignedIn: function(user) {
    return !!user;
  },

  _computeAuth: function(app) {
    return this.app.auth();
  },

  __authChanged: function(auth, oldAuth) {
    this._setStatusKnown(false);
    if (oldAuth !== auth && this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }

    if (this.auth) {
      this._unsubscribe = this.auth.onAuthStateChanged(function(user) {
        this._setUser(user);
        this._setStatusKnown(true);
      }.bind(this), function(err) {
        this.fire('error', err);
      }.bind(this));
    }
  }
});
