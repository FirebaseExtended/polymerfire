import '../../@polymer/polymer/polymer.js';
import { FirebaseStorageBehavior } from './firebase-storage-behavior.js';
import { Polymer } from '../../@polymer/polymer/lib/legacy/polymer-fn.js';

/**
* The firebase-storage-upload-task element is an easy way to track upload tasks made
* by the firebase-storage-multiupload or the firebase-storage-ref
*
* For example:
*
*     <firebase-storage-upload-task
*       task="[[task]]"
*       bytes-transferred="{{bytesTransferred}}"
*       total-bytes="{{totalBytes}}"
*       state="{{state}}"
*       download-url="{{downloadUrl}}"
*       metadata="{{metadata}}"
*       path="{{path}}"></firebase-storage-upload-task>
*
* It has to get the upload task from either the firebase-storage-multiupload or firebase-storage-ref
* and produces data like bytes-transferred, total-bytes, states, etc...
*
* You can also use this element to cancel, pause, and resume a task.
*
*
* `<firebase-storage>` needs some information about how to talk to Firebase.
* Set this configuration by adding a `<firebase-app>` element anywhere in your
* app.
*/
Polymer({
  is: 'firebase-storage-upload-task',

  properties: {
    /**
    *  The upload task that is being tracked
    */
    task: {
      type: Object,
      value: null,
      observer: '_taskChanged'
    },

    /**
    *  Number of bytes transferred
    */
    bytesTransferred: {
      type: Number,
      notify: true
    },

    /**
    *  Total number of bytes of the file
    */
    totalBytes: {
      type: Number,
      notify: true
    },

    /**
    *  The upload task's state
    */
    state: {
      type: Object,
      notify: true
    },

    /**
    *  The download url of the file
    */
    downloadUrl: {
      type: String,
      notify: true
    },

    /**
    *  The metadata of the file
    */
    metadata: {
      type: Object,
      notify: true
    },

    /**
    *  The firebase storage path of the file
    */
    path: {
      type: String,
      notify: true
    },

    /**
    *  The current snapshot of the task
    */
    snapshot: {
      type: Object,
      notify: true
    }
  },

  behaviors: [
    FirebaseStorageBehavior
  ],

  /**
  * @override
  */
  get zeroValue() {
    return [];
  },

  _updateProperties: function(snapshot) {
    this.state = snapshot.state;
    this.totalBytes = snapshot.totalBytes;
    this.bytesTransferred = snapshot.bytesTransferred;
    this.downloadUrl = snapshot.downloadURL;
    this.metadata = snapshot.metadata;
    this.path = snapshot.ref.fullPath;
    this.snapshot = snapshot;
  },

  _taskChanged: function(task) {
    this._updateProperties(task.snapshot);
    task.on(firebase.storage.TaskEvent.STATE_CHANGED,
      this._updateProperties.bind(this), function(error) {
        this._updateProperties(task.snapshot)
        this.fire('error', error, { bubble: false});
      }.bind(this), function() {
        this._updateProperties(task.snapshot)
      }.bind(this));
  },

  /**
  *  Cancels the upload
  */
  cancel: function() {
    return this.task ? this.task.cancel() : new Promise(function(resolve, reject) {
      reject('No task included')
    });
  },

  /**
  *  Resumes a paused upload
  */
  resume: function() {
    return this.task ? this.task.resume() : new Promise(function(resolve, reject) {
      reject('No task included')
    });
  },

  /**
  *  Pauses the upload
  */
  pause: function() {
    return this.task ? this.task.pause() : new Promise(function(resolve, reject) {
      reject('No task included')
    });
  }
});
