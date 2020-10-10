import React from 'react'
import { Modal, Button, Message, Badge, Tooltip } from 'antd'
import ActionBtnGroup from './action-btn-group/index'
import receiveStatus from '@/enum/receiveStatus'
import { formatReceiveRestrict, formatDate, formatFaceValue, formatDateRange } from '@/pages/helper'
import { stopCouponTask, invalidTaskCoupon } from './api'
import emitter from '@/util/events'
import { download } from '@/util/utils'

const listBadgeColors = {
  '0': 'gray',
  '1': 'blue',
  '2': 'green'
}
const releaseRecordsBadgeColors = {
  '0': 'gray',
  '1': 'blue',
  '2': 'green',
  '3': 'orange',
  '4': 'red'
}
export const taskStatus = {
  '0': '未执行',
  '1': '执行中',
  '2': '已执行',
  '3': '停止',
  '4': '失败'
}
export const userType = {
  '0': '全部',
  '1': '用户等级',
  '2': '指定用户',
  '3': '文件'
}
export const platformOptions = [
  { label: '安卓', value: '2' },
  { label: 'iOS', value: '4' },
  { label: 'H5', value: '8' },
  { label: '小程序', value: '16' }
]
export const useIdentityOptions = [
  { label: '普通用户', value: 0 },
  { label: '普通团长', value: 10 },
  { label: '星级团长', value: 12, disabled: true },
  { label: '体验团长', value: 11, disabled: true },
  { label: '社区管理员', value: 20 },
  { label: '城市合伙人', value: 30 }
]

export const productColumns = [{
  title: '商品ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '商品名称',
  dataIndex: 'productName',
  key: 'productName'
}]
const calcRatio = ({ useCount, receiveCount }) => {
  const result = useCount / receiveCount
  return (100 * result).toFixed(1) + '%'
}

const handleStop = async (taskId) => {
  console.log('taskId=>', taskId)
  const res = await stopCouponTask(taskId)
  if (res) {
    Message.success('停止发券成功')
    emitter.emit('list.coupon-detail.fetchCouponTasks')
  }
}

const handleInvalid = async (record) => {
  Modal.confirm({
    title: '系统提示',
    content: '是否失效掉任务中已发送的优惠券，回收优惠券库存？',
    onOk: async () => {
      const res = await invalidTaskCoupon(record.id, record.couponId)
      if (res) {
        Message.success('失效优惠券成功')
        emitter.emit('list.coupon-detail.fetchCouponTasks')
      }
    }
  })
}
export const releaseRecordsColumns = [{
  title: '目标用户类型',
  dataIndex: 'receiveUserGroup',
  key: 'receiveUserGroup',
  render: (text, record) => userType[text]
}, {
  title: '用户群体值',
  dataIndex: 'userGroupValue',
  key: 'userGroupValue',
  width: 600,
  render: (text, record) => {
    let node
    switch (record.receiveUserGroup) {
      case 0:
        node = '全部用户'
        break
      case 1:
        node = formatReceiveRestrict(record.userGroupValue)
        break
      case 2:
        node = record.userGroupValue
        break
      case 3:
        // eslint-disable-next-line no-case-declarations
        const [href, name] = record?.userGroupValue?.split(',')
        node = (
          <span className='href' onClick={() => {
            download(href, name)
          }}>{name}
          </span>
        )
        break
      default:
        node = '全部用户'
        break
    }
    return (
      <div className='wrap'>
        {node}
      </div>
    )
  }
}, {
  title: '发送时间',
  dataIndex: 'executionTime',
  key: 'executionTime',
  render: (text) => formatDate(text)
}, {
  title: '发送类型',
  dataIndex: 'operateBehavior',
  key: 'operateBehavior',
  render: (text, record) => {
    const status = {
      1: '发券',
      2: '失效优惠券'
    }
    return status[text]
  }
}, {
  title: '发送状态',
  dataIndex: 'status',
  key: 'status',
  render: (text, record) => {
    if (text === 4) {
      return (
        <Tooltip placement='topLeft' title={record.remark}>
          <Badge color={releaseRecordsBadgeColors[text]} text={taskStatus[text]} />
        </Tooltip>
      )
    } else {
      return <Badge color={releaseRecordsBadgeColors[text]} text={taskStatus[text]} />
    }
  }
}, {
  title: '操作',
  dataIndex: 'action',
  key: 'action',
  render: (text, record) => {
    if (record.operateBehavior === 1 && record.status === 0) {
      return <Button type='link' onClick={() => handleStop(record.id)}>停止</Button>
    } else if (record.operateBehavior === 1 && [2, 4].includes(record.status)) {
      return <Button type='link' onClick={() => handleInvalid(record)}>失效</Button>
    } else {
      return '-'
    }
  }
}]

export const getListColumns = () => [
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '店铺编号',
    dataIndex: 'shopId',
    key: 'shopId'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
    render: (text, record) => formatDateRange(record)
  },
  {
    title: '店铺名称',
    dataIndex: 'shopName',
    key: 'shopName'
  },
  {
    title: '供应商',
    dataIndex: 'supplierName',
    key: 'supplierName'
  },
  {
    title: '渠道',
    dataIndex: 'bizType',
    key: 'bizType',
    render: (text, record) => {
      let str=''
      switch (text) {
        case 0:
          str='优选'
          break
        case 1:
          str='买菜'
          break
        case 2:
          str='好店'
          break
      }
      return str
    }
  },
  {
    title: '优惠券价值',
    dataIndex: 'discountAmount',
    key: 'discountAmount',
    render: (text, record) => formatFaceValue(record)
  },
  {
    title: '已领取/总量',
    dataIndex: 'receiveRatio',
    key: 'receiveRatio',
    align: 'center',
    width: 120,
    render: (text, record) => {
      return `${record.receiveCount}/${record.inventory}`
    }
  },
  {
    title: '已使用|使用率',
    dataIndex: 'usedRatio',
    key: 'usedRatio',
    width: 130,
    align: 'center',
    render: (text, record) => {
      return record.receiveCount ? `${record.useCount} | ${calcRatio(record)}` : '-'
    }
  },
  {
    title: '领取状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
    render: (text) => <Badge color={listBadgeColors[text]} text={receiveStatus.getValue(text)} />
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 240,
    align: 'center',
    render: (text, record) => <ActionBtnGroup record={record} />
  }
]

export const pagination = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `共 ${total} 条记录`
}

export const defaultConfig = {
  coupon: {
    name: {
      label: '优惠券名称',
      placeholder: '例：国庆优惠券，最多20个字',
      fieldDecoratorOptions: {
        rules: [
          {
            required: true,
            message: '请输入优惠券名称',
            whitespace: true
          },
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 20) {
                callback('优惠券最多20个字')
              } else {
                callback()
              }
            }
          }
        ]
      }
    },
    useTimeType: {
      label: '使用时间',
      type: 'radio',
      fieldDecoratorOptions: {
        initialValue: 0,
        rules: [{
          required: true,
          message: '请选择使用时间类型'
        }]
      }
    },
    showFlag: {
      type: 'radio',
      label: '商详显示',
      options: [{
        label: '显示',
        value: 1
      }, {
        label: '不显示',
        value: 0
      }],
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请选择商详显示'
        }]
      }
    },
    description: {
      label: '优惠券说明',
      type: 'textarea',
      placeholder: '显示在优惠券下方，建议填写限制信息，如美妆个户、食品保健可用，仅团长专区商品可用等等（选填）'
    },
    remark: {
      label: '优惠券备注',
      type: 'textarea',
      placeholder: '备注优惠券信息，不会在用户端显示（选填）'
    }
  }
}