import React from 'react'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import Ribbon from './components/Ribbon'
import { title, type, statusConfig, formatDate } from './config'
import { Card, DatePicker, Icon, Table, Button } from 'antd'
import { ColumnProps } from 'antd/es/table'
import * as api from './api'
import { parseQuery } from '@/util/utils'
import moment from 'moment'
interface State {
  roundList: Lottery.LuckyDrawRoundListVo[]
}

/** 禁用日期 */
function disabledDate (current: any) {
  return current && current < moment().endOf('day').subtract(1, 'days')
}

/** 禁用时间 */
function disabledDateTime () {
  
}

class Main extends React.Component<any, State> {
  public form: FormInstance
  public id: number
  public readOnly: boolean = (parseQuery() as any).readOnly === '1'
  public state: State = {
    roundList: []
  }
  public constructor (props: any) {
    super(props)
    this.id = +props.match.params.id
    this.handleSave = this.handleSave.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  public componentDidMount () {
    /** 编辑获取详情 */
    if (this.id !== -1) {
      this.fetchData()
    }
  }
  public async fetchData () {
    const res = await api.getActivityDetail(this.id)
    this.form.setValues(res)
    this.setState({ roundList: res.roundList})
  }
  public columns: ColumnProps<Lottery.LuckyDrawRoundListVo>[] = [
    {
      key: 'id',
      title: '序号',
      dataIndex: 'id'
    },
    {
      key: 'title',
      title: '场次名称',
      dataIndex: 'title'
    },
    {
      key: 'startTime',
      title: '开始时间',
      dataIndex: 'startTime',
      render: formatDate
    },
    {
      key: 'endTime',
      title: '结束时间',
      dataIndex: 'endTime',
      render: formatDate
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
      render: (text: any, record: Lottery.LuckyDrawRoundListVo) => {
        const path = `/activity/lottery/${this.id}/${record.id}`
        return (
          <Ribbon
            status={record.status}
            moduleId='sessions'
            onView={() => APP.history.push(`${path}?readOnly=1`)}
            onEdit={() => APP.history.push(path)}
            onDelete={async () => {
              const res = await api.deleteSession(record.id)
              if (res) {
                APP.success('删除成功')
                this.fetchData()
              }
            }}
            onUpdate={async (open: 0 | 1) => {
              const res = await api.updateSessionsStatus({
                open,
                luckyDrawRoundId: record.id
              })
              if (res) {
                const msg = open === 1 ? '开启成功' : '关闭成功' 
                APP.success(msg)
                this.fetchData()
              }
            }}
          />
        )
      }
    }
  ]
  /** 新建或编辑活动 */
  public handleSave () {
    this.form.props.form.validateFields(async (err, vals) => {
      if (!err) {
        let msg, res
        if (this.id === -1) {
          msg = '新建活动'
          res = await api.saveActivity(vals)
        } else {
          msg = '编辑活动'
          res = await api.updateActivity({id: this.id, ...vals})
        }
        if (res) {
          APP.success(`${msg}成功`)
          this.handleCancel()
        }
      }
    })
  }

  public handleCancel () {
    APP.history.go(-1)
  }

  public render () {
    const startTime = this.form && this.form.props.form.getFieldValue('startTime')
    let timestamp = 0
    if (startTime) {
      timestamp = startTime.valueOf()
    }
    return (
      <Form
        readonly={this.readOnly}
        getInstance={ref => this.form = ref}
        addonAfter={(
          <div style={{marginTop: 100}}>
            <Button
              disabled={this.readOnly}
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
            { ...title }
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
                  {form.getFieldDecorator('startTime', {
                    rules: [{
                      required: true,
                      message: '请输入开始时间'
                    }]
                  })(
                    this.readOnly ? (
                      startTime ?
                        <span>{startTime.format('YYYY-MM-DD HH:mm:ss')}</span> :
                        <></>
                      ) :
                      (
                        <DatePicker
                          disabledDate={disabledDate}
                          showTime
                        />
                      )
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
            dataSource={this.state.roundList}/>
        </Card>
        <div>
          <Button
            type='danger'
            disabled={this.id === -1 || this.readOnly}
            onClick={() => {
              const type = this.form && this.form.props.form.getFieldValue('type')
              APP.history.push(`/activity/lottery/${this.id}/-1?activityStartTime=${timestamp}&activityType=${type}`)
            }}>
            新建场次
          </Button>
        </div>
      </Form>
    )
  }
}

export default Main