import React from 'react'
import ListPage, { ListPageInstanceProps} from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import If from '@/packages/common/components/if'
import { ColumnProps } from 'antd/lib/table'
import TagEdit from './components/TagEdit'
import { Button, Popconfirm } from 'antd'
import { TagItem } from './interface'
import * as api from './api'

interface Props extends AlertComponentProps {}

enum StatusEnum {
  生效中 = 0,
  已删除 = 1,
  删除中 = 2
}

class Main extends React.Component<Partial<Props>> {
  public columns: ColumnProps<TagItem>[] = [
    {
      title: '序号',
      dataIndex: '序号',
      width: 150,
      align: 'center',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '标签名称',
      dataIndex: 'title',
      align: 'center',
      render: (text) => {
        return <span className='href'>{text}</span>
      }
    },
    {
      title: '直播场次（直播中 | 预告）',
      dataIndex: 'livingTatol',
      align: 'center',
      render: (text, record) => {
        return (
          <span>{record.livingTatol} | {record.trailerTatol}</span>
        )
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'isDelete',
      align: 'center',
      render: (text) => {
        return StatusEnum[text]
      }
    },
    {
      title: '操作',
      dataIndex: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <If condition={record.isDelete !== 2} >
              <span
                className='href'
                onClick={() => {
                  this.editTag(record)
                }}
              >
                修改
              </span>&nbsp;&nbsp;
              <span
                className='href'
                onClick={() => { this.deleteTag(record) }}
              >
                删除
              </span>
            </If>
          </div>
        )
      }
    }
  ]
  public tagRef: TagEdit | null
  public listpage: ListPageInstanceProps
  public editTag = (record?: TagItem) => {
    if (this.props.alert) {
      const hide = this.props.alert({
        width: 400,
        content: (
          <TagEdit
            ref={(ref) => this.tagRef = ref}
            record={record}
          />
        ),
        onOk: () => {
          if (this.tagRef) {
            this.tagRef.save().then(() => {
              hide()
              this.listpage.refresh()
            })
          }
        }
      })
    }
  }
  public deleteTag = (record: TagItem) => {
    if (!this.props.alert) {
      return
    }
    let node = (
      <div>
        确定是否删除该标签吗？
      </div>
    )
    if (record.livingTatol) {
      node = (
        <div>
          该标签仍有{record.livingTatol}场直播中的场次，结束后会自动删除！<br />
          {record.trailerTatol && <span>另外有{record.trailerTatol}场预告标签将失效！</span>}
        </div>
      )
    }
    const hide = this.props.alert({
      width: 400,
      content: node,
      onOk: () => {
        api.deleteTag(record.id).then(() => {
          hide()
          this.listpage.refresh()
        })
      }
    })
  }
  public render () {
    return (
      <div>
        {/* 1111 */}
        <ListPage
          style={{padding: 0}}
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          api={api.fetchTagList}
          processPayload={(payload) => {
            return {
              ...payload,
              pageSize: undefined,
              page: undefined
            }
          }}
          processData={(result) => {
            result = result || []
            return {
              records: result,
              total: result.length
            }
          }}
          tableProps={{
            pagination: false
          }}
          addonAfterSearch={(
            <div style={{marginTop: -10}}>
              <Button
                type='primary'
                onClick={this.editTag.bind(this, undefined)}
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