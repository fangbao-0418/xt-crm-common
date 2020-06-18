import React from 'react'
import { Card, Descriptions, Button } from 'antd'
import Pannel from './components/pannel'
import * as api from './api'

class BossDetail extends React.Component {
  state = {
    detail: null
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData = () => {
    const { match: { params: { id: merchantApplyLogId } } } = this.props
    api.getShopInfo({ merchantApplyLogId }).then(detail => {
      this.setState({
        detail
      })
    })
  }

  render () {
    return (
      <Card bordered={false}>
        <Pannel title='企业信息'>
          <Descriptions>
            <Descriptions.Item label='公司名称'>公司名称</Descriptions.Item>
            <Descriptions.Item label='统一社会信用代码'>统一社会信用代码</Descriptions.Item>
            <Descriptions.Item label='公司经营地址'>公司经营地址</Descriptions.Item>
            <Descriptions.Item label='营业执照'>营业执照</Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='法人信息' style={{ marginTop: 16 }}>
          <Descriptions>
            <Descriptions.Item label='法定代表人手机'>公司名称</Descriptions.Item>
            <Descriptions.Item label='身份证照'>统一社会信用代码</Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='品牌商标信息' style={{ marginTop: 16 }}>
          <Descriptions>
            <Descriptions.Item label='品牌类型'>公司名称</Descriptions.Item>
            <Descriptions.Item label='品牌名称'>统一社会信用代码</Descriptions.Item>
            <Descriptions.Item label='授权书'>统一社会信用代码</Descriptions.Item>
            <Descriptions.Item label='授权有效期'>统一社会信用代码</Descriptions.Item>
            <Descriptions.Item label='商标注册号'>统一社会信用代码</Descriptions.Item>
            <Descriptions.Item label='商标注册证明'>统一社会信用代码</Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='店铺基本信息' style={{ marginTop: 16 }}>
          <Descriptions>
            <Descriptions.Item label='店铺名称'>公司名称</Descriptions.Item>
            <Descriptions.Item label='主营类目'>统一社会信用代码</Descriptions.Item>
            <Descriptions.Item label='管理人身份证照'>统一社会信用代码</Descriptions.Item>
            <Descriptions.Item label='第三方平台链接'>统一社会信用代码</Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='保证金信息' style={{ marginTop: 16 }}>
          保证金转账截图
        </Pannel>
        <Pannel title='审核记录' style={{ marginTop: 16 }}>
          审核记录
        </Pannel>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button type='primary'>审核通过</Button>
          <Button style={{ marginLeft: 16 }}>审核不通过</Button>
        </div>
      </Card>
    )
  }
}

export default BossDetail
