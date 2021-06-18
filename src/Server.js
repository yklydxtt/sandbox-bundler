const http=require('http');
const ejs=require('ejs');
const tmpl=require('./template/reactStr');

function middleware(bundler){
    return function(req,res){
        const code=bundler.assets;
        let staticAsset=''
        bundler.staticAsset.forEach(asset=>{
            staticAsset+=asset;
        });
        const template=ejs.render(tmpl.reactTmpl(),{code,staticAsset});
        res.write(template);
        res.end();
    }
}

function serve(bundler,port){
    return http.createServer(middleware(bundler)).listen(port);
}

exports.serve=serve;