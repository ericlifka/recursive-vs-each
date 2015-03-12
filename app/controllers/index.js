import Ember from 'ember';

let IndexController = Ember.Controller.extend({
    renderMethod: 'iterative',
    dataStructureSize: null,

    recursiveRenderSelected: function () {
        return this.get('renderMethod') === 'recursive';
    }.property('renderMethod'),

    iterativeRenderSelected: function () {
        return this.get('renderMethod') === 'iterative';
    }.property('renderMethod'),

    renderPaneLabel: function () {
        switch(this.get('renderMethod')) {
            case 'recursive': return "Recursive Render";
            case 'iterative': return "Iterative Render";
            default: return "No Render selected";
        }
    }.property('renderMethod'),

    actions: {
        selectRecursive() {
            this.set('renderMethod', 'recursive');
        },

        selectIterative() {
            this.set('renderMethod', 'iterative');
        },

        clear() {

        },

        run() {

        }
    }
});

export default IndexController;
