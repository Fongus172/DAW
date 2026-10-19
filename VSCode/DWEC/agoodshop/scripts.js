import Carrito from "./carrito.js";

const carrito = new Carrito();

const tablaProductos = document.getElementById("tablaProductos");

fetch("http://localhost:8080/api/carrito")
    .then(function (response) {

        return response.json();

    })
    .then(function (datosTienda) {

        const listaResumen = document.getElementById("listaResumen");
        const totalGeneral = document.getElementById("totalGeneral");

        function actualizarResumen() {

            const informacionCarrito = carrito.obtenerCarrito();

            listaResumen.innerHTML = "";

            informacionCarrito.products.forEach(function (producto) {

                const subtotal = Number(producto.price) * producto.quantity;

                listaResumen.innerHTML += `
                    <div>
                        <span>${producto.title} x${producto.quantity}</span>
                        <span>${subtotal.toFixed(2)} ${datosTienda.currency}</span>
                    </div>
                `;
            });

            totalGeneral.innerText =
                informacionCarrito.total.toFixed(2) + " " + datosTienda.currency;
        }

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
            const totalProductoTexto = fila.querySelector(".total-producto");

            let cantidad = 0;

            botonSumar.addEventListener("click", function () {

                cantidad++;

                carrito.agregarProducto(producto);
                carrito.actualizarUnidades(producto.sku, cantidad);

                cantidadTexto.innerText = cantidad;

                const totalProducto = Number(producto.price) * cantidad;

                totalProductoTexto.innerText =
                    totalProducto.toFixed(2) + " " + datosTienda.currency;

                actualizarResumen();

                console.log(carrito.obtenerCarrito());
            });

            botonRestar.addEventListener("click", function () {

                if (cantidad > 0) {

                    cantidad--;

                    carrito.actualizarUnidades(producto.sku, cantidad);

                    cantidadTexto.innerText = cantidad;

                    const totalProducto = Number(producto.price) * cantidad;

                    totalProductoTexto.innerText =
                        totalProducto.toFixed(2) + " " + datosTienda.currency;

                    actualizarResumen();

                    console.log(carrito.obtenerCarrito());
                }
            });

        });

    })
    .catch(function (error) {

        console.error("Error al conectar con la API:", error);

    });