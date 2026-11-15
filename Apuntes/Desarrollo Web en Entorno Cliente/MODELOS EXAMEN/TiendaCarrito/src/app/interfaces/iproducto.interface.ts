// Esta interfaz describe los productos disponibles en el catálogo.
// Es equivalente a decir: "todo producto debe tener estas propiedades y estos tipos".
export interface IProducto {
    sku: string;
    titulo: string;
    precio: number;
    stock: number;
    categoria: string;
}
