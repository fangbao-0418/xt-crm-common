import React from 'react';
import { Card, Tabs, message, Button } from 'antd';
import { getGoodsList, getCategoryTopList, passGoods, getGoodsInfo } from './api';
import SelectFetch from '@/components/select-fetch';
import { ListPage, FormItem, If } from '@/packages/common/components';
import SuppilerSelect from '@/components/suppiler-auto-select';
import { replaceHttpUrl } from '@/util/utils';
import CarouselPreview from '@/components/carousel-preview'
import UnpassModal from './components/unpassModal';
import LowerModal from './components/lowerModal';
import ViolationModal from './components/violationModal';
import { combinationStatusList, formConfig } from './config/config';
import getColumns from './config/columns';

const { TabPane } = Tabs;

class Main extends React.Component {

  state = {
    tabStatus: '2',
    // status: undefined, // 0: 下架 1: 上架
    // auditStatus: undefined, // 0: 待提交 1: 待审核 2: 审核通过 3: 审核不通过
    currentGoods: null, // 当前审核商品
    selectedRowKeys: [],
    carouselTitle: '',
    carouselVisible: false,
    carouselImgs: []
  }

  /** 获取相关图片组合成自己想要的数据结构 */
  getCarouselsInfos = (currentGoods) => {
    let coverUrl = [{
      label: '封面图',
      value: currentGoods.coverUrl
    }]

    let productImage = [], skuImages = []

    if (currentGoods.productImage) {
      productImage = currentGoods.productImage.split(',').map(item => ({
        label: '详情图',
        value: currentGoods.coverUrl
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
      ...productImage,
      ...skuImages
    ];

    return carouselsInfos
  }

  /** 操作：商品图片预览-显示预览模态框 */
  handlePreview = (currentGoods) => {
    getGoodsInfo({ productPoolId: currentGoods.id }).then(res => {
      this.setState({
        carouselTitle: `【${res.productName}】 图片预览`,
        carouselVisible: true,
        carouselImgs: this.getCarouselsInfos(res)
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
    const { origin, pathname } = window.location
    window.open(`${origin}${/^\/$/.test(pathname) ? '/' : pathname}#/shop/goods/detail/${record.id}`);
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
    passGoods({
      ids: [record.id]
    }).then(() => {
      message.success('审核通过成功!');
      this.listRef.fetchData()
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
      this.listRef.refresh(true);
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
    this.setState({ selectedRowKeys });
  }

  handleBatchPass = () => {
    const { selectedRowKeys } = this.state;
    passGoods({
      ids: selectedRowKeys
    }).then(() => {
      message.success(`共${selectedRowKeys.length}件商品审核通过成功！`);
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

  render() {
    const { currentGoods, tabStatus, selectedRowKeys, carouselTitle, carouselVisible, carouselImgs } = this.state;
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <Card>
        {/* 商品图片预览模态框 */}
        <CarouselPreview
          title={carouselTitle}
          visible={carouselVisible}
          list={carouselImgs}
          onCancel={this.handleCarouselPreviewCancel}
          afterClose={this.handleDestroy}
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
          reserveKey='/shop/goods'
          namespace='/shop/goods'
          formConfig={formConfig}
          getInstance={ref => this.listRef = ref}
          processPayload={({ innerAuditStatus, ...payload }) => {
            payload.labType = +tabStatus
            if (tabStatus === '0') { // tab 全部
              if (
                innerAuditStatus &&
                (innerAuditStatus !== -1)
              ) {
                payload.auditStatus = innerAuditStatus
              } else {
                payload.auditStatus = undefined
              }
            } else {
              payload.auditStatus = undefined
            }

            // payload.storeId = 124

            return payload
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
                  return form.getFieldDecorator('storeId')(
                    <SuppilerSelect style={{ width: 172 }} />
                  );
                }}
              />
              <If condition={tabStatus === '0'}>
                <FormItem name='innerAuditStatus' />
              </If>
              <FormItem label="审核人" name="auditUser" />
              <FormItem
                name="createTime"
                label="创建时间"
                type="rangepicker"
                controlProps={{
                  showTime: true,
                }}
              />
              <FormItem
                label="审核时间"
                name="auditTime"
                type="rangepicker"
                controlProps={{
                  showTime: true,
                }}
              />
              <FormItem name='phone' />
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
          addonAfterSearch={
            tabStatus === '3' ?
              <div>
                <Button
                  type='primary'
                  disabled={!hasSelected}
                  className='ml10'
                  onClick={this.handleBatchPass}
                >
                  审核通过
              </Button>
                <Button
                  disabled={!hasSelected}
                  className='ml10'
                  onClick={this.handleBatchReject}
                >
                  审核不通过
              </Button>
              </div> : null
          }
        />
      </Card>
    )
  }
}

export default Main;
