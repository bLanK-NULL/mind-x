const { defineConfig } = require('@vue/cli-service')
const TerserPlugin = require('terser-webpack-plugin');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    hot: false
  },
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
    if (process.env.use_analyzer)
      config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  },
  configureWebpack: {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // 去除console.log
            },
            output: {
              comments: false, // 去除注释
            },
          },
        }),
      ],
    },
  }
})
