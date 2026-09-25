import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const URI_DB = process.env.URI_DB || "mongodb://127.0.0.1:27017/biblioteca";
const client = new MongoClient(URI_DB);

async function main() {
  try {

    await client.connect();
    console.log("¡Conexión a MongoDB exitosa! 🚀");
    const db = client.db("biblioteca");
    const librosCollection = db.collection("libros");
    const accion = process.argv[2];

    console.log(`La acción que elegiste fue: ${accion}`);

  } catch (error) {
    console.error("Hubo un error al conectar:", error);
  } finally {
    await client.close();
  }
}


main();