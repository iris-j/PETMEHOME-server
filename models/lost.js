/*
lost info model
field|type
_id: unique id, mongodb自动生成
reporter: ObjectId, 作为外键连接到user表
date: Date
address: String
detail: String
contact: String
images: String[]
displayed: Boolean 对于已经找回的，不显示？
获取方式：在走失信息页面，首先get所有丢失信息，分解返回的json object，显示在卡片页面上(*ngFor)
每个卡片点击事件触发时，将id（或整个item）传给某个函数，让它通过id来query对应的详细信息并显示在详情页
相关事件操作：
1. 查看丢失信息，get整个item
2. 发布走失信息，post整个item
3. 根据地址信息，查询user表，推送给附近的user
4. 点击提供信息，按reporter查询user表
5. 点击关注，添加user_id 和 lost_id到某个表，或直接append到user的关注列表中
*/


/* Import the Mongoose software module */
var mongoose 			=	require('mongoose'),
	Schema 				=	mongoose.Schema,

    /* Define the schema rules (field names, types and rules) */
	LOSTSchema 		=	new Schema({
	   reporter     : { type: Schema.Types.ObjectId, ref: 'User'},
	   address   	: { type : String, required : true },
	   title        : { type: String, required: true},
	   detail	    : { type : String, required : true },
	   contact 	    : { type : String, required : true },
	   images       : { type : Array, required: true},
	   date 		: { type: Date, default: Date.now }
	});

/* Export model for application usage */
module.exports = mongoose.model('Lost', LOSTSchema);