const chalk=require('chalk');
const fs=require('fs');
const path=require('path');
const parser=require('@babel/parser');
const babel=require('@babel/core');
const traverse=require('@babel/traverse').default;
const chokidar = require('chokidar');
const {EventEmitter} = require('events');
const Server=require('./Server');
const HMRServer=require('./HMRServer');

const hmr = fs.readFileSync(path.join(__dirname,'/buildins/hmr-runtime.js'), 'utf8').trim();

class Bundler extends EventEmitter{
    constructor(main,options={}){
        super();
        this.entry=main||'index.js';
        this.ID=0;
        this.assets=null;
        this.server=null;
        this.staticAsset=[];
    }

    createAsset=(filename)=>{
        const content=fs.readFileSync(filename,'utf-8');
        const ast=parser.parse(content,{sourceType:"module",plugins:["jsx"]});
        const dependences=[];
        traverse(ast,{
            ImportDeclaration:({node})=>{
                dependences.push(node.source.value);
            }
        });
        const id=this.ID++;
        const {code}=babel.transformFromAst(ast,null,{presets:["@babel/preset-env","@babel/preset-react"]});
        return {
            id,
            filename,
            dependences,
            code
        }
    }

    createBundle=(filemane)=>{
        this.createGraph(filemane);
        let modules='';
        this.queue.forEach(mod=>{
            modules+=`${mod.id}:[
                function (require,module,exports) {
                    ${mod.code}
                },
                ${JSON.stringify(mod.mapping)},
            ],`
        });
        const result=`
        (function(modules){
            function require(id) {
                const [fn,mapping]=modules[id];
                function localRequest(relativePath){
                    return require(mapping[relativePath]);
                }
                const module={exports:{}};
                fn(localRequest,module,module.exports);
                return module.exports;
            }
            require(0);
        })({${modules}})
        `;
        return result;
    }

    createGraph=(entry)=>{
        const mainAsset=this.createAsset(entry);
        const queue=[mainAsset];
        for(const asset of queue){
            const dirname=path.dirname(asset.filename);
            asset.mapping={};
            asset.dependences.forEach(relativePath=>{
                const absolutePath=path.join(dirname,relativePath);
                const child=this.createAsset(absolutePath+'.js');
                asset.mapping[relativePath]=child.id;
                queue.push(child);
            })
        }
        this.queue=queue;
    }

    addStaticAsset=()=>{
        const asset=`
        (function () {
            ${hmr.replace('{{HMR_PORT}}', this.hmr.port)}
        })();
        `;
        this.staticAsset.push(asset)
    }

    bundle=()=>{
        this.ID=0;
        let startTime=Date.now();
        console.log(chalk.blue('⏳ Building...'));
        const fileName=this.entry;
        let bundle=this.createBundle(fileName);
        let buildTime=Date.now()-startTime;
        let time = buildTime < 1000 ? `${buildTime}ms` : `${(buildTime / 1000).toFixed(2)}s`;
        console.log(chalk.green(`✨ Built in ${time}.`));
        this.assets=bundle;
    }

    start=()=>{
        this.ID=0;
        this.bundle();
        const watcher=chokidar.watch('.');
        watcher.on('change',this.onChange);
        this.hmr = new HMRServer(this.server);
        this.addStaticAsset();
        this.serve();
    }

    onChange=()=>{
        this.bundle();
        this.hmr.emitUpdate(this.assets);
    }

    serve=(port=8888)=>{
        console.log(chalk.green("访问地址  http://localhost:8888"))
        this.server=Server.serve(this,port);
    }
}

module.exports=Bundler;