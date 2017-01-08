/**
 * Created by Luu Nhu on 01/06/2017.
 */
var express = require("express");
var myParser = require("body-parser");
var router = express();
var jsonParser = myParser.json();
var pool = require('../db');
var verify = require('./VerifyToken');
var admin = false;

//them sach
function add_book(req,res) {
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        var post  = {TenSach: req.body.TenSach, SoLuongConLai: req.body.SoLuongConLai, TacGia: req.body.TacGia,
            Gia:req.body.Gia, NgonNgu:req.body.NgonNgu, SoTrang:req.body.SoTrang,
            AnhBia:req.body.AnhBia, NXB:req.body.NXB, IdTheLoai:req.body.IdTheLoai};
        connection.query("insert into sach set ?",post,function(err,rows){
            connection.release();
            if(!err) {
                res.json({success:true, message:"Added new book!"});
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//cap nhat thong tin sach
function update_book(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);
        //console.log(req.body.IdSach);

        var post = {TenSach: req.body.TenSach, SoLuongConLai: req.body.SoLuongConLai, TacGia: req.body.TacGia,
            Gia:req.body.Gia, NgonNgu:req.body.NgonNgu, SoTrang:req.body.SoTrang,
            AnhBia:req.body.AnhBia, NXB:req.body.NXB, IdTheLoai:req.body.IdTheLoai};
        connection.query("update sach set ? where IdSach = ?",[post, req.body.IdSach],function(err,rows){
            connection.release();
            if(!err) {
                res.json({success:true, message:"Updated successfully!"});
            }
        });
        //console.log(req.body.TenTheLoai);

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//xoa sach
function delete_book(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("delete from sach where IdSach = ? ",req.body.IdSach,function(err,rows){
            connection.release();
            if(!err) {
                res.json({success:true, message:"Deleted successfully!"});
            }
        });
        //console.log(req.body.TenTheLoai);

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//lay sach theo ten tac gia
function get_by_author(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("Select * from sach where TacGia = ?", [req.params.TacGia],function(err,rows){
            connection.release();
            if(!err) {
                //setValue(rows);
                if(rows.length)
                    res.json(rows);
                else
                    res.json({success:true, message: "Not found any book of this author"});
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//lay sach theo the loai
function get_by_gerne(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("Select b.* from sach b join theloai g on b.IdTheLoai = g.IdTheLoai where g.IdTheLoai = ?", [req.params.idTheLoai],function(err,rows){
            connection.release();
            if(!err) {
                //setValue(rows);
                if(rows.length)
                    res.json(rows);
                else
                    res.json({success:true, message: "Not found any book of this gerne"});
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//lay sach theo ngon ngu
function get_by_language(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("Select * from sach where NgonNgu = ?", [req.params.NgonNgu],function(err,rows){
            connection.release();
            if(!err) {
                //setValue(rows);
                if(rows.length)
                    res.json(rows);
                else
                    res.json({success:true, message:"Not found any book of this language"});
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//lay sach theo ten sach
function get_by_name(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("Select * from sach where TenSach = ?", [req.params.TenSach],function(err,rows){
            connection.release();
            if(!err) {
                //setValue(rows);
                if(rows.length)
                    res.json(rows);
                else
                    res.json({success:true, message:"Not found any book like this"});
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//lay sach theo gia
function get_by_price(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("Select * from sach where Gia = ?", [req.params.Gia],function(err,rows){
            connection.release();
            if(!err) {
                //setValue(rows);
                if(rows.length)
                    res.json(rows);
                else
                    res.json({success:true, message:"Not found any book with this price"});
            }
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//Authentication
router.use("/api", function(req, res, next){
    verify.verifyToken(req, res, next);
    admin = verify.verifyAdmin(req, res);
});

//only admin
router.post("/api/new",jsonParser, function(req,res){
    if(admin)
        add_book(req,res);
    else
        res.json({success:false, message:"You are not allowed to access this site"});
});

//only admin
router.put("/api/update",jsonParser, function(req,res){
    if(admin)
        update_book(req,res);
    else
        res.json({success:false, message:"You are not allowed to access this site"});
});

//only admin
router.delete("/api/delete",jsonParser, function(req,res){
    if(admin)
        delete_book(req,res);
    else
        res.json({success:false, message:"You are not allowed to access this site"});
});

//public
router.get("/get/author/:TacGia",function(req,res){
    get_by_author(req,res);
});

//public
router.get("/get/gerne/:idTheLoai",function(req,res){
    get_by_gerne(req,res);
});

//public
router.get("/get/language/:NgonNgu",function(req,res){
    get_by_language(req,res);
});

//public
router.get("/get/name/:TenSach",function(req,res){
    get_by_name(req,res);
});

//public
router.get("/get/price/:Gia",function(req,res){
    get_by_price(req,res);
});

module.exports = router;
