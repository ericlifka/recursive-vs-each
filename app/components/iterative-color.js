import Ember from 'ember';

const IterativeColorComponent = Ember.Component.extend({
    classNames: ['color-component'],
    attributeBindings: ['style'],
    item: null,

    style: function () {
        return `background-color: ${this.get('item.color')};`;
    }.property('item.color')
});

export default IterativeColorComponent;
