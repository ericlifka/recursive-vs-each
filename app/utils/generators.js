export default Ember.Object.create({
    createIterativeData(size) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Ember.Object.create({
                id: i,
                color: this.randomColor()
            }));
        }
        return arr;
    },

    createRecursiveData(size) {
        const createObj = id => Ember.Object.create({
            id, color: this.randomColor()
        });

        const first = createObj(0);
        let current = first;
        for (let i = 1; i < size; i++) {
            current.next = createObj(i);
            current = current.next;
        }

        return first;
    },

    createCustomData(size) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Ember.Object.create({
                id: i,
                color: this.randomColor(),
                template: `<div class="color-component" style="background-color: ${this.randomColor()};">${i}</div>`
            }));
        }
        return arr;
    },

    randomColor() {
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }
});