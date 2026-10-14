// import http from 'http';
import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3000;
const HOSTNAME = "127.0.0.1";
// const products = [
//   { id: 1, name: "Product 1", price: 100 },
//   { id: 2, name: "Product 2", price: 200 },
//   { id: 3, name: "Product 3", price: 300 },
// ];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "products.json");
let products = [];
try {
  products = JSON.parse(fs.readFileSync(filePath, "utf-8"));
} catch (error) {
  console.error("Error reading products file:", error);
}

const server = createServer((req, res) => {
  const method = req.method.toUpperCase();
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = parsedUrl.pathname;
  res.setHeader("content-type", "application/json");

  //HOME
  if ((path === "/" || path === "") && method === "GET") {
    res.writeHead(200);
    // res.writeHead(200, { "content-type": "application/json" });
    return res.end(
      JSON.stringify({ message: "Welcome to the NodeJS HTTP Server" }),
    );
  }

  //GET
  else if (path === "/products" && method === "GET") {
    res.writeHead(200);
    return res.end(JSON.stringify(products));
  }
  //GET by ID
  else if (path.startsWith("/products/") && method === "GET") {
    const id = parseInt(path.split("/")[2]);
    const product = products.find((product) => product.id === id);

    if (product) {
      res.writeHead(200);
      return res.end(JSON.stringify(product));
    } else {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Product not found" }));
    }
  }
  //POST
  else if (path === "/products" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const productData = JSON.parse(body);
        const newProduct = {
          ...productData,
          id:
            products.length > 0
              ? Math.max(...products.map((product) => product.id)) + 1
              : 1,
        };
        products.push(newProduct);
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
        res.writeHead(201);
        return res.end(
          JSON.stringify({
            message: "Product created successfully",
            product: newProduct,
          }),
        );
      } catch (error) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Invalid data" }));
      }
    });

    req.on("error", (err) => {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: "Internal Server Error" }));
    });
  }
  //DELETE
  else if (path.startsWith("/products/") && method === "DELETE") {
    const id = parseInt(path.split("/")[2]);
    const index = products.findIndex((product) => product.id === id);

    if (index !== -1) {
      const deletedProduct = products.splice(index, 1)[0];
      res.writeHead(200);
      return res.end(
        JSON.stringify({
          message: "Product deleted successfully",
          product: deletedProduct,
        }),
      );
    } else {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Product not found" }));
    }
  }
  //UPDATE
  else if (path.startsWith("/products/") && method === "PUT") {
    const id = parseInt(path.split("/")[2]);
    const index = products.findIndex((product) => product.id === id);

    if (index !== -1) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const updatedProduct = JSON.parse(body);
          if (
            !updatedProduct ||
            typeof updatedProduct !== "object" ||
            Array.isArray(updatedProduct)
          ) {
            throw new Error("Product data must be an object");
          }
          products[index] = { ...products[index], ...updatedProduct, id };
          res.writeHead(200);
          return res.end(
            JSON.stringify({
              message: "Product updated successfully",
              product: products[index],
            }),
          );
        } catch (error) {
          res.writeHead(400);
          return res.end(JSON.stringify({ error: "Invalid data" }));
        }
      });

      req.on("error", (err) => {
        res.writeHead(500);
        return res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
    } else {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Product not found" }));
    }
  }
  //404
  else {
    res.writeHead(404);
    return res.end(JSON.stringify({ error: `Route ${path} not found` }));
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on http://${HOSTNAME}:${PORT}`);
});
