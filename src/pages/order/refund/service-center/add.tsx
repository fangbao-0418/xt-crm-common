import React from 'react'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { RouteComponentProps } from 'react-router'
import { Alert, If } from '@/packages/common/components'
import { getUniqueId } from '@/packages/common/utils/index'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Popconfirm, Row, Col, Input, Table, Button, Modal, InputNumber } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import UploadView, { ossUpload } from '@/components/upload'
import { getFieldsConfig } from './config'
import SearchFetch from '@/packages/common/components/search-fetch'
import { gotoPage } from '@/util/utils'
import * as api from './api'
interface Props extends AlertComponentProps, RouteComponentProps<{id: string}> {
}

interface Data {
  announcement: string
  applicationQuestion: any[]
  originalQuestion: any[]
}
interface MainProblem {
  mainProblemId: string
  mainProblemName: string
  mainProblemIcon: string | null
  mainProblemSort: number | null
  question: any[]
}
interface State {
  /** 当前配置的数据 */
  mainProblem: MainProblem
  page: any
  pageSize: any
  total: any
  itemData: any
  visible: boolean
  /** 原始数据 */
  data: Data
  isLoading: boolean
  id: string
}
interface PayloadProps {
  page: number
  pageSize: number
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public tempItemData: any
  public questionList: any
  public form: FormInstance
  public data: Data = {
    announcement: '',
    applicationQuestion: [],
    originalQuestion: []
  }

