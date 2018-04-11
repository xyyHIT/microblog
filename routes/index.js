var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var UserService = require('../models/user');
var PostService = require('../models/post');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('index ... ');
    new PostService().Post_Query(null, function (err, posts) {
      if (err) {
        posts = [];
      }
      res.render('index', {
          title: 'Microblog',
          posts: posts
      });
  })
});

router.get('/u/:user', function (req, res) {
    new UserService().User_Query(req.params.user, function (err, user) {
        if (!user) {
          req.flash('error', '用户不存在');
          return res.redirect('/');
        }
        new PostService().Post_Query(user.name, function (err, posts) {
            if (err) {
              req.flash('error', err);
              return res.redirect('/');
            }
            res.render('user', {
                title: user.name,
                posts: posts
            })
        })
    })
});

router.post('/post', checkLogin);
router.post('/post', function (req, res) {
    var currentUser = req.session.user;
    new PostService().Post_Save(currentUser.name, req.body.post, function (err, post) {
        if (err) {
          req.flash('error', '发布失败');
          return res.redirect('/');
        }
        req.flash('success', '发布成功');
        res.redirect('/u/' + currentUser.name);
    })
});

router.get('/reg', checkNotLogin);
router.get('/reg', function (req, res) {
    res.render('reg', {
      title: 'Signin'
    })
});

router.post('/reg', checkNotLogin);
router.post('/reg', function (req, res) {
    if (req.body['password-confirm'] != req.body['password']) {
      req.flash('error', '两次输入的密码不一致');
      return res.redirect('/company');
    }

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    var newUser = {
        name: req.body.username,
        password: password
    };

    new UserService().User_Query(req.body.username, function (err, user) {
        if (user) {
            err = 'Username already exists.';
        }
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');
        }
        new UserService().User_Save(req.body.username, password, function (err, user) {
            if (err) {
              req.flash('error', err);
              return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/');
        })
    })
});

router.get('/login', checkNotLogin);
router.get('/login', function (req, res) {
    res.render('login', {
        title: 'Login'
    })
});

router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    new UserService().User_Query(req.body.username, function (err, user) {
        if (!user) {
          req.flash('error', '用户不存在');
          return res.redirect('/login');
        }
        if (user.password != password) {
          req.flash('error', '密码错误');
        }
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/');
    })
});

router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '退出成功');
    res.redirect('/');
});

function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '您还没有登录');
      return res.redirect('/login');
    }
    next();
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '您已经登录');
      return res.redirect('/');
    }
    next();
}

module.exports = router;
