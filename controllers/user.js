const { Op, sequelize, User, Address, Book, Teacher, Student, People,TestReferences } = require('../model');
class UserCtl {

    /**
     * 一对一
     */

    // 新增
    async userCreateOTO(ctx) {
        const user = await User.create({ username: '钱松科' });
        const address = await user.createAddress({ address: '天元' });
        ctx.body = { address };
    };
    // 改
    async userChangeOTO(ctx) {
        const user = await User.findOne({ where: { id: 2 } });
        const address = await Address.create({ address: '余姚' });
        const changed = await user.setAddress(address);
        ctx.body = { changed }
    };
    // 删
    async userDeleteOTO(ctx) {
        const user = await User.findOne({ where: { id: 1 } });
        const changed = await user.setAddress(null);
        ctx.body = { changed }
    };
    // 查
    async userFindOTO(ctx) {
        const user = await User.findOne({ where: { id: 2 } });
        const result = await user.getAddress();
        ctx.body = { result };
    };
    // 根据用户返回所有关联表的信息
    async userFindAllOTO(ctx) {
        const result = await User.findOne({
            where: {
                id: 2
            },
            include: [Address]
        });
        ctx.body = { result };
    };

    /**
     * 一对多
     */

    //增
    async userCreateOTM(ctx) {
        const user = await User.create({ username: 'OTM钱松科' });
        const book = await user.createBook({ bookName: '我爱JS' });
        ctx.body = { book };
    };

    //增2
    async userCreateManyOTM(ctx) {
        // 因为要更改book1 book2，用let不要用const 否则常量会报错
        let user = await User.create({ username: 'OTM钱松科' });
        let book1 = await user.createBook({ bookName: '我爱JS1' });
        let book2 = await user.createBook({ bookName: '我爱JS2' });
        book1 = await user.addBook(book1);
        book2 = await user.addBook(book2);
        ctx.body = { book1, book2 };
    };

    //改 改/更新其实就是把外键给删掉了，记录还在的，删除还是同个道理
    async userChangeManyOTM(ctx) {
        const user = await User.findOne({ where: { id: 11 } });
        const upBook1 = await user.createBook({ bookName: '我不爱JS1' });
        const upBook2 = await user.createBook({ bookName: '我不爱JS2' });
        const upUser = await user.setBooks([upBook1, upBook2]);//小心这里要用Books而不是book
        ctx.body = { upUser };
    };

    //删
    async userDeleteManyOTM(ctx) {
        const user = await User.findOne({ where: { id: 11 } });
        const result = await user.setBooks([]);
        ctx.body = { result };
    };

    //查
    async userFindManyOTM(ctx) {
        const user = await User.findOne({ where: { id: 12 } });
        const result = await user.getBooks();
        ctx.body = { result };
    }

    // 查所有满足条件的Book,同时查询属于哪本书 v5.9 model:[User] v5.
    async userFindAllBooksOTM(ctx) {
        const result = await Book.findAll({
            where: { userId: 12 },
            include: [{
                model: User,
                attributes: ['username']
            }],
            attributes: ['bookName', 'userId']
        });
        ctx.body = { result };
    };

    // 查所有满足条件的User,同时查询用有的书名
    async userFindAllUserOTM(ctx) {
        const result = await User.findAll({
            where: { id: 12 },
            include: [{
                model: Book,
                attributes: ['bookName']
            }],
            attributes: ['username']
        });
        ctx.body = { result };
    }

    /**
     * 多对多
     */

    // 创建1 多对多不能使用hasMany，必须都用belongsToMany 而且必须有一张中间表，如果不用中间表就会报错
    //直接创建法
    async userCreateMTM(ctx) {
        const teacher = await Teacher.create({ name: '老师1' });
        const student = await teacher.createStudent({ name: '学生1' }, { through: { type: 0 } });
        ctx.body = { student };
    };

    //创建2 add创建法
    async useCreateMTM2(ctx) {
        const teacher = await Teacher.create({ name: '老师2' });
        const student = await Student.create({ name: '学生2' });
        const result = await teacher.addStudents(student, { through: { type: 1 } });
        ctx.body = { result };
    };

    //创建3 add批量添加
    async userCreateMTM3(ctx) {
        const teacher1 = await Teacher.create({ name: '老师1' });
        const teacher2 = await Teacher.create({ name: '老师2' });
        const student1 = await Student.create({ name: '学生1' });
        const student2 = await Student.create({ name: '学生1' });
        const student3 = await Student.create({ name: '学生2' });
        const student4 = await Student.create({ name: '学生2' });
        const result1 = await teacher1.addStudents([student1, student2], { through: { type: 9 } });
        const result2 = await teacher2.addStudents([student3, student4], { through: { type: 9 } });
        ctx.body = { result1, result2 };
    };

    //修改 再多设置一些关联，多关联一些学生
    async userChangeMTM(ctx) {
        const teacher = await Teacher.findOne({
            where: {
                id: 10
            }
        });
        const banzhang = await Student.create({ name: '班长' });
        const tuanzhishu = await Student.create({ name: '团支书' });
        const result = await teacher.addStudents([banzhang, tuanzhishu], { through: { type: 9 } });
        ctx.body = { result };
    }

