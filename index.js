const express = require('express');
const app = express();
const port = process.env.PORT || 5006;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();


//midileware

app.use(cors());
app.use(express.json());




//user: emaJohnServer
//password :9ZxZXTPUyECpRx7f




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wqhd5vt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    const productCollection = client.db('emaJon').collection('products');


    try {
        //http://localhost:5006/products
        app.get('/products', async (req, res) => {

            // const page = req.query.page;
            // const size = req.query.size;

            //console.log(page, size);



            const Page = parseInt(req.query.page);
            const Size = parseInt(req.query.size);
            console.log(Page, Size);




            const quary = {};

            const cursor = productCollection.find(quary);
            const products = await cursor.skip(Page * Size).limit(Size).toArray();
            //const products = await cursor.toArray();

            //console.log(services);
            const count = await productCollection.estimatedDocumentCount()
            res.send({ count, products });



        })

        app.post('/productsByIds', async (req, res) => {

            const ids = req.body;
            //console.log(ids);


            const objectId = ids.map((id) => {
                return id;
            });

            // console.log(objectId);


        })

        app.post('/addProducts', async (req, res) => {

            const product = req.body;
            console.log(product);

            const result = await productCollection.insertOne(product);

            console.log(result);
            res.send(result);


        })

        app.get('/allproducts', async (req, res) => {

            const search = req.query.search;
            console.log(search);


            let query = {};
            if (search.length) {
                query = {
                    $text: {
                        $search: search
                    }
                }

            }
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/allproducts/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);


        })

        app.put('/allproducts/:id', async (req, res) => {

            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const productData = req.body;
            // console.log(id);
            // console.log(productData);
            const options = { upsert: true };
            const ProductUpdate = {
                $set: {

                    category: productData.category,
                    name: productData.name,
                    seller: productData.seller,
                    price: parseFloat(productData.price),
                    stock: parseInt(productData.stock),
                    ratings: parseInt(productData.ratings),
                    ratingsCount: parseInt(productData.ratingsCount),
                    img: productData.photo,
                    shipping: parseInt(productData.shipping)


                }
            }

            const result = await productCollection.updateOne(filter, ProductUpdate, options);
            console.log(result);
            res.send(result);


        })

        app.delete('/allproducts/:id', async (req, res) => {

            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })


    }

    finally {

    }


}

run().catch((error) => {
    console.log(error.message)
})



app.get('/', (req, res) => {

    res.send('ema-john-simple-Server')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

