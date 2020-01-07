var express         = require('express'),
    apiRouter          = express.Router();
var userController  = require('./controller/user_controller');
var passport	    = require('passport');
var pet         = require('./models/pet');
var lost        = require('./models/lost');
var user        = require('./models/user');
var message     = require('./models/message');

apiRouter.get('/', (req, res)=>{
        return res.send('Hello, this is the API.');
});

apiRouter.post('/register', userController.registerUser);
apiRouter.post('/login', userController.loginUser);
apiRouter.post('/changepassword', userController.changePassword);

apiRouter.get('/user', function(req, res){
   user.find({}, (err, recs) =>
   {
      if (err){
         console.dir(err);
      }
      res.json({ records: recs });

   });

});
apiRouter.get('/personal/:recordID', function(req, res){
   user.findById({_id: req.params.recordID }, (err, recs) => {
   }).populate('adopt')
   .populate('postlost')
   .populate('postpet')
   .populate('favorite')
   .exec((err, user)=>{
      if (err) console.dir(err);
      else {
         res.json(user);
      }
   })
});

// get specific user information
apiRouter.get('/user/:recordID', function(req,res){
   user.findById({ _id: req.params.recordID }, (err, recs) => {
      if (err) console.dir(err);
      else{
         res.json({records: recs});
      }
   });
});

apiRouter.put('/user/:recordID', function(req,res){
   user.findById({ _id: req.params.recordID }, (err, recs) =>
      {
         if (err)
         {
            console.dir(err);
         }
         else
         {
            // 修改User表时，可以通过指明一个action来判断具体操作。
            if (req.body.action=="adopt"){
               // 防止重复领养，或者通过修改pet状态实现
               if (recs.adopt.indexOf(req.body.petid) == -1){
                  recs.adopt.push(req.body.petid);
               }
            }
            else if (req.body.action=="postlost"){
               if (recs.postlost.indexOf(req.body.lostid) == -1){
                  recs.postlost.push(req.body.lostid);
               }
            }
            else if (req.body.action=="postpet"){
               if (recs.postpet.indexOf(req.body.petid) == -1){
                  recs.postpet.push(req.body.petid);
               }
            }
            else if (req.body.action=="follow"){
               if (recs.favorite.indexOf(req.body.petid) == -1){
                  recs.favorite.push(req.body.petid);
               }
            }
            else if (req.body.action=="unfollow"){
               if (recs.favorite.indexOf(req.body.petid) != -1){
                  recs.favorite.splice(recs.favorite.indexOf(req.body.petid), 1);
               }
            }
            else if (req.body.action=="editprofile"){
               recs.avatar = req.body.avatar || recs.avatar;
               recs.nickname = req.body.nickname || recs.nickname;
               if (req.body.address){
                  recs.address = req.body.address;
               }
            }
            
            recs.save((err, recs) =>{
               if (err){
                  res.status(500).send(err)
               }
               res.json({ records: recs });
            });
         }
      });

});

apiRouter.get('/pet', function(req, res)
{
    /* Use the pet model and access Mongoose's API to
      retrieve ALL MongoDB documents whose displayed field
      has a value of true */
   pet.find({displayed: true }, (err, recs) => {
   }).populate('reporter')
   .exec((err, pet)=>{
      if (err) console.dir(err);
      else {
         res.json(pet);
      }
   })
   
   
   // pet.find({ displayed: true }, (err, recs) =>
   // {
   //    /* If we encounter an error log this to the console */
   //    if (err)
   //    {
   //       console.dir(err);
   //    }

   //    /* Send the retrieve documents based as JSON encoded
   //       data with the Router Response object */
   //    res.json({ records: recs });
   // });

});


apiRouter.post('/pet', function(req, res)
{
 /* Retrieve the posted data from the Request object and assign
      this to variables */
      var reporter = req.body.reporter,
      name 	=	req.body.name,
      sex 	=	req.body.sex,
      age 	=	req.body.age,
      type 	=	req.body.type,
      size  =  req.body.size,
      address = req.body.address,
      images = req.body.images,
      displayed 			=	true;
      console.log(req.body);

  /* Use the pet model to access the Mongoose API method to
     add the supplied data as a new document to the MongoDB
     database */
  pet.create({  reporter: reporter,
                name : name,
                sex : sex,
                age : age,
                type: type,
                size: size,
                address: address,
                images: images,
                displayed: displayed},
            function (err, record)
  {
      if (err){
         console.dir(err);
      }
      else{ // 同时修改user表
      res.json({ message: 'success', petid: record._id});   
      };

  });

});


