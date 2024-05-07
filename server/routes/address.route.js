const express = require("express");
const AddressController = require("../controllers/address.controller");

const router = express.Router();

router.post("/", AddressController.createAddress);
router.get("/", AddressController.getAddress);

module.exports = router;
