import { sendProductToAPI, deleteProductFromAPI } from './api.js'; // Asegúrate de que la ruta sea correcta

// Cargar productos de localStorage al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    storedProducts.forEach(product => {
         // Solo agregar al DOM productos que tengan un id
        if (product.id) {
            agregarProductoADOM(product);
        
        } else{
            console.warn('El producto tiene un ID definidoy se omitirá:', product);
        }
        
    });

    // Mostrar el mensaje si no hay productos guardados
    document.querySelector('.no-products-message').style.display = storedProducts.length === 0 ? 'block' : 'none';
});

// Función para agregar producto al DOM y `localStorage`
function agregarProductoADOM(product) {
    if (!product.id) {
        console.error('El producto no tiene un ID definido:', product);
        return;
    }

    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.setAttribute('data-id', product.id);  // Asigna el id al elemento

    productItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Precio: $${product.price}</p>
        <button class="delete-product">
            <img src="/imagen/basura.png" alt="Borrar" style="width: 20px; height: 20px;">
        </button>
    `;

    // Agregar el producto a la lista en el DOM
    document.querySelector('.product-list').appendChild(productItem);

    // Ocultar el mensaje de "no se han agregado productos"
    document.querySelector('.no-products-message').style.display = 'none';

    // Manejar el botón de borrado
    productItem.querySelector('.delete-product').addEventListener('click', async function() {
        const productId = productItem.getAttribute('data-id');  // Obtener el ID del atributo
        if (productId) {  // Verificar que el ID no sea undefined
            await eliminarProducto(productId, productItem); // Pasar solo el ID y el elemento
        } else {
            console.error('No se pudo obtener el ID del producto para eliminar.');
        }
    });
}

// Función para eliminar producto del DOM, `localStorage`, y la API
async function eliminarProducto(productId, productItem) {
    try {
        // Llama a la función DELETE para eliminar el producto de la API
        const deleteSuccess = await deleteProductFromAPI(productId); // Cambié product.id por productId

        if (deleteSuccess) { // Cambié success por deleteSuccess
            // Elimina el producto del DOM
            productItem.remove();

            // Eliminar el producto de `localStorage`
            let productos = JSON.parse(localStorage.getItem('products')) || [];
            productos = productos.filter(p => p.id !== productId); // Cambié product.id por productId
            localStorage.setItem('products', JSON.stringify(productos));

            // Mostrar el mensaje de "no se han agregado productos" si ya no hay elementos
            if (document.querySelectorAll('.product-item').length === 0) {
                document.querySelector('.no-products-message').style.display = 'block';
            }
        } else {
            console.error(`No se pudo eliminar el producto con id ${productId} de la API.`);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}

// Evento al enviar el formulario para agregar productos
document.getElementById('productForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Obtener datos del formulario
    const name = document.querySelector("#productName").value;
    const price = document.querySelector("#productPrice").value;
    const image = document.querySelector("#productImage").value;

    // Crear un objeto de producto
    const product = { name, price, image };

    // Enviar el producto a la API
    const result = await sendProductToAPI(product);
    console.log('Resultado de la API:', result); // Verifica la respuesta de la API

    if (result && result.id) {// Verificamos que result y result.id existen
        // Agregar el producto al DOM y asignar su ID desde la respuesta de la API
        product.id = result.id;
        agregarProductoADOM(product);

        // Guardar el producto en localStorage
        const productos = JSON.parse(localStorage.getItem('products')) || [];
        productos.push(product);
        localStorage.setItem('products', JSON.stringify(productos));

        // Limpiar el formulario
        clearForm();
    } else {
        console.error('No se pudo agregar el producto. Verifica la conexión con la API.');
    }
});

// Función para limpiar el formulario
function clearForm() {
    document.getElementById('productForm').reset();
}
