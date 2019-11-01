const Router = require('koa-router');
const router = new Router();

const { User } = require('../controllers/user');

router.get('/',User);

module.exports = router;