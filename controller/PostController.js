import { deleteFromCloudinary, uploadBuffer } from "../config/ConnectCloudinary.js";
import { PostModel } from "../models/PostSchema.js";
import { v4 as uuid } from "uuid";


export const AddPost = async (req, res) => {
  try {
    const { PostTitle, PostDescription } = req.body;

    const data = req.MatchedUser; // from token middleware
    
    const userId = data.userId
    const imageFile = req.files?.postImage?.[0];

    // At least one field required
    if (!PostTitle && !PostDescription && !imageFile) {
      return res.status(400).json({
        success: false,
        msg: "Add title, description or image",
      });
    }

    let imageUrl = "";

    if (imageFile) {
      const uploadRes = await uploadBuffer(imageFile.buffer, {
        folder: "posts",
      });
      imageUrl = uploadRes.secure_url;
    }

    const post = await PostModel.create({
      UserId: userId,
      PostTitle: PostTitle || "",
      PostDescription: PostDescription || "",
      PostImageUrl: imageUrl,
    });

    res.status(200).json({ success: true, post });
  } catch (err) {
    console.log("Add Post Error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};


export const fetchPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;

    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("UserId", "username fullname profile")
      .lean();

    const updatedPosts = posts.map(post => {
      const likesArray = Array.isArray(post.Likes) ? post.Likes : [];

      const isLiked = likesArray.some(
        likeId => likeId && likeId.toString() === userId
      );

      return {
        ...post,
        isLiked,
        TotalLikes: likesArray.length
      };
    });

    return res.status(200).json({
      msg: "Successfully Fetched",
      Posts: updatedPosts,
      success: true
    });

  } catch (err) {
    console.log("Fetch Post Error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const fetchMyPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;

    // Fetch all posts for this user
    const posts = await PostModel.find({ UserId: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("UserId", "username fullname profile")
      .lean();

    const updatedPosts = posts.map(post => {
      const likesArray = Array.isArray(post.Likes) ? post.Likes : [];

      const isLiked = likesArray.some(
        likeId => likeId && likeId.toString() === userId
      );

      return {
        ...post,
        isLiked,
        TotalLikes: likesArray.length
      };
    });

    return res.status(200).json({
      msg: "Successfully Fetched",
      Posts: updatedPosts,
      success: true
    });

  } catch (err) {
    console.log("Fetch Post Error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const DeleteMyPosts = async (req, res) => {
  try {
    const {  userId , postId} = req.body;

    const posts = await PostModel.findByIdAndDelete(postId)
      
    return res.status(200).json({
      msg: "Successfully Deleted",
      success: true
    });

  } catch (err) {
    console.log("Fetch Post Error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};


export const LikePost = async (req, res) => {
  try {
    const { userId, postId } = req.body; 

    if (!userId || !postId)
      return res.status(400).json({ success: false, msg: "Missing data" });

    const post = await PostModel.findById(postId);
    if (!post)
      return res.status(404).json({ success: false, msg: "Post not found" });

    const alreadyLiked = post.Likes.includes(userId);

    let updatedPost;

    if (alreadyLiked) {
      // UNLIKE
      updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $pull: { Likes: userId },
          $inc: { TotalLikes: -1 },
        },
        { new: true }
      );
    } else {
      // LIKE
      updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $addToSet: { Likes: userId }, // duplicate like nahi hoga
          $inc: { TotalLikes: 1 },
        },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      totalLikes: updatedPost.TotalLikes,
    });

  } catch (err) {
    console.log("Like Post Error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};


export const loadComments = async (req, res) => {
  try {
    const { postId, page = 1, limit = 10 } = req.query;
    const post = await PostModel.findById(postId).populate("Comments.userId", "username fullname profile");

    if (!post) return res.status(404).json({ success: false, msg: "Post not found" });

    // Reverse poore array ko pehle karein taaki newest top par rahein
    const allComments = [...post.Comments].reverse(); 
    
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const comments = allComments.slice(skip, skip + limitNum);
    const total = allComments.length;

    res.status(200).json({
      success: true,
      comments,
      hasMore: skip + limitNum < total
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId, userId } = req.body;

    if (!postId || !commentId || !userId)
      return res.status(400).json({ success: false, msg: "Missing data" });

    const post = await PostModel.findById(postId);

    if (!post)
      return res.status(404).json({ success: false, msg: "Post not found" });

    const comment = post.Comments.find(c => c.commentId === commentId);

    if (!comment)
      return res.status(404).json({ success: false, msg: "Comment not found" });

    if (comment.userId.toString() !== userId)
      return res.status(403).json({ success: false, msg: "Not allowed" });

    await PostModel.findByIdAndUpdate(postId, {
      $pull: { Comments: { commentId } },
      $inc: { TotalComments: -1 }
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.log("Delete Comment Error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};




export const addCommentPost = async (req, res) => {
  try {
    const { postId, userId, comment } = req.body;

    if (!postId || !userId || !comment)
      return res.status(400).json({ success: false, msg: "Missing data" });

    const newComment = {
      commentId: uuid(),   // ✅ FIXED
      userId,
      comment
    };

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $push: { Comments: newComment },
        $inc: { TotalComments: 1 }
      },
      { new: true }
    ).populate("Comments.userId", "username fullname profile");

    if (!updatedPost)
      return res.status(404).json({ success: false, msg: "Post not found" });

    res.status(200).json({
      success: true,
      comment: updatedPost.Comments.at(-1)
    });

  } catch (err) {
    console.log("Add Comment Error:", err);
    res.status(500).json({ success: false });
  }
};
