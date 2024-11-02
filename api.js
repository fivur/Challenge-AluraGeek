// api.js
export async function sendProductToAPI(product) {
    try {
        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        
         // Verifica si la respuesta es exitosa
        if (!response.ok) {
            const errorDetails = await response.text(); // Captura detalles del error, si existen
            throw new Error('Error al enviar el producto:${errorDetails}');
        }
        
        const data = await response.json();
        console.log('Data returned from API:', data); // Agrega esta línea
        return data;  // Devuelve el objeto de respuesta
    } catch (error) {
        console.error('Error al enviar el producto a la API:', error);
        return null;  // Devuelve null en caso de error
    }
}

// Función para eliminar un producto de la API (método DELETE)
export async function deleteProductFromAPI(id) {
    try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el producto con id ${id}`);
        }

        console.log(`Producto con id ${id} eliminado correctamente`);
        return true;
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        return false;
    }
}