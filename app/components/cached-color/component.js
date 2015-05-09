import Ember from 'ember';

const CachedColorComponent = Ember.Component.extend({
    items: null,

    renderObserver: function () {
        this.rerender();
    }.observes('items.@each.template'),

    render(buffer) {
        const items = this.get('items');
        if (items) {
            items.forEach(item => buffer.push(item.get('template')));
        }
    }
});

export default CachedColorComponent;
