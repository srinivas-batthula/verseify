const router = require('express').Router()
const multer = require('multer')
const asyncHandler = require('../utils/asyncHandler')
const UserController = require('../controllers/UserController')
const BlogController = require('../controllers/BlogController')
const CommentController = require('../controllers/CommentController')
const {Authorization_Middleware} = require('../controllers/AuthController')


const uploads = multer({ storage: multer.memoryStorage() })

router.route('/user')                                      //Users...
    .get(Authorization_Middleware, asyncHandler(UserController.getUser));

router.route('/users/:id')
    .get(asyncHandler(UserController.get))
    .patch(Authorization_Middleware, uploads.single('file'), asyncHandler(UserController.update))
    .delete(Authorization_Middleware, asyncHandler(UserController.remove));

                                                        //dashboard...
router.get('/dashboard', Authorization_Middleware, asyncHandler(UserController.dashboard));


router.route('/follow/:id')                                 //Follow / UnFollow
    .get(asyncHandler(UserController.follow))
    .patch(Authorization_Middleware, asyncHandler(UserController.followUpdate));


router.route('/blogs/user/:userId')                         // My Blogs...
    .get(asyncHandler(BlogController.myBlogs));


router.route('/blogs')                                      //Blogs...
    .get(asyncHandler(BlogController.getAll));

router.route('/blogs/:userId')
    .post(Authorization_Middleware, uploads.single('file'), asyncHandler(BlogController.create));

router.route('/blogs/:id')
    .get(asyncHandler(BlogController.get))
    .patch(Authorization_Middleware, asyncHandler(BlogController.update))
    .delete(Authorization_Middleware, asyncHandler(BlogController.remove));

// User id :  67b72b4603509deecc88be47   &&   Blog id :  67bea5d6874a6c5445f6bd0b  &&   Comment id : 67beae3bef8caa09d4f45b41

router.route('/comments/:blogId')
    .get(asyncHandler(CommentController.getAll))
    .post(Authorization_Middleware, asyncHandler(CommentController.create));

router.route('/comments/:id')
    .patch(Authorization_Middleware, asyncHandler(CommentController.update));





module.exports = router
