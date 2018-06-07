var newman = require('newman'); // require newman in your project 
var nodemailer  = require('nodemailer');
var fs = require('fs');

var export_file = './htmlResults_for_mail.html';
var collection_file = './postman_echo.postman_collection.json';
// call newman.run to pass `options` object and wait for callback 
newman.run({
    collection: require(collection_file),
    reporters: ['cli','html'],
    reporter : { html : { export : export_file,template: './template.hbs'} } 
}, function (err,summary) {
    if (err) { throw err; }
    console.log('collection run complete!');
    console.dir(summary);

    var network_total = summary['run']['stats']['requests']['total'];
    var network_failed = summary['run']['stats']['requests']['failed'];
    var network_success = network_total - network_failed;
    
    var unit_total = summary['run']['stats']['assertions']['total'];
    var unit_failed = summary['run']['stats']['assertions']['failed'];
    var unit_success = unit_total - unit_failed;
    var stats = "网络请求"+network_total+"次，成功"+network_success+"次，失败"+network_failed+"次。\n共执行单元测试"+unit_total+"次，成功"+unit_success+"次，失败"+unit_failed+"次";
    
    if(network_failed>0 || unit_failed > 0){
        console.log("Something Is WRONG");
        var tracelog = JSON.stringify(summary['run']['failures'], null, 2);
        send(stats,tracelog);
    }else{
        console.log("Everything Is OK");
    }
});

function send(sub,tracelog){
    var transporter = nodemailer.createTransport({
         service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
         port: 465, // SMTP 端口
         secureConnection: true, // 使用了 SSL
         auth: {
           user: '',
           // 这里密码不是qq密码，是你设置的smtp授权码
           pass: '',
         }
	   });
    
    var html = fs.readFileSync(export_file);
    var to = '---收件人地址---';
	var mailOptions = {
		from: "---发件人邮箱地址---",
		to: to,
		subject: "冒烟测试问题报告:"+sub,
        html:html,
        attachments:[{   
                filename:'results.html',
                path: export_file,
                contentType: 'text/html' 
                },
                {   
                    filename: 'tracelog.txt',
                    content: tracelog,
                    contentType: 'text/plain'
                }
        ],
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			throw error;
		} else {
			fn();
		}
	});
}
