export default class Carrito {

    #total;
    #productosEnCarrito;

    constructor() {
        this.#total = 0;
        this.#productosEnCarrito = [];
    }

    agregarProducto(producto) {

        const productoEncontrado = this.#productosEnCarrito.find(function (productoCarrito) {
            return productoCarrito.sku === producto.sku;
        });

        if (productoEncontrado === undefined) {
            this.#productosEnCarrito.push({
                sku: producto.sku,
                title: producto.title,
                price: producto.price,
                quantity: 0
            });
        }
    }

    actualizarUnidades(sku, unidades) {

        const producto = this.#productosEnCarrito.find(function (producto) {
            return producto.sku === sku;
        });

        if (producto === undefined) {
            return;
        }

        if (unidades <= 0) {

            this.#productosEnCarrito = this.#productosEnCarrito.filter(function (producto) {
                return producto.sku !== sku;
            });

        } else {

            producto.quantity = unidades;
        }

        this.#recalcularTotal();
    }

    #recalcularTotal() {

        this.#total = 0;

        this.#productosEnCarrito.forEach(function (producto) {
            this.#total += Number(producto.price) * producto.quantity;
        }, this);
    }

    obtenerCarrito() {

        return {
            total: this.#total,
            products: this.#productosEnCarrito
        };
    }
}