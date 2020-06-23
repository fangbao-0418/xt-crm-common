import React, { Fragment } from 'react'
import { Card, Descriptions, Button, Table, Modal } from 'antd'
import { connect } from '@/util/utils'
import Pannel from './components/pannel'
import PassModal from './components/passModal'
import CarouselPreview from '@/components/carousel-preview'
import Image from '@/components/Image'
import { replaceHttpUrl } from '@/util/utils'
import { brandTypeListMap } from './config'
import { groupBy } from 'lodash'

const { confirm } = Modal

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
    const { dispatch, match: { params: { id: merchantApplyLogId, auditResult } } } = this.props
    dispatch['shop.boss.detail'].getShopInfo({
      merchantApplyLogId,
      auditResult
    })
    dispatch['shop.boss.detail'].getApplyList({
      merchantApplyLogId
    })
  }

  handlePass = () => {
    const { dispatch, match: { params: { id: merchantApplyLogId } }, history } = this.props
    confirm({
      title: '确认重新审核通过吗?',
      okText: '审核通过',
      onOk: () => {
        dispatch['shop.boss.detail'].passShop({
          merchantApplyLogId
        }, () => {
          history.push('/shop/boss')
        })
      }
    })
  }

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

  getCarouselImgs (detail) {
    const { enterpriseInfo, merchantStoreInfo, storeBrandList } = detail
    // 营业执照
    const businessLicenseListImgs = enterpriseInfo.businessLicenseList.map(item => ({
      label: item.imageName || '营业执照',
      value: item.imageUrl
    }))
    // 身份证
    const legalPersonListImgs = enterpriseInfo.legalPersonList.map(item => ({
      label: item.imageName || '身份证',
      value: item.imageUrl
    }))
    // 授权书
    const authorizationListImgs = storeBrandList.reduce((pre, next) => ([
      ...pre,
      ...(next.authorizationList.map(item => ({
        label: item.imageName || '授权书',
        value: item.imageUrl
      })))
    ]), [])
    // 注册证明
    const registrationListImgs = storeBrandList.reduce((pre, next) => ([
      ...pre,
      ...(next.registrationList.map(item => ({
        label: item.imageName || '注册证明',
        value: item.imageUrl
      })))
    ]), [])
    return [
      ...businessLicenseListImgs,
      ...legalPersonListImgs,
      ...authorizationListImgs,
      ...registrationListImgs
    ]
  }

  render () {
    const { detail, list } = this.props
    const { carouselTitle, carouselVisible } = this.state

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

    const { enterpriseInfo, merchantStoreInfo, storeBrandList } = detail

    const carouselImgs = this.getCarouselImgs(detail)

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
            <Descriptions.Item label='公司名称'>
              {enterpriseInfo.enterpriseName}
            </Descriptions.Item>
            <Descriptions.Item label='统一社会信用代码'>
              {enterpriseInfo.enterpriseCreditCode}
            </Descriptions.Item>
            <Descriptions.Item label='公司经营地址'>
              {`${enterpriseInfo.provinceName} ${enterpriseInfo.cityName} ${enterpriseInfo.areaName} ${enterpriseInfo.detailAddress}`}
            </Descriptions.Item>
            <Descriptions.Item label='营业执照'>
              {
                enterpriseInfo.businessLicenseList.map((item, i) => (
                  <Image
                    key={i}
                    style={{
                      height: 100,
                      width: 100,
                      minWidth: 100,
                      marginRight: 8
                    }}
                    src={replaceHttpUrl(item.imageUrl)}
                    onClick={this.handlePreview.bind(this, item.imageUrl)}
                    alt={item.imageName}
                  />
                ))
              }
            </Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='法人信息' style={{ marginTop: 16 }}>
          <Descriptions column={2}>
            <Descriptions.Item label='法定代表人手机'>
              {enterpriseInfo.legalPersonPhone}
            </Descriptions.Item>
            <Descriptions.Item label='身份证照'>
              {
                enterpriseInfo.legalPersonList.map((item, i) => (
                  <Image
                    key={i}
                    style={{
                      height: 100,
                      width: 100,
                      minWidth: 100,
                      marginRight: 8
                    }}
                    src={replaceHttpUrl(item.imageUrl)}
                    onClick={this.handlePreview.bind(this, item.imageUrl)}
                    alt={item.imageName}
                  />
                ))
              }
            </Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='品牌商标信息' style={{ marginTop: 16 }}>
          {
            storeBrandList.map((item, i) => (
              <Fragment key={i}>
                <Descriptions column={2}>
                  <Descriptions.Item label={`${i + 1} 品牌类型`}>
                    {brandTypeListMap[item.brandType]}
                  </Descriptions.Item>
                  <Descriptions.Item label='品牌名称'>
                    {item.brandName}
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions column={1}>
                  <Descriptions.Item label='授权书'>
                    {
                      item.authorizationList.map((iItem, iI) => (
                        <Image
                          key={iI}
                          style={{
                            height: 100,
                            width: 100,
                            minWidth: 100,
                            marginRight: 8
                          }}
                          src={replaceHttpUrl(iItem.imageUrl)}
                          onClick={this.handlePreview.bind(this, iItem.imageUrl)}
                          alt={iItem.imageName}
                        />
                      ))
                    }
                  </Descriptions.Item>
                  <Descriptions.Item label='授权有效期'>
                    {APP.fn.formatDate(item.authValidityTime)}
                  </Descriptions.Item>
                  {
                    Object.entries(groupBy(item.registrationList, 'imageName')).map((iItem, j) => {
                      return (
                        <>
                          <Descriptions.Item label={`${i + 1}.${j + 1} 商标注册号`}>
                            {iItem[0]}
                          </Descriptions.Item>
                          <Descriptions.Item label='商标注册证明'>
                            {iItem[1].map((img, k) => (
                              <Image
                                key={k}
                                style={{
                                  height: 100,
                                  width: 100,
                                  minWidth: 100,
                                  marginRight: 8
                                }}
                                src={replaceHttpUrl(img)}
                                onClick={this.handlePreview.bind(this, img)}
                                alt={img}
                              />
                            ))}
                          </Descriptions.Item>
                        </>
                      )
                    })
                  }
                </Descriptions>
              </Fragment>
            ))
          }
        </Pannel>
        <Pannel title='店铺基本信息' style={{ marginTop: 16 }}>
          <Descriptions column={2}>
            <Descriptions.Item label='店铺名称'>
              {merchantStoreInfo.storeName}
            </Descriptions.Item>
            <Descriptions.Item label='主营类目'>
              {merchantStoreInfo.mainCategoryName}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions column={1}>
            <Descriptions.Item label='管理人身份证照'>
              {merchantStoreInfo.managerList.map((item, i) => (
                <Image
                  key={i}
                  style={{
                    height: 100,
                    width: 100,
                    minWidth: 100,
                    marginRight: 8
                  }}
                  src={replaceHttpUrl(item.imageUrl)}
                  onClick={this.handlePreview.bind(this, item.imageUrl)}
                  alt={item.imageName}
                />
              ))}
            </Descriptions.Item>
            <Descriptions.Item label='第三方平台链接'>
              {merchantStoreInfo.thirdPartyUrl}
            </Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='保证金信息' style={{ marginTop: 16 }}>
          {merchantStoreInfo.moneyList.map((item, i) => (
            <Image
              key={i}
              style={{
                height: 100,
                width: 100,
                minWidth: 100,
                marginRight: 8
              }}
              src={replaceHttpUrl(item.imageUrl)}
              onClick={this.handlePreview.bind(this, item.imageUrl)}
              alt={item.imageName}
            />
          ))}
        </Pannel>
        <Pannel title='审核记录' style={{ marginTop: 16 }}>
          <div>
            <Table
              scroll={{ y: 240 }}
              pagination={false}
              columns={columns}
              dataSource={list}
            />
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
