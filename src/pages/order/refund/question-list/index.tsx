import React from 'react'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { ListPage, Alert } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Button, Radio } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig } from './config'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import * as api from './api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '问题标题',
    dataIndex: 'nickName'
  }, {
    title: '问题内容',
    dataIndex: 'fansTotal',
    align: 'center'
  },
  {
    title: '操作',
    align: 'center',
    render: (text, record) => {
      return (
        <div>
          <span
            className='href'
            onClick={this.operation(record)}
          >
            修改
          </span>
        </div>
      )
    }
  }]
  public refresh () {
    this.listpage.refresh()
  }
  public operation = (detail:any) => () => {
    if (this.props.alert) {
      let form: FormInstance
      const hide = this.props.alert({
        title: detail? '修改问题':'新增问题',
        width: 700,
        content: (
          <Form
            getInstance={(ref) => {
              form = ref
            }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            <FormItem
              label='问题标题'
              verifiable
              required
              name='operateRemark1'
            />
            <FormItem
              label='标题字色'
              verifiable
              required
              name='operateRemark2'
            />
            <FormItem
              label='问题内容'
              inner={(form) => {
                return form.getFieldDecorator('operateRemark3')(
                  <BraftEditor controls={['text-color', 'bold', 'italic', 'underline']} />
                )
              }}
            />
          </Form>
        ),
        onOk: () => {
          if (form) {
            form.props.form.validateFields((err, values) => {
              if (err) {
                return
              }
              const operateRemark = values.operateRemark
              api.addAnchor({
              }).then(() => {
                hide()
                this.listpage.refresh()
              })
            })
          }
        }
      })
    }
  }
  public render () {
    return (
      <div
        style={{
          background: '#FFFFFF'
        }}
      >
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          tableProps={{
            rowKey: 'anchorId'
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={this.operation(null)}
              >
                新增问题
              </Button>
            </div>
          )}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='operateRemark1' />
              <FormItem name='status2' />
            </>
          )}
          api={api.getAnchorList}
        />
      </div>
    )
  }
}
export default Alert(Main)
