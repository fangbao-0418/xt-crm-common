export const statusList = [{
  id: '0',
  name: '全部商品'
}, {
  id: '1',
  name: '在售商品'
}, {
  id: '3',
  name: '待审核'
}, {
  id: '2',
  name: '仓库中'
}]

export const formConfig = {
  '/shop/goods': {
    productName: {
      label: '商品名称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入商品名称'
        }]
      }
    },
    productId: {
      label: '商品ID',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    auditStatus: {
      label: '审核状态',
      type: 'select',
      controlProps: {
        style: {
          width: 172
        }
      },
      options: [
        {
          label: '全部',
          value: -1,
        },
        {
          label: '待审核',
          value: 1,
        },
        {
          label: '审核通过',
          value: 2,
        },
        {
          label: '审核不通过',
          value: 3,
        },
      ]
    },
    phone: {
      label: '店长手机号',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    }
  }
}