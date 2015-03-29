import Ember from 'ember';

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const createObj = id => Ember.Object.create({
    id,
    color: randomColor(),
    template: `
        <div class="color-component" style="background-color: ${randomColor()};">
            ${id}
        </div>
    `
});

const dataArray = size =>
    new Array(size)
        .fill(0)
        .map((val, index) =>
            createObj(index));

const dataList = size => Ember.Object.create({
    head: dataArray(size)
        .map((current, index, collection) =>
            current.set('next', collection[index + 1]))
        .get(0)
});

export default Ember.Object.create({
    dataArray,
    dataList,

    addToListFront: list =>
        list.set('head',
            createObj(list.get('head.id') - 1)
                .set('next', list.get('head'))),

    addToListEnd(head) {
    },

    addToArrayFront: array =>
        array.unshiftObject(createObj(array.get('firstObject.id') - 1)),

    addToArrayEnd: array =>
        array.pushObject(createObj(array.get('lastObject.id') + 1))
});
