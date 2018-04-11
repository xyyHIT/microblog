var express = require('express');
var router = express.Router();
var CompanyService = require('../models/company');
var redis = require('../utils/redis');

router.get('/', function (req, res) {
    res.render('company', {
        title: '表单'
    });
});

router.post('/', function (req, res) {
    if (req.body.name && req.body.company && req.body.phone && req.body.code) {
        new CompanyService().Company_Query(req.body.phone, function (result) {
            if (result.valid) {
                var company = {
                    name: req.body.name,
                    company: req.body.company,
                    phone: req.body.phone
                }
                checkCode(req.body.code, function (check) {
                    if (check.success) {
                        new CompanyService().Company_Save(company, function (err, result) {
                            if (err) {
                                req.flash('error', '提交失败');
                            } else {
                                req.flash('success', '确认码:' + result.id.toString().substring(19,24));
                            }
                            return res.redirect('/company');
                        })
                    } else {
                        console.log('验证码不正确');
                        req.flash('error', '验证码不正确');
                        return res.redirect('/company');
                    }
                });
            } else {
                req.flash('error', '该手机号已使用 确认码:'+ result.id.toString().substring(19,24));
                return res.redirect('/company');
            }
        })
    } else {
        req.flash('error', '信息不完整');
        return res.redirect('/company');
    }
});

function checkCode(code, cb) {
    redis.get("random_code_"+code, function (result) {
        if (result.success && result.result) {
            return cb({success: true});
        } else {
            return cb({success: false});
        }
    })
}

router.post('/sms', function (req, res) {
    var QcloudSms = require("qcloudsms_js");

    // 短信应用SDK AppID
    var appid = 1400081904;  // SDK AppID是1400开头

    // 短信应用SDK AppKey
    var appkey = "6b0d9bf1cecd7e22e1e3cd0058939615";

    // 需要发送短信的手机号码
    var phoneNumbers = [req.body.phone];

    // 短信模板ID，需要在短信应用中申请
    var templateId = 105990;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

    // 签名
    var smsSign = "图米乐";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

    // 实例化QcloudSms
    var qcloudsms = QcloudSms(appid, appkey);

    var smsType = 0; // Enum{0: 普通短信, 1: 营销短信}
    var ssender = qcloudsms.SmsSingleSender();
    genCode(function (result) {
        if (result.success) {
            ssender.send(smsType, 86, phoneNumbers[0],
                result.code, "", "", function (err, ret, resData) {
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/company');
                    } else {
                        req.flash('success', '验证码已发送');
                        return res.redirect('/company');
                    }
                });
        }
    });
});

function genCode(cb) {
    var code = '';
    for(var i=1;i<=4;i++) {
        code += Math.floor(Math.random()*10);
    }
    redis.set("random_code_"+code, code, function (result) {
        if (result.success) {
            return cb({success: true, code: '【图米乐】您的验证码是: '+code});
        } else {
            return cb({success: false});
        }
    }, 60);

}




module.exports = router;