import React, { useEffect } from 'react'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig } from './config'
import ListPage from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import * as api from './api'
import { FormItem } from '@/packages/common/components/form';
interface Props extends AlertComponentProps {}
let data = {
  a: 2,
  b: {
    a: 2
  }
}
const Demo = () => {
  useEffect(() => {
    console.log('useEffect')
    return () => {
      console.log('clear effect')
    }
  }, [data])
  console.log(data, 'Demo render')
  return (
    <></>
  )
}

class Main extends React.Component<Props> {
  public payload: any = {
    //
  }
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
      dataIndex: 'field1'
    },
    {
      title: '消息通道',
      dataIndex: 'field2'
    },
    {
      title: '消息类型',
      dataIndex: 'field3'
    },
    {
      title: '状态',
      dataIndex: 'field4'
    },
    {
      title: '发送时间',
      dataIndex: 'field5'
    },
    {
      title: '创建人',
      dataIndex: 'field6'
    },
    {
      title: '操作',
      render: () => {
        return (
          <div>
            <span>取消发送</span>
            <span
              className='href'
              onClick={() => {
                APP.history.push('/message/detail/22')
              }}
            >
              查看
            </span>
            <span
              className='href'
              onClick={() => {
                this.delete()
              }}
            >
              删除
            </span>
          </div>
        )
      }
    }
  ]
  static getDerivedStateFromProps (props: any, state: any) {
    console.log(props, state, 'getDerivedStateFromProps')
    return {}
  }
  public getSnapshotBeforeUpdate (props: any, state: any) {
    console.log('getSnapshotBeforeUpdate')
    return {a: 'b'}
  }
  public componentWillReceiveProps () {
    console.log('componentWillReceiveProps')
  }
  public shouldComponentUpdate () {
    console.log('shouldComponentUpdate')
    return true
  }
  public componentDidUpdate (props: any, state: any, snapshot: any) {
    console.log(snapshot, 'did update')
  }
  public delete () {
    console.log('delete')
    this.props.alert({
      // title: ''
      content: (
        <div>
          当前模板正在使用中，删除后将无法继续使用且无法恢复，确认删除？
        </div>
      )
    })
  }
  public render () {
    console.log('render')
    return (
      <div>
        <ListPage
          processPayload={(payload) => {
            return payload
          }}
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
                  data.a = 3
                  data = {...data}
                  this.setState({})
                }}
              >
                发送消息
              </Button>
            </div>
          )}
        />
        <Demo />
      </div>
    )
  }
}
export default Alert(Main)
