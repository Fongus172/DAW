// Un producto dentro del carrito necesita los datos del producto y, además, una cantidad.
export interface IProductoCarrito {
    sku: string;
    titulo: string;
    precio: number;
    cantidad: number;
}
