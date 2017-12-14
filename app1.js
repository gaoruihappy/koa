const Koa = require('koa');
// 创建一个Koa对象表示web app本身:
const app = new Koa();
// const get = require('./get');
const request = require('request')
const PassThrough = require('stream').PassThrough

// 对于任何请求，app将调用该异步函数处理请求：
// console.log(get)
var goToUrl = 'http://summer123.free.ngrok.cc'
app.use(async (ctx, next) => {
	var path = ctx.request.path
	let wxopenid = ctx.cookies.get("wxopenid")
	if(!wxopenid){
		if(path == '/aa'){
			//获取oenid第二步
			var code = ctx.request.query.code
			var state = ctx.request.query.state
			var newurl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx24b1e3489cc6b911&secret=063234f5efd869b2cb5dc6d97c68e988&code='+ code +'&grant_type=authorization_code&goToUrl=http://summer123.free.ngrok.cc'
			  function getdata(url) {
			    return new Promise((resolve) => {
			    	console.log(newurl)
			    	request({ url: newurl }, (error, res) => {
							console.log('new promise')
							return resolve(res);
							//需要返回最初的访问页面,带上cookie
						})
			    });
			  }
			await getdata({
				url:newurl
			}).then((res) => {
			    var wxopenid = JSON.parse(res.body).openid;
			    ctx.cookies.set('wxopenid', wxopenid)
			    ctx.redirect(state)
			 });
			return
		}else{
			//获取code，第一步
			var newurl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx24b1e3489cc6b911&redirect_uri=http%3a%2f%2fsummer123.free.ngrok.cc%2faa%3fechostr%3d1233&response_type=code&scope=snsapi_userinfo&state=http://summer123.free.ngrok.cc#wechat_redirect'
			ctx.redirect(newurl)
			return
		}
	}else{
		//返回访问页面
	    await next();
	    ctx.response.type = 'text/html';
	    ctx.response.body = 'you are right';
	}
});

// app.use(get())

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');