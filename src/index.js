module.exports=parseInt(process.versions.node)<8?require('./lib/Bundler'):require('./src/lib/Bundler');