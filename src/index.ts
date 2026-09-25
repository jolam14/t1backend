import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const URI_DB = process.env.URI_DB || "mongodb://127.0.0.1:27017/biblioteca";
const client = new MongoClient(URI_DB);

async function main() {
  try {
    await client.connect();
    const db = client.db("biblioteca");
    const librosCollection = db.collection("libros");

    const args = process.argv.slice(2);
    const accion = args[0];

    switch (accion) {
      case "create": {
        const titulo = args[1];
        const autor = args[2];
        const precio = parseFloat(args[3]);
        const stock = parseInt(args[4]);

        if (!titulo || !autor || isNaN(precio) || isNaN(stock)) {
          console.log(" Error: Faltan datos o están mal escritos.");
          console.log('Uso correcto: create "El Principito" "Antoine" 15000 10');
          break;
        }

        const nuevoLibro = { titulo, autor, precio, stock };
        const resultado = await librosCollection.insertOne(nuevoLibro);
        
        console.log(" Libro creado con éxito. Su ID es:", resultado.insertedId);
        break;
      }

      case "read": {

        const libros = await librosCollection.find().toArray();
        
        if (libros.length === 0) {
          console.log("No hay libros guardados en la biblioteca.");
        } else {
          console.log("Libros en la biblioteca:");
          console.table(libros); 
        }
        break;
      }

      default:
        console.log("Comando no válido. Comandos disponibles: create, read");
        break;
    }

  } catch (error) {
    console.error("Hubo un error:", error);
  } finally {
    await client.close();
  }
}

main();