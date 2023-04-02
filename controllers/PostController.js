import PostModel from "../models/Post.js";

export const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5);
    const tags = posts.map((post) => post.tags).flat();
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to return tags",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({
      path: "user",
      select: "-password -__v -createdAt -updatedAt -email",
    });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to return posts",
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { views: 1 },
      },
      { new: true }
    ).populate({
      path: "user",
      select: "-password -__v -createdAt -updatedAt -email",
    });
    if (!post) {
      return res.status(500).json({
        message: "Not Found",
      });
    }
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to return post",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete post",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const newPost = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await newPost.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create a post",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const check = await PostModel.findById(postId);
    if (check.user.toString() === req.userId) {
      await PostModel.findByIdAndUpdate(postId, {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      });
      res.json({ success: true });
    } else {
      res.status(403).json({ message: "no permission" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update a post",
    });
  }
};
