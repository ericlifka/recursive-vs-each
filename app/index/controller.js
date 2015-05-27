import Ember from 'ember';

import Generators from '../utils/generators';

const IndexController = Ember.Controller.extend({
    data: null,
    dataStructureSize: null,
    itemCountBreakOver: 'large',

    renderPaneClass: Ember.computed('itemCountBreakOver', function () {
        return `render-pane ${this.get('itemCountBreakOver')}`;
    }),

    renderMethod: Ember.computed({
        get() {
            this.set('renderMethod', 'iterative');
            return 'iterative';
        },

        set(keyName, renderMethod) {
            this.setProperties({
                recursiveRenderSelected: renderMethod === 'recursive',
                iterativeRenderSelected: renderMethod === 'iterative',
                customRenderSelected: renderMethod === 'custom',
                cachedRenderSelected: renderMethod === 'cached'
            });

            return renderMethod;
        }
    }),

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
            else {
                this.setItemCountBreakOver(size);
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
    },

    setItemCountBreakOver(size) {
        if (size <= 10) {
            this.set('itemCountBreakOver', "small");
        }
        else if (size <= 100) {
            this.set('itemCountBreakOver', "medium");
        }
        else {
            this.set('itemCountBreakOver', "large");
        }
    }
});

export default IndexController;
