module.exports = {
  apps: [{
    name: 'JsBot-Next',
    script: './src/app.ts',
    interpreter: 'node',
    node_args: '--import tsx',
    watch:true
  }]
};
