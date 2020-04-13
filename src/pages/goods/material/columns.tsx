import Image from '@/components/Image'
import { replaceHttpUrl } from '@/util/utils'
import { Switch, Button } from 'antd'

export default [
  {
    title: '商品ID',
    width: 120,
    dataIndex: 'id'
  },
  {
    title: '商品主图',
    dataIndex: 'coverUrl',
    width: 120,
    render: (record: any) => (
      <Image
        style={{
          height: 100,
          width: 100,
          minWidth: 100
        }}
        src={replaceHttpUrl(record)}
        alt='主图'
      />
    )
  },
  {
    title: '商品名称',
    width: 120,
    dataIndex: 'productName'
  },
  {
    title: '内容',
    width: 100,
    dataIndex: 'content'
  },
  {
    title: '发布人',
    width: 100,
    dataIndex: 'author'
  },
  {
    title: '手机号',
    width: 100,
    dataIndex: 'author'
  },
  {
    title: '发布时间',
    width: 100,
    dataIndex: 'author'
  },
  {
    title: '推荐',
    width: 100,
    dataIndex: 'isStickUp',
    render: (isStickUp: number, record: any) => {
      const isChecked = isStickUp === 1
      return  <Switch checked={isChecked} checkedChildren='开' unCheckedChildren='关' defaultChecked />
    }
  },
  {
    title: '显示状态',
    width: 100,
    dataIndex: 'status',
    render: (status: number) => {
      return (
        <span>
          {status === 1 ? '隐藏' : '显示'}
        </span>
      )
    }
  },
  {
    title: '操作',
    fixed: 'right',
    align: 'center',
    width: 120,
    render: (record: any) => {
      return (
        <div>
          <span
            className='href'
          >
            查看
          </span>
          <span
            className='href'
          >
            编辑
          </span>
          <span
            className='href'
          >
            删除
          </span>
        </div>
      )
    }
  }
]