const productos = [
  { id: 1, nombre: "Labial Mate Rosa Nude", categoria: "Maquillaje para labios", precio: 28000, imagen: "img/p1.png" },
  { id: 2, nombre: "Labial Líquido Rojo Pasión", categoria: "Maquillaje para labios", precio: 32000, imagen: "img/p2.png" },
  { id: 3, nombre: "Paleta de Sombras Sunset", categoria: "Sombras", precio: 45000, imagen: "img/p3.png" },
  { id: 4, nombre: "Sombra Individual Dorada", categoria: "Sombras", precio: 18000, imagen: "img/p4.png" },
  { id: 5, nombre: "Set de Brochas x5", categoria: "Brochas y Aplicadores", precio: 55000, imagen: "img/p5.png" },
  { id: 6, nombre: "Brocha para Base", categoria: "Brochas y Aplicadores", precio: 21000, imagen: "img/p6.png" },
  { id: 7, nombre: "Delineador Líquido Negro", categoria: "Maquillaje para ojos", precio: 24000, imagen: "img/p7.png" },
  { id: 8, nombre: "Máscara de Pestañas Volumen", categoria: "Maquillaje para ojos", precio: 30000, imagen: "img/p8.png" },
];

let carrito = [];
let terminoBusqueda = "";

function formatearPrecio(valor) {
  return "$ " + valor.toLocaleString("es-CO");
}

function renderizarCatalogo() {
  const contenedor = document.querySelector("#grid-productos");
  contenedor.innerHTML = "";

  const filtrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  if (filtrados.length === 0) {
    const vacio = document.createElement("p");
    vacio.classList.add("cargando");
    vacio.textContent = "No encontramos productos para tu búsqueda.";
    contenedor.appendChild(vacio);
    return;
  }

  filtrados.forEach((producto) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-producto");
    tarjeta.dataset.id = producto.id;
    tarjeta.dataset.categoria = producto.categoria;

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
    imagen.classList.add("producto-imagen");
    imagen.loading = "lazy";

    const categoria = document.createElement("p");
    categoria.classList.add("producto-categoria");
    categoria.textContent = producto.categoria;

    const nombre = document.createElement("p");
    nombre.classList.add("producto-nombre");
    nombre.textContent = producto.nombre;

    const estrellas = document.createElement("p");
    estrellas.classList.add("producto-estrellas");
    estrellas.textContent = "☆☆☆☆☆";
    estrellas.setAttribute("aria-hidden", "true");

    const precio = document.createElement("p");
    precio.classList.add("producto-precio");
    precio.textContent = formatearPrecio(producto.precio);

    const boton = document.createElement("button");
    boton.classList.add("btn-agregar");
    boton.type = "button";
    boton.textContent = "Añadir al carrito";
    boton.dataset.id = producto.id;

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(categoria);
    tarjeta.appendChild(nombre);
    tarjeta.appendChild(estrellas);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(boton);

    contenedor.appendChild(tarjeta);
  });
}

function agregarAlCarrito(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return;

  const itemExistente = carrito.find((item) => item.id === idProducto);
  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  renderizarCarrito();
  abrirCarrito();
}

function quitarDelCarrito(idProducto) {
  carrito = carrito.filter((item) => item.id !== idProducto);
  renderizarCarrito();
}

function calcularTotal() {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function renderizarCarrito() {
  const lista = document.querySelector("#lista-carrito");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    const vacio = document.createElement("p");
    vacio.classList.add("carrito-vacio");
    vacio.textContent = "Tu carrito está vacío.";
    lista.appendChild(vacio);
  } else {
    carrito.forEach((item) => {
      const fila = document.createElement("div");
      fila.classList.add("item-carrito");
      fila.dataset.id = item.id;

      const miniatura = document.createElement("img");
      miniatura.src = item.imagen;
      miniatura.alt = "";
      miniatura.classList.add("item-carrito-img");

      const info = document.createElement("span");
      info.textContent = `${item.nombre} (x${item.cantidad}) — ${formatearPrecio(item.precio * item.cantidad)}`;

      const btnQuitar = document.createElement("button");
      btnQuitar.classList.add("btn-quitar");
      btnQuitar.type = "button";
      btnQuitar.dataset.id = item.id;
      btnQuitar.textContent = "✕";

      fila.appendChild(miniatura);
      fila.appendChild(info);
      fila.appendChild(btnQuitar);
      lista.appendChild(fila);
    });
  }

  document.querySelector("#total-carrito").textContent = formatearPrecio(calcularTotal());
  const totalUnidades = carrito.reduce((total, item) => total + item.cantidad, 0);
  document.querySelector("#contador-carrito").textContent = totalUnidades;
}

function abrirCarrito() {
  document.querySelector("#carrito-drawer").classList.add("abierto");
  document.querySelector("#overlay-carrito").classList.add("visible");
}

function cerrarCarrito() {
  document.querySelector("#carrito-drawer").classList.remove("abierto");
  document.querySelector("#overlay-carrito").classList.remove("visible");
}

document.querySelector("#grid-productos").addEventListener("click", (evento) => {
  const boton = evento.target.closest(".btn-agregar");
  if (!boton) return;
  agregarAlCarrito(Number(boton.dataset.id));
});

document.querySelector("#lista-carrito").addEventListener("click", (evento) => {
  const boton = evento.target.closest(".btn-quitar");
  if (!boton) return;
  quitarDelCarrito(Number(boton.dataset.id));
});

document.querySelector("#btn-carrito").addEventListener("click", abrirCarrito);
document.querySelector("#btn-cerrar-carrito").addEventListener("click", cerrarCarrito);
document.querySelector("#overlay-carrito").addEventListener("click", cerrarCarrito);

// ---------- Búsqueda dinámica ----------
document.querySelector("#buscador").addEventListener("input", (evento) => {
  terminoBusqueda = evento.target.value.trim();
  renderizarCatalogo();
});

document.querySelector("#btn-buscar").addEventListener("click", () => {
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
});


document.querySelector("#btn-menu").addEventListener("click", () => {
  const nav = document.querySelector("#nav-principal");
  const abierto = nav.classList.toggle("abierto");
  document.querySelector("#btn-menu").setAttribute("aria-expanded", abierto);
});

document.querySelector("#form-contacto").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = document.querySelector("#nombre");
  const correo = document.querySelector("#correo");
  const asunto = document.querySelector("#asunto");
  const mensaje = document.querySelector("#mensaje");
  const terminos = document.querySelector("#terminos");
  const respuesta = document.querySelector("#respuesta-form");

  const campos = [nombre, correo, asunto, mensaje];
  const hayVacios = campos.some((campo) => campo.value.trim() === "");

  if (hayVacios || !terminos.checked) {
    respuesta.textContent = "Por favor completa todos los campos obligatorios y acepta ser contactada/o.";
    respuesta.className = "error";
    return;
  }

  respuesta.textContent = `¡Gracias, ${nombre.value.trim()}! Recibimos tu mensaje y te contactaremos pronto.`;
  respuesta.className = "exito";
  evento.target.reset();
});

document.querySelector("#anio").textContent = new Date().getFullYear();

renderizarCatalogo();
renderizarCarrito();
