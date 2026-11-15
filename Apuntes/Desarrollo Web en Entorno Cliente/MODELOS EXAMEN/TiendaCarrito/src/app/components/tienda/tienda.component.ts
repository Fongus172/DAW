import { Component } from "@angular/core";
import { IProducto } from "../../interfaces/iproducto.interface";
import { IProductoCarrito } from "../../interfaces/iproducto-carrito.interface";

@Component({
    selector: "app-tienda",
    imports: [],
    templateUrl: "./tienda.component.html",
    styleUrl: "./tienda.component.css",
})
export class TiendaComponent {
    // Catálogo de productos disponibles en la tienda.
    productos: IProducto[];

    // El carrito empieza vacío y solo contiene productos que el usuario haya añadido.
    productosEnCarrito: IProductoCarrito[];

    // Guardamos el símbolo de moneda para no escribirlo a mano en muchos sitios.
    moneda: string;

    constructor() {
        /*
         * Datos iniciales inspirados en el BackCarrito utilizado en clase.
         * Aquí están escritos directamente porque ESTE proyecto no estudia fetch todavía.
         */
        this.productos = [
            {
                sku: "0K3QOSOV4V",
                titulo: "iFhone 13 Pro",
                precio: 938.99,
                stock: 4,
                categoria: "Telefonía",
            },
            {
                sku: "TGD5XORY1L",
                titulo: "Cargador",
                precio: 49.99,
                stock: 8,
                categoria: "Accesorios",
            },
            {
                sku: "IOKW9BQ9F3",
                titulo: "Funda de piel",
                precio: 79.99,
                stock: 3,
                categoria: "Accesorios",
            },
            {
                sku: "G4K8V9N2B1",
                titulo: "Laptop UltraSlim",
                precio: 1299.99,
                stock: 2,
                categoria: "Informática",
            },
            {
                sku: "A9T5F0Y3E2",
                titulo: "Teclado Mecánico RGB",
                precio: 119.99,
                stock: 5,
                categoria: "Informática",
            },
            {
                sku: "M2R6W1C4O8",
                titulo: "Ratón Ergonómico Inalámbrico",
                precio: 59.95,
                stock: 6,
                categoria: "Informática",
            },
        ];

        this.productosEnCarrito = [];
        this.moneda = "€";
    }

    /*
     * Añade UNA unidad de un producto al carrito.
     * Aquí aparecen varios patrones muy típicos de examen:
     * - find() para buscar un elemento.
     * - comprobar undefined.
     * - controlar un máximo, en este caso el stock.
     * - push() cuando el producto todavía no existe en el carrito.
     */
    agregarProducto(producto: IProducto): void {
        if (producto == null) {
            return;
        }

        const productoEncontrado = this.productosEnCarrito.find(function (productoCarrito) {
            return productoCarrito.sku === producto.sku;
        });

        // Si ya existe en el carrito, aumentamos su cantidad.
        if (productoEncontrado !== undefined) {
            if (productoEncontrado.cantidad >= producto.stock) {
                alert("No puedes añadir más unidades. Has alcanzado el stock disponible.");
                return;
            }

            productoEncontrado.cantidad++;
            return;
        }

        // Si todavía no estaba en el carrito, lo añadimos con cantidad 1.
        const nuevoProductoCarrito: IProductoCarrito = {
            sku: producto.sku,
            titulo: producto.titulo,
            precio: producto.precio,
            cantidad: 1,
        };

        this.productosEnCarrito.push(nuevoProductoCarrito);
    }

    // Suma una unidad desde la zona del carrito.
    sumarUnidad(productoCarrito: IProductoCarrito): void {
        const productoCatalogo = this.buscarProductoCatalogo(productoCarrito.sku);

        if (productoCatalogo === undefined) {
            alert("No se ha encontrado el producto en el catálogo.");
            return;
        }

        if (productoCarrito.cantidad >= productoCatalogo.stock) {
            alert("No hay más stock disponible de este producto.");
            return;
        }

        productoCarrito.cantidad++;
    }

    // Resta una unidad. Si solo queda una, eliminamos directamente el producto.
    restarUnidad(productoCarrito: IProductoCarrito): void {
        if (productoCarrito.cantidad <= 1) {
            this.eliminarProducto(productoCarrito.sku);
            return;
        }

        productoCarrito.cantidad--;
    }

