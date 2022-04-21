const express   = require('express');
const router    = express.Router();
const Car       = require('../models/cars');
const multer    = require('multer');
const fs        = require ('fs');
const { info } = require('console');

//images upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("images");

//Get All Car
router.get("/", (req, res) => {
    Car.find().exec((err, cars) => {
        if (err) {
            res.json({message: err.message});
        } else {
            res.render("index", {
                title:"List Car",
                cars:cars,
            });
        }
    });
});

router.get("/add", (req, res) => {
    res.render('add_car.ejs', {title: "Add Car"});
});

//insert cars into database
router.post('/add', upload, (req, res)=>{
    const car = new Car({
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        images: req.file.filename,
    });
    car.save((err) => {
        if (err) {
            res.json({message: err.message, type:'danger'});
        }else{
            req.session.message = {
                type:'success',
                message:'data berhasil ditambahkan',
            };
            res.redirect("/");
        }
    })
});

//get halaman edit
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    Car.findById(id, (err, cars) =>{
        if (err) {
            res.redirect("/");
        } else {
            if (cars == null) {
                res.redirect("/");
            } else {
                res.render('edit_car', {
                    title: "Edite Car",
                    cars: cars,
                });
            }
        }
    });
});

//update data
router.post("/update/:id", upload, (req, res) => {
    let id = req.params.id;
    let new_images = "";

    if (req.file) {
        new_images = req.file.filename;
        try {
            fs.unlinkSync("./uploads" + req.body.old_image);
        } catch (err) {
           console.log('error', err)
        }
    } else {
        new_images = req.body.old_image;
    }

    Car.findByIdAndUpdate(id, {
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        images: new_images,
    }, (err, result) =>{
        if (err) {
            res.json({message: err.message, type:'danger'});
        }else{
            req.session.message = {
                type:'success',
                message:'data berhasil diupdate',
            };
            res.redirect("/");
        }
    });
});

//delete data 

router.get("/delete/:id", (req, res) =>{
    let id = req.params.id;
    Car.findByIdAndRemove(id, (err, result) => {
        if (result.images !="") {
            try {
                fs.unlinkSync("./uploads/" + result.images);
            } catch (err) {
                console.log('error', err);
            }
        }

        if (err) {
            res.json({message: err.message});
        } else {
            req.session.message = {
                type : "danger",
                message: "Data berhasil dihapus",
            };
            res.redirect("/");
        }
    });
});
module.exports = router;