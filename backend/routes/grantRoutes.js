const express = require("express");
const router = express.Router();
const {
  createGrant,
  getGrants,
  getGrantById,
  updateGrant,
  deleteGrant,
  getGrantPDF,
  updateGrantFromWebhook
} = require("../controllers/grantController");

// Public routes
router.get("/", getGrants);
router.get("/:id", getGrantById);
router.get("/:id/pdf", getGrantPDF);

// Create and update
router.post("/create", createGrant);
router.put("/:id", updateGrant);

// Delete
router.delete("/:id", deleteGrant);

// Webhook for n8n
router.post("/webhook/update", updateGrantFromWebhook);

module.exports = router;