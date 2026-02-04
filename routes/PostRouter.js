import express from "express"
import { verifyAdminToken, verifyToken } from "../Middleware/JwtVerify.js";
// import { AddProduct, AddProductImages, fetchAllMyProducts, fetchMyProducts, FetchSelectedProduct } from "../controller/Product.controller.js";
import { uploads } from "../config/MulterSetup.js";

import { addCommentPost, AddPost ,deleteComment,DeleteMyPosts,fetchMyPosts,fetchPosts, LikePost, loadComments} from "../controller/PostController.js";

export const PostRouter = express.Router();


PostRouter.post(
  "/add-post",
  verifyToken,
  uploads.fields([{ name: "postImage", maxCount: 1 }]),
  AddPost
)

PostRouter.get('/fetch-posts' , verifyToken, fetchPosts);
PostRouter.post('/like-post',verifyAdminToken,LikePost);
PostRouter.post('/add-comment',verifyAdminToken,addCommentPost);
PostRouter.get('/comments',verifyAdminToken,loadComments);
PostRouter.post('/delete-comment',verifyAdminToken,deleteComment);
PostRouter.get('/fetchmypost',verifyAdminToken,fetchMyPosts);
PostRouter.post('/delete-post',verifyAdminToken,DeleteMyPosts)

// ProductRouter.post('/add-product-images',verifyAdminToken,  uploads.fields([{ name: "images", maxCount: 5 }]), AddProductImages)

// ProductRouter.get('/fetch-all-my-product' , verifyAdminToken, fetchAllMyProducts);
// ProductRouter.get('/fetch-selected-product' , verifyAdminToken, FetchSelectedProduct);



