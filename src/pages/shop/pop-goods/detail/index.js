import React from 'react';
import { connect } from '@/util/utils';
import BaseCard from './components/baseCard';
import SkuCard from './components/skuCard';
import LogisCard from './components/logisCard';
import AuditCard from './components/auditCard';
import { unionBy } from 'lodash'

@connect(state => ({
  goodsInfo: state['shop.pop.goods.detail'].goodsInfo
}))
class GoodsDetail extends React.Component {
  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    const { dispatch, match: { params: { id: productPoolId } } } = this.props;
    dispatch['shop.pop.goods.detail'].getGoodsInfo({ productPoolId });
  }

  getSpecKeys = (goodsInfo) => {
    // 1.根据后端的propertyId1, propertyId2组装成规格key数组
    let propertys = [{
      id: goodsInfo.propertyId1,
      name: goodsInfo.property1,
      specNameKey: 'propertyValue1',
      specPictureKey: 'imageUrl1'
    }, {
      id: goodsInfo.propertyId2,
      name: goodsInfo.property2,
      specNameKey: 'propertyValue2',
      specPictureKey: 'imageUrl2'
    }].filter(pitem => !!pitem.id);

    // 2.根据后端的skuList遍历获取规格key的其他一些元数据, 具体有key下面的一些数据, 如key为颜色,那么key下面的值有红色、绿色等数据
    propertys.forEach(pitem => {
      pitem.content = (goodsInfo.skuList || []).map(sitem => ({
        specName: sitem[pitem.specNameKey],
        specPicture: sitem[pitem.specPictureKey]
      }))
      pitem.content = unionBy(pitem.content, 'specName')
    })

    console.log(propertys)

    return propertys
  }

  getSpecVals = (goodsInfo) => {
    return goodsInfo.skuList
  }

  render() {
    const { goodsInfo, match: { params: { id: productPoolId } }  } = this.props;

    let baseInfo = null, // 商品信息
      skuInfo = null, // 规格信息
      logisInfo = null, // 物流信息
      auditInfo = null; // 审核信息

    if (goodsInfo) {
      baseInfo = {
        productCategory: goodsInfo.productCategoryVO && goodsInfo.productCategoryVO.combineName || '暂无数据',
        commission: (goodsInfo.productCategoryVO && (goodsInfo.productCategoryVO.agencyRate + goodsInfo.productCategoryVO.companyRate) || 0) + ' %',
        productName: goodsInfo.productName || '暂无数据',
        commissionIncreaseRate: goodsInfo.commissionIncreaseRate||0,
        productImage: goodsInfo.productImage.split(','),
        listImage: goodsInfo.listImage.split(','),
        saleCount: goodsInfo.saleCount || 0,
        productCategoryVO: goodsInfo.productCategoryVO
      }

      skuInfo = {
        specKeys: this.getSpecKeys(goodsInfo),
        specVals: this.getSpecVals(goodsInfo)
      }

      logisInfo = {
        bulk: goodsInfo.bulk || '暂无数据',
        weight: goodsInfo.weight || '暂无数据',
        withShippingFree: goodsInfo.withShippingFree,
        freightTemplateName: goodsInfo.freightTemplateName,
        freightTemplateId: goodsInfo.freightTemplateId,
        returnContact: goodsInfo.returnContact,
        returnPhone: goodsInfo.returnPhone,
        returnAddress: goodsInfo.returnAddress
      }

      auditInfo = {
        status: goodsInfo.status,
        channel: goodsInfo.channel,
        auditInfo: goodsInfo.auditInfo,
        auditStatus: goodsInfo.auditStatus,
        withdrawalType: goodsInfo.withdrawalType,
        withdrawalInfo: goodsInfo.withdrawalInfo
      }
    }

    return (
      <div>
        <BaseCard data={baseInfo} />
        <SkuCard status={goodsInfo?.status} data={skuInfo} />
        <LogisCard data={logisInfo} />
        <AuditCard data={auditInfo} productPoolId={productPoolId} />
      </div>
    );
  }
}

export default GoodsDetail;
