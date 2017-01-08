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
var username;

//them chi tiet don hang
function add_order_detail(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);
        //console.log(req.body.IdUser);

        var post  = {IdUser: req.body.IdUser, IdBook: req.body.IdBook, SoLuong: req.body.SoLuong,
            DiaChiNhan: req.body.DiaChiNhan, SDTNhan: req.body.SDTNhan, IdDonHang: req.body.IdDonHang};
        connection.query("insert into chitietdonhang set ?",post,function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });
        //console.log(req.body.TenTheLoai);

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//tim thong tin don hang trong danh sach
function getOrderDetail(IdChiTietDonHang, done){
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query('SELECT * FROM chitietdonhang WHERE IdChiTietDonHang = ? LIMIT 1', [IdChiTietDonHang], function(err, rows, fields) {
            if (err) throw err;
            done(rows[0]);
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//lay thong tin chi tiet don hang
function get_order_detail(req, res){

    if (!req.params.IdChiTietDonHang){
        return res.json({success: false, message: 'You must send IdChiTietDonHang'});
    }

    getOrderDetail(req.params.IdChiTietDonHang, function(order_detail){
        if(!order_detail){
            return res.json({success: false, message: 'Not found this data in database.'});
        }
        else{
            pool.getConnection(function(err,connection){
                if (err) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                    return;
                }

                console.log('connected as id ' + connection.threadId);

                connection.query("SELECT * FROM chitietdonhang where IdChiTietDonHang = ?",[req.params.IdChiTietDonHang],function(err,rows){
                    connection.release();
                    if(!err) {
                        res.json(rows);
                    }
                });

                connection.on('error', function(err) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                    return;
                });
            });
        }
    });
}

//Authentication
router.use("/api", function(req, res, next){
    verify.verifyToken(req, res, next);
    admin = verify.verifyAdmin(req, res);
    username = verify.verifyUser(req, res);
});

//protected
router.post("/api/new",jsonParser, function(req,res){
    add_order_detail(req,res);
});

//only admin and owner user
router.get("/api/get/view/:IdChiTietDonHang",function(req,res){
    if(admin || username === req.params.Username)
        get_order_detail(req,res);
    else
        res.json({success:false, message:"You are not allowed to access this site"});
});

module.exports = router;
