import React from 'react'
import { Card, Tabs, message, Button, Icon } from 'antd'
import { getGoodsList, getCategoryTopList, getShopList, exportGoods, passGoods, getGoodsInfo, getShopTypes } from './api'
import * as api from './api'
import SelectFetch from '@/components/select-fetch'
import { ListPage, If } from '@/packages/common/components'
import Form, { FormItem } from '@/packages/common/components/form'
import SuppilerSelector from '@/components/supplier-selector'
import SearchFetch from '@/packages/common/components/search-fetch'
import { replaceHttpUrl } from '@/util/utils'
import CarouselPreview from '@/components/carousel-preview'
import UnpassModal from './components/unpassModal'
import LowerModal from './components/lowerModal'
import ViolationModal from './components/violationModal'
import { combinationStatusList, formConfig } from './config/config'
import getColumns from './config/columns'
import Alert from '@/packages/common/components/alert'

const { TabPane } = Tabs

class Main extends React.Component {

  state = {
    tabStatus: '2',
    // status: undefined, // 0: 下架 1: 上架
    // auditStatus: undefined, // 0: 待提交 1: 待审核 2: 审核通过 3: 审核不通过
    currentGoods: null, // 当前审核商品
    selectedRowKeys: [],
    carouselTitle: '',
    carouselVisible: false,
    carouselImgs: [],
    imageViolationReasons: ''
  }

  /** 获取相关图片组合成自己想要的数据结构 */
  getCarouselsInfos = (currentGoods) => {
    const coverUrl = [{
      label: '封面图',
      value: currentGoods.coverUrl
    }]

    let listImage = [], skuImages = []

    if (currentGoods.listImage) {
      listImage = currentGoods.listImage.split(',').map(item => ({
        label: '详情图',
        value: item
      }))
    }

    if (currentGoods.skuList) {
      skuImages = currentGoods.skuList.filter(item => !!item.imageUrl1).map(item => ({
        label: 'sku图',
        value: replaceHttpUrl(item.imageUrl1)
      }))
    }

    const carouselsInfos = [
      ...coverUrl,
      ...listImage,
      ...skuImages
    ]

    return carouselsInfos
  }

  /** 操作：商品图片预览-显示预览模态框 */
  handlePreview = (currentGoods) => {
    getGoodsInfo({ productPoolId: currentGoods.id }).then(res => {
      this.setState({
        carouselTitle: `【${res.productName}】 图片预览`,
        carouselVisible: true,
        carouselImgs: this.getCarouselsInfos(res),
        imageViolationReasons: res.imageViolationReasons
      })
    })
  }

  /** 操作：查看商品违规次数-显示违规模态框 */
  handleViolation = (currentGoods) => {
    this.setState({
      currentGoods
    }, () => {
      this.violationModalRef.showModal()
      this.violationModalRef.fetchData({
        page: 1,
        pageSize: 10,
        productPoolId: currentGoods.id
      })
    })
  }

  /** 操作：查看商品详情-打开新标签页面 */
  handleDetail = (record) => {
    APP.open(`/shop/pop-goods/detail/${record.id}`)
  }

  /** 操作：下架商品-显示下架理由模态框 */
  handleLower = (currentGoods) => {
    this.setState({
      currentGoods
    }, () => {
      this.lowerModalRef.showModal()
    })
  }

  /** 操作：通过商品审核 */
  handlePass = (record) => {
    let form
    const hide = this.props.alert({
      title: '渠道选择',
      content: (
        <Form
          getInstance={(ref) => form = ref }
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <FormItem
            name='channel'
            label='渠道选择'
            required={true}
            type='radio'
            options={[
              { label: '优选', value: 1 },
              { label: '好店', value: 2 }
            ]}
            fieldDecoratorOptions={{
              initialValue: 1,
              rules: [
                { required: true, message: '请选择渠道' }
              ]
            }}
          />
        </Form>
      ),
      onOk: () => {
        form?.props.form.validateFields((err, values) => {
          if (err) {
            return
          }
          passGoods({
            ids: [record.id],
            channel: values.channel
          }).then(() => {
            hide?.()
            message.success('审核通过成功!')
            this.listRef.fetchData()
          })
        })
      }
    })
  }

