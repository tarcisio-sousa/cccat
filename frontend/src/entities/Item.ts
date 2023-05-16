export default class Item {
    private quantity = 1;

    constructor (readonly idProduct: number) {

    }

    incrementalQuantity () {
        this.quantity++;
    }

    getQuantity () {
        return this.quantity;
    }
}