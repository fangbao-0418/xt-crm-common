import React from 'react'
import Page from '@/components/page'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import ListPage from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'

interface Props extends AlertComponentProps {}

interface Item {}

class Main extends React.Component<Props> {
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
            <span className='href'>删除</span>
          </div>
        )
      }
    }
  ]
  public edit = (record: Item) => () => {
    let form: FormInstance
    const hide = this.props.alert({
      width: 480,
      content: (
        <Form
          getInstance={(ref) => form = ref}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          formItemStyle={{ marginBottom: 8 }}
        >
          <FormItem
            verifiable label='Api名称' name='a'
            fieldDecoratorOptions={{
              rules: [{ required: true, message: 'Api名称必填' }]
            }}
          />
          <FormItem
            verifiable
            label='path' name='a1'
            fieldDecoratorOptions={{
              rules: [{ required: true, message: 'path必填' }]
            }}
          />
          <FormItem
            label='映射地址' name='a2'
          />
          <FormItem
            verifiable
            label='Server_id' name='a3'
            fieldDecoratorOptions={{
              rules: [{ required: true, message: 'Server_id必填' }]
            }}
          />
          <FormItem
            verifiable
            label='是否过滤前缀'
            name='a4'
            type='radio'
            options={[{ label: '过滤', value: 1 }, { label: '不过滤', value: 2 }]}
            fieldDecoratorOptions={{
              initialValue: 1
            }}
          />
          <FormItem
            verifiable
            label='类型'
            name='a5'
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
          hide()
        })
      }
    })
  }
  public render () {
    return (
      <Page>
        <ListPage
          formConfig={{
            common: {
              path: {
                type: 'input', label: 'path'
              },
              serverId: {
                type: 'input', label: 'Server_id'
              }
            }
          }}
          columns={this.columns}
          formItemLayout={(
            <>
              <FormItem name='path' />
              <FormItem name='serverId' />
            </>
          )}
          api={() => {
            return Promise.resolve({
              records: [{ path: '/abc' }]
            })
          }}
        />
      </Page>
    )
  }
}
export default Alert(Main)
