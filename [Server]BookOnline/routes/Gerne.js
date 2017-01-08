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

//them the loai moi
function add_gerne(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("insert into theloai set TenTheLoai = ?",req.body.TenTheLoai,function(err,rows){
            connection.release();
            if(!err) {
                res.json({success:true, message:"Added new gerne!"});
            }
        });
        console.log(req.body.TenTheLoai);

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//tim the loai trong danh sach
function getGerne(IdTheLoai, done){
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query('SELECT * FROM theloai WHERE IdTheLoai = ? LIMIT 1', [IdTheLoai], function(err, rows, fields) {
            if (err) throw err;
            done(rows[0]);
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//cap nhat the loai trong danh sach
function update_gerne(req,res) {

    if (!req.body.IdTheLoai){
        return res.json({success: false, message: 'You must send IdTheLoai'});
    }

    getGerne(req.body.IdTheLoai, function(gerne){
        if(!gerne){
            return res.json({success: false, message: 'Updated failed. Not found this data in database.'});
        }
        else{
            pool.getConnection(function(err,connection){
                if (err) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                    return;
                }

                console.log('connected as id ' + connection.threadId);

                var post = {TenTheLoai: req.body.TenTheLoai};
                connection.query("update theloai set ? where IdTheLoai = ?",[post, req.body.IdTheLoai],function(err,rows){
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
    });
}

//xoa the loai
function delete_gerne(req,res) {

    if (!req.body.IdTheLoai){
        return res.json({success: false, message: 'You must send IdTheLoai'});
    }

    getGerne(req.body.IdTheLoai, function(gerne){
        if(!gerne){
            return res.json({success: false, message: 'Updated failed. Not found this data in database.'});
        }
        else{
            pool.getConnection(function(err,connection){
                if (err) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                    return;
                }

                console.log('connected as id ' + connection.threadId);

                connection.query("delete from theloai where IdTheLoai = ? ",req.body.IdTheLoai,function(err,rows){
                    connection.release();
                    if(!err) {
                        res.json({success:true, message: "Deleted successfully!"});
                    }
                });
                //console.log(req.body.TenTheLoai);

                connection.on('error', function(err) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                    return;
                });
            });
        }
    });
}

//xem tat ca the loai
function get_all_gerne(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("SELECT * FROM theloai",function(err,rows){
            connection.release();
            if(!err) {
                //setValue(rows);
                res.json(rows);
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
        add_gerne(req,res);
    else
        res.json({success:false, message:"You are not allowed to access this site"});
});

//only admin
router.put("/api/update",jsonParser, function(req,res){
    if(admin)
        update_gerne(req,res);
    else
        res.json({success:false, message:"You are not allowed to access this site"});
});

//only admin
router.delete("/api/delete",jsonParser, function(req,res){
    if(admin)
        delete_gerne(req,res);
    else
        res.json({success:false, message:"You are not allowed to access this site"});
});

//public
router.get("/get/all",function(req,res){
    get_all_gerne(req,res);
});

module.exports = router;
