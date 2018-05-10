import '../../@polymer/polymer/polymer.js';
import { FirebaseCommonBehavior } from './firebase-common-behavior.js';
import './firebase-storage-script.js';

export const FirebaseStorageBehaviorImpl = {
  properties: {
    /**
      * Firebase storage instance
      *
      */
    storage : {
      type: Object,
      computed: '__computeStorage(app)'
    },

    /**
      * Firebase storage ref instance
      *
      */
    ref: {
      type: Object,
      computed: '__computeRef(storage, path)'
    },

    /**
     * Path to a Firebase storage root or endpoint. N.B. `path` is case sensitive.
     */
    path: {
      type: String,
      observer: '__pathChanged',
      value: null
    },

    /**
      * Forces every upload to be a unique file by adding a date of upload at the start of the file.
      *
      */
    forceUnique: {
      type: Boolean,
      value: false
    },

    /**
     * When true, will perform detailed logging.
     */
    log: {
      type: Boolean,
      value: false
    }
  },

  get zeroValue() {
    return [];
  },

  __put: function(path, file, metadata) {
    this._log('Putting Firebase file at', path ? this.path + '/' + path : this.path);
    if (file) {
      var newFilename = this.forceUnique ? Date.now().toString() + '-' + file.name : file.name;
      return path ? this.ref.root.child(path + '/' + newFilename).put(file, metadata) : this.ref.child(newFilename).put(file, metadata);
    }
    return path ? this.ref.child(path).delete() : this.ref.delete();
  },

  __putString: function(path, data, format, metadata) {
    this._log('Putting Firebase file at', path ? this.path + '/' + path : this.path);
    if (data) {
      var ref = path ? this.storage.ref().child(path) : this.ref;
      return ref.putString(data, format, metadata);
    }
    return path ? this.ref.child(path).delete() : this.ref.delete();
  },

  __computeStorage: function(app) {
    return app ? app.storage() : null;
  },

  __computeRef: function(storage, path) {
    if (storage == null ||
        path == null ||
        path.split('/').slice(1).indexOf('') >= 0) {
      return null;
    }
    return storage.ref(path);
  },

  __pathChanged: function(path) {},

  /**
   * A wrapper around `console.log`.
   */
  _log: function() {
    if (this.log) {
      console.log.apply(console, arguments);
    }
  }

};

export const FirebaseStorageBehavior = [
  FirebaseCommonBehavior,
  FirebaseStorageBehaviorImpl
];