    // 修改2 重新设置关联
    async userChangeMTM2(ctx) {
        const teacher = await Teacher.findOne({ where: { id: 10 } });
        const banzhang = await Student.findOne({ where: { id: 19 } });
        const tuanzhishu = await Student.findOne({ where: { id: 20 } });
        //下面这段话注意，setStudents 班长和团支书 ，表示id为10的老师，仅关联班长和团支书，其他的关联取消，而不是取消班长和团支书的关联
        //你可以理解为重新设置关联
        //注意Students
        const result = await teacher.setStudents([banzhang, tuanzhishu], { through: { type: 10 } });
        ctx.body = { result };
    };

    // 删除
    async userDeleteMTM(ctx) {
        const teacher = await Teacher.findOne({ where: { id: 10 } });
        const student1 = await Student.findOne({ where: { id: 19 } });
        const student2 = await Student.findOne({ where: { id: 20 } });
        //删除一个
        const deleteOne = await teacher.removeStudent([student1], { through: { type: 10 } });
        //删除全部
        //注意Students
        const deleteAll = await teacher.setStudents([], { through: { type: 10 } });
        ctx.body = { deleteOne, deleteAll };
    };

    // 查询 查询学生的名字和中间表信息
    async userFindAllMTM(ctx) {
        const teacher = await Teacher.findOne({
            where: {
                id: 9
            },
            attributes: ['name', 'id']
        });
        //下面要加Students
        const result = await teacher.getStudents({ attributes: ['name'] });
        ctx.body = { result };
    };

    // 查询2 查询老师的信息和他的学生的信息
    async userFindAllMTM2(ctx) {
        const teacher = await Teacher.findOne({
            where: {
                id: 9
            },
            attributes: ['name', 'id'],
            include: [{
                model: Student,
                through: {
                    attributes: ['name', 'id']
                }
            }],
        });
        ctx.body = { teacher };
    };

    //查询3 查询某个学生有哪几个老师
    async userFindAllMTM3(ctx) {
        const student = await Student.findOne({
            where: {
                id: 10
            },
            attributes: ['name', 'id'],
            include: [{
                model: Teacher,
                through: {
                    attributes: ['name', 'id']
                }
            }]
        });
        ctx.body = { student };
    };

    /**
     * 聚合查询
     * People是数据模型
     */

    //创建一些聚合查询的数据模型
    async userCreatePeople(ctx) {
        const { name, age } = ctx.request.body;
        console.log(name, age);
        const people = await People.create({ name, age });
        ctx.body = { people };
    };

    //查
    async userFindMax(ctx) {
        const result = await People.max('age');
        ctx.body = { result };
    };

    //查2
    async userFindMax2(ctx) {
        const result = await People.max('age', {
            where: {
                age: {
                    [Op.lt]: 28
                }
            }
        });
        ctx.body = { result };
    };

    //原始查询
    async userFindAllRaw(ctx) {
        const result = await People.findAll({ raw: true });
        ctx.body = { result };
    };

    /**
     * 后续添加
     * @param {*} ctx 
     */
    // 一对多 排序查询
    async userFindOrder(ctx) {
        const result = await User.findAll({
            include: [Book],
            order: [['id', 'DESC']]
        });
        ctx.body = { result };
    };

    // required:false 这个为true的时候，所有查询到的User都会返回，如果是false,只有Book符合条件的才会返回
    async userFindOrderRequiredFalse(ctx) {
        const result = await User.findAll({
            include: [{
                model:Book, 
                required:false,
            }],
        });
        ctx.body = { result };
    };

    //多对多 排序查询
    // async userFindOrder2(ctx) {
    //     const result = await Teacher.findAll({
    //         include: [{
    //             model: Student,
    //             include: [
    //                 //老师包含学生模型>学生包含什么模型>再深层
    //             ]
    //         }],
    //         order: [[]]
    //     })
    //     ctx.body = { result };
    // };

    //嵌套查询
    // User.findAll({
    //     include: [
    //         { model: Tool, as: 'Instruments', include: [
    //             { model: Teacher, include: [ /* etc */] }
    //         ] }
    //     ]
    // }).then(users => {
    //     console.log(JSON.stringify(users))

    //嵌套查询的结果
    //     [{
    //     "name": "John Doe",
    //     "id": 1,
    //     "createdAt": "2013-03-20T20:31:45.000Z",
    //     "updatedAt": "2013-03-20T20:31:45.000Z",
    //     "Instruments": [{ // 1:M and N:M association
    //         "name": "Toothpick",
    //         "id": 1,
    //         "createdAt": null,
    //         "updatedAt": null,
    //         "userId": 1,
    //         "Teacher": { // 1:1 association
    //         "name": "Jimi Hendrix"
    //         }
    //     }]
    //     }]
    //  })

    //这将产生一个外连接. 但是,相关模型上的 where 语句将创建一个内部连接,并仅返回具有匹配子模型的实例. 要返回所有父实例,你应该添加 required: false.
    // User.findAll({
    //     include: [{
    //         model: Tool,
    //         as: 'Instruments',
    //         include: [{
    //             model: Teacher,
    //             where: {
    //                 school: "Woodstock Music School"
    //             },
    //             required: false
    //         }]
    //     }]
    // }).then(users => {
    //     /* ... */

    //查询所有模型的所有嵌套模型
    //User.findAll({ include: [{ all: true, nested: true }]});

    // references
    //自己试了试，比方说我创建了一个testReferences,我填写一个不想关的表，但是我可以直接引用其他表的信息，就这么个意思，可以不用hasOne,hasMany这样了
    async userTestReferences(ctx){
        const result = await TestReferences.create({
            name:'测试references',
            user_id:1
        });
        ctx.body = { result };
    }
}
module.exports = new UserCtl();