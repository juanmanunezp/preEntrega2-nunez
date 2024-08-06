let masid = 1;

class Producto {
    constructor(nombre, precio, stock, imgSrc = '') {
        this.id = masid++;
        this.nombre = nombre;
        this.precio = parseFloat(precio) + ' U$S';
        this.stock = stock;
        this.imgSrc = imgSrc;
    }
}

const inventario = [
    new Producto("Remera", 19, 70, 'img/remera.jpg'),
    new Producto("Gorra", 12, 40, 'img/gorra.jpg'),
    new Producto("Canguro", 49, 60, 'img/canguro.jpeg'),
    new Producto("Medio cierre", 59, 34, 'img/Medio-cierre.jpg'),
    new Producto("Bermuda", 39, 100, 'img/bermuda.jpeg'),
    new Producto("Medias", 4, 120, 'img/medias.jpg'),
    new Producto("Pantalon", 54, 90, 'img/pantalon.jpg'),
    new Producto("Corta viento", 64, 90, 'img/corta-viento.jpg'),
];

const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarInventario() {
    const productosContainer = document.getElementById('productos-container');
    const template = document.getElementById('producto-template');

    productosContainer.innerHTML = '';

    inventario.forEach(producto => {
        const clon = template.content.cloneNode(true);
        clon.querySelector('.card-title').innerHTML = `<b>${producto.nombre}</b>`;
        clon.querySelector('.card-text').textContent = `Stock: ${producto.stock}`;
        clon.querySelector('.precio').textContent = `${producto.precio}`;
        clon.querySelector('.card-img-top').src = producto.imgSrc;
        clon.querySelector('.card-img-top').alt = producto.nombre;
        clon.querySelector('.agregar-btn').addEventListener('click', () => agregarAlCarrito(producto.id));
        productosContainer.appendChild(clon);
    });
}

function agregarAlCarrito(idDelProducto) {
    const producto = inventario.find(item => item.id === idDelProducto);

    if (producto) {
        if (producto.stock > 0) {
            let itemEnCarrito = carrito.find(item => item.id === idDelProducto);
            if (itemEnCarrito) {
                if (itemEnCarrito.cantidad < producto.stock) {
                    itemEnCarrito.cantidad += 1;
                    producto.stock -= 1;
                    Toastify({
                        text: `${producto.nombre} se ha añadido al carrito.`,
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)"
                        }
                    }).showToast();
                } else {
                    Toastify({
                        text: `No puedes añadir más de ${producto.stock} unidades de ${producto.nombre}.`,
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)"
                        }
                    }).showToast();
                }
            } else {
                itemEnCarrito = { id: idDelProducto, nombre: producto.nombre, precio: producto.precio, cantidad: 1 };
                carrito.push(itemEnCarrito);
                producto.stock -= 1;
                Toastify({
                    text: `${producto.nombre} se ha añadido al carrito.`,
                    duration: 3000,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)"
                    }
                }).showToast();
            }
            actualizarCarrito();
        } else {
            Toastify({
                text: `No hay stock disponible para ${producto.nombre}.`,
                duration: 3000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)"
                }
            }).showToast();
        }
    }
}

function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));

    const carritoContainer = document.getElementById('carrito-container');
    carritoContainer.innerHTML = '';

    carrito.forEach(item => {
        const producto = inventario.find(p => p.id === item.id);
        const div = document.createElement('div');
        div.classList.add('carrito-item');
        div.innerHTML = `
            <img src="${producto.imgSrc}" alt="${producto.nombre}" class="carrito-img">
            <span><b>${item.nombre}</b></span>
            <span>Cantidad: ${item.cantidad}</span>
            <span>Precio unitario: ${producto.precio}</span>
            <span>Total: ${parseFloat(producto.precio) * item.cantidad} U$S</span>
            <button class="btn btn-warning btn-sm" onclick="decrementarCantidad(${item.id})">-1</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        `;
        carritoContainer.appendChild(div);
    });

    const total = calcularPrecioTotal();
    document.getElementById('total-a-pagar').textContent = `Total a pagar: ${total} U$S`;
}
function decrementarCantidad(idDelProducto) {
    const item = carrito.find(item => item.id === idDelProducto);
    if (item) {
        if (item.cantidad > 1) {
            item.cantidad -= 1;
            const producto = inventario.find(p => p.id === idDelProducto);
            producto.stock += 1;
            actualizarCarrito();
        } else {
            eliminarDelCarrito(idDelProducto);
        }
    }
}

function eliminarDelCarrito(idDelProducto) {
    const index = carrito.findIndex(item => item.id === idDelProducto);
    if (index !== -1) {
        carrito.splice(index, 1);
        const producto = inventario.find(p => p.id === idDelProducto);
        if (producto) {
            producto.stock += 1;
        }
        actualizarCarrito();
    }
}

function calcularPrecioTotal() {
    return carrito.reduce((total, item) => total + parseFloat(item.precio) * item.cantidad, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarInventario();
    actualizarCarrito();
});

document.getElementById('comprar-btn').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Añade productos antes de comprar.");
    } else {
        alert("¡Gracias por tu compra! Tu pedido está en proceso.");
        carrito.length = 0;
        actualizarCarrito();
    }
});
