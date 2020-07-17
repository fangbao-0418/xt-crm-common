import React from 'react'
import Image from '@/components/Image'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { ListPage, Alert, If } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Button } from 'antd'
import { gotoPage } from '@/util/utils'
import { ColumnProps } from 'antd/lib/table'
import saveService from '../common/saveService'
import * as api from './api'
interface Props extends AlertComponentProps {
}
interface Data {
  announcement: string
  applicationQuestion: any[]
  originalQuestion: any[]
}

interface State {
  /** 原始数据 */
  data: Data
  /** 要展示的数据 */
  showDataSource: any[]
  isLoading: Boolean
}
class Main extends React.Component<Props, State> {
  public listpage: ListPageInstanceProps
  public form: FormInstance
  public data: Data = {
    announcement: '',
    applicationQuestion: [],
    originalQuestion: []
  }
  public state: State = {
    data: {
      announcement: '',
      applicationQuestion: [],
      originalQuestion: []
    },
    showDataSource: [],
    isLoading: true
  }

  public componentDidMount () {
    api.fetchQuestion().then(res => {
      this.data = res
      this.setState({
        data: res,
        showDataSource: res.originalQuestion,
        isLoading: false
      })
    })
  }
  public columns: ColumnProps<any>[] = [{
    title: '配置标题',
    dataIndex: 'mainProblemName',
    width: 300
  }, {
    title: '配置图标',
    dataIndex: 'mainProblemIcon',
    width: 200,
    align: 'center',
    render: (text) => {
      return (
        <div>
          <Image
            style={{
              height: 50,
              width: 50,
              minWidth: 50
            }}
            src={text}
            alt='图标'
          />
        </div>
      )
    }
  }, {
    title: '展示问题数目',
    width: 150,
    render: (record => {
      const { question } = record
      return (
        <div>
          {question?.length || 0}
        </div>
      )
    })
  }, {
    dataIndex: 'status',
    title: '启用状态',
    width: 120,
    align: 'center',
    render: (text) => {
      return (
        <div>
          {text=== 1 ? '启用' : '禁用' }
        </div>
      )
    }
  }, {
    dataIndex: 'mainProblemSort',
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
              gotoPage(`/order/servicecenter/${record.mainProblemId}`)
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
        const { mainProblemId } = record
        this.data.applicationQuestion
        const saveApplicationQuestion = this.data.applicationQuestion.concat([])
        saveApplicationQuestion.forEach(item => {
          if (item.mainProblemId === mainProblemId) {
            item.status = record.status === 1 ? 0 : 1
          }
        })
        this.setState({
          data: { ...this.state.data, applicationQuestion: saveApplicationQuestion }
        }, () => this.save())
        hide()
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
  /**
   * 保存数据
   */
  public save = () => {
    const { data } = this.state
    saveService(data, 'isServiceCenter')
  }

  public render () {
    const { isLoading, data } = this.state
    const { announcement, applicationQuestion } = data
    return (
      <div
        style={{
          background: '#FFFFFF',
          paddingTop: 20
        }}
      >
        <If condition={!isLoading}>
          <div style={{ paddingLeft: 20 }}>
            <div style={{ marginBottom: 20 }}>公告设置</div>
            <Form
              getInstance={(ref) => {
                this.form = ref
              }}
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 5 }}
              mounted={() => {
                this.form.setValues({
                  fromAnnouncement: announcement
                })
              }}
            >
              <FormItem
                label=''
                type='textarea'
                name='fromAnnouncement'
                placeholder='最多输入50字，为空时不显示公告'
                controlProps={{
                  style: { height: '120px' }
                }}
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
                this.form.props.form.validateFields((err, values) => {
                  if (err) {
                    return
                  }
                  const fromAnnouncement: string = values.fromAnnouncement
                  this.setState({
                    data: { ...data, announcement: fromAnnouncement }
                  }, () => this.save())
                })
              }}
            >
              保存
            </Button>
            <div style={{ marginTop: 20 }}>猜你想问配置</div>
          </div>
        </If>

        <ListPage
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          tableProps={{
            rowKey: 'anchorId',
            dataSource: applicationQuestion
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
          processPayload={(payload) => {
            console.log(payload, 'payload====')
          }}
          formConfig={false}
        />
      </div>
    )
  }
}
export default Alert(Main)
