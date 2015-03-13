import Ember from 'ember';

const IndexController = Ember.Controller.extend({
    renderMethod: 'iterative',
    dataStructureSize: null,
    iterativeDataStructure: null,
    recursiveDataStructure: null,

    itemCountBreakover: function () {
        const size = this.get('iterativeDataStructure.length');
        if (size <= 10) {
            return "small";
        }
        else if (size <= 100) {
            return "medium";
        }
        else {
            return "large";
        }
    }.property('iterativeDataStructure.length'),

    recursiveRenderSelected: function () {
        return this.get('renderMethod') === 'recursive';
    }.property('renderMethod'),

    iterativeRenderSelected: function () {
        return this.get('renderMethod') === 'iterative';
    }.property('renderMethod'),

    customRenderSelected: function () {
        return this.get('renderMethod') === 'custom';
    }.property('renderMethod'),

    actions: {
        selectRender(type) {
            this.send('clear');
            this.set('renderMethod', type);
            this.send('run');
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
                const recursiveData = this.createRecursiveData(size);
                const iterativeData = this.createIterativeData(size);
                const customData = this.createCustomData(size);

                this.set('renderTime', null);
                const start = (new Date()).valueOf();

                this.set('recursiveDataStructure', recursiveData);
                this.set('iterativeDataStructure', iterativeData);
                this.set('customDataStructure', customData);

                Ember.run.scheduleOnce('afterRender', null, () => {
                    const end = (new Date()).valueOf();
                    this.set('renderTime', end - start);
                });
            }
        }
    },

    createIterativeData(size) {
        const arr = [];
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

    createCustomData(size) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Ember.Object.create({
                id: i,
                color: this.randomColor(),
                template: `<div class="color-component" style="background-color: ${this.randomColor()};">${i}</div>`
            }));
        }
        return arr;
    },

    randomColor() {
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }
});

export default IndexController;
