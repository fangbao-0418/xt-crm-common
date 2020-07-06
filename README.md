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

# 添加submodule
```
git submodule add -b feature/issue28 -f --name common -- git@192.168.20.7:front-end/xt-youxan/platform-library.git ./src/packages/common
```

# 添加portal
```
git submodule add -b master -f --name portal -- git@192.168.20.7:front-end/xt-youxan/xt-crm-microservice/portal.git ./src/packages/portal
```