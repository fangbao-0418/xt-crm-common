import React from 'react'
import { Modal, Table, Button, ConfigProvider, Icon } from 'antd'
import * as api from '../api'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import styles from './style.module.sass'
import receiveStatus from '@/enum/receiveStatus'
import { formatFaceValue, formatDateRange } from '@/pages/helper'

interface State {
  visible: boolean
  dataSource: any,
  dataCouponSource: any,
  updata:number
}
interface Props {
  getInstance?: (ref: Main) => void
  onOk?: (data: any) => void
}

class Main extends React.Component<Props, State> {
  public form: FormInstance
  //type:1、已添加的优惠券 2、搜索出的优惠券
  public columns = (type: any) => [
    {
      title: '优惠券编号',
      dataIndex: 'code'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '领取时间',
      dataIndex: 'receiveTime',
      render: (text:any, record:any) => formatDateRange(record)
    },
    {
      title: '优惠券价值',
      dataIndex: 'discountAmount',
      render: (text:any, record:any) => formatFaceValue(record)
    },
    {
      title: '已领取/总量',
      dataIndex: 'receiveRatio',
      render: (text:any, record:any) => {
        return `${record.receiveCount}/${record.inventory}`
      }
    },
    {
      title: '已使用|使用率',
      dataIndex: 'usedRatio',
      render: (text:any, record:any) => {
        return record.receiveCount ? `${record.useCount} | ${ (100 * (record.useCount / record.receiveCount)).toFixed(1) + '%'}` : '-'
      }
    },
    {
      title: '领取状态',
      dataIndex: 'status',
      render: (text:any) => receiveStatus.getValue(text)
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text:any, record:any) => {
        const { dataCouponSource, updata }=this.state
        let flag = false
        let num = -1
        dataCouponSource&&dataCouponSource.length>0&& dataCouponSource.map((date: any, key:any)=>{
          if (date.code===record.code) {
            flag=true
            num=key
          }
        })
        return (
          <span
            className={flag&&type===2?'':'href'}
            onClick={() => {
              if (flag&&type===2) {
                return
              }
              if (type===2) {
                if (dataCouponSource&&dataCouponSource.length===10) {
                  APP.error('最多可添加10个优惠券')
                  return
                }
                APP.success('添加成功')
                dataCouponSource.push(record)
              } else {
                if (num>-1) {
                  dataCouponSource.splice(num, 1)
                }
              }
              this.setState({
                dataCouponSource,
                updata: updata+1
              })
            }}
          >
            { type===2?(flag?'已添加':'添加'):'删除' }
          </span>
        )
      }
    }
  ]
  public state: State = {
    visible: false,
    dataSource: [],
    dataCouponSource: [],
    updata: 0
  }
  public constructor (props: Props) {
    super(props)
    this.onOk = this.onOk.bind(this)
  }
  public componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
    }
  }
  //type:1、已添加的优惠券 2、搜索出的优惠券
  public fetchCouponData (data: any, type:any) {
    if (type===2) {
      data.statusList=[0, 1]
      data.exactMatchCode=true
    }
    api.getCouponlist(data).then((res: any) => {
      if (type===1) {
        this.setState({
          dataCouponSource: res.records || []
        })
      } else {
        if (!res.records||(res.records&&res.records.length===0)) {
          APP.error('优惠券不存在')
        }
        this.setState({
          dataSource: res.records || []
        })
      }
    })
  }
  public onOk () {
    const { dataCouponSource }=this.state
    // if (!dataCouponSource||(dataCouponSource&&dataCouponSource.length===0)) {
    //   APP.error('请添加优惠券')
    //   return
    // }
    const couponCode: any[]=[]
    let flag=false
    dataCouponSource.map((data: any)=>{
      if (data.status===2) {
        flag=true
      }
      couponCode.push(data.code)
    })
    if (flag) {
      APP.error('添加的优惠券有已结束的，请删除后再确认')
      return
    }
    if (this.props.onOk) {
      this.props.onOk(couponCode)
    }
  }
  public open (codes: any) {
    if (this.form) {
      this.form.props.form.resetFields()
    }
    if (codes&&codes.length>0) {
      this.fetchCouponData({ codes }, 1)
    }
    this.setState({
      visible: true,
      dataSource: [],
      dataCouponSource: codes?this.state.dataCouponSource:[]
    })
  }
  public hide () {
    this.setState({
      visible: false
    })
  }
  public render () {
    const { visible, dataSource, dataCouponSource, updata } = this.state
    const customizeRenderEmpty = () => (
      <div style={{ textAlign: 'center' }}>
        <p>暂无优惠券可添加，请先校验优惠券信息</p>
      </div>
    )
    return (
      <div>
        <Modal
          width={1200}
          visible={visible}
          title='添加优惠券'
          onOk={this.onOk}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
        >
          <div className={styles['shop-select-modal']}>
            <div>
              <Form
                className='mb10'
                layout='inline'
                getInstance={(ref) => {
                  this.form = ref
                }}
              >
                <FormItem
                  label='优惠券编号'
                  name='code'
                  type='input'
                  placeholder='请输入优惠券编号'
                  controlProps={{
                    style: {
                      width: 200
                    }
                  }}
                />
                <FormItem>
                  <Button
                    type='primary'
                    className='mr10'
                    onClick={() => {
                      const value = this.form.props.form.getFieldsValue()
                      if (!value.code) {
                        APP.error('请输入需要校验的优惠券编号')
                        return
                      }
                      this.fetchCouponData(value, 2)
                    }}
                  >
                    校验
                  </Button>
                </FormItem>
              </Form>
            </div>
            <ConfigProvider renderEmpty={customizeRenderEmpty}>
              <Table
                bordered
                rowKey='id'
                key={updata}
                columns={this.columns(2)}
                dataSource={dataSource}
                pagination={false}
              />
            </ConfigProvider>
            <div className={styles['select-title-header']}>
              已添加优惠券
            </div>
            <Table
              bordered
              rowKey='id1'
              columns={this.columns(1)}
              dataSource={dataCouponSource}
              pagination={false}
            />
          </div>
        </Modal>
      </div>
    )
  }
}
export default Main
