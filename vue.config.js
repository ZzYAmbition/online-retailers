module.exports = {
  configureWebpack: {
    resolve: {
      // 引入文件无需使用后缀名
      extensions: [],
      // alias用于配置路径的别名，vuecli3已经默认将src的别名改为@
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
  ? '/base'
  : '/'
}