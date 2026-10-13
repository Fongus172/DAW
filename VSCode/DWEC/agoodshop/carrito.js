export default class Carrito {

    #total;
    #productosEnCarrito;

    constructor() {
        this.#total = 0;
        this.#productosEnCarrito = [];
    }

    agregarProducto(producto) {

        const productoEncontrado = this.#productosEnCarrito.find(function (productoCarrito) {
            return productoCarrito.SKU === producto.SKU;
        });

        if (productoEncontrado === undefined) {
            this.#productosEnCarrito.push({
                SKU: producto.SKU,
                title: producto.title,
                price: producto.price,
                quantity: 0
            });
        }
    }

    actualizarUnidades(sku, unidades) {

        const producto = this.#productosEnCarrito.find(function (producto) {
            return producto.SKU === sku;
        });

        if (producto === undefined) {
            return;
        }

        if (unidades <= 0) {
            this.#productosEnCarrito = this.#productosEnCarrito.filter(function (producto) {
                return producto.KU !== sku;
            });
        } else {
            producto.quantity = unidades;
        }

        this.#recalcularTotal();
    }

    #recalcularTotal() {

        this.#total = 0;

        for (const producto of this.#productosEnCarrito) {
            this.#total += parseFloat(producto.price) * producto.quantity;
        }
    }

    obtenerCarrito() {
        return {
            total: this.#total,
            products: this.#productosEnCarrito
        };
    }

}