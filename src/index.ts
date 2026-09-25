import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";npx tsx src/index.ts read

dotenv.config();

const URI_DB = process.env.URI_DB || "mongodb://127.0.0.1:27017/biblioteca";
const client = new MongoClient(URI_DB);

async function main() {
  try {
    // Intentamos conectar
    await client.connect();
    console.log("¡Conexión a MongoDB exitosa! 🚀");

    // Seleccionamos la base de datos y la colección
    const db = client.db("biblioteca");
    const librosCollection = db.collection("libros");

    // Capturamos los argumentos que el usuario escribe en la consola
    // process.argv[2] es la acción (create, read, update, delete)
    const accion = process.argv[2];

    console.log(`La acción que elegiste fue: ${accion}`);

  } catch (error) {
    console.error("Hubo un error al conectar:", error);
  } finally {
    await client.close();
  }
}

// Ejecutamos la función principal
main();