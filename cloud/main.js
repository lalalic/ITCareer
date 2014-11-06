var express = require('express');
var app = express();

app.set('views', 'cloud/views'); 
app.set('view engine', 'ejs'); 
app.use(express.bodyParser());

var Post=Parse.Object.extend("post"), 
	Posts=Parse.Collection.extend({model:Post});
	
var posts=new Posts();

var _=app.locals._=Parse._
app.locals.posts=posts
app.locals.tags=false
app.locals.site='{ITCareer} Blog'
app.locals.siteDesc='Share knowledge about'
app.locals.email='lalalic@139.com'
app.locals.formatDate=function(d){
	var d=new Date()
	d.setTime(Date.parse(d))
	return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
}

app.get('/(:title.html)?', function(req, res) {
	posts.fetch().then(function(posts){
		var post=req.params.title ? posts.find(function(p){return p.get('title')==decodeURI(req.params.title)}) : posts.at(0);
		if(req.query.create!=undefined)
			res.render('post',{title:'',content:'',objectId:'',tags:[]})
		else
			res.render((req.query.edit!=undefined ? 'post' : 'blog'), (post && post.toJSON())||{title:'this post does NOT exist!'})
	},function (error){res.render('error', error)})
});

app.post('/(:title.html)?', function(req, res) {
	posts.fetch().then(function(posts){
		var post=req.body.objectId ? posts.get(req.body.objectId) : new Post()
		if(req.body.tags)
			req.body.tags=_.uniq(_.compact(req.body.tags.split(',')))
		else
			delete req.body.tags
		
		delete req.body.objectId
		
		if(post)
			post.save(req.body)
				.then(function(){
					if(!posts.get(post.id))
						posts.add(post);
					res.render('post',post.toJSON())
				},function (error){res.render('error', error)})
		else
			res.render('blog',{title:'this post does NOT exist!'})
	},function (error){res.render('error', error)})
});

app.listen();