  /** 操作：不通过商品审核-弹出理由模态框 */
  handleUnpass = (currentGoods) => {
    this.setState({
      currentGoods
    }, () => {
      this.unpassModalRef.showModal()
    })
  }

  /** 操作：切换状态查询 */
  handleTabChange = (tabStatus) => {
    this.setState({
      tabStatus
    }, () => {
      this.listRef.refresh(true)
    })
  }

  /** 性能优化: 重置清空当前商品 */
  handleDestroy = () => {
    this.setState({
      currentGoods: null,
      carouselImgs: []
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  handleBatchPass = () => {
    const { selectedRowKeys } = this.state
    passGoods({
      ids: selectedRowKeys
    }).then(() => {
      message.success(`共${selectedRowKeys.length}件商品审核通过成功！`)
      this.setState({
        selectedRowKeys: []
      })
      this.listRef.fetchData()
    })
  }

  handleBatchReject = () => {
    this.unpassModalRef.showModal()
  }

  clearSelectedRowKeys = () => {
    this.setState({
      selectedRowKeys: []
    })
  }

  /* 商品图片预览模态框取消 */
  handleCarouselPreviewCancel = () => {
    this.setState({
      carouselVisible: false
    })
  }

  importAdvisePrice () {
    const el = document.createElement('input')
    el.setAttribute('type', 'file')
    el.onchange = function (e) {
      console.dir(e.target)
      const file = e?.target.files?.[0]
      api.importAdvisePrice(file)
    }
    el.click()
  }

  render () {
    const { currentGoods, tabStatus, selectedRowKeys, carouselTitle, carouselVisible, carouselImgs, imageViolationReasons } = this.state
    const hasSelected = selectedRowKeys.length > 0

    return (
      <Card>
        {/* 商品图片预览模态框 */}
        <CarouselPreview
          title={carouselTitle}
          visible={carouselVisible}
          list={carouselImgs}
          onCancel={this.handleCarouselPreviewCancel}
          afterClose={this.handleDestroy}
          afterAddon={
            imageViolationReasons ? (
              <p style={{ textAlign: 'center', color: 'red' }}>
                <Icon style={{ color: 'red' }} type='info-circle' />{' '}
                商品图片中有部分图片涉嫌违规，请谨慎复核
              </p>
            ) : null
          }
        />

        {/* 不通过理由模态框 */}
        <UnpassModal
          currentGoods={currentGoods}
          selectedRowKeys={selectedRowKeys}
          listRef={this.listRef}
          wrappedComponentRef={ref => this.unpassModalRef = ref}
          ondestroy={this.handleDestroy}
          onClearSelectedRowKeys={this.clearSelectedRowKeys}
        />

        {/* 下架操作模态框 */}
        <LowerModal
          currentGoods={currentGoods}
          listRef={this.listRef}
          wrappedComponentRef={ref => this.lowerModalRef = ref}
          ondestroy={this.handleDestroy}
        />

        {/* 违规历史模态框 */}
        <ViolationModal
          currentGoods={currentGoods}
          ref={ref => this.violationModalRef = ref}
          ondestroy={this.handleDestroy}
        />

        {/* Tabs状态切换组 */}
        <Tabs
          defaultActiveKey='2'
          onChange={this.handleTabChange}
        >
          {
            combinationStatusList
              .map((item) => {
                return (
                  <TabPane tab={item.name} key={item.id} />
                )
              })
          }
        </Tabs>

        {/* 列表内容: 查询条件 + 表格内容 */}
        <ListPage
          reserveKey='/shop/pop-goods'
          namespace='/shop/pop-goods'
          formConfig={formConfig}
          getInstance={ref => this.listRef = ref}
          cachePayloadProcess={(payload) => {
            return {
              ...payload
            }
          }}
          processPayload={({ innerAuditStatus, ...payload }) => {
            payload.labType = +tabStatus
            if (tabStatus === '0') { // tab 全部
              if (
                innerAuditStatus
                && (innerAuditStatus !== -1)
              ) {
                payload.auditStatus = innerAuditStatus
              } else {
                payload.auditStatus = undefined
              }
            } else {
              payload.auditStatus = undefined
            }
            return {
              ...payload,
              storeId: payload.store?.key,
              store: undefined
            }
          }}
          rangeMap={{
            createTime: {
              fields: ['createStartTime', 'createEndTime']
            },
            auditTime: {
              fields: ['auditStartTime', 'auditEndTime']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='productName' />
              <FormItem name='id' />
              <FormItem
                label='一级类目'
                inner={(form) => {
                  return form.getFieldDecorator('firstCategoryId')(
                    <SelectFetch
                      style={{ width: 172 }}
                      fetchData={getCategoryTopList}
                    />
                  )
                }}
              />
              <FormItem
                label='供应商'
                inner={(form) => {
                  return form.getFieldDecorator('store')(
                    <SuppilerSelector
                      style={{ width: 172 }}
                      processPayload={payload => ({
                        ...payload,
                        categorys: [6, 7]
                      })}
                    />
                  )
                }}
              />
              <If condition={tabStatus === '0'}>
                <FormItem name='innerAuditStatus' />
              </If>
              <FormItem label='审核人' name='auditUser' />
              <FormItem
                label='渠道'
                name='channel'
                type='select'
                options={[
                  { label: '优选', value: 1 },
                  { label: '好店', value: 2 }
                ]}
              />
              <FormItem
                label='商家类型'
                inner={(form) => {
                  return form.getFieldDecorator('shopTypes')(
                    <SelectFetch
                      mode='multiple'
                      style={{ width: 172 }}
                      fetchData={getShopTypes}
                    />
                  )
                }}
              />
              <FormItem
                name='createTime'
                label='创建时间'
                type='rangepicker'
                controlProps={{
                  showTime: true
                }}
              />
              <FormItem
                label='审核时间'
                name='auditTime'
                type='rangepicker'
                controlProps={{
                  showTime: true
                }}
              />
              <FormItem name='phone' />
              <FormItem
                label='店铺名称'
                inner={(form) => {
                  return form.getFieldDecorator('shopId')(
                    <SearchFetch
                      api={getShopList}
                      style={{ width: 172 }}
                      placeholder='请输入店铺名称'
                    />
                  )
                }}
              />
            </>
          )}
          api={getGoodsList}
          columns={getColumns({
            onPreview: this.handlePreview,
            onViolation: this.handleViolation,
            onDetail: this.handleDetail,
            onLower: this.handleLower,
            onPass: this.handlePass,
            onUnpass: this.handleUnpass
          })}
          tableProps={{
            scroll: {
              x: true
            },
            rowSelection: {
              selectedRowKeys,
              onChange: this.onSelectChange
            }
          }}
          showButton={false}
          addonAfterSearch={
            <>
              {tabStatus === '2' && (
                <>
                  <Button
                    type='primary'
                    disabled={!hasSelected}
                    className='mr8'
                    onClick={this.handleBatchPass}
                  >
                    审核通过
                  </Button>
                  <Button
                    disabled={!hasSelected}
                    className='mr8'
                    onClick={this.handleBatchReject}
                  >
                    审核不通过
                  </Button>
                </>
              )}
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.listRef.refresh()
                }}
              >
                查询
              </Button>
              <Button
                className='mr8'
                onClick={() => {
                  this.listRef.refresh(true)
                }}
              >
                清除
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  const payload = this.listRef.getPayload()
                  exportGoods(payload)
                }}
              >
                商品导出
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.importAdvisePrice()
                }}
              >
                建议价格导入
              </Button>
              <span
                className='href'
                onClick={() => {
                  APP.fn.download(require('./assets/建议价格导入模板.xlsx'), '建议价格导入模板.xlsx')
                }}
              >
                下载模板
              </span>
            </>
          }
        />
      </Card>
    )
  }
}

export default Alert(Main)
