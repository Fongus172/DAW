# TIENDA CARRITO - GUÍA DE EXAMEN

## 1. Qué practica este proyecto

Este proyecto está pensado para reutilizarse si un examen pide una tienda, cesta, pedido, inventario o cualquier ejercicio con elementos que tengan cantidades y precios.

Conceptos principales:

- Interfaces TypeScript.
- Arrays de objetos.
- `@for`, `@empty` y `@if`.
- Interpolación y Property Binding.
- Event Binding con `(click)` y `(change)`.
- `$event` para leer el valor de un input.
- `find()`.
- `findIndex()`.
- `push()`.
- `splice()`.
- `forEach()`.
- Comprobaciones de `undefined`.
- Validaciones numéricas.
- Stock máximo.
- Cantidad mínima.
- Subtotales y total general.

Este proyecto NO utiliza backend ni fetch. Eso se estudia en el modelo específico de backend.

---

## 2. Interfaces

### Producto del catálogo

```ts
export interface IProducto {
    sku: string;
    titulo: string;
    precio: number;
    stock: number;
    categoria: string;
}
```

### Producto del carrito

```ts
export interface IProductoCarrito {
    sku: string;
    titulo: string;
    precio: number;
    cantidad: number;
}
```

La diferencia importante es que el producto del carrito necesita `cantidad`.

---

## 3. Buscar si un producto ya existe

Patrón fundamental:

```ts
const productoEncontrado = this.productosEnCarrito.find(function (productoCarrito) {
    return productoCarrito.sku === producto.sku;
});

if (productoEncontrado !== undefined) {
    // Ya existe.
} else {
    // No existe.
}
```

`find()` devuelve el elemento encontrado o `undefined`.

---

## 4. Añadir con push

```ts
const nuevoProductoCarrito: IProductoCarrito = {
    sku: producto.sku,
    titulo: producto.titulo,
    precio: producto.precio,
    cantidad: 1,
};

this.productosEnCarrito.push(nuevoProductoCarrito);
```

Solo hacemos `push()` si el producto todavía no existe en el carrito.

---

## 5. Aumentar y disminuir cantidades

Aumentar:

```ts
productoCarrito.cantidad++;
```

Disminuir:

```ts
productoCarrito.cantidad--;
```

Pero antes siempre hay que comprobar límites.

Ejemplo para stock:

```ts
if (productoCarrito.cantidad >= productoCatalogo.stock) {
    return;
}
```

---

## 6. Eliminar con findIndex + splice

```ts
const indice = this.productosEnCarrito.findIndex(function (productoCarrito) {
    return productoCarrito.sku === sku;
});

if (indice !== -1) {
    this.productosEnCarrito.splice(indice, 1);
}
```

Recordatorio:

- `find()` devuelve objeto o `undefined`.
- `findIndex()` devuelve posición o `-1`.

---

## 7. Input numérico y $event

HTML:

```html
<input
    type="number"
    [value]="productoCarrito.cantidad"
    (change)="cambiarCantidadManual(productoCarrito.sku, $event)"
/>
```

TypeScript:

```ts
const input = $event.target as HTMLInputElement;
const textoIntroducido = input.value.trim();
const nuevaCantidad = Number(textoIntroducido);
```

Aquí `$event.target` es el input que ha producido el evento.

---

## 8. Validaciones numéricas importantes

### Campo vacío

```ts
if (textoIntroducido === "") {
    return;
}
```

### NaN

```ts
if (Number.isNaN(nuevaCantidad)) {
    return;
}
```

### Solo enteros

```ts
if (!Number.isInteger(nuevaCantidad)) {
    return;
}
```

### Cero o negativos

```ts
if (nuevaCantidad <= 0) {
    this.eliminarProducto(sku);
    return;
}
```

### Superar un máximo

```ts
if (nuevaCantidad > productoCatalogo.stock) {
    return;
}
```

---

## 9. Calcular subtotal

```ts
getSubtotal(productoCarrito: IProductoCarrito): number {
    return productoCarrito.precio * productoCarrito.cantidad;
}
```

---

## 10. Calcular total

```ts
getTotal(): number {
    let total = 0;

    this.productosEnCarrito.forEach((productoCarrito) => {
        total += this.getSubtotal(productoCarrito);
    });

    return total;
}
```

Patrón típico:

```text
TOTAL = suma de todos los subtotales
SUBTOTAL = precio * cantidad
```

---

## 11. Contar unidades

No es lo mismo:

```ts
this.productosEnCarrito.length
```

que devuelve el número de PRODUCTOS DIFERENTES, que sumar las cantidades:

```ts
let unidades = 0;

this.productosEnCarrito.forEach(function (productoCarrito) {
    unidades += productoCarrito.cantidad;
});
```

Ejemplo:

```text
2 cargadores + 3 teclados

productos diferentes = 2
unidades totales = 5
```

---

## 12. Vaciar el carrito

```ts
this.productosEnCarrito.splice(0, this.productosEnCarrito.length);
```

Se eliminan todos los elementos del mismo array.

---

## 13. Desactivar botón cuando se alcanza stock

```html
<button
    [disabled]="getCantidadEnCarrito(producto.sku) >= producto.stock"
>
    Añadir
</button>
```

Esto es Property Binding.

---

## 14. Casos que debes probar antes de entregar

1. Añadir un producto que no estaba en el carrito.
2. Añadir dos veces el mismo producto.
3. Comprobar que no aparecen dos filas distintas del mismo producto.
4. Llegar exactamente al stock máximo.
5. Intentar superar el stock con el botón +.
6. Intentar superar el stock desde el catálogo.
7. Intentar superar el stock escribiendo la cantidad.
8. Escribir 1.5 como cantidad.
9. Escribir 0.
10. Escribir un número negativo.
11. Vaciar el input y salir del campo.
12. Restar cuando queda una sola unidad.
13. Eliminar manualmente un producto.
14. Vaciar todo el carrito.
15. Comprobar `@empty` con carrito vacío.
16. Comprobar subtotal después de cambiar cantidad.
17. Comprobar total general con varios productos.
18. Comprobar unidades totales frente a productos diferentes.
19. Comprobar un producto de precio decimal.
20. Comprobar el carrito después de añadir el stock completo de un producto.

---

## 15. Cómo adaptar este modelo en examen

Si el ejercicio habla de PEDIDOS:

```text
IProducto       -> IArticulo
productos       -> articulos
productosEnCarrito -> lineasPedido
cantidad        -> unidades
```

Si habla de INVENTARIO:

```text
carrito -> selección / salida de almacén
stock -> existencias
cantidad -> unidades retiradas
```

Si habla de ENTRADAS:

```text
producto -> tipo de entrada
stock -> aforo disponible
cantidad -> número de entradas
```

La lógica principal es la misma.

---

## 16. Archivos que debes mirar durante el examen

```text
src/app/interfaces/iproducto.interface.ts
src/app/interfaces/iproducto-carrito.interface.ts
src/app/components/tienda/tienda.component.ts
src/app/components/tienda/tienda.component.html
```

Si tienes que recordar la lógica de cantidades, abre primero `tienda.component.ts`.
