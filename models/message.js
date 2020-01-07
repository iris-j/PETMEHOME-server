/*
message model
field|type
_id: unique id, mongodb自动生成
from: ObjectId, 作为外键连接到user表, 发信人
to: ObjectId, 收信人
petid: ObjectId, 作为外键连接到lost表
message: String
date: Date

相关事件操作：
1. 点击发送信息，获取current_user和收信方，记录消息和时间
2. 在个人中心，点击我的消息，查看所有收到的消息
走失信息和领养沟通信息似乎都能搞定
*/

/* Import the Mongoose software module */
var mongoose 			=	require('mongoose'),
	Schema 				=	mongoose.Schema,

    /* Define the schema rules (field names, types and rules) */
	MESSAGESchema 		=	new Schema({
	   from         : { type: Schema.Types.ObjectId, ref: 'User'},
	   to        	: { type: Schema.Types.ObjectId, ref: 'User' },
	   lostid        : { type: Schema.Types.ObjectId, ref: 'Lost'},
	   petid         : { type: Schema.Types.ObjectId, ref: 'Pet'},
	   message	    : { type : String, required : true },
	   date 		: { type: Date, default: Date.now }
	});

/* Export model for application usage */
module.exports = mongoose.model('Message', MESSAGESchema);