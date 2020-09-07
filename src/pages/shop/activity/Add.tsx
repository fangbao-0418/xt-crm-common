import React from 'react'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Form, FormItem, Alert } from '@/packages/common/components'
import { getDefaultConfig } from './config'
import { Card, Radio, InputNumber, Table, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import StoreModal from './StoreModal'
interface Props extends AlertComponentProps {}
interface State {
  dataSource: any[]
}
class Main extends React.Component<Props, State> {
  public state = {
    dataSource: []
  }  
  public columns: ColumnProps<any>[] = [{
    title: '供应商id',
    dataIndex: 'supplierId'
  }, {
    title: '供应商名称',
    dataIndex: 'supplierName'
  }, {
    title: '操作',
    render: () => {
      return (
        <span className='href'>删除</span>
      )
    }
  }]
  public handleAdd = () => {
    this.props.alert({
      title: '选择店铺',
      width: 1200,
      content: (
        <StoreModal />
      )
    })
  }
  public render () {
    const { dataSource } = this.state
    return (
      <Form config={getDefaultConfig()}>
        <Card title='活动报名设置'>
          <FormItem
            name='name'
            controlProps={{
              style: {
                width: 220
              }
            }}
          />
          <FormItem
            name='type'
            controlProps={{
              style: {
                width: 220
              }
            }}
          />
          <FormItem name='desc' />
          <FormItem name='signUpTime' />
          <FormItem
            label='是否预热'
            inner={(form) => {
              return form.getFieldDecorator('preheat', {
                initialValue: '0'
              })(
                <Radio.Group>
                  <Radio value='0' style={{ display: 'block' }}>是，活动开始前24小时，会场同步到线上预热</Radio>
                  <Radio value='1' style={{ display: 'block' }}>否，活动正式开始时线上开放</Radio>
                </Radio.Group>
              )
            }}
          />
          <FormItem name='schedulingTime' />
        </Card>
        <Card title='活动规则和要求'>
          <FormItem label='活动供货价'>
            <div>
              <span>不高于日常供货价的</span>
              <InputNumber className='ml10 mr10' precision={0} />
              <span>%</span>
            </div>
            <div>（输入正整数，比例后取两位小数，例如日常供货价79，比高于日常供货价85%，即活动供货价最高为67.15元）</div>
          </FormItem>
          <FormItem
            label='报名商家类型'
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('businessType', {
                    initialValue: 0
                  })(
                    <Radio.Group>
                      <Radio value={0} style={{ display: 'block' }}>全部</Radio>
                      <Radio value={1}>指定店铺参与<span className='href' onClick={this.handleAdd}>+添加店铺</span>（指定几个商家，会单独拆分为几个会场）</Radio>
                    </Radio.Group>
                  )}
                  <Table
                    columns={this.columns}
                    dataSource={dataSource}
                  />
                </>
              )
            }}
          />
        </Card>
        <div>
          <Button type='primary'>保存</Button>
          <Button
            className='ml10'
            onClick={() => {
              APP.history.goBack()
            }}
          >
            取消
          </Button>
        </div>
      </Form>
    )
  }
}

export default Alert(Main)