/* eslint-disable */
const express = require("express");
const path = require("path");
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const app = express();
//const compiler = webpack(webpackConfig);
const port = 1337;

// webpack hmr
// app.use(
//     require('webpack-dev-middleware')(compiler, {
//         noInfo: true,
//         publicPath: webpackConfig.output.publicPath
//     })
// );
// app.use(require('webpack-hot-middleware')(compiler));

// static assets
app.use("/", express.static("dist"));
app.use("/dist/assets/", express.static("dist/assets"));

// headers for api
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// main route
app.get("*", function(req, res){
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// app start up
app.listen(port, (err) => {
    if(err)
        throw err;
    console.log("server started: http://localhost:"+port);
});