const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sequelize1', 'root', '661553', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
const Op = Sequelize.Op;

class User extends Model { }
User.init({
    username:{
        type:DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'user',
    freezeTableName: true,
    // underscored: true,
});

class Address extends Model { }
Address.init({
    address: {
        type:DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'address',
    freezeTableName: true,
    // underscored: true,
});

User.hasOne(Address);
Address.belongsTo(User);

class Book extends Model { }
Book.init({
    bookName:{
        type:DataTypes.STRING
    }
},{
    sequelize,
    modelName:'book',
    freezeTableName:true
});

User.hasMany(Book);
Book.belongsTo(User);

class Teacher extends Model { }
Teacher.init({
    name:{
        type:DataTypes.STRING
    }
},{
    sequelize,
    modelName:'teacher',
    freezeTableName:true
});

class Student extends Model { }
Student.init({
    name:{
        type:DataTypes.STRING
    }
},{
    sequelize,
    modelName:'student',
    freezeTableName:true
});

class MiddleTeacherStudent extends Model { }
MiddleTeacherStudent.init({
    type:{
        type:DataTypes.INTEGER
    }
},{
    sequelize,
    modelName:'middleTeacherStudent',
    freezeTableName:true
});

// 多对多不能使用hasMany，必须用belongsToMany 而且必须有一张中间表，如果不用中间表就会报错

//理解多对多：
//1.其实一直都理解错了多对多的概念,在1对多的概念里 ** 1 hasMany 2，2 belongsTo (1) ** ，1有 许多2，2 属于 1
//2.而多对多，从字面意思来理解，belongsToMany ** 1 belongsToMany 2，2 belongsToMany 1 **, 1 属于 许多2，2属于 许多1
//它们是独立的，不存在1对多的那种 他和她们 的关系
//3.所以就有了牵红钱的人，就是中间表，中间表存了 他们和她们 的id（可以比喻为他们和她们的姓名）,自己也有一个id（比喻为自己的姓名），
//这个牵红线的人手里有一本小本子，给他们和她们分了组（比如type），type:0的那群他们，对应了type:0的她们
Teacher.belongsToMany(Student,{ through:MiddleTeacherStudent });
Student.belongsToMany(Teacher,{ through:MiddleTeacherStudent });

//用来做聚合查询的数据模型
class People extends Model { };
People.init({
    name:{
        type:DataTypes.STRING,
    },
    age:{
        type:DataTypes.INTEGER
    }
},{
    sequelize,
    modelName:'people',
    freezeTableName:true
});

sequelize.sync()
// sequelize.sync({ force: true })
    // .then(() => User.create({
    //     username: 'Jane'
    // }))
    // .then(Jane => {
    //     console.log(Jane.toJSON());
    // });

module.exports = {
    Op,
    sequelize,
    User,
    Address,
    Book,
    Teacher,
    Student,
    People
};