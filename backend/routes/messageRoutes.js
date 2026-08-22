const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.post("/", createMessage);                      // public: submit contact form
router.get("/", protect, getMessages);                // admin only
router.get("/:id", protect, getMessageById);          // admin only
router.put("/:id", protect, updateMessage);           // admin only
router.delete("/:id", protect, deleteMessage);        // admin only

module.exports = router;
