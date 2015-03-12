import Ember from 'ember';

const IndexController = Ember.Controller.extend({
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
            this.set('renderTime', null);
        },

        run() {
            let input = this.get('dataStructureSize') || "0";
            let size = parseInt(input, 10);
            if (size === 0) {
                this.send('clear');
            }
            else {
                this.set('renderTime', null);
                const start = (new Date()).valueOf();

                this.set('iterativeDataStructure', this.createIterativeData(size));
                this.set('recursiveDataStructure', this.createRecursiveData(size));

                Ember.run.scheduleOnce('afterRender', null, () => {
                    const end = (new Date()).valueOf();
                    this.set('renderTime', end - start);
                });
            }
        }
    },

    createIterativeData(size) {
        var arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Ember.Object.create({
                id: i,
                color: this.randomColor()
            }));
        }
        return arr;
    },

    createRecursiveData(size) {
        const createObj = id => Ember.Object.create({
            id, color: this.randomColor()
        });

        const first = createObj(0);
        let current = first;
        for (let i = 1; i < size; i++) {
            current.next = createObj(i);
            current = current.next;
        }

        return first;
    },

    randomColor() {
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }
});

export default IndexController;
