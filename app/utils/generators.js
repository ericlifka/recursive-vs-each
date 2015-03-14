import Ember from 'ember';

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const createObj = id => Ember.Object.create({ id, color: randomColor() });

const dataArray = function (size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Ember.Object.create({
            id: i,
            color: randomColor()
        }));
    }
    return arr;
};

export default Ember.Object.create({
    iterativeData(size) {
        return dataArray(size);
    },

    recursiveData(size) {
        return dataArray(size)
            .map((current, index, collection) => current.set('next', collection[index + 1]))
            .get(0);
    },

    customData(size) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Ember.Object.create({
                id: i,
                color: randomColor(),
                template: `<div class="color-component" style="background-color: ${randomColor()};">${i}</div>`
            }));
        }
        return arr;
    }
});
