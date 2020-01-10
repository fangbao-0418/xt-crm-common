# 喜团管理平台

基于create-react-app搭建的React项目脚手架。

## notice

${name}-`deprecated` - 弃用的文件，暂时不要动

## Installation

``` code
npm config set registry http://192.168.20.8:802/
yarn submodule (注意会先删除packages文件，及时提交)
yarn install
yarn dev
```

## Dependencies

* React 16.7      --hooks
* Redux           --状态管理
* React-Router-V4 --多页面
* Ant Design      --UI
* React Intl      --国际化
* Gulp            --合并国际化词条
* Restify         --Mock服务器

## Solved Problems

* React、Redux、React-Router-V4等整合
* Code Splitting
* [组件](https://zhuanlan.zhihu.com/p/40134493)按功能划分
* [国际化](https://zhuanlan.zhihu.com/p/40176138)
* [服务器交互](https://zhuanlan.zhihu.com/p/40512216)
* [侧边栏](https://zhuanlan.zhihu.com/p/41111300)更易配置
* [样式](https://zhuanlan.zhihu.com/p/50837353)使用局部结合全局
* 全局等待效果 & 局部组件加载等待
* ...
