/**
 * Created by Luu Nhu on 01/06/2017.
 */
var express = require("express");
var myParser = require("body-parser");
var router = express();
var jsonParser = myParser.json();
var pool = require('../db');
var verify = require('./VerifyToken');

//them don hang moi
function add_order(req,res) {

    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);
        //console.log(req.body.TenSach);

        var post  = {IdUser: req.body.IdUser, TongGia: 0,TrangThai:1};
        connection.query("insert into donhang set ?",post,function(err,rows){
            connection.release();
            if(!err) {
                res.json({success:true, message:"Added new order"});
            }
        });
        //console.log(req.body.TenTheLoai);

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//tim kiem don hang trong danh sach
function getOrder(IdDonHang, done){
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query('SELECT * FROM donhang WHERE IdDonHang = ? LIMIT 1', [IdDonHang], function(err, rows, fields) {
            if (err) throw err;
            done(rows[0]);
        });

        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}

//cap nhat tong gia
function update_sum(req,res) {

    if (!req.body.IdDonHang || !req.body.TongGia){
        return res.json({success: false, message: 'You must send IdDonHang and TongGia'});
    }

    getOrder(req.body.IdDonHang, function(order) {
        if (!order) {
            return res.json({success: false, message: 'Updated failed. Not found this data in database.'});
        }
        else {
            pool.getConnection(function(err,connection){
                if (err) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                    return;
                }

                console.log('connected as id ' + connection.threadId);

                var post = {TongGia: req.body.TongGia};
                connection.query("update donhang set ? where IdDonHang = ?",[post, req.body.IdDonHang],function(err,rows){
                    connection.release();
                    if(!err) {
                        res.json({success:true, message:"Updated successfully!"});
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

//cap nhat trang thai
function update_state(req,res) {

    if (!req.body.IdDonHang || !req.body.TrangThai){
        return res.json({success: false, message: 'You must send IdDonHang and TrangThai'});
    }

    getOrder(req.body.IdDonHang, function(order) {
        if (!order) {
            return res.json({success: false, message: 'Updated failed. Not found this data in database.'});
        }
        else {
            pool.getConnection(function(err,connection){
                if (err) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                    return;
                }

                console.log('connected as id ' + connection.threadId);

                var post = {TrangThai: req.body.TrangThai};
                connection.query("update donhang set ? where IdDonHang = ?",[post, req.body.IdDonHang],function(err,rows){
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

//Authentication
router.use("/api", function(req, res, next){
    verify.verifyToken(req, res, next);
});

//protected
router.post("/api/new",jsonParser, function(req,res){
    add_order(req,res);
});

//protected
router.put("/api/update/sum",jsonParser, function(req,res){
    update_sum(req,res);
});

//protected
router.put("/api/update/state",jsonParser, function(req,res){
    update_state(req,res);
});

module.exports = router;
