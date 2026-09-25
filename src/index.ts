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
        const precio = parseFloat(String(args[3]));
        const stock = parseInt(String(args[4]));

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

      case "update": {
        const id = args[1];
        const titulo = args[2];
        const autor = args[3];
        const precio = parseFloat(String(args[4]));
        const stock = parseInt(String(args[5]));

        if (!id || !ObjectId.isValid(id)) {
          console.log(" Error: El ID ingresado no es válido o está vacío.");
          break;
        }

        if (!titulo || !autor || isNaN(precio) || isNaN(stock)) {
          console.log(" Error: Faltan datos para actualizar.");
          break;
        }

        const resultado = await librosCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { titulo, autor, precio, stock } }
        );

        if (resultado.matchedCount === 0) {
          console.log(" No se encontró ningún libro con ese ID.");
        } else {
          console.log("Libro actualizado correctamente.");
        }
        break;
      }

      case "delete": {
        const id = args[1];

        if (!id || !ObjectId.isValid(id)) {
          console.log(" Error: El ID ingresado no es válido o está vacío.");
          break;
        }

        const resultado = await librosCollection.deleteOne({ _id: new ObjectId(id) });

        if (resultado.deletedCount === 0) {
          console.log(" No se encontró ningún libro con ese ID para eliminar.");
        } else {
          console.log(" Libro eliminado con éxito.");
        }
        break;
      }

      default:
        console.log("Comando no válido. Comandos: create, read, update, delete");
        break;
    }

  } catch (error) {
    console.error("Hubo un error:", error);
  } finally {
    await client.close();
  }
}

main();