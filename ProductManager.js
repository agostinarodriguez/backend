const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path
  }

  async addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error('Error al agregar producto, es necesario completar todos los campos');
    } else {
      try {
        let data = await fs.promises.readFile(this.path, "utf-8");
        
        //Valida que el archivo tenga contenido
        if(!data){
          data = '[]'
        }
        const products = JSON.parse(data);

        // Valida que el producto no exista
        let productExists = products.find((p) => p.code === product.code)

        if (productExists) {
          console.error(`Error al agregar el producto, el código ${product.code} ya existe`)
        } else {
          //Nuevo ID del producto
          const lastProduct = products[products.length - 1]
          const newId = lastProduct ? lastProduct.id + 1 : 1
          
          const productWithId = {...product, id: newId};
          products.push(productWithId)

          await fs.promises.writeFile(this.path, JSON.stringify(products));
          console.log('Producto agregado:', productWithId);
        }
      } catch (error) {
        console.error('Ocurrió un error leyendo el archivo:', error);
      }
    }
  }

  async getProducts() {
    try {
      const obj = await fs.promises.readFile(this.path, "utf-8");
      return console.log(JSON.parse(obj));
    } catch (error) {
      console.error('Error al leer el archivo', error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const obj = await fs.promises.readFile(this.path, "utf-8")
      const products = JSON.parse(obj)

      const find = products.find((e) => e.id === id)
      return console.log(find);
    } catch (error) {
      console.log('Error buscando productos')
    }
  }

  async updateProduct(id, fieldToUpdate) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const productData = products.find((product) => product.id === id);

      if (productData === -1) {
        console.log(`Producto con id ${id} no encontrado`);
      } else {
        let updateProd = {
          title: fieldToUpdate.title ? fieldToUpdate.title : productData.title,
          
          description: fieldToUpdate.description ? fieldToUpdate.description : productData.description,
          
          price: fieldToUpdate.price ? fieldToUpdate.price : productData.price,
          
          thumbnail: fieldToUpdate.thumbnail ? fieldToUpdate.thumbnail : productData.thumbnail,
         
          code: fieldToUpdate.code ? fieldToUpdate.code : productData.code,
          
          stock: fieldToUpdate.stock ? fieldToUpdate.stock : productData.stock,
         
          id: productData.id,
        }

        const index = products.findIndex((product) => product.id === id);
        products[index] = updateProd;

        await fs.promises.writeFile(this.path, JSON.stringify(products));
        console.log(`Producto con id ${id} modificado`, updateProd);
      }
    } catch (error) {
      console.error(`Error actualizando el producto `, error);
    }
  }

  async deleteProduct(id) {
    try {
      const obj = await fs.promises.readFile(this.path, "utf-8");
      let products = JSON.parse(obj);
      const productIndex = products.findIndex((product) => product.id === id);

      if (productIndex === -1) {
        console.log(`Producto con ID ${id} no encontrado`);
      } else {
        const deletedProduct = products[productIndex];
        products.splice(productIndex, 1)

        await fs.promises.writeFile(this.path, JSON.stringify(products));
        console.log(`Producto con ID ${id} eliminado`, deletedProduct);
      }
    } catch (error) {
      console.log(`Error eliminando producto con ID ${id}`);
      return false;
    }
  }
}

module.exports = ProductManager;

//const productManager = new ProductManager("../productos.txt")
/*
productManager.addProduct({
  title: 'Libro de cocina',
  description: 'Libro con recetas de cocina variadas y fáciles de seguir.',
  price: 1500,
  thumbnail: 'https://www.example.com/libro_cocina.jpg',
  code: 'DEF456',
  stock: 5,
})
 productManager.addProduct({
  title: 'Bicicleta de montaña',
  description: 'Bicicleta diseñada para recorridos en montaña y terrenos irregulares.',
  price: 80000,
  thumbnail: 'https://www.example.com/bicicleta.jpg',
  code: 'GHI789',
  stock: 2
 })
 productManager.addProduct({
  title: 'Auriculares Bluetooth',
  description: 'Auriculares Bluetooth con cancelación de ruido',
  price: 38000,
  thumbnail: 'https://via.placeholder.com/150',
  code: 912,
  stock: 5
  })
*/
//productManager.getProducts();
//productManager.getProductById(3);
//productManager.deleteProduct(3)
// productManager.updateProduct(2, {
//   price: "Rosa",
// })
