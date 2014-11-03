var express = require('express');
var app = express();

app.set('views', 'cloud/views'); 
app.set('view engine', 'ejs'); 
app.use(express.bodyParser());

var Post=Parse.Object.extend("post"), posts;
(function init(){
	var _=require('underscore')
	Parse.initialize("CxZhTKQklDOhDasWX9hidldoK7xtzEmtcl5VSBeL","RwqvvbakVmWPhtO78QCUppfnclzfZ2SyUZ198ArG")
	var query=new Parse.Query(Post)
	query.descending('createdAt')
	query.find({
		success: function(results){
			posts=resultes
		},
		error: function(error){
		
		})
})();

app.get('/(:title.html)?', function(req, res) {
	var post=req.params.title ? posts.find() : posts.at(0)
	res.render(req.query.edit ? 'post' : 'blog', post)
});

app.post('/(:title.html)?', function(req, res) {
	if(req.body.id){
		new Post({id:req.body.id})
			.save({content:req.body.content})
			.then(function(){
				res.render('post', req.body)
			}, function(error){
				res.render('error', error)
			})
	}else{
		new Post(req.body)
			.save()
			.then(function(post){
				res.render('post', post)	
			}, function(error){
				res.render('error', error)
			})
	}
});

app.listen();