import React from 'react'
import ListPage from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { ColumnProps } from 'antd/lib/table'
import AddTag from './components/AddTag'
import { Button } from 'antd'

interface Props extends AlertComponentProps {}

class Main extends React.Component<Partial<Props>> {
  public columns: ColumnProps<any>[] = [
    {
      title: '序号',
      dataIndex: '序号',
      width: 150
    },
    {
      title: '标签名称',
      dataIndex: 'a',
      align: 'center',
      render: (text) => {
        return <span className='href'>{text}</span>
      }
    },
    {
      title: '直播场次（直播中 | 预告）',
      dataIndex: '直播场次（直播中 | 预告）'
    },
    {
      title: '排序',
      dataIndex: '排序'
    },
    {
      title: '状态',
      dataIndex: '状态'
    },
    {
      title: '操作',
      dataIndex: '操作',
      align: 'center',
      render: () => {
        return (
          <div>
            <span className='href'>
              修改
            </span>&nbsp;&nbsp;
            <span className='href'>
              删除
            </span>
          </div>
        )
      }
    }
  ]
  public addTag = () => {
    if (this.props.alert) {
      this.props.alert({
        content: <AddTag />
      })
    }
  }
  public render () {
    return (
      <div>
        {/* 1111 */}
        <ListPage
          style={{padding: 0}}
          columns={this.columns}
          api={() => {
            return Promise.resolve({
              records: [{a: 1}]
            })
          }}
          addonAfterSearch={(
            <div style={{marginTop: -10}}>
              <Button
                type='primary'
                onClick={this.addTag}
              >
                新建标签
              </Button>
            </div>
          )}
        />
      </div>
    )
  }
}
export default Alert(Main)