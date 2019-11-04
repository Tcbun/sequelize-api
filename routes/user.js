const Router = require('koa-router');
const router = new Router();

const { userCreateOTO,userChangeOTO,userDeleteOTO,userFindOTO,userFindAllOTO,userCreateOTM,userCreateManyOTM,
    userChangeManyOTM,userDeleteManyOTM,userFindManyOTM,userFindAllBooksOTM,userFindAllUserOTM,userCreateMTM,
    useCreateMTM2,userCreateMTM3,userChangeMTM,userChangeMTM2,userDeleteMTM,userFindAllMTM,userFindAllMTM2,
    userFindAllMTM3,userCreatePeople,userFindMax,userFindMax2,userFindAllRaw,userFindOrder,userFindOrder2,
    userFindOrderRequiredFalse
} = require('../controllers/user');
//一对一
router.get('/userCreateOTO',userCreateOTO);
router.get('/userChangeOTO',userChangeOTO);
router.get('/userDeleteOTO',userDeleteOTO);
router.get('/userFindOTO',userFindOTO);
router.get('/userFindAllOTO',userFindAllOTO);
//一对多
router.get('/userCreateOTM',userCreateOTM);
router.get('/userCreateManyOTM',userCreateManyOTM);
router.get('/userChangeManyOTM',userChangeManyOTM);
router.get('/userDeleteManyOTM',userDeleteManyOTM);
router.get('/userFindManyOTM',userFindManyOTM);
router.get('/userFindAllBooksOTM',userFindAllBooksOTM);
router.get('/userFindAllUserOTM',userFindAllUserOTM);
//多对多
router.get('/userCreateMTM',userCreateMTM);
router.get('/useCreateMTM2',useCreateMTM2);
router.get('/userCreateMTM3',userCreateMTM3);
router.get('/userChangeMTM',userChangeMTM);
router.get('/userChangeMTM2',userChangeMTM2);
router.get('/userDeleteMTM',userDeleteMTM);
router.get('/userFindAllMTM',userFindAllMTM);
router.get('/userFindAllMTM2',userFindAllMTM2);
router.get('/userFindAllMTM3',userFindAllMTM3);
// 聚合查询
router.post('/userCreatePeople',userCreatePeople);
router.get('/userFindMax',userFindMax);
router.get('/userFindMax2',userFindMax2);
router.get('/userFindAllRaw',userFindAllRaw);
router.get('/userFindOrder',userFindOrder);
router.get('/userFindOrderRequiredFalse',userFindOrderRequiredFalse);

module.exports = router;