const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("title")) {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  }
  next();
});
blogSchema.plugin(toJSON);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
