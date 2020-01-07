/*
user info model
field|type
_id: unique id, mongodb自动生成, 作为其他所有用到User表的reference
nickname: String, 用于个人页面展示，可以修改
email: String, 登录使用
password: String, hash形式存储，登录使用
address: String， 可选，可在个人信息页面修改
adopt: list of ObjectIds, 被该用户领养的宠物，用于个人中心
postlost: list of ObjectIds, 该用户发送的走失信息，用于个人中心
postpet: list of ObjectIds, 该用户上传的宠物信息，用于个人中心
favorite: list of ObjectIds, 该用户收藏的走失宠物，用于个人中心
role: String, user/office 用于判断是否官方救助站

获取方式：在个人中心页面，
相关事件操作：

*/

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false,
    },
    adopt: [{type: Schema.Types.ObjectId, ref: 'Pet'}],
    postlost: [{type: Schema.Types.ObjectId, ref: 'Lost'}],
    postpet: [{type: Schema.Types.ObjectId, ref: 'Pet'}],
    favorite: [{type: Schema.Types.ObjectId, ref: 'Pet'}],
});

UserSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt){
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) return next(err);
            user.password = hash;
            next();
        })
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);