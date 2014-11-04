var express = require('express');
var app = express();
var ejs=require('ejs')
ejs.debug=true

app.set('views', 'cloud/views'); 
app.set('view engine', 'ejs'); 
app.use(express.bodyParser());

var Post=Parse.Object.extend("post"), 
	Posts=Parse.Collection.extend({model:Post}), 
	loaded=false;
	
var posts=new Posts();

app.locals._=Parse._
app.locals.posts=posts
app.locals.tags=false
app.locals.site='{ITCareer} Blog'
app.locals.siteDesc='Share knowledge about'
app.locals.user='Li Cheng'
app.locals.email='lalalic@139.com'



function loadPosts(res){
	if(loaded)
		return Parse.Promise.as(posts)
	return posts.fetch()
			.then(function(){
				loaded=true
				console.log('found '+posts.length+' posts' )
				return posts
			},function (error){res.render('error', error)})
}

app.get('/(:title.html)?', function(req, res) {
	loadPosts(res).then(function(posts){
		var post=req.params.title ? posts.find(function(p){return p.get('title')==decodeURI(req.params.title)}) : posts.at(0);
		res.render((req.query.edit ? 'post' : 'blog'), post.toJSON()||{title:'this post does NOT exist!'})
	})
});

app.post('/(:title.html)?', function(req, res) {
	loadPosts(res).then(function(posts){
		var post=req.body.objectId ? posts.get(req.body.objectId) : new Post()
		if(req.body.tags)
			req.body.tags=_.uniq(_.compact(req.body.tags.split(',')))
		else
			delete req.body.tags

		if(post)
			post.save(req.body)
				.then(function(){
					if(!posts.get(post.id))
						posts.add(post);
					res.render('post',post.toJSON())
				},function (error){res.render('error', error)})
		else
			res.render('blog',{title:'this post does NOT exist!'})
	})
});

app.listen();