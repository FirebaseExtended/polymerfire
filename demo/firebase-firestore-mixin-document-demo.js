import '../firebase-firestore-mixin.js';
import { Element } from '../../../@polymer/polymer/polymer-element.js';
class FirebaseFirestoreMixinDocumentDemo extends Polymer.FirestoreMixin(Element) {
  static get template() {
    return `
    <div>[[user.name]]</div>
`;
  }

  static get is() { return 'firebase-firestore-mixin-document-demo'; }
  static get properties() {
    return {
      uid: {
        type: String,
        value: 'mBylIa6HUTUU5e4npnoE',
      },
      user: {
        type: Object,
        doc: 'users/{uid}',
      }
    }
  }
}
customElements.define(FirebaseFirestoreMixinDocumentDemo.is, FirebaseFirestoreMixinDocumentDemo);
