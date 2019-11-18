const dataList = [
  // {
  //   icon: 'home',
  //   key: 'overview',
  //   label: '首页',
  //   url: '/',
  // },
  {
    icon: 'fork',
    key: 'goods',
    label: '商品管理',
    children: [
      {
        label: '在售商品',
        key: '#/goods',
        url: '/goods/list',
      },
      {
        label: '类目管理',
        key: '#/goods',
        url: '/goods/category',
      },
    ],
  },
  {
    icon: 'snippets',
    key: 'order',
    label: '订单管理',
    children: [
      {
        key: '#/order/mainOrder',
        label: '所有订单列表',
        url: '/order/mainOrder',
      },
      {
        key: '#/order/unpaidOrder',
        label: '待付款订单列表',
        url: '/order/unpaidOrder',
      },
      {
        key: '#/order/undeliveredOrder',
        label: '待发货订单列表',
        url: '/order/undeliveredOrder',
      },
      {
        key: '#/order/partDeliveredOrder',
        label: '部分发货订单列表',
        url: '/order/partDeliveredOrder',
      },
      {
        key: '#/order/deliveredOrder',
        label: '已发货订单列表',
        url: '/order/deliveredOrder',
      },
      {
        key: '#/order/completeOrder',
        label: '交易成功订单列表',
        url: '/order/completeOrder',
      },
      {
        key: '#/order/closedOrder',
        label: '交易关闭订单列表',
        url: '/order/closedOrder',
      },
    ],
  },
  {
    icon: 'sound',
    key: 'refund',
    label: '售后管理',
    children: [
      {
        key: '/order/refundOrder',
        label: '所有售后订单',
        url: '/order/refundOrder',
      },
    ],
  },
  {
    icon: 'gift',
    key: 'activity',
    label: '活动管理',
    children: [
      {
        key: '/activity/list',
        label: '活动列表',
        url: '/activity/list',
      },
    ],
  },
  {
    icon: 'user',
    key: 'user',
    label: '用户管理',
    children: [
      {
        key: '/user/userlist',
        label: '用户列表',
        url: '/user/userlist',
      },
      {
        key: '/user/cdkey',
        label: '激活码管理',
        url: '/user/cdkey',
      },
    ],
  },
  {
    icon: 'solution',
    key: 'solution',
    label: '供应商管理',
    children: [
      {
        key: '/supplier/list',
        label: '供应商列表',
        url: '/supplier/list',
      },
    ],
  },
  {
    icon: 'highlight',
    key: 'banner',
    label: 'Banner配置',
    children: [
      {
        key: '/banner/list',
        label: 'Banner列表',
        url: '/banner/list',
      },
    ],
  },
  {
    icon: 'pay-circle',
    key: 'finance',
    label: '财务管理',
    children: [
      {
        key: '/finance/log',
        label: '提现记录',
        url: '/finance/log',
      },
      {
        key: '/finance/order',
        label: '订单报表',
        url: '/finance/order',
      },
    ],
  },
  {
    icon: 'lock',
    key: 'auth',
    label: '权限管理',
    children: [
      {
        key: '/auth/memberlist',
        label: '成员列表',
        url: '/auth/memberlist',
      }, {
        key: '/auth/rolelist',
        label: '角色列表',
        url: '/auth/rolelist',
      }, {
        key: '/auth/config',
        label: '页面列表',
        url: '/auth/config',
      }
    ],
  },
];

export default dataList;
