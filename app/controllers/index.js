import Ember from 'ember';

let IndexController = Ember.Controller.extend({
    renderMethod: 'iterative',
    dataStructureSize: null,
    iterativeDataStructure: null,
    recursiveDataStructure: null,

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
            this.set('iterativeDataStructure', null);
            this.set('recursiveDataStructure', null);
        },

        run() {
            let input = this.get('dataStructureSize') || "0";
            let size = parseInt(input, 10);

            this.set('iterativeDataStructure', this.createIterativeData(size));
            this.set('recursiveDataStructure', this.createRecursiveData(size));
        }
    },

    createIterativeData(size) {
        var arr = [];
        for (let i = 0; i < size.length; i++) {
            arr.push(Ember.Object.create({
                id: i,
                color: this.randomColor()
            }));
        }
        return arr;
    }
});

export default IndexController;