apiRouter.put('/pet/:recordID', function(req, res)
{
 /* Use the pet model to access the Mongoose API method and
      find a specific document within the MongoDB database based
      on the document ID value supplied as a route parameter */
      pet.findById({ _id: req.params.recordID }, (err, recs) =>
      {
   
         /* If we encounter an error we log this to the console */
         if (err)
         {
            console.dir(err);
         }
         else
         {
            /* Assign the posted values to the respective fields for the retrieved
               document */
            recs.name 				= req.body.name 		|| recs.name;
            recs.description 		= req.body.description 	|| recs.description;
            recs.thumbnail  		= req.body.thumbnail	|| recs.thumbnail;
            recs.displayed 		= req.body.displayed 	|| recs.displayed;
   
            /* Save the updated document back to the database */
            recs.save((err, recs) =>
            {
               /* If we encounter an error send the details as a HTTP response */
               if (err)
               {
                  res.status(500).send(err)
               }
   
               /* If all is good then send a JSON encoded map of the retrieved data
                  as a HTTP response */
               res.json({ records: recs });
            });
         }
   
      });
});



apiRouter.delete('/pet/:recordID', function(req, res)
{
 /* Use the pet model to access the Mongoose API method and
      find & remove a specific document within the MongoDB database
      based on the document ID value supplied as a route parameter */
      pet.findByIdAndRemove({ _id: req.params.recordID }, (err, recs) =>
      {
   
         /* If we encounter an error we log this to the console */
         if (err)
         {
            console.dir(err);
         }
   
   
         /* If all is good then send a JSON encoded map of the removed data
            as a HTTP response */
         res.json({ records: recs });
   
      });
});


///////////////////////lost schema start here///////////////////////////////////////////
apiRouter.get('/lost', function(req, res)
{
   lost.find({}, (err, recs) =>
   {
      if (err){
         console.dir(err);
      }
      res.json({ records: recs });
   });
});


apiRouter.post('/lost', function(req, res)
{
 /* Retrieve the posted data from the Request object and assign
      this to variables */
      var reporter = req.body.reporter,
      address =	req.body.address,
      detail 		=	req.body.detail,
      title       =  req.body.title,
      contact 		=	req.body.contact,
      images 		=	req.body.images,
      date 			=	req.body.date;
      console.log(req.body);

  lost.create({ reporter : reporter, 
                address  : address,
                detail 	 : detail,
                title    : title,
                contact  : contact,
                images 	 : images,
                date 	 : date },
            function (err, record)
  {
     if (err){
        console.dir(err);
     }
     else{ // 同时修改user表
      res.json({ message: 'success', lostid: record._id});   
     };
   });

});


apiRouter.put('/lost/:recordID', function(req, res)
{
      lost.findById({ _id: req.params.recordID }, (err, recs) =>
      {
         if (err){
            console.dir(err);
         }
         else
         {
            /* Assign the posted values to the respective fields for the retrieved
               document */
            recs.address 		= req.body.address 	|| recs.address;
            recs.detail 		= req.body.detail 	|| recs.detail;
            recs.contact  		= req.body.contact	|| recs.contact;
            recs.images 		= req.body.images 	|| recs.images;
            recs.date         = req.body.date      || recs.date;
   
            /* Save the updated document back to the database */
            recs.save((err, recs) =>
            {
               /* If we encounter an error send the details as a HTTP response */
               if (err){
                  res.status(500).send(err)
               }
   
               /* If all is good then send a JSON encoded map of the retrieved data
                  as a HTTP response */
               res.json({ records: recs });
            });
         }
   
      });
});



apiRouter.delete('/lost/:recordID', function(req, res)
{
      lost.findByIdAndRemove({ _id: req.params.recordID }, (err, recs) =>
      {
         if (err){
            console.dir(err);
         }  
         /* If all is good then send a JSON encoded map of the removed data
            as a HTTP response */
         res.json({ records: recs });
   
      });
});

///////////////////////message schema start here///////////////////////////////////////////
apiRouter.post('/message', function(req, res)
{
   if (req.body.action=="lostmessage"){
      var from       =  req.body.from,
      to          =	req.body.to,
      lostid      =  req.body.lostid,
      mess        =  req.body.message,
      date 			=	req.body.date;
      console.log(req.body);

      message.create({from   : from, 
                     to       : to,
                     lostid   : lostid,
                     message  : mess,
                     date 	 : date },
                  function (err, record)
      {
         if (err){
            console.dir(err);
         }
         else{
            res.json({ message: 'success'});   
         };
         });
   }
   else{
      var from       =  req.body.from,
      to          =	req.body.to,
      petid      =  req.body.petid,
      mess        =  req.body.message,
      date 			=	req.body.date;
      console.log(req.body);

      message.create({from   : from, 
                     to       : to,
                     petid   : petid,
                     message  : mess,
                     date 	 : date },
                  function (err, record)
      {
         if (err){
            console.dir(err);
         }
         else{
            res.json({ message: 'success'});   
         };
         });

   }
   
});

//找到发给指定user的消息
apiRouter.get('/message/:userID', function(req, res)
{
   message.find({to: req.params.userID }, (err, recs) => {
   }).populate('from')
   .populate('petid')
   .populate('lostid')
   .exec((err, message)=>{
      if (err) console.dir(err);
      else {
         res.json(message);
      }
   })

})


module.exports = apiRouter;