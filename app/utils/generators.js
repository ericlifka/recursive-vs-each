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

const getLast = list => !list.get('next') ? list : getLast(list.get('next'));

const addToListFront = list =>
    list.set('head',
        createObj(list.get('head.id') - 1)
            .set('next', list.get('head')));

const addToListEnd = list => {
    let last = getLast(list.get('head'));
    last.set('next', createObj(last.get('id') + 1));
};

const addToArrayFront = array =>
    array.unshiftObject(createObj(array.get('firstObject.id') - 1));

const addToArrayEnd = array =>
    array.pushObject(createObj(array.get('lastObject.id') + 1));

export default Ember.Object.create({
    dataArray,
    dataList,
    addToListFront,
    addToListEnd,
    addToArrayFront,
    addToArrayEnd
});
