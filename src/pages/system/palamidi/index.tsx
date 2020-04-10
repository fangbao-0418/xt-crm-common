import React from 'react'
import { Button, Popconfirm } from 'antd'
import Page from '@/components/page'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'
import * as api from './api'
interface Props extends AlertComponentProps {}

interface Item {
  id: any
  path: string
  mappingPath: string
  serviceId: string
  apiName: string
  /** 过滤 1 不过滤 0 */
  stripPrefix: string
  /** 1=C端,2=M端 */
  category: 1 | 2
  appId: string
}

class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Item>[] = [
    {
      title: '序号',
      dataIndex: 'x'
    },
    {
      title: 'Api名称',
      dataIndex: 'x'
    },
    {
      title: 'path',
      dataIndex: 'path'
    },
    {
      title: '映射地址',
      dataIndex: '映射地址'
    },
    {
      title: 'Server_id',
      dataIndex: 'Server_id'
    },
    {
      title: 'URL',
      dataIndex: 'Server_id'
    },
    {
      title: '前缀过滤',
      dataIndex: 'Server_id'
    },
    {
      title: '类型',
      dataIndex: 'Server_id'
    },
    {
      title: '操作',
      dataIndex: 'Server_id',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <span onClick={this.edit(record)} className='href mr8'>修改</span>
            <Popconfirm
              title='确定删除吗？'
              onConfirm={this.remove(record)}
            >
              <span className='href'>删除</span>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  public remove = (record: Item) => () => {
    api.deleteRecord(record.id).then(() => {
      this.listpage.refresh()
    })
  }
  public edit = (record?: Item) => () => {
    let form: FormInstance
    const hide = this.props.alert({
      width: 480,
      content: (
        <Form
          getInstance={(ref) => {
            form = ref
            if (record) {
              setTimeout(() => {
                console.log(record, 'record')
                form.setValues(record)
              }, 100)
            }
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          formItemStyle={{ marginBottom: 8 }}
        >
          <FormItem
            verifiable label='Api名称' name='apiName'
            fieldDecoratorOptions={{
              rules: [{ required: true, message: 'Api名称必填' }]
            }}
          />
          <FormItem
            verifiable
            label='path' name='path'
            fieldDecoratorOptions={{
              rules: [{ required: true, message: 'path必填' }]
            }}
          />
          <FormItem
            label='映射地址' name='mappingPath'
          />
          <FormItem
            verifiable
            label='Server_id' name='serviceId'
            fieldDecoratorOptions={{
              rules: [{ required: true, message: 'Server_id必填' }]
            }}
          />
          <FormItem
            verifiable
            label='是否过滤前缀'
            name='stripPrefix'
            type='radio'
            options={[{ label: '过滤', value: 1 }, { label: '不过滤', value: 2 }]}
            fieldDecoratorOptions={{
              initialValue: 1
            }}
          />
          <FormItem
            verifiable
            label='类型'
            name='category'
            type='radio'
            options={[{ label: 'C端', value: 1 }, { label: 'M端', value: 2 }]}
            fieldDecoratorOptions={{
              initialValue: 1
            }}
          />
        </Form>
      ),
      onOk: () => {
        form.props.form.validateFields((err, value) => {
          if (err) {
            return
          }
          let p: Promise<any>
          if (!record) {
            p = api.add(value)
          } else {
            p = api.edit({
              ...value,
              id: record.id
            })
          }
          p.then(() => {
            this.listpage.refresh()
          })
          hide()
        })
      }
    })
  }
  public render () {
    return (
      <Page>
        <ListPage
          getInstance={(ref) => this.listpage = ref }
          formConfig={{
            common: {
              path: {
                type: 'input', label: 'path'
              },
              serviceId: {
                type: 'input', label: 'Server_id'
              }
            }
          }}
          columns={this.columns}
          addonAfterSearch={(
            <Button
              type='primary'
              onClick={this.edit()}
            >
              新增配置
            </Button>
          )}
          formItemLayout={(
            <>
              <FormItem name='path' />
              <FormItem name='serviceId' />
            </>
          )}
          api={api.fetcuList}
        />
      </Page>
    )
  }
}
export default Alert(Main)
