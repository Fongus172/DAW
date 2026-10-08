import datosTienda from "./products.js";
import Carrito from "./carrito.js";

const carrito = new Carrito();

const tablaProductos = document.getElementById("tablaProductos");

datosTienda.products.forEach(function (producto) {

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${producto.title}</td>
        <td>0</td>
        <td>${producto.price} ${datosTienda.currency}</td>
        <td>0 ${datosTienda.currency}</td>
    `;

    tablaProductos.appendChild(fila);
});