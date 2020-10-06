const {VueLoaderPlugin} = require('vue-loader')

module.exports={
    entry: './src/app/index.mjs',
    output: {
        path: __dirname + '/src/public',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(svg|png)$/,
                loader: 'file-loader'
            }
          
        ],
    },
    plugins:[
        new VueLoaderPlugin()
    ]
}