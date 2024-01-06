const catchAsync = require("../utils/catchAsync");
const { Blog } = require("../models");

// --------------- Create Blog Detail ------------------
const createBlog = catchAsync(async (req, res) => {
  try {
    const identity = req.user;
    const blog = await Blog.create({ ...req.body, userId: identity });
    return res.status(200).json({
      status: "200",
      message: "Blog created successfully!",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetcihng blog data !",
      error: error.message,
    });
  }
});

// --------------- Get One  Blog Data ------------------
const getBlog = catchAsync(async (req, res) => {
  try {
    const blogId = req.params.id;
    const blogDetail = await Blog.findById(blogId);
    return res.status(200).json({
      status: "200",
      message: "Blog data fetched successfully!",
      data: blogDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetcihng Blog data !",
      error: error.message,
    });
  }
});

// -------------------- Update Blog  ------------------
const updateBlog = catchAsync(async (req, res) => {
  try {
    const blogId = req.params.id;
    const blogDetail = await Blog.findOneAndUpdate({ _id: blogId }, req.body, {
      new: true,
    });
    return res.status(200).json({
      status: "200",
      message: "Blog data updated successfully!",
      data: blogDetail,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while updating blog data !",
      error: error.message,
    });
  }
});

// ------------------------ Delete selected Blog ------------------
const deleteBlog = catchAsync(async (req, res) => {
  try {
    const blogId = req.params.id;
    await Blog.findOneAndDelete({ _id: blogId });
    return res.status(200).json({
      status: "200",
      message: "Blog deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while deleting blog data !",
      error: error.message,
    });
  }
});

// --------------------- Get List of all blog's ------------------
const getList = catchAsync(async (req, res) => {
  const searchName = req.query.name;
  const currentUser = req.user;
  const perPage = 9; //  Number of documents to display on each page
  const page = req.query.page ? parseInt(req.query.page, 10) : 1; // It specify the selected page number

  let query = { userId: currentUser };

  if (searchName) {
    const searchValue = new RegExp(searchName, "i");
    query.$or = [{ title: searchValue }, { author: searchValue }];
  } // You can search Blog through title or author

  try {
    const totalCount = await Blog.countDocuments(query);

    const blogList = await Blog.find(query)
      .populate("userId")
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.status(200).json({
      status: "200",
      message: "Blog list fetched successfully!",
      data: blogList,
      page,
      totalPages: Math.ceil(totalCount / perPage),
      count: blogList.length,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while fetching blog list!",
      error: error.message,
    });
  }
});

module.exports = {
  createBlog,
  getBlog,
  updateBlog,
  getList,
  deleteBlog,
};
