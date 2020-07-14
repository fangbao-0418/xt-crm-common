import React, { Fragment } from 'react'
import { Card, Descriptions, Button, Table, Modal } from 'antd'
import { connect, replaceHttpUrl } from '@/util/utils'
import Pannel from './components/pannel'
import PassModal from './components/passModal'
import CarouselPreview from '@/components/carousel-preview'
// import { If } from '@/packages/common/components'
import Image from '@/components/Image'
import { brandTypeListMap } from './config'
import { groupBy } from 'lodash'

// const shopTypeMap = {
//   1: '喜团自营',
//   2: '直播小店',
//   3: '品牌旗舰店',
//   4: '品牌专营店',
//   5: '喜团工厂店',
//   6: '普通企业店'
// }

const { confirm } = Modal

const columns = [
  {
    title: '审核时间',
    dataIndex: 'createTime',
    render: text => APP.fn.formatDate(text),
    width: 150
  },
  {
    title: '审核人',
    dataIndex: 'auditName',
    width: 150
  },
  {
    title: '审核不通过原因',
    dataIndex: 'auditReason'
  }
]

@connect(state => ({
  detail: state['shop.boss.detail'].detail,
  list: state['shop.boss.detail'].list
}))
class BossDetail extends React.Component {
  state = {
    carouselTitle: '',
    carouselVisible: false,
    carouselImgs: [],
    activeSlide: undefined
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
      merchantApplyLogId,
      auditResult
    })
  }

  handlePass = () => {
    const { dispatch, match: { params: { id: merchantApplyId } }, history } = this.props
    confirm({
      title: '确认重新审核通过吗?',
      okText: '审核通过',
      onOk: () => {
        dispatch['shop.boss.detail'].passShop({
          merchantApplyId
        }, () => {
          history.push('/shop/boss')
        })
      }
    })
  }

  handleUnpass = () => {
    const { dispatch, match: { params: { id: merchantApplyId } } } = this.props
    dispatch({
      type: 'shop.boss.detail/saveDefault',
      payload: {
        passModal: {
          visible: true,
          merchantApplyId
        }
      }
    })
  }

  handleCarouselPreviewCancel = () => {
    this.setState({
      carouselVisible: false
    })
  }

  handlePreview (img, type) {
    const { detail } = this.props
    const carouselImgs = this.getCarouselImgs(detail)
    const activeSlide = carouselImgs.findIndex(item => {
      return item.value === img && type === item.type
    })
    console.log(carouselImgs, activeSlide)
    this.setState({
      activeSlide,
      carouselVisible: true
    }, () => {
      this.carouselPreviewRef.goto(activeSlide)
    })
  }

  getCarouselImgs (detail) {
    const { enterpriseInfo, merchantStoreInfo, shopType } = detail
    const storeBrandList = detail?.storeBrandList || []
    // 营业执照
    const businessLicenseListImgs = enterpriseInfo.businessLicenseList.map(item => ({
      label: item.imageName || '营业执照',
      value: item.imageUrl,
      type: 1
    }))
    // 生产许可证
    const productionLicenseListImgs = shopType === 5 ? enterpriseInfo.productionLicenseList.map(item => ({
      label: item.imageName || '生产许可证',
      value: item.imageUrl,
      type: 2
    })) : []
    // 身份证
    const legalPersonListImgs = enterpriseInfo.legalPersonList.map(item => ({
      label: item.imageName || '身份证照',
      value: item.imageUrl,
      type: 3
    }))
    const storeBrandListImgs = storeBrandList.reduce((pre, next) => {
      return [
        ...pre,
        ...((next.authorizationList || []).map(item => ({
          label: item.imageName || '授权书',
          value: item.imageUrl,
          type: 4
        }))),
        ...(
          Object.entries(groupBy((next.registrationList || []), 'imageName')).reduce((pre, next) => ([
            ...pre,
            ...(next[1]?.map(item => ({
              label: item.imageName || '注册证明',
              value: item.imageUrl,
              type: 5
            })) || [])
          ]), [])
        )
        // ...(next.registrationList.map(item => ({
        //   label: item.imageName || '注册证明',
        //   value: item.imageUrl,
        //   type: 5
        // })))
      ]
    }, [])
    // // 授权书
    // const authorizationListImgs = (storeBrandList || []).reduce((pre, next) => ([
    //   ...pre,
    //   ...(next.authorizationList.map(item => ({
    //     label: item.imageName || '授权书',
    //     value: item.imageUrl
    //   })))
    // ]), [])
    // // 注册证明
    // const registrationListImgs = (storeBrandList || []).reduce((pre, next) => ([
    //   ...pre,
    //   ...(next.registrationList.map(item => ({
    //     label: item.imageName || '注册证明',
    //     value: item.imageUrl
    //   })))
    // ]), [])
    // 管理员身份证
    const managerList = merchantStoreInfo.managerList.map(item => ({
      label: item.imageName || '管理人身份证照',
      value: item.imageUrl,
      type: 6
    }))
    // 保证金信息
    const moneyList = merchantStoreInfo.moneyList.map(item => ({
      label: item.imageName || '保证金',
      value: item.imageUrl,
      type: 7
    }))
    return [
      ...businessLicenseListImgs,
      ...productionLicenseListImgs,
      ...legalPersonListImgs,
      // ...authorizationListImgs,
      // ...registrationListImgs,
      ...storeBrandListImgs,
      ...managerList,
      ...moneyList
    ]
  }

  render () {
    const { detail, list, match: { params: { auditResult } } } = this.props
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

    const { enterpriseInfo, merchantStoreInfo, storeBrandList, shopType } = detail

    const carouselImgs = this.getCarouselImgs(detail)

    return (
      <Card bordered={false}>
        <CarouselPreview
          ref={ref => this.carouselPreviewRef = ref}
          title={carouselTitle}
          visible={carouselVisible}
          list={carouselImgs}
          onCancel={this.handleCarouselPreviewCancel}
          afterClose={this.handleDestroy}
          forceRender={true}
          bodyStyle={{
            overflow: 'hidden'
          }}
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
                    onClick={this.handlePreview.bind(this, item.imageUrl, 1)}
                    alt={item.imageName}
                  />
                ))
              }
            </Descriptions.Item>
            {
              shopType === 5 && (
                <Descriptions.Item label='生产许可证'>
                  {
                    enterpriseInfo.productionLicenseList.map((item, i) => (
                      <Image
                        key={i}
                        style={{
                          height: 100,
                          width: 100,
                          minWidth: 100,
                          marginRight: 8
                        }}
                        src={replaceHttpUrl(item.imageUrl)}
                        onClick={this.handlePreview.bind(this, item.imageUrl, 2)}
                        alt={item.imageName}
                      />
                    ))
                  }
                </Descriptions.Item>
              )
            }
          </Descriptions>
        </Pannel>
        <Pannel title='法人信息' style={{ marginTop: 16 }}>
          <Descriptions>
            <Descriptions.Item label='法定代表人手机'>
              {enterpriseInfo.legalPersonPhone}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions column={2}>
            <Descriptions.Item label='姓名'>
              {enterpriseInfo.legalPersonName}
            </Descriptions.Item>
            <Descriptions.Item label='身份证号'>
              {enterpriseInfo.legalPersonIdentity}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions>
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
                    onClick={this.handlePreview.bind(this, item.imageUrl, 3)}
                    alt={item.imageName}
                  />
                ))
              }
            </Descriptions.Item>
          </Descriptions>
        </Pannel>
        <Pannel title='品牌商标信息' style={{ marginTop: 16 }}>
          {
            storeBrandList && storeBrandList[0]
              ? storeBrandList.map((item, i) => (
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
                    {
                      item.brandType === 2 && (
                        <Fragment>
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
                                  onClick={this.handlePreview.bind(this, iItem.imageUrl, 4)}
                                  alt={iItem.imageName}
                                />
                              ))
                            }
                          </Descriptions.Item>
                          <Descriptions.Item label='授权有效期'>
                            {APP.fn.formatDate(item.authValidityTime, 'YYYY-MM-DD')}
                          </Descriptions.Item>
                        </Fragment>
                      )
                    }
                    {
                      Object.entries(groupBy(item.registrationList, 'imageName')).map((iItem, j) => {
                        console.log(iItem, 123)
                        return (
                        <>
                          <Descriptions.Item label={`${i + 1}.${j + 1} 商标注册号`}>
                            {iItem[0]}
                          </Descriptions.Item>
                          <Descriptions.Item label='商标注册证明'>
                            {iItem[1].map((imgItem, k) => (
                              <Image
                                key={k}
                                style={{
                                  height: 100,
                                  width: 100,
                                  minWidth: 100,
                                  marginRight: 8
                                }}
                                src={replaceHttpUrl(imgItem.imageUrl)}
                                onClick={this.handlePreview.bind(this, imgItem.imageUrl, 5)}
                                alt={imgItem.imageUrl}
                              />
                            ))}
                          </Descriptions.Item>
                        </>
                        )
                      })
                    }
                  </Descriptions>
                </Fragment>
              )) : '暂无数据'
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
          <Descriptions column={2}>
            <Descriptions.Item label='管理人姓名'>
              {merchantStoreInfo.managerName}
            </Descriptions.Item>
            <Descriptions.Item label='管理人身份证号'>
              {merchantStoreInfo.managerIdentity}
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
                  onClick={this.handlePreview.bind(this, item.imageUrl, 6)}
                  alt={item.imageName}
                />
              ))}
            </Descriptions.Item>
            <Descriptions.Item label='第三方平台链接'>
              {
                merchantStoreInfo.thirdPartyUrl
                  ? (
                    <a
                      href={(/^(https|http)/).test(merchantStoreInfo.thirdPartyUrl) ?merchantStoreInfo.thirdPartyUrl : 'http://' + merchantStoreInfo.thirdPartyUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {merchantStoreInfo.thirdPartyUrl}
                    </a>
                  ) : '暂无数据'
              }
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
              onClick={this.handlePreview.bind(this, item.imageUrl, 7)}
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
        {
          auditResult === '1' && (
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Button onClick={this.handlePass} type='primary'>审核通过</Button>
              <Button onClick={this.handleUnpass} style={{ marginLeft: 16 }}>审核不通过</Button>
            </div>
          )
        }
      </Card>
    )
  }
}

export default BossDetail
