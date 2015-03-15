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

const dataArray = size => {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(createObj(i));
    }
    return arr;
};

const dataList = size =>
    dataArray(size)
        .map((current, index, collection) =>
            current.set('next', collection[index + 1]))
        .get(0);

export default Ember.Object.create({
    dataArray, dataList,

    addToListFront(head) {

    },

    addToListEnd(head) {

    },

    addToArrayFront(array) {
        array.unshiftObject(createObj(array.get('0.id') - 1));
    },

    addToArrayEnd(array) {

    }
});
