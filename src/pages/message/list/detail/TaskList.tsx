import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import * as api from '../api'
interface Props {
  value?: any[]
}
interface State {
  dataSource: any[]
}

/** 任务状态枚举 */
export enum taskStatusEnum {
  未发送 = 0,
  发送成功 = 1,
  正在发送 = 2,
  发送异常 = 3,
  取消发送 = 4
}

const Main = React.forwardRef((props: Props, ref) => {
  const value = props.value || []
  const [ dataSource, setDataSource ] = useState<Message.TaskItemProps[]>(value)
  const colums: ColumnProps<Message.TaskItemProps>[] = [
    {
      title: '序号',
      dataIndex: 'jobId',
      render: (text, record, index) => index + 1
    },
    {
      title: '任务名称',
      dataIndex: 'jobTitle'
    },
    {
      title: '数量',
      dataIndex: 'jobCount'
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      render: (text) => APP.fn.formatDate(text)
    },
    {
      title: '任务状态',
      dataIndex: 'pushType',
      render: (text) => {
        return taskStatusEnum[text]
      }
    },
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: (text, record, index) => {
        const now = new Date().getTime()
        const sendTime = record.sendTime
        const inSendTime = (sendTime - now) > 60 * 30 * 1000
        return (
          <div>
            {String(record.pushType) === '0' && inSendTime && (
              <span
                className='href'
                onClick={() => {
                  api.cancelTaskSend(record.jobId).then(() => {
                    dataSource[index].pushType = 4
                    console.log(dataSource, 'dataSource')
                    setDataSource([...dataSource])
                  })
                }}
              >
                取消发送
              </span>
            )}
          </div>
        )
      }
    }
  ]
  useEffect(()=> {
    console.log('useEffect props.value change')
    setDataSource(value)
  }, [props.value])
  console.log(dataSource, 'render')
  return (
    <div>
      <Table
        pagination={false}
        rowKey='jobId'
        columns={colums}
        dataSource={dataSource}
      />
    </div>
  )
})
export default Main
