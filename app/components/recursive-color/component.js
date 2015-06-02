import Ember from 'ember';

const RecursiveColorComponent = Ember.Component.extend({
    item: null,

    style: function () {
        return `background-color: ${this.get('item.color')};`.htmlSafe();
    }.property('item.color')
});

export default RecursiveColorComponent;
