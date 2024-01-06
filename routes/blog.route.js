const express = require("express");
const router = express.Router();
const { blogController } = require("../controllers");
const auth = require("../middlewares/auth");

router.post("/add", auth(), blogController.createBlog);
router.get("/get/:id", auth(), blogController.getBlog);
router.get("/list", auth(), auth(), blogController.getList);
router.put("/update/:id", auth(), blogController.updateBlog);
router.delete("/delete/:id", auth(), blogController.deleteBlog);

module.exports = router;
