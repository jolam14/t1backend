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
          console.log(" Error: Faltan datos.");
          break;
        }
        const resultado = await librosCollection.insertOne({ titulo, autor, precio, stock });
        console.log("Libro creado. ID:", resultado.insertedId);
        break;
      }

      case "read": {
        const libros = await librosCollection.find().toArray();
        libros.length === 0 ? console.log("No hay libros.") : console.table(libros);
        break;
      }

      case "update": {
        const id = args[1];
        const titulo = args[2];
        const autor = args[3];
        const precio = parseFloat(args[4]);
        const stock = parseInt(args[5]);

        if (!id || !ObjectId.isValid(id)) {
          console.log(" Error: ID inválido.");
          break;
        }

        const resultado = await librosCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { titulo, autor, precio, stock } }
        );

        resultado.matchedCount === 0 
          ? console.log(" No se encontró el libro.") 
          : console.log(" Libro actualizado correctamente.");
        break;
      }

      default:
        console.log("Comandos: create, read, update");
        break;
    }
  } catch (error) {
    console.error("Hubo un error:", error);
  } finally {
    await client.close();
  }
}

main();