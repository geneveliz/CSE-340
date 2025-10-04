// funtion error
const express = require("express")
const router = express.Router()

router.get("/trigger", (req, res, next) => {
  next(new Error("This is a footer-based error test"))
})

module.exports = router
