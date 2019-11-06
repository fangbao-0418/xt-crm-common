import React from 'react'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, statusEnum, typeEnum } from './config'
import { FormItem } from '@/packages/common/components/form';
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import * as api from './api'
interface Props extends AlertComponentProps {}
class Main extends React.Component<Props> {
  public listPage: ListPageInstanceProps
  public columns: ColumnProps<MessageTemplate.ItemProps>[] = [
    {
      title: '模板ID',
      dataIndex: 'id'
    },
    {
      title: '模板编码',
      dataIndex: 'businessGroup'
    },
    {
      title: '模板标题',
      dataIndex: 'templateTitle',
      width: 200
    },
    {
      title: '模板类型',
      dataIndex: 'type',
      render: (text) => {
        return typeEnum[text]
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => {
        return statusEnum[text]
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
              className='href'
              onClick={() => {
                APP.history.push(`/message/template/detail/${record.id}`)
              }}
            >
              编辑
            </span>
            <span
              className='ml10 href'
              onClick={() => {
                this.disabled(record)
              }}
            >
              {String(record.status) === '1' ? '禁用' : '启用'}
            </span>
            <span
              className='ml10 href'
              onClick={() => {
                this.delete(record.id)
              }}
            >
              删除
            </span>
          </div>
        )
      }
    }
  ]
  public disabled (record: MessageTemplate.ItemProps) {
    const message = record.status === 1 ? '禁用模板后，用户将不再收到此模板消息，确认禁用？' : '确认是否启用此模板，确认启用？'
    this.props.alert({
      // title: ''
      width: 400,
      onOk: (hide) => {
        api.changeTemplteStatus({
          id: record.id,
          status: record.status === 0 ? 1 : 0
        }).then(() => {
          hide()
          this.listPage.refresh()
        })
      },
      content: (
        <div>
          {message}
        </div>
      )
    })
  }
  public delete (id: number) {
    this.props.alert({
      // title: ''
      width: 400,
      onOk: (hide) => {
        api.deleteTemplte(id).then(() => {
          hide()
          this.listPage.refresh()
        })
      },
      content: (
        <div>
          当前模板正在使用中，删除后将无法继续使用且无法恢复，确认删除？
        </div>
      )
    })
  }
  public render () {
    return (
      <div>
        <ListPage
          getInstance={(ref) => {
            this.listPage = ref
          }}
          formConfig={getFieldsConfig()}
          rangeMap={{
            createTime: {
              fields: ['createStartTime', 'createEndTime']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='id' />
              <FormItem name='type' />
              <FormItem name='status' />
              <FormItem name='createTime' />
              <FormItem name='messageGroup' />
            </>
          )}
          columns={this.columns}
          api={api.getList}
          addonAfterSearch={(
            <div>
              <Button
                className='mr10'
                type='primary'
                onClick={() => {
                  APP.history.push('/message/template/detail/-1')
                }}
              >
                新建模板
              </Button>
              {/* <Button
                className='mr10'
                type='primary'
                onClick={() => {
                  APP.history.push('/message/template/detail/-1')
                }}
              >
                同步服务号模板消息
              </Button>
              <Button
                type='primary'
                onClick={() => {
                  APP.history.push('/message/template/detail/-1')
                }}
              >
                同步小程序模板消息
              </Button> */}
            </div>
          )}
        />
      </div>
    )
  }
}
export default Alert(Main)
