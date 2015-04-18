import Ember from 'ember';
import computed from 'ember-computed-decorators';

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

    @computed('renderMethod')
    recursiveRenderSelected(renderMethod) {
        return renderMethod === 'recursive';
    },

    @computed('renderMethod')
    iterativeRenderSelected(renderMethod) {
        return renderMethod === 'iterative';
    },

    @computed('renderMethod')
    customRenderSelected(renderMethod) {
        return renderMethod === 'custom';
    },

    @computed('renderMethod')
    cachedRenderSelected(renderMethod) {
        return renderMethod === 'cached';
    },

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

            const data = this.createData(size);
            this.runWithTiming(() =>
                this.set('data', data));
        },

        addFront() {
            this.runWithTiming(() =>
                this.get('recursiveRenderSelected') ?
                    Generators.addToListFront(this.get('data')) :
                    Generators.addToArrayFront(this.get('data')));
        },

        addEnd() {
            this.runWithTiming(() =>
                this.get('recursiveRenderSelected') ?
                    Generators.addToListEnd(this.get('data')) :
                    Generators.addToArrayEnd(this.get('data')));
        }
    },

    createData(size) {
        return this.get('recursiveRenderSelected') ?
            Generators.dataList(size) :
            Generators.dataArray(size);
    },

    runWithTiming(runnable) {
        this.set('renderTime', null);
        const start = new Date().valueOf();
        runnable();
        Ember.run.scheduleOnce('afterRender', () => {
            const end = new Date().valueOf();
            this.set('renderTime', end - start);
        });
    }
});

export default IndexController;
