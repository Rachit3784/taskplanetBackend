import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "Users",
    required: true
  },
  PostImageUrl : {
    type : String,
    default : ''
  },
  PostTitle: {
  type: String,
  default: "",
},

PostDescription: {
  type: String,
  default: "",
},


  TotalLikes: { type: Number, default: 0 },
  TotalComments: { type: Number, default: 0 },

  Comments: [
  {
    commentId: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    comment: {
      type: String,
      default: ""
    }
  }
],

  Likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }]


}, { timestamps: true });

export const PostModel = mongoose.model("Posts", PostSchema);
