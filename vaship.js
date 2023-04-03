const express = require('express');
const exphbs = require('express-handlebars');
const Routes = require('./routes/rout');


const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(Routes);

app.use(express.static(__dirname + "/style"));
app.use(express.static(__dirname + "/script"));
app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/Excel"));

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});