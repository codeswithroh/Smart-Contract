const express = require("express");
const Modules = require("./Modules");

const router = express.Router();

Modules.forEach((module) => router.use(module.path, module.route));

module.exports = router;
