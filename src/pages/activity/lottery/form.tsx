import React from 'react'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import OperateArea from './components/OperateArea'
import { type, statusConfig } from './config'
import { Card, DatePicker, Icon, Table, Button } from 'antd'
import { ColumnProps } from 'antd/es/table'
import * as api from './api'
class Main extends React.Component {
  public form: FormInstance
  public id: number
  public constructor (props: any) {
    super(props)
    this.id = props.match.params.id
    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  public columns: ColumnProps<Lottery.LuckyDrawRoundListVo>[] = [
    {
      key: 'id',
      title: '序号',
      dataIndex: 'id'
    },
    {
      key: 'name',
      title: '场次名称',
      dataIndex: 'name'
    },
    {
      key: 'startTime',
      title: '开始时间',
      dataIndex: 'startTime',
      render: (text: any) => APP.fn.formatDate(text)
    },
    {
      key: 'endTime',
      title: '结束时间',
      dataIndex: 'endTime',
      render: (text: any) => APP.fn.formatDate(text)
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (text: any) => statusConfig[text] 
    },
    {
      key: 'operate',
      title: '操作',
      width: 280,
      render: (text: any, records: Lottery.LuckyDrawRoundListVo) => <OperateArea {...records} />
    }
  ]
  /** 新建或编辑活动 */
  public handleSave () {
    this.form.props.form.validateFields(async (err, vals) => {
      if (!err) {
        const res = await api.saveActivity(vals)
        const msg = Number(this.id) === -1 ? '新建活动': '编辑活动'
        if (res) {
          APP.success(`${msg}成功`)
        }
      }
    })
  }

  public handleCancel () {
    APP.history.go(-1)
  }

  public render () {
    return (
      <Form
        getInstance={ref => this.form = ref}
        addonAfter={(
          <div style={{marginTop: 100}}>
            <Button
              type='danger'
              onClick={this.handleSave}>
              保存
            </Button>
            <Button
              className='ml10'
              onClick={this.handleCancel}
            >
              取消
            </Button>
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
            name='restrictWinningTimes'
            type='number'
            label='单人中奖次数上限'
            controlProps={{
              style: {
                width: 195
              },
              min: 0,
              precision: 0
            }}
          />
          <FormItem
            name='remark'
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
        <Card
          title={(
            <span>
              <span>场次列表</span>
              <span style={{ color: '#999'}}>（必须先有活动才能新建场次）</span>
          </span>
        )}>
          <Table
            columns={this.columns}
            rowKey='id'
            pagination={false}
            dataSource={[]}/>
        </Card>
        <div>
          <Button
            type='danger'
            disabled={Number(this.id) === -1}
            onClick={() =>  APP.history.push(`/activity/lottery/sessions/${this.id}`)}>
            新建场次
          </Button>
        </div>
      </Form>
    )
  }
}

export default Main