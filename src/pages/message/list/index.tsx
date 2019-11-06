import React, { useEffect } from 'react'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, statusEnum, typeEnum } from './config'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import * as api from './api'
import { FormItem } from '@/packages/common/components/form';
interface Props extends AlertComponentProps {}

class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '消息标题',
      dataIndex: 'messageTitle'
    },
    {
      title: '消息通道',
      dataIndex: 'messageType',
      render: (text) => {
        return typeEnum[text]
      }
    },
    {
      title: '消息类型',
      dataIndex: 'messageForm'
    },
    {
      title: '状态',
      dataIndex: 'messageStatus',
      render: (text) => {
        return statusEnum[text]
      }
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '创建人',
      dataIndex: 'createName'
    },
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <span
              className='href mr10'
              onClick={() => {
                APP.history.push(`/message/detail/${record.id}`)
              }}
            >
              查看
            </span>
            <span
              className='href'
              onClick={() => {
                this.delete(record)
              }}
            >
              删除
            </span>
          </div>
        )
      }
    }
  ]
  public componentDidUpdate (props: any, state: any, snapshot: any) {
    console.log(snapshot, 'did update')
  }
  public delete (record: Message.ItemProps) {
    this.props.alert({
      content: (
        <div>
          当前模板正在使用中，删除后将无法继续使用且无法恢复，确认删除？
        </div>
      ),
      onOk: (hide) => {
        api.deleteMessage(record.id).then(() => {
          hide()
          this.listpage.refresh()
        })
      }
    })
  }
  public render () {
    console.log('render')
    return (
      <div>
        <ListPage
          getInstance={(ref) => {
            this.listpage = ref
          }}
          // processPayload={(payload) => {
          //   return APP.fn.fieldConvert(payload, {
          //     page: 'pageNo'
          //   })
          // }}
          formConfig={getFieldsConfig()}
          rangeMap={{
            sendTime: {
              fields: ['sendStartTime', 'sendEndTime']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='messageTitle' />
              <FormItem name='messageStatus' />
              <FormItem name='sendTime' />
              <FormItem name='messageType' />
            </>
          )}
          columns={this.columns}
          api={api.getList}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={() => {
                  APP.history.push('/message/detail/-1')
                }}
              >
                发送消息
              </Button>
            </div>
          )}
        />
      </div>
    )
  }
}
export default Alert(Main)
