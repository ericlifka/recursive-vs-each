import Ember from 'ember';

let IndexController = Ember.Controller.extend({
    renderMethod: 'iterative',

    recursiveRenderSelected: function () {
        return this.get('renderMethod') === 'recursive';
    }.property('renderMethod'),

    iterativeRenderSelected: function () {
        return this.get('renderMethod') === 'iterative';
    }.property('renderMethod'),

    actions: {
        selectRecursive() {
            this.set('renderMethod', 'recursive');
        },

        selectIterative() {
            this.set('renderMethod', 'iterative');
        }
    }
});

export default IndexController;