  public payload: PayloadProps = {
    page: 1,
    pageSize: 10
  }
  public state: State = {
    page: this.payload.page,
    pageSize: this.payload.pageSize,
    total: 0,
    itemData: {},
    visible: false,
    mainProblem: {
      mainProblemId: '',
      mainProblemName: '',
      mainProblemIcon: null,
      mainProblemSort: null,
      question: []
    },
    data: {
      announcement: '',
      applicationQuestion: [],
      originalQuestion: []
    },
    isLoading: true,
    id: ''
  }
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '主要问题标题',
    dataIndex: 'title',
    width: 300
  }, {
    title: '次要问题数目',
    width: 200,
    align: 'center',
    render: (record) => {
      console.log(record, 'record=====')
      return (
        <div>
          {record.item?.length || 0}
        </div>
      )
    }
  }, {
    dataIndex: 'sort',
    title: '问题排序号',
    width: 150
  },
  {
    title: '操作',
    align: 'center',
    render: (text, record, index) => {
      return (
        <div>
          <span
            className='href'
            onClick={()=>{
              this.setState({
                itemData: record
              }, ()=>{
                this.tempItemData=record
                this.onShow()
              })
            }}
          >
            修改配置
          </span>
          <Popconfirm
            title='确认删除?'
            onConfirm={() => this.handleRemove(index)}>
            <span
              className='ml10 href'
            >
          删除配置
            </span>
          </Popconfirm>
        </div>
      )
    }
  }]

  public componentDidMount () {
    const { id } = this.props.match.params
    api.fetchQuestion().then(res => {
      this.data = res
      if (id) {
        const mainProblem = this.data.applicationQuestion.find(item => item.mainProblemId === id)
        mainProblem.mainProblemIcon = [{
          url: mainProblem.mainProblemIcon
        }]
        this.setState({
          mainProblem,
          id
        })
      }
      this.setState({
        data: res,
        isLoading: false
      }, () => {
        console.log(this.state, 'this.state=====')
      })
    })
  }

  public componentWillMount () {
    this.fetchData()
  }
  public fetchData () {
    this.setState({
      page: this.payload.page
    })
    // api.getAnchorList(this.payload).then((res: any) => {
    //   this.setState({
    //     mainProblem: res.records || [],
    //     total: res.total
    //   })
    // })
  }
  // 删除当前行
  public handleRemove (index: number) {
    const { mainProblem } = this.state
    mainProblem.question.splice(index, 1)
    this.setState({ mainProblem })
  }
  /**
   * 保存数据
   */
  public save = () => {
    const obj = {
      announcement: '喜团不会以任何理由要求您转账汇款、扫描二维码或点击退款/补款链接，请提高警惕，谨防上当受骗。',
      applicationQuestion: [
        {
          name: '售后问题',
          icon: 'https://assets.hzxituan.com/upload/2020-06-02/76b5d1c0-13b0-4e29-994a-bff3e29247b6-kaxe7z26.png',
          problemSort: 1,
          question: [
            {
              mainProblemId: '001',
              mainProblemSort: 1,
              minorProblems: [
                {
                  minorProblemId: '001',
                  minorProblemSort: 1
                }
              ]
            },
            {
              mainProblemId: '001',
              mainProblemSort: 1,
              minorProblems: [
                {
                  minorProblemId: '001',
                  minorProblemSort: 1
                }
              ]
            }
          ]
        }
      ],
      originalQuestion: []
    }
    const { data } = this.state
    const saveData = JSON.stringify(data)
    const file = new File([saveData], 'abc')
    ossUpload(file, 'question', 'cos', '/question.json').then((res: any) => {
      if (res) {
        APP.success('保存成功')
        gotoPage('/order/servicecenter')
      }
    })
  }
  public render () {
    const { isLoading, mainProblem } = this.state
    return (
      <div
        style={{
          background: '#FFFFFF',
          paddingTop: 20
        }}
      >
        <If condition={!isLoading}>
          <div style={{ paddingLeft: 20 }}>
            <Form
              getInstance={(ref) => {
                this.form = ref
              }}
              config={getFieldsConfig()}
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 5 }}
              mounted={() => {
                this.form.setValues({
                  ...mainProblem
                })
              }}
            >
              <FormItem
                verifiable
                required
                name='mainProblemName'
              />
              <FormItem
                label='配置图标'
                required
                inner={(form) => {
                  return form.getFieldDecorator('mainProblemIcon')(
                    <UploadView
                      listType='picture-card'
                      listNum={1}
                      fileType={['jpg', 'jpeg', 'gif', 'png']}
                      size={10}
                      placeholder='上传icon图'
                    />
                  )
                }}
              />
              <FormItem
                verifiable
                required
                name='mainProblemSort'
              />
            </Form>

            <div style={{ marginTop: 20, marginBottom: 20 }}>猜你想问配置</div>
            <Button
              type='primary'
              onClick={()=>{
                this.tempItemData={}
                this.setState({
                  itemData: {}
                }, ()=>{
                  this.onShow()
                })
              }}
            >
                新增问题
            </Button>
          </div>
        </If>
        <Table
          style={{ margin: 20 }}
          bordered
          rowKey='id'
          columns={this.columns}
          dataSource={this.state.mainProblem.question}
          pagination={{
            total: this.state.total,
            pageSize: this.state.pageSize,
            current: this.state.page,
            onChange: (current) => {
              this.payload.page = current
              this.fetchData()
            }
          }}
        />
        <Button
          type='primary'
          className='ml20 mb20'
          onClick={() => {
            this.form.props.form.validateFields((err, values) => {
              if (err) {
                return
              }
              const { mainProblem, data, id } = this.state
              const { mainProblemId } = mainProblem
              values.mainProblemIcon = values.mainProblemIcon[0].url
              const saveMainProblem = { ...mainProblem, ...values, status: 1, mainProblemId: mainProblemId ? mainProblemId: getUniqueId() }
              let saveApplicationQuestion
              if (!id) {
                saveApplicationQuestion = data.applicationQuestion.concat([saveMainProblem])
              } else {
                saveApplicationQuestion = data.applicationQuestion.concat([])
                saveApplicationQuestion.forEach(item => {
                  if (item.mainProblemId === id) {
                    item = Object.assign(item, saveMainProblem)
                  }
                })
              }
              console.log(saveApplicationQuestion, 'saveApplicationQuestion=====')
              // this.setState({
              //   data: { ...data, applicationQuestion: saveApplicationQuestion }
              // }, () => {
              //   this.save()
              // })
            })
          }}
        >
          保存
        </Button>
        <Button
          className='ml20 mb20'
          onClick={() => {
          }}
        >
          取消
        </Button>
        {this.modalView()}
      </div>
    )
  }

  public modalView () {
    const { visible, itemData }=this.state
    console.log(itemData, 'itemData=====')
    const that=this
    return (
      <Modal
        title={(itemData?.id)? '修改配值':'新增配置'}
        visible={visible}
        width='75%'
        onOk={()=>this.onOk(that)}
        onCancel={()=>{
          this.onCancel(that)
        }}
      >
        <div>
          <Form

            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            <Row className='mt10'>
              <Col span={6} style={{ textAlign: 'right', paddingRight: 8 }}>
              问题标题 :
              </Col>
              <Col span={14}>
                <SearchFetch
                  value={itemData?.title}
                  api={(areaName) => {
                    const { originalQuestion } = this.data
                    return new Promise((resolve, reject) => {
                      if (areaName) {
                        const res = originalQuestion.filter((item: any) => item.title.indexOf(areaName) !== -1).map((item: any) => ({ text: item.title, value: item.id }))
                        resolve(res)
                      }
                    })
                  }}
                  onChange={(v)=>{
                    const { originalQuestion } = this.data
                    const res = originalQuestion?.find((item: { id: any }) => {
                      return String(item.id) === String(v)
                    })
                    this.setState({
                      itemData: res
                    })
                  }}
                  placeholder='请输入问题标题关键字下拉搜索'
                />
              </Col>
            </Row>

            <Row className='mt10'>
              <Col span={6} style={{ textAlign: 'right', paddingRight: 8 }}>
                排序号 :
              </Col>
              <Col span={14}>
                <InputNumber
                  value={itemData?.sort}
                  style={{ marginBottom: 20, width: 160 }}
                  placeholder='请输入排序号'
                  onChange={(v: any)=>{
                    itemData.sort= v < 0 ? 0 : v
                    this.setState({
                      itemData
                    })
                  }}
                />
              </Col>
            </Row>
            <Row className='mt10'>
              <Col span={6} style={{ textAlign: 'right', paddingRight: 8 }}>
                标题字体颜色 :
              </Col>
              <Col span={14}>
                {itemData?.fontSize}
              </Col>
            </Row>
            <Row>
              <Col span={6} style={{ textAlign: 'right', paddingRight: 8 }}>
                主要问题内容 :
              </Col>
              <Col span={14}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<pre>${itemData?.content || ''}</pre>`
                  }}
                >
                </div>
              </Col>
            </Row>
            <Row className='mt10'>
              <Col span={6} style={{ textAlign: 'right', paddingRight: 8 }}>
                次要问题 :
              </Col>
              <Col span={6}>
                <Button
                  type='primary'
                  onClick={() => {
                    itemData.item=itemData.item||[]
                    itemData.item.push({})
                    this.setState({
                      itemData
                    })
                  }}
                >
                新增
                </Button>
              </Col>

            </Row>
            {
              itemData&&itemData.item&&itemData.item.map((data: any, index: any)=>{
                return (
                  <div key={index} className='mt10'>
                    <Row>
                      <Col span={6} style={{ textAlign: 'right', paddingRight: 8 }}>
                    关联问题标题 :
                      </Col>
                      <Col span={14}>
                        <SearchFetch
                          value={data?.title}
                          api={(areaName) => {
                            const { originalQuestion } = this.data
                            return new Promise((resolve, reject) => {
                              if (areaName) {
                                const res = originalQuestion.filter((item: any) => item.title.indexOf(areaName) !== -1).map((item: any) => ({ text: item.title, value: item.id }))
                                resolve(res)
                              }
                            })
                          }}
                          onChange={(v)=>{
                            const { originalQuestion } = this.data
                            const res = originalQuestion?.find((item: { id: any }) => {
                              return String(item.id) === String(v)
                            })
                            itemData.item[index] = res
                            this.setState({
                              itemData
                            })
                          }}
                          placeholder='请输入问题标题关键字下拉搜索'
                        />
                      </Col>
                    </Row>
                    <Row className='mt10'>
                      <Col span={6} style={{ textAlign: 'right', paddingRight: 8 }}>
                    关联问题内容 :
                      </Col>
                      <Col span={14}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `<pre>${data?.content || ''}</pre>`
                          }}
                        >
                        </div>
                      </Col>
                    </Row>
                    <Row className='mt10'>
                      <Col span={14} offset={6}>
                        <Button
                          type='primary'
                          onClick={() => {
                            itemData?.item?.splice(index, 1)
                            this.setState({
                              itemData
                            })
                          }}
                        >
                          删除
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )
              })
            }
          </Form>
        </div>
      </Modal>
    )
  }
  public onOk (that:any) {
    const { itemData, mainProblem }=that.state
    console.log(that.state, 'state=====')
    if (!itemData.id) {
      return APP.error('请选择问题')
    }
    if (!itemData.sort) {
      return APP.error('输入排序号')
    }
    if (that.tempItemData && that.tempItemData?.id) {
      mainProblem.question.forEach((item: any) => {
        if (item.id === this.tempItemData.id) {
          item = itemData
        }
      })
    } else {
      mainProblem.question.push(itemData)
    }
    that.setState({
      mainProblem,
      visible: false
    })

  }
  public onCancel (that:any) {
    that.setState({
      visible: false,
      itemData: this.tempItemData
    })
  }
  public onShow () {
    this.setState({
      visible: true
    })
  }
}
export default Alert(Main)
