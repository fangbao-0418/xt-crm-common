import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'
import { CouponTaskList } from './interface'
import { getFieldsConfig, StatusEnum, getUserLevelText, UserTypeEnum } from './config'
import { Button, Popconfirm } from 'antd'
import Status from './components/status'
import * as api from './api'

interface Props {
  code: any
}

class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<CouponTaskList>[] = [
    { title: '任务ID', dataIndex: 'id', width: 100 },
    { title: '任务名称', dataIndex: 'name', width: 200 },
    { title: '用户类型', dataIndex: 'receiveUserGroup', width: 150, render: (text) => UserTypeEnum[text] },
    {
      title: '用户群体值',
      dataIndex: 'userGroupValue',
      width: 200,
      render: (text, record) => {
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
      title: '操作',
      width: 150,
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <span
              className='href mr8'
              onClick={() => {
                APP.history.push(`/coupon/task/${record.id}?readonly=true`)
              }}
            >
              查看
            </span>
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
          // formConfig={getFieldsConfig()}
          columns={this.columns}
          rangeMap={{
            startTime: {
              fields: ['sendTimeStart', 'sendTimeEnd']
            }
          }}
          processPayload={(payload) => {
            return {
              ...payload,
              code: this.props.code
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
              total: records.length
            }
          }}
          api={api.fetchTaskList}
        />
      </div>
    )
  }
}
export default Main
