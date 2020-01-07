/*
pet info model
field|type
_id: unique id, mongodb自动生成
reporter: ObjectId, 作为外键连接到user表
name: String
sex: Boolean
age: String
type: String
size: String
address: String
images: String[]
displayed: Boolean 对于已经被领养的，不显示在发现页
reward: Number 可选
获取方式：在发现页面，首先get所有救助站宠物信息，分解返回的json object，显示在卡片页面上(*ngFor)
每个卡片点击事件触发时，将id（或整个item）传给某个函数，让它通过id来query对应的详细信息并显示在详情页
相关事件操作：
1. 查看宠物信息，get整个item
2. 发布宠物信息，post整个item，需要判断是否为官方救助站
3. 根据地址信息，查询user表，推送给附近的user
4. 点击我要领养，按reporter查询user表
5. 点击关注，添加user_id 和 pet_id到某个表，或直接append到user的关注列表中
*/


/* Import the Mongoose software module */
var mongoose 			=	require('mongoose'),
	Schema 				=	mongoose.Schema,
	PETSchema 		=	new Schema({
	   reporter     : { type : Schema.Types.ObjectId, ref: 'User'},
	   name   		: { type : String, required : true, max : 50 },
	   sex	        : { type : Boolean, required : true },
	   age       	: { type : String },
	   type 		: { type : String, required: true },
	   size			: { type : String},
	   address		: { type : String, required: true },
	   images		: { type : Array},
	   displayed    : { type : Boolean, default: true},
	});

/* Export model for application usage */
module.exports = mongoose.model('Pet', PETSchema);