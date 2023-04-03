const { Router } = require('express');
const express = require('express');
const mysql = require("mysql2");
const router = Router();
const Excel = require('exceljs');

const urlencodedParser = express.urlencoded({extended: false});
const jsonParser = express.json();

// _________________________________________________________________MySQL_________________________________________________________________ //

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "127.0.0.1",
    user: "inser",
    database: "pc_tu",
    password: ""
});

// _________________________________________________________________Function_________________________________________________________________ //

let num = [];
let unique = [];
let Aud;
let upvote='';
let def_get;
let inv_data;

function Share(){
    pool.query("SELECT * FROM pc_tu ORDER BY name ASC", function (err, result) {
        if (err) return console.log(err);
        Data = result;
        console.log("[i] | Scan complete");
    });
};

function ShareName() {
    pool.query("SELECT name FROM pc_tu ORDER BY name ASC", function (err, data) {
        if (err) return console.log(err);
        for (let i = 0; i < data.length; i++){
            unique = data[i].name.slice(0, 3);
            testNumber = isNaN(unique);
            if (testNumber == false) {
                num.push(unique);
                num.sort();
            };
        };
        unique = Array.from(new Set(num));
        num = [];
        console.log("[i] | Share Name complete");
    });
};

function ShareAud(){
    pool.query("SELECT * FROM `pc_tu` WHERE name LIKE '" + `${upvote}` + "%' ORDER BY name ASC", function (err, data) {
        if (err) return console.log(err);
        Aud = data;
    });
}

function ShareDG(){
    pool.query("SELECT default_get, name FROM pc_tu ORDER BY `pc_tu`.`default_get` ASC", function (err, data) {
        if (err) return console.log(err);
        for(let i = 0;  i < data.length; i++){
            if(i!=0) {
                if (data[i].default_get == data[i-1].default_get) {
                    data[i-1].name += ' ' + data[i].name;
                    data.splice(i, 1);
                    i=i-1;
                }
            }
        }
        def_get = data;
    });
}

// _________________________________________________________________Request_________________________________________________________________ //

router.get('/', (req, res) => {
    ShareName();
    Share();
    ShareDG();
    res.render('index', {
        title: "Начальная",
        Home: true
    });
})

router.get("/Inventory", function (req, res) {
    ShareName();
    pool.query("SELECT * FROM pc_tu ORDER BY name ASC", function (err, data) {
        if (err) return console.log(err);
        Data_length = data.length;
        inv_data = data;
        ExcelCreate();
        res.render('Inventory', {
            title: "Инвентаризация",
            ActivInventory: true,
            aud_num: [unique],
            all: inv_data,
            DL: Data_length
        });
    });

    console.log("[i] | Step Inv");
});

router.get("/Net", function (req, res) {
    ShareName();
    pool.query("SELECT * FROM pc_tu ORDER BY name ASC", function (err, result) {
        if (err) return console.log(err);
        Data_length = result.length;
        res.render('Network', {
            title: "Сеть",
            ActivNet: true,
            aud_num: [unique],
            all: result,
            DL: Data_length
        });
        console.log("[i] | Scan complete");
    });
    console.log("[i] | Step Net");
});

router.post("/*/Inventory", urlencodedParser,function (request, response) {
    if (!request.body) return response.sendStatus(400);
    ShareName();
    if(request.body.upvote == undefined){
        pool.query("SELECT * FROM pc_tu WHERE name NOT LIKE '%STUD%' ORDER BY name ASC", function (err, data) {
            if (err) return console.log(err);
            Data_length = data.length;
            inv_data = data;
            ExcelCreate();

            response.render("Inventory", {
                title: "Инвентаризация "+"Сотрудники",
                ActivInventory: true, 
                aud_num: [unique],
                all: inv_data,
                DL: Data_length
            });
        });
    }else{
        pool.query("SELECT * FROM `pc_tu` WHERE name LIKE '" + `${request.body.upvote}` + "%' ORDER BY name ASC", function (err, data) {
            if (err) return console.log(err);
            Data_length = data.length;
            inv_data = data;
            ExcelCreate();
            response.render("Inventory", {
                title: "Инвентаризация "+`${request.body.upvote}`,
                ActivInventory: true, 
                aud_num: [unique],
                all: inv_data,
                DL: Data_length
            });
        });
    }
});

