import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'
import { CouponTaskList } from './interface'
import { getFieldsConfig, StatusEnum, getUserLevelText, UserTypeEnum } from './config'
import { Button, Popconfirm, Tooltip } from 'antd'
import Status from './components/status'
import * as api from './api'
class Main extends React.Component {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<CouponTaskList>[] = [
    { title: '任务ID', dataIndex: 'id', width: 100 },
    {
      title: '任务名称',
      dataIndex: 'name',
      width: 200,
      render: (text, record) => {
        return (
          <Tooltip
            title={(
              <span
                style={{
                  whiteSpace: 'pre-wrap'
                }}
              >
                {record.codes?.join?.('\r\n')}
              </span>
            )}
          >
            <span className='pointer'>{text}</span>
          </Tooltip>
        )
      }
    },
    { title: '用户类型', dataIndex: 'receiveUserGroup', width: 150, render: (text) => UserTypeEnum[text] },
    {
      title: '用户群体值',
      dataIndex: 'userGroupValue',
      width: 200,
      render: (text, record) => {
        if (record.receiveUserGroup === 3) {
          return (
            <span
              className='href'
              onClick={() => {
                APP.fn.download(text, '用户列表')
              }}
            >
              {text}
            </span>
          )
        }
        if (record.receiveUserGroup === 2 && text?.length > 64) {
          return text.slice(0, 50) + '...'
        }
        return text
      }
    },
    { title: '发送时间', dataIndex: 'sendStartTime', render: (text) => APP.fn.formatDate(text), width: 150 },
    { title: '领取（人数）', dataIndex: 'receiveNum', width: 150, align: 'center' },
    {
      title: '发送状态',
      dataIndex: 'status',
      width: 150,
      align: 'center',
      render: (text) => {
        return (
          <Status status={text}>
            {StatusEnum[text]}
          </Status>
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150
    },
    {
      title: '操作',
      width: 200,
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            {[0].includes(record.status) && (
              <span
                className='href mr8'
                onClick={() => {
                  APP.history.push(`/shop/coupon-task/${record.id}`)
                }}
              >
                编辑
              </span>
            )}
            {[0, 1, 2].includes(record.status) && (
              <Popconfirm
                title='你确定要停止发放任务吗？'
                onConfirm={() => {
                  this.stopTask(record.id)
                }}
              >
                <span
                  className='href mr8'
                >
                  停止
                </span>
              </Popconfirm>
            )}
            {record.status === 3 && (
              <Popconfirm
                title='你确定要失效并回收已发放优惠券吗？'
                onConfirm={() => {
                  this.invalidateTask(record.id)
                }}
              >
                <span
                  className='href mr8'
                >
                  失效
                </span>
              </Popconfirm>
            )}
            <span
              className='href mr8'
              onClick={() => {
                APP.history.push(`/shop/coupon-task/${record.id}?readonly=true`)
              }}
            >
              查看
            </span>
            {record.receiveUserGroup === 3 && record.userGroupValue && (
              <span
                className='href mr8'
                onClick={() => {
                  APP.fn.download(record.userGroupValue, '用户列表')
                }}
              >
                下载Excel
              </span>
            )}
          </div>
        )
      }
    }
  ]
  public stopTask (id: any) {
    api.stopTask(id).then(() => {
      this.listpage.refresh()
    })
  }
  public invalidateTask (id: any) {
    api.invalidateTask(id).then(() => {
      this.listpage.refresh()
    })
  }
  public render () {
    return (
      <div>
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          formConfig={getFieldsConfig()}
          columns={this.columns}
          rangeMap={{
            startTime: {
              fields: ['sendTimeStart', 'sendTimeEnd']
            }
          }}
          processPayload={(payload) => {
            return {
              ...payload
            }
          }}
          processData={(data) => {
            const records = data.records || []
            return {
              records: records.map((item: CouponTaskList) => {
                if (item.receiveUserGroup === 0) {
                  item.userGroupValue = '全部用户'
                } else if (item.receiveUserGroup === 1) {
                  item.userGroupValue = getUserLevelText(item.userGroupValue?.split?.(','))
                }
                return {
                  ...item,
                  userGroupValue: item.userGroupValue
                }
              }),
              total: data.total
            }
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={() => APP.history.push('/shop/coupon-task/-1')}
              >
                新建发券任务
              </Button>
            </div>
          )}
          api={api.fetchTaskList}
        />
      </div>
    )
  }
}
export default Main
