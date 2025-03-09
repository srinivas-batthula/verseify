const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler')
const DataBaseRouter = require('./DataBaseRouter')
const AuthRouter = require('./AuthRouter')
const PaymentRouter = require('./PaymentRouter')
const SearchController = require('../controllers/SearchController')


router.use('/db', DataBaseRouter)

router.use('/auth', AuthRouter)

router.use('/razorpay', PaymentRouter)

router.get('/search', asyncHandler(SearchController.search))




module.exports = router;
