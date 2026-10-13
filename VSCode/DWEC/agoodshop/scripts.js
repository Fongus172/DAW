import datosTienda from "./products.js";
import Carrito from "./carrito.js";

const carrito = new Carrito();

const tablaProductos = document.getElementById("tablaProductos");

datosTienda.products.forEach(function (producto) {

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${producto.title}</td>

        <td>
            <button class="restar">-</button>
            <span class="cantidad">0</span>
            <button class="sumar">+</button>
        </td>

        <td>${producto.price} ${datosTienda.currency}</td>

        <td class="total-producto">
            0 ${datosTienda.currency}
        </td>
    `;

    tablaProductos.appendChild(fila);

    const botonSumar = fila.querySelector(".sumar");
    const botonRestar = fila.querySelector(".restar");
    const cantidadTexto = fila.querySelector(".cantidad");

    let cantidad = 0;

    botonSumar.addEventListener("click", function () {

        cantidad++;

        carrito.agregarProducto(producto)
        carrito.actualizarUnidades(producto.SKU, cantidad);

        cantidadTexto.innerText = cantidad;

        console.log(carrito.obtenerCarrito());
    });

    botonRestar.addEventListener("click", function () {

        if (cantidad > 0) {

            cantidad--;

            carrito.actualizarUnidades(producto.SKU, cantidad);

            cantidadTexto.innerText = cantidad;

            console.log(carrito.obtenerCarrito());
        }
    });
});