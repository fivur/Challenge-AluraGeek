
// Función para realizar la requisición GET
async function obtenerDatos(url) {
    try {
        const response = await fetch(url); // Realiza la requisición GET
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`); // Incluye el estado en el mensaje de error
            
        }
        const data = await response.json(); // Convierte a JSON
        return data; // Devuelve los datos
    } catch (error) {
        console.error('Error al obtener los datos:', error);
         return null; // Devuelve null en caso de error Manejo de errores
    }
}

// Ejemplo de uso
const url = 'https://jsonplaceholder.typicode.com/posts'; // URL de ejemplo
obtenerDatos(url).then(data => {
    if (data) {
        console.log('Datos obtenidos:', data); // Maneja los datos
    } else {
        console.log('No se pudieron obtener datos'); // Mensaje si la data es null
    }
});