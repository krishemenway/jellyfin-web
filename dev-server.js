const express = require('express');
const app = express();
const port = 3000;

app.use("/app.js", function(req, res) {
	res.sendFile("dist/app.js", { root: __dirname });
});

app.use("/favicon.ico", function(req, res) {
	res.sendFile("dist/favicon.ico", { root: __dirname });
});

app.use("/", function(req, res) {
	res.sendFile("dist/app.html", { root: __dirname });
});

app.use(express.static("dist"));
app.listen(port, () => console.log(`Dev Server started on port ${port}!`));
