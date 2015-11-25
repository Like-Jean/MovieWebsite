var express = require('express');
var app = express();
var serveStatic = require('serve-static')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var User = require('./models/user')
mongoose.connect('mongodb://localhost/inode')

app.set('view engine','jade')
app.set('views','./views/pages')
app.use(bodyParser.urlencoded())
app.use(serveStatic('public'))
app.locals.moment = require('moment')

//首页
app.get('/',function(req,res){
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}

	res.render('index',{
		title:'inode首页',
		movies: movies
		})
	})
})

// signup
app.post('/user/signup/', function(req, res) {
	var _user = req.body.user
	var user = new User(_user)

	user.save(function(err, user) {
		if (err) {
			console.log(err)
		}

		console.log(user)
	})
})

//userlist page
app.get('/admin/userlist/',function(req,res){
	User.fetch(function(err, users) {
		if (err) {
			console.log(err)
		}

		res.render('userlist',{
			title:'inode用户列表页',
			users: users
		})
	})
})

//详情页
app.get('/movie/:id',function(req,res){
	var id = req.params.id

	Movie.findById(id, function(err, movie) {

		res.render('movie',{
			title:'inode ',
			movie: movie
		})
	})
})

//后台录入页
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'inode后台录入页',
		movie:{
			title: '',
			director: '',
			country: '',
			year: '',
			summary: ''
		}
	})
})

//admin update movie
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id

	if (id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'inode 后台更新页',
				movie: movie
			})
		})
	}
})

//admin post movie
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if (id !== 'undefined') {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			};

			_movie = _.ectend(movie, movieObj)
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				};

				console.log(movie)

				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else {
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})

		_movie.save(function(err, movie){
			if (err) {
				console.log(err)
			}

			res.redirect('/movie/:' + movie._id)
		})
	}
})

//列表页
app.get('/admin/list/',function(req,res){
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}

		res.render('list',{
			title:'inode列表页',
			movies: movies
		})
	})
})

// list delete movie
app.delete('/admin/list/', function(req, res) {
	var id = req.query.id

	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err)
			}
			else{
				res.json({success: 1})
			}
		})
	};
})

app.listen(3000)