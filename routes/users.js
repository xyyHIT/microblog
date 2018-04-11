var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/group', function (req, res) {
    res.render('group',{
        title: 'group'
    });
});

module.exports = router;
