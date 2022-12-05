const express = require('express');
const app = express();
const PORT = 2222;
const mongoose = require("mongoose");
require('dotenv').config();
const TermoMupalavra = require('./models/termoSchema');
// novo
// const mainRoutes = require('./routes/main');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.DB_STRING,
    {useNewUrlParser: true},
    () => {console.log('Connected to database')});
    
    // funciona
    // app.get('/', async (req, res, next) => {
    //     try {
    //         TermoMupalavra.find({}, (err, info) => {
    //             res.render('index.ejs', {
    //                 items: info
    //             })
    //         })
    //         } catch (error) {
    //        res.status(500).send({message: error.message})
    //     };
    //     next();
    // })

// funciona, mas nao as duas juntas
    app.get('/', async (req, res) => {
        try {
            TermoMupalavra.aggregate([{ $sample: { size: 1 } }], (err, info) => {
                res.render('index.ejs', {
                    items: info
                })
            })
        } catch (error) {
            res.status(500).send({message: error.message})
         };
       })
    
    app.post('/', async (req, res) => {
        const novoTermo = new TermoMupalavra({
            termo: req.body.termo,
            descricao: req.body.descricao
        }    
        )
        try {
            await novoTermo.save()
            console.log(novoTermo)
            res.redirect('/')
        } catch(err) {
            if (err) return res.status(500).send(err)
            res.redirect('/')
        }
    })

app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id
        TermoMupalavra.find({}, (err, info) => {
            res.render('edit.ejs', {
                items: info, idItem: id
            })
    })
})
    .post((req, res) => {
        const id = req.params.id
        TermoMupalavra.findByIdAndUpdate(
            id, 
            {
                termo: req.body.termo,
                descricao: req.body.descricao
            },
            err => {
                if (err) return res.status(500).send(err)
                res.redirect('/')
            })
    })

    app.
        route('/remove/:id')
        .get((req, res) => {
            const id = req.params.id
            TermoMupalavra.findByIdAndRemove(id, err => {
                if (err) return res.status(500).send(err)
                res.redirect('/')
            })
        })

app
.route('/add')
.get((req, res) => {
            try {
                TermoMupalavra.find({}, (err, info) => {
                    res.render('add.ejs', {
                        items: info
                    })
                })
                } catch (error) {
               res.status(500).send({message: error.message})
            }
        })
           
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
