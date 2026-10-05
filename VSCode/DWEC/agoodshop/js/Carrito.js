class Carrito {     // creacion de la clase

    constructor(productos) {        // constructor al crear un carrito con la lista de productos que le pasemos como parámetro
        this.productos = productos;

        this.productos.forEach(function (producto) {
            producto.quantity = 0;      // inicializar la cantidad de cada producto a 0
        });
    }

    actualizarUnidades(sku, unidades) {

        const producto = this.productos.find(function (producto) {
            return producto.SKU === sku;
        });

        if (producto !== undefined) {
            producto.quantity = unidades;
        }
    }

    obtenerInformacionProducto(sku) {

        const producto = this.productos.find(function (producto) {
            return producto.SKU === sku;
        });

        if (producto === undefined) {
            return undefined;
        }

        return {
            sku: producto.SKU,
            title: producto.title,
            price: producto.price,
            quantity: producto.quantity
        };
    }

    obtenerCarrito() {

        const productosCarrito = [];
        let total = 0;

        this.productos.forEach(function (producto) {

            if (producto.quantity > 0) {
                const precio = parseFloat(producto.price);
                const totalProducto = precio * producto.quantity;

                productosCarrito.push({
                    sku: producto.SKU,
                    title: producto.title,
                    price: precio,
                    quantity: producto.quantity,
                    total: totalProducto
                });

                total += totalProducto;
            }
        });

        return {
            total: total,
            currency: "€",
            products: productosCarrito
        };
    }
}


const productosPrueba = [
    {
        SKU: "0K3QOSOV4V",
        title: "iFhone 13 Pro",
        price: "938.99"
    },
    {
        SKU: "TGD5XORY1L",
        title: "Cargador",
        price: "49.99"
    },
    {
        SKU: "IOKW9BQ9F3",
        title: "Funda de piel",
        price: "79.99"
    }
];

const carrito = new Carrito(productosPrueba);

carrito.actualizarUnidades("0K3QOSOV4V", 3);
carrito.actualizarUnidades("TGD5XORY1L", 1);
carrito.actualizarUnidades("IOKW9BQ9F3", 2);

console.log(carrito.productos);

const informacion = carrito.obtenerInformacionProducto("0K3QOSOV4V");

console.log(informacion);

const informacionCarrito = carrito.obtenerCarrito();

console.log(informacionCarrito);