router.post("/*/Net", urlencodedParser,function (request, response) {
    if (!request.body) return response.sendStatus(400);
    ShareName();
    if(request.body.upvote == undefined){
        pool.query("SELECT * FROM pc_tu WHERE name NOT LIKE '%STUD%' ORDER BY name ASC", function (err, data) {
            if (err) return console.log(err);
            Data_length = data.length;
            work = data;
            response.render("Network", {
                title: "Network "+"Сотрудники",
                ActivNet: true,
                aud_num: [unique],
                all: work,
                DL: Data_length
            });
        });
    }else{
        pool.query("SELECT * FROM `pc_tu` WHERE name LIKE '" + `${request.body.upvote}` + "%' ORDER BY name ASC", function (err, data) {
            if (err) return console.log(err);
            Data_length = data.length;
            Aud = data;
            response.render("Network", {
                title: "Сеть "+`${request.body.upvote}`,
                ActivNet: true, 
                aud_num: [unique],
                all: Aud,
                DL: Data_length
            });
        });
    }
});

router.get("/Topology", function (req, res) {
    ShareDG();
    res.render('Topology', {
        title: "Топология сети",
        Topology: true,
        data: def_get
    });
    console.log("[i] | Step Net");
});

router.post("/update", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    pool.query("SELECT id FROM pc_tu WHERE sn LIKE '" + `${request.body.Old}`, function (err, data) {
        if (err) return console.log(err);
        for (let i = 0; i < data.length; i++) {
            id_old_sn = data[i].id;
        }
        pool.query("UPDATE `pc_tu` SET sn = " + `'${request.body.New}'` + " WHERE id = " + `'${id_old_sn}'`, function (err, data){
            if (err) return console.log(err);
            response.json(request.body);
        });
    });
});

router.post("/delite", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    pool.query("DELETE FROM pc_tu WHERE `pc_tu`.`mac` =" + `'${request.body.Mac}'`, function (err, data) {
        if (err) return console.log(err);
        ShareAud();
        response.json(request.body);
    });
});

router.post("/com", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    pool.query("SELECT id FROM pc_tu WHERE mac LIKE '" + `${request.body.Mac_com}` + "%'", function (err, data) {
        if (err) return console.log(err);
        for (let i = 0; i < data.length; i++) {
            id_old_com = data[i].id;
        }
        pool.query("UPDATE `pc_tu` SET comment = " + `'${request.body.New_comm}'` + " WHERE id = " + `'${id_old_com}'`, function (err, data){
            if (err) return console.log(err);
            response.json(request.body);
        });
    });
});

// _________________________________________________________________Excel_________________________________________________________________ //

function ExcelCreate(){

    const fileName = './Excel/DB_Table.xlsx';
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Всё');

        // for(let i=0; i < unique.length; i++){
        //     wb.addWorksheet(`${unique[i]}`);
        // }

    ws.columns = [
        { header: 'Имя', key: 'Name', width: 20 },
        { header: 'Дата | Время', key: 'DT', width: 20 },
        { header: 'Модель', key: 'model', width: 35},
        { header: 'Монитор', key: 'screen_sn', width: 45},
        { header: 'Серийный номер', key: 'sn', width: 18},
        { header: 'Комментарий', key: 'comment', width: 50}
    ];

    for(let i = 0; i < inv_data.length; i++){
        ws.addRow( [inv_data[i].name,
            `${inv_data[i].date}`+" | "+`${inv_data[i].time}`,
            inv_data[i].model,
            inv_data[i].screen_sn,
            inv_data[i].sn,
            inv_data[i].comment
        ] ) ;
    }
            
         
        wb.xlsx
        .writeFile(fileName)
        .then(() => {
            console.log('file created');
        })
        .catch(err => {
            console.log(err.message);
        });

}


module.exports = router;