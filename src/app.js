const express = require('express')
const ProductManager = require('../ProductManager')
const fs = require('fs')

const app = express ()
const productManager = new ProductManager('./productos.txt')


app.get('/products', (req, res) =>{
    const limit = req.query.limit
    if (limit){
        const products = productManager.getProductsLimit(parseInt(limit))
        res.send(products);
    }else{
        const products = productManager.getProducts()
        res.send(products)
    }


})


app.get('/products/:pid', (req, res) =>{
    const pid = req.params.pid
    const product = productManager.getProduct(pid)
    res.json({product})
   //res.sendFile(__dirname+'./productos.txt')
})


app.post('/products', (req, res) => {
    const product = req.body
    productManager.addProduct(product)
    const products = productManager.getProducts()
    fs.writeFileSync('./productos.txt', JSON.stringify(products))
    res.json({ message:'producto añadido', product })
  })
  

app.listen(8080, () =>{
    console.log('servidor desde el puerto 8080')
})


productManager.addProduct({
    title: 'Bicicleta de montaña',
    description: 'Bicicleta diseñada para recorridos en montaña y terrenos irregulares.',
    price: 80000,
    thumbnail: 'https://www.example.com/bicicleta.jpg',
    code: 'GHI789',
    stock: 2
})
    
  