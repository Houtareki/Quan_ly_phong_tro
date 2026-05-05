const express = require("express");
const router = express.Router();
const {
  getMyRoom,
  getMyInvoices,
  createSupportRequest
} = require("../controllers/user.controller");

//const requireLogin = require("../middleware/requireLogin");

router.get("/my-room", requireLogin, getMyRoom);
router.get("/my-invoices", requireLogin, getMyInvoices);
router.post("/support", requireLogin, createSupportRequest);

module.exports = router;