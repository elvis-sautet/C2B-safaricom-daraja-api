const {
  registerUrl,
  simulatePayment,
  validation,
} = require("../controllers/mpesa");

const router = require("express").Router();

// mpesa routes
router.post("/register-url", registerUrl);

// simulate c2b transaction
router.post("/simulate-payment", simulatePayment);

// confirm payment
router.post("/confirmation", (req, res) => {
  console.log(req.body);
  console.log(`------------confirmation------------`);
});

router.post("/validation", (req, res) => {
  console.log(req.body);
  console.log(`------------validation------------`);
});

module.exports = router;
