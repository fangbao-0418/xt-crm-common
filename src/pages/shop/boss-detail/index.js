import React from 'react'
import { Card, Descriptions, Button, Table } from 'antd'
import { connect } from '@/util/utils'
import Pannel from './components/pannel'
import PassModal from './components/passModal'
import CarouselPreview from '@/components/carousel-preview'
import Image from '@/components/Image'
import { replaceHttpUrl } from '@/util/utils'
import * as api from './api'

const columns = [
  {
    title: '审核时间',
    dataIndex: 'name',
    render: text => <a>{text}</a>,
    width: 150
  },
  {
    title: '审核人',
    dataIndex: 'age',
    width: 150
  },
  {
    title: '审核不通过原因',
    dataIndex: 'address'
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]

@connect(state => ({
  detail: state['shop.boss.detail'].detail
}))
class BossDetail extends React.Component {
  state = {
    carouselTitle: '',
    carouselVisible: false,
    carouselImgs: []
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData = () => {
    // const { match: { params: { id: merchantApplyLogId } } } = this.props
    // api.getShopInfo({ merchantApplyLogId }).then(detail => {
    //   this.setState({
    //     detail
    //   })
    // })
  }

  handlePass = () => {}

  handleUnpass = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'shop.boss.detail/saveDefault',
      payload: {
        passModal: {
          visible: true
        }
      }
    })
  }

  handleCarouselPreviewCancel = () => {
    this.setState({
      carouselVisible: false
    })
  }

  handlePreview (img) {
    this.setState({
      carouselImgs: [img],
      carouselVisible: true
    })
  }

  render () {
    const { detail } = this.props
    const { carouselTitle, carouselVisible, carouselImgs } = this.state

    if (!detail) {
      return (
        <Card bordered={false}>
          <Pannel title='企业信息'>
            <Card loading={true} />
          </Pannel>
          <Pannel title='法人信息' style={{ marginTop: 16 }}>
            <Card loading={true} />
          </Pannel>
          <Pannel title='品牌商标信息' style={{ marginTop: 16 }}>
            <Card loading={true} />
          </Pannel>
          <Pannel title='店铺基本信息' style={{ marginTop: 16 }}>
            <Card loading={true} />
          </Pannel>
          <Pannel title='保证金信息' style={{ marginTop: 16 }}>
            <Card loading={true} />
          </Pannel>
          <Pannel title='审核记录' style={{ marginTop: 16 }}>
            <Card loading={true} />
          </Pannel>
        </Card>
      )
    }
    console.log(carouselVisible, 'carouselVisible')

    return (
      <Card bordered={false}>
        <CarouselPreview
          title={carouselTitle}
          visible={carouselVisible}
          list={carouselImgs}
          onCancel={this.handleCarouselPreviewCancel}
          afterClose={this.handleDestroy}
        />
        <PassModal />
        <Pannel title='企业信息'>
          <Descriptions column={2}>
            <Descriptions.Item label='公司名称'>公司名称</Descriptions.Item>
            <Descriptions.Item label='统一社会信用代码'>统一社会信用代码</Descriptions.Item>
            <Descriptions.Item label='公司经营地址'>公司经营地址</Descriptions.Item>
            <Descriptions.Item label='营业执照'>
              <Image
                style={{
                  height: 100,
                  width: 100,
                  minWidth: 100
                }}
                src={replaceHttpUrl('https://assets.hzxituan.com/supplier/72BFA32C0F02CB27.png')}
                onClick={this.handlePreview.bind(this, 'https://assets.hzxituan.com/supplier/72BFA32C0F02CB27.png')}
                alt='主图'
              />
            </Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='法人信息' style={{ marginTop: 16 }}>
          <Descriptions>
            <Descriptions.Item label='法定代表人手机'>公司名称</Descriptions.Item>
            <Descriptions.Item label='身份证照'>统一社会信用代码</Descriptions.Item>
            <Descriptions.Item label='身份证照'>统一社会信用代码</Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='品牌商标信息' style={{ marginTop: 16 }}>
          <Descriptions column={2}>
            <Descriptions.Item label='品牌类型'>公司名称</Descriptions.Item>
            <Descriptions.Item label='品牌名称'>统一社会信用代码</Descriptions.Item>
          </Descriptions>
          <Descriptions column={1}>
            <Descriptions.Item label='授权书'>公司名称</Descriptions.Item>
            <Descriptions.Item label='授权有效期'>公司名称</Descriptions.Item>
            <Descriptions.Item label='商标注册号'>公司名称</Descriptions.Item>
            <Descriptions.Item label='商标注册证明'>公司名称</Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='店铺基本信息' style={{ marginTop: 16 }}>
          <Descriptions column={2}>
            <Descriptions.Item label='店铺名称'>公司名称</Descriptions.Item>
            <Descriptions.Item label='主营类目'>统一社会信用代码</Descriptions.Item>
          </Descriptions>
          <Descriptions column={1}>
            <Descriptions.Item label='管理人身份证照'>公司名称</Descriptions.Item>
            <Descriptions.Item label='第三方平台链接'>公司名称</Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='保证金信息' style={{ marginTop: 16 }}>
          保证金转账截图
        </Pannel>
        <Pannel title='审核记录' style={{ marginTop: 16 }}>
          <div>
            <Table scroll={{ y: 240 }} pagination={false} columns={columns} dataSource={data} />
          </div>
        </Pannel>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button onClick={this.handlePass} type='primary'>审核通过</Button>
          <Button onClick={this.handleUnpass} style={{ marginLeft: 16 }}>审核不通过</Button>
        </div>
      </Card>
    )
  }
}

export default BossDetail
