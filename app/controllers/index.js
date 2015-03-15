import Ember from 'ember';
import Generators from '../utils/generators';

const IndexController = Ember.Controller.extend({
    renderMethod: 'iterative',
    dataStructureSize: null,
    data: null,

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

    cachedRenderSelected: function () {
        return this.get('renderMethod') === 'cached';
    }.property('renderMethod'),

    actions: {
        selectRender(type) {
            this.send('clear');
            this.set('renderMethod', type);
            Ember.run.scheduleOnce('afterRender', () => this.send('run'));
        },

        clear() {
            this.set('data', null);
            this.set('renderTime', null);
        },

        run() {
            const input = this.get('dataStructureSize') || "0";
            const size = parseInt(input, 10);
            if (size === 0) {
                this.send('clear');
                return;
            }

            this.set('renderTime', null);
            const data = this.createData(size);
            const start = (new Date()).valueOf();

            this.set('data', data);   // Trigger Render
            Ember.run.scheduleOnce('afterRender', () => {
                const end = (new Date()).valueOf();
                this.set('renderTime', end - start);
            });
        },

        addFront() {
            switch (this.get('renderMethod')) {
                case 'recursive':
                    this.addToListFront();
                    break;
                case 'iterative':
                case 'custom':
                case 'cached':
                    this.addToArrayFront();
                    break;
            }
        },

        addEnd() {
            switch (this.get('renderMethod')) {
                case 'recursive':
                    this.addToListEnd();
                    break;
                case 'iterative':
                case 'custom':
                case 'cached':
                    this.addToArrayEnd();
                    break;
            }
        }
    },

    createData(size) {
        switch (this.get('renderMethod')) {
            case 'recursive':
                return Generators.dataList(size);

            case 'iterative':
            case 'custom':
            case 'cached':
            default:
                return Generators.dataArray(size);
        }
    }
});

export default IndexController;
