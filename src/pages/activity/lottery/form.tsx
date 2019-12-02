import React from 'react'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { name, type } from './config'
import { Card, DatePicker, Icon, Table, Button } from 'antd'
import { ColumnProps } from 'antd/es/table'
interface Sessions {
  No: number
  name: string
  num: number
  beginTime: number
  endTime: number
  status: number
}
class Main extends React.Component {
  public form: FormInstance
  public id: number
  public constructor (props: any) {
    super(props)
    // console.log('this =>', props.match.parmas.id)
    // this.id = props.match.parmas.id
  }
  public columns: ColumnProps<Sessions>[] = [
    {
      key: 'No',
      title: '序号',
      dataIndex: 'No'
    },
    {
      key: 'name',
      title: '场次名称',
      dataIndex: 'name'
    },
    {
      key: 'beginTime',
      title: '开始时间',
      dataIndex: 'beginTime'
    },
    {
      key: 'endTime',
      title: '结束时间',
      dataIndex: 'endTime'
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status'
    },
    {
      key: 'operate',
      title: '操作',
      width: 280,
      render: (text: any, record: Sessions, index: number) => {
        return (
          <div>
            <Button type='link'>查看</Button>
            <Button type='link'>编辑</Button>
            <Button type='link'>删除</Button>
            <Button type='link'>关闭</Button>
          </div>
        )
      }
    }
  ]
  public render () {
    return (
      <Form
        getInstance={ref => this.form = ref}
        addonAfter={(
          <div style={{marginTop: 100}}>
            <Button type='danger'>确认</Button>
            <Button className='ml10'>保存</Button>
            <Button className='ml10'>取消</Button>
          </div>
        )}
      >
        <Card title='活动信息'>
          <FormItem
            verifiable
            { ...name }
          />
          <FormItem
            verifiable
            { ...type }
          />
          <FormItem
            label='开始时间'
            verifiable
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('beginTime')(
                    <DatePicker showTime/>
                  )}
                  <span className='ml10'>
                    <Icon
                      type='info-circle'
                      theme='filled'
                      style={{
                        color: '#1890ff',
                        marginRight: 4
                      }}
                    />
                    <span>由于场次才是实际活动开始的时间，这里的开始时间相当于预热开始时间。</span>
                  </span>
                </div>
              )
            }}
            fieldDecoratorOptions={{
              rules: [{
                required: true
              }]
            }}
          />
          <FormItem
            name='cap'
            type='number'
            label='单人中奖次数上限'
            controlProps={{
              style: {
                width: 195
              }
            }}
          />
          <FormItem
            name='rule'
            type='textarea'
            label='活动规则'
            verifiable
            controlProps={{
              style: {
                width: 500
              },
              autoSize: {
                minRows: 4
              }
            }}
            fieldDecoratorOptions={{
              rules: [{
                required: true,
                message: '请输入活动规则'
              }]
            }}
          />
        </Card>
        <Card title='场次列表'>
          <Table
            columns={this.columns}
            rowKey='id'
            dataSource={[{
              No: 1,
              name: '标题',
              num: 6,
              beginTime: Date.now(),
              endTime: Date.now(),
              status: 1
            }]}/>
        </Card>
        <div>
          <Button type='danger' onClick={() =>  APP.history.push(`/lottery/sessions/${this.id}`)}>新建场次</Button>
        </div>
      </Form>
    )
  }
}

export default Main