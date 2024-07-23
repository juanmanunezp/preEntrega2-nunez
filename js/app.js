let masid = 1

class Producto {
    constructor(id, nombre, precio, stock) {
        this.id = masid++;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
    }
}

const inventario = [
    new Producto(1, "Plato", 900, 70),
    new Producto(2, "Vaso", 550, 40),
    new Producto(3, "Taza", 420, 60),
    new Producto(4, "Copa", 630, 34),
    new Producto(5, "Cuchara", 250, 100),
    new Producto(6, "Tenedor", 280, 120),
    new Producto(7, "Cuchillo", 280, 90),
];

const carrito = [];

function mostrarInventario() {
    let inventarioTexto = "Productos disponibles:\n";
    inventario.forEach(producto => {
        inventarioTexto += `ID: ${producto.id}, ${producto.nombre} - Precio: ${producto.precio}, Stock: ${producto.stock}\n`;
    });
    alert(inventarioTexto);
}

function agregarAlCarrito(idDelProducto, cantidad) {
    const producto = inventario.find(item => item.id === idDelProducto);

    if (producto) {
        if (producto.stock >= cantidad) {
            const itemEnCarrito = carrito.find(item => item.id === idDelProducto);
            if (itemEnCarrito) {
                itemEnCarrito.cantidad += cantidad;
            } else {
                carrito.push({ id: idDelProducto, nombre: producto.nombre, precio: producto.precio, cantidad: cantidad });
            }
            producto.stock -= cantidad;
            console.log(`${producto.nombre} añadido al carrito.`);
        } else {
            const cantidadMaxima = producto.stock;
            const valorMaximo = producto.precio * cantidadMaxima;
            alert(`Stock insuficiente para ${producto.nombre}. Solo hay ${cantidadMaxima} unidades disponibles. El valor total para estas unidades es ${valorMaximo}.`);
        }
    } else {
        alert(`Producto con ID ${idDelProducto} no encontrado en el inventario.`);
    }
}

function calcularPrecioTotal() {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function buscarProducto(idDelProducto) {
    return inventario.find(item => item.id === idDelProducto) || null;
}

function agregarProducto() {
    mostrarInventario();
    const idDelProducto = parseInt(prompt("Ingrese el ID del producto:"), 10);
    const producto = buscarProducto(idDelProducto);

    if (producto) {
        const cantidad = parseInt(prompt("Ingrese la cantidad:"), 10);

        if (!isNaN(cantidad) && cantidad > 0) {
            if (cantidad <= producto.stock) {
                agregarAlCarrito(idDelProducto, cantidad);
            } else {
                const cantidadMaxima = producto.stock;
                const valorMaximo = producto.precio * cantidadMaxima;
                alert(`La cantidad solicitada excede el stock disponible. Solo se pueden añadir ${cantidadMaxima} unidades. El valor total para estas unidades es ${valorMaximo}.`);
            }
        } else {
            alert("Cantidad inválida. Debe ser un número entero positivo.");
        }
    } else {
        alert(`Se ha producido un error. Por favor intente nuevamente`);
    }
}

function ejecutarAplicacion() {


    let continuar = true;
    while (continuar) {
        agregarProducto();

        const total = calcularPrecioTotal();
        alert(`Total a pagar: ${total}`);

        continuar = confirm("¿Desea agregar más productos al carrito? (Cancelar para finalizar compra)");
    }

    alert("Resumen de la compra:\n" + carrito.map(item => `ID: ${item.id}, ${item.nombre} - Precio: ${item.precio}, Cantidad: ${item.cantidad}`).join('\n') + `\nTotal a pagar al final: ${calcularPrecioTotal()}`);

    console.log("Carrito:", carrito);
    console.log("Total a pagar al final:", calcularPrecioTotal());
}

ejecutarAplicacion();