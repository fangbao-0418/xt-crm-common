import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { ListPage, Alert } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Popconfirm, Row, Col, Table, Button, Modal } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import UploadView from '@/components/upload'
import { getFieldsConfig } from './config'
import SearchFetch from '@/packages/common/components/search-fetch'
import * as api from './api'
interface Props extends AlertComponentProps {
}

interface State {
  dataSource: any
  page: any
  pageSize: any
  total: any
  itemData: any
  visible: boolean
}
interface PayloadProps {
  page: number
  pageSize: number
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public tempItemData: any
  public questionList: any
  public payload: PayloadProps = {
    page: 1,
    pageSize: 10
  }
  public state: State = {
    dataSource: [],
    page: this.payload.page,
    pageSize: this.payload.pageSize,
    total: 0,
    itemData: {},
    visible: false
  }
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '主要问题标题',
    dataIndex: 'nickName',
    width: 300
  }, {
    title: '次要问题数目',
    dataIndex: 'fansTotal',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'anchorIdentityType',
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
  public componentWillMount () {
    this.fetchData()
  }
  public fetchData () {
    this.setState({
      page: this.payload.page
    })
    api.getAnchorList(this.payload).then((res: any) => {
      this.setState({
        dataSource: res.records || [],
        total: res.total
      })
    })
  }
  // 删除当前行
  public handleRemove (index: number) {
    const { dataSource } = this.state
    dataSource.splice(index, 1)
    this.setState({ dataSource })
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
            config={getFieldsConfig()}
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 5 }}
          >
            <FormItem
              verifiable
              required
              name='operateRemark1'
            />
            <FormItem
              label='配置图标'
              inner={(form) => {
                return form.getFieldDecorator('imgUrl')(
                  <UploadView
                    listType='picture-card'
                    listNum={1}
                    fileType={['jpg', 'jpeg', 'gif', 'png']}
                    size={0.3}
                    placeholder='上传icon图'
                  />
                )
              }}
            />
            <FormItem
              verifiable
              required
              name='operateRemark2'
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
        <Table
          style={{ margin: 20 }}
          bordered
          rowKey='id'
          columns={this.columns}
          dataSource={this.state.dataSource}
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
    let form: FormInstance
    const { visible, itemData }=this.state
    const that=this
    return (
      <Modal
        title={(itemData?.id)? '修改配值':'新增配置'}
        visible={visible}
        width='75%'
        onOk={()=>this.onOk(form, that)}
        onCancel={()=>{
          this.onCancel(that)
        }}
      >
        <div>
          <Form
            getInstance={(ref) => {
              form = ref
            }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            <FormItem
              label='选择主要问题'
              required
              inner={(form) => {
                return form.getFieldDecorator('warehouseLocationId')(
                  <SearchFetch
                    value={itemData?.areaName}
                    api={(areaName) => {
                      return api.searchPoints(areaName).then((res: { result: any[] }) => {
                        this.questionList=res.result||[]
                        return res?.result?.map((v: { areaName: string, id: string }) => ({ text: v.areaName, value: v.id }))
                      })
                    }}
                    onChange={(v)=>{
                      const res = this.questionList?.find((item: { id: any }) => {
                        return String(item.id) === String(v)
                      })
                      itemData.areaName=v
                      itemData.areaCode=res?.areaCode
                      itemData.id=res?.id
                      this.setState({
                        itemData
                      })
                    }}
                    placeholder='请输入问题标题关键字下拉搜索'
                  />
                )
              }}
            />
            <FormItem
              label='排序号'
              verifiable
              required
              name='operateRemark2'
            />
            <Row className='mt10'>
              <Col span={6} style={{ textAlign: 'right', paddingRight: 8 }}>
                标题字体颜色 :
              </Col>
              <Col span={14}>
                {itemData?.areaCode}
              </Col>
            </Row>
            <Row>
              <Col span={6} style={{ textAlign: 'right', paddingRight: 8 }}>
                主要问题内容 :
              </Col>
              <Col span={14}>
                {itemData?.id}
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
                          value={data?.areaName}
                          api={(areaName) => {
                            return api.searchPoints(areaName).then((res: { result: any[] }) => {
                              this.questionList=res.result||[]
                              return res?.result?.map((v: { areaName: string, id: string }) => ({ text: v.areaName, value: v.id }))
                            })
                          }}
                          onChange={(v)=>{
                            const res = this.questionList?.find((item: { id: any }) => {
                              return String(item.id) === String(v)
                            })
                            itemData.item[index].areaName=v
                            itemData.item[index].areaCode=res?.areaCode
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
                        {data?.areaCode}
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
  public onOk (form: FormInstance, that:any) {
    const { itemData, dataSource }=this.state
    if (form) {
      form.props.form.validateFields((err: any, values: { operateRemark: any }) => {
        if (err) {
          return
        }
      })
      if (this.tempItemData) {
        dataSource[0]=itemData
      } else {
        dataSource.push(itemData)
      }
    }

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
