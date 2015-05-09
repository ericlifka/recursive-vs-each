import Ember from 'ember';

const CustomColorComponent = Ember.Component.extend({
    items: null,

    renderObserver: function () {
        this.rerender();
    }.observes('items.@each.color'),

    render(buffer) {
        const items = this.get('items');
        if (items) {
            items.forEach(item => buffer.push(this.getMarkup(item)));
        }
    },

    getMarkup(item) {
        return `
            <div class="color-component" style="background-color: ${item.get('color')};">
                    ${item.get('id')}
            </div>
        `;
    }
});

export default CustomColorComponent;
