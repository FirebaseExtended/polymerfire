import '../firebase-firestore-mixin.js';
import { Element } from '../../../@polymer/polymer/polymer-element.js';
class FirebaseFirestoreMixinCollectionDemo extends Polymer.FirestoreMixin(Element) {
  static get template() {
    return `
    <ul>
    <dom-repeat items="[[users]]"><template>
      <li>[[item.name]]</li>
    </template></dom-repeat>
    </ul>
`;
  }

  static get is() { return 'firebase-firestore-mixin-collection-demo'; }
  static get properties() {
    return {
      users: {
        type: Array,
        collection: 'users',
        query: q => q.orderBy('name')
      }
    }
  }
}
customElements.define(FirebaseFirestoreMixinCollectionDemo.is, FirebaseFirestoreMixinCollectionDemo);
