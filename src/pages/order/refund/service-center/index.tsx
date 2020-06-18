import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { ListPage, Alert } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Row, Col, Button } from 'antd'
import { gotoPage } from '@/util/utils'
import { ColumnProps } from 'antd/lib/table'
import * as api from './api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<any>[] = [{
    title: '配置标题',
    dataIndex: 'nickName',
    width: 300
  }, {
    title: '配置图标',
    dataIndex: 'fansTotal',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'anchorIdentityType',
    title: '展示问题数目',
    width: 150
  }, {
    dataIndex: 'anchorId',
    title: '启用状态',
    width: 120,
    align: 'center'
  }, {

    dataIndex: 'anchorLevel',
    title: '排序号',
    width: 100
  },
  {
    title: '操作',
    align: 'center',
    render: (text, record) => {
      return (
        <div>
          <span
            className='href'
            onClick={()=>{
              gotoPage(`/order/servicecenter/${record.id}`)
            }}
          >
            修改
          </span>

          <span
            className='ml10 href'
            onClick={() => {
              this.disabled(record)
            }}
          >
            {String(record.status) === '1' ? '禁用' : '启用'}
          </span>
        </div>
      )
    }
  }]
  public disabled (record: any) {
    const message = record.status === 1 ? '确认禁用？' : '确认启用？'
    this.props.alert({
      title: '提示',
      width: 400,
      onOk: (hide) => {
        api.addAnchor({
        }).then(() => {
          hide()
          this.refresh()
        })
      },
      content: (
        <div>
          {message}
        </div>
      )
    })
  }
  public refresh () {
    this.listpage.refresh()
  }
  public deleteAnchor (record: Anchor.ItemProps) {
    api.deleteAnchor(record.anchorId).then(() => {
      this.listpage.refresh()
    })
  }
  public render () {
    let form: FormInstance
    return (
      <div
        style={{
          background: '#FFFFFF',
          paddingTop: 20
        }}
      >
        <div style={{ paddingLeft: 20 }}>
          <div style={{ marginBottom: 20 }}>公告设置</div>
          <Form
            getInstance={(ref) => {
              form = ref
            }}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 5 }}
          >
            <FormItem
              label=''
              type='textarea'
              name='operateRemark3'
              placeholder='最多输入50字，为空时不显示公告'
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '问题内容必填' },
                  { max: 50, message: '问题内容最长50个字符' }
                ]
              }}
            />
          </Form>
          <Button
            type='primary'
            onClick={() => {
            }}
          >
          保存
          </Button>
          <div style={{ marginTop: 20 }}>猜你想问配置</div>
        </div>
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
                onClick={()=>{
                  gotoPage('/order/servicecenter/-1')
                }}
              >
                新增配置
              </Button>
            </div>
          )}
          formConfig={false}
          api={api.getAnchorList}
        />
      </div>
    )
  }
}
export default Alert(Main)