    /*
     * Permite escribir manualmente una cantidad en un input type="number".
     * Recibimos $event para leer el valor real del campo que ha cambiado.
     * Este método está especialmente pensado para practicar casos extremos numéricos.
     */
    cambiarCantidadManual(sku: string, $event: Event): void {
        const input = $event.target as HTMLInputElement;
        const productoCarrito = this.buscarProductoCarrito(sku);
        const productoCatalogo = this.buscarProductoCatalogo(sku);

        if (productoCarrito === undefined || productoCatalogo === undefined) {
            return;
        }

        const textoIntroducido = input.value.trim();

        // Un input vacío no debe convertirse silenciosamente en una cantidad válida.
        if (textoIntroducido === "") {
            alert("La cantidad no puede estar vacía.");
            input.value = productoCarrito.cantidad.toString();
            return;
        }

        const nuevaCantidad = Number(textoIntroducido);

        // Number("hola") produce NaN. Number.isNaN() nos permite detectarlo.
        if (Number.isNaN(nuevaCantidad)) {
            alert("La cantidad debe ser un número.");
            input.value = productoCarrito.cantidad.toString();
            return;
        }

        // En un carrito no tiene sentido comprar 1.5 unidades.
        if (!Number.isInteger(nuevaCantidad)) {
            alert("La cantidad debe ser un número entero.");
            input.value = productoCarrito.cantidad.toString();
            return;
        }

        // En este ejemplo, 0 o un número negativo significa eliminar el producto.
        if (nuevaCantidad <= 0) {
            this.eliminarProducto(sku);
            return;
        }

        // Nunca permitimos comprar más unidades de las que existen en stock.
        if (nuevaCantidad > productoCatalogo.stock) {
            alert("La cantidad supera el stock disponible.");
            input.value = productoCarrito.cantidad.toString();
            return;
        }

        productoCarrito.cantidad = nuevaCantidad;
    }

    // Elimina completamente un producto del carrito mediante findIndex() + splice().
    eliminarProducto(sku: string): void {
        const indice = this.productosEnCarrito.findIndex(function (productoCarrito) {
            return productoCarrito.sku === sku;
        });

        // findIndex() devuelve -1 cuando no encuentra ningún elemento.
        if (indice !== -1) {
            this.productosEnCarrito.splice(indice, 1);
        }
    }

    // Vacía el array conservando la misma referencia.
    vaciarCarrito(): void {
        this.productosEnCarrito.splice(0, this.productosEnCarrito.length);
    }

    // Busca un producto dentro del catálogo por su SKU.
    buscarProductoCatalogo(sku: string): IProducto | undefined {
        return this.productos.find(function (producto) {
            return producto.sku === sku;
        });
    }

    // Busca un producto dentro del carrito por su SKU.
    buscarProductoCarrito(sku: string): IProductoCarrito | undefined {
        return this.productosEnCarrito.find(function (productoCarrito) {
            return productoCarrito.sku === sku;
        });
    }

    // Devuelve cuántas unidades de un producto concreto hay actualmente en el carrito.
    getCantidadEnCarrito(sku: string): number {
        const productoCarrito = this.buscarProductoCarrito(sku);

        if (productoCarrito === undefined) {
            return 0;
        }

        return productoCarrito.cantidad;
    }

    // Subtotal = precio de una unidad * número de unidades.
    getSubtotal(productoCarrito: IProductoCarrito): number {
        return productoCarrito.precio * productoCarrito.cantidad;
    }

    // Suma todos los subtotales para obtener el total general del carrito.
    getTotal(): number {
        let total = 0;

        this.productosEnCarrito.forEach(function (productoCarrito) {
            total += productoCarrito.precio * productoCarrito.cantidad;
        });

        return total;
    }

    // Cuenta todas las unidades, no solo el número de productos diferentes.
    getUnidadesTotales(): number {
        let unidades = 0;

        this.productosEnCarrito.forEach(function (productoCarrito) {
            unidades += productoCarrito.cantidad;
        });

        return unidades;
    }

    // Devuelve el número de productos distintos presentes en el carrito.
    getProductosDiferentes(): number {
        return this.productosEnCarrito.length;
    }

    // toFixed(2) fuerza dos decimales para visualizar importes monetarios.
    formatearPrecio(precio: number): string {
        return precio.toFixed(2) + " " + this.moneda;
    }
}
