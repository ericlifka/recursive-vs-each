const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export default Ember.Object.create({
    iterativeData(size) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Ember.Object.create({
                id: i,
                color: randomColor()
            }));
        }
        return arr;
    },

    recursiveData(size) {
        const createObj = id => Ember.Object.create({
            id, color: randomColor()
        });

        const first = createObj(0);
        let current = first;
        for (let i = 1; i < size; i++) {
            current.next = createObj(i);
            current = current.next;
        }

        return first;
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
