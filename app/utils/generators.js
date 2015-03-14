import Ember from 'ember';

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const createObj = id => Ember.Object.create({ id, color: randomColor() });

const dataArray = function (size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(createObj(i));
    }
    return arr;
};

export default Ember.Object.create({
    iterativeData: size => dataArray(size),
    customData: size => dataArray(size),

    recursiveData: size =>
        dataArray(size)
            .map((current, index, collection) => current.set('next', collection[index + 1]))
            .get(0),

    cachedData: size =>
        dataArray(size)
            .map(item => item.set(
                'template',
                `<div class="color-component" style="background-color: ${item.get('color')};">${item.get('id')}</div>`
            ))
});
