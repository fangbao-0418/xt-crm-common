import React from 'react';
import { connect } from '@/util/utils';
import BaseCard from './components/baseCard';
import SkuCard from './components/skuCard';
import LogisCard from './components/logisCard';
import AuditCard from './components/auditCard';

@connect(state => ({
  goodsInfo: state['shop.goods.detail'].goodsInfo
}))
class GoodsDetail extends React.Component {
  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    const { dispatch, match: { params: { id: productId } } } = this.props;
    dispatch['shop.goods.detail'].getGoodsInfo({ productId });
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
      pitem.content = goodsInfo.skuList.map(sitem => ({
        specName: sitem[pitem.specNameKey],
        specPicture: sitem[pitem.specPictureKey]
      }))
    })

    return propertys
  }

  getSpecVals = (goodsInfo) => {
    return goodsInfo.skuList
  }

  render() {
    const { goodsInfo } = this.props;

    console.log(goodsInfo)

    let baseInfo = null, // 商品信息
      skuInfo = null, // 规格信息
      logisInfo = null, // 物流信息
      auditInfo = null; // 审核信息

    if (goodsInfo) {
      baseInfo = {
        productCategory: goodsInfo.productCategoryVO.combineName,
        productName: goodsInfo.productName,
        productImage: goodsInfo.productImage.split(','),
        listImage: goodsInfo.listImage.split(','),
        showNum: goodsInfo.showNum
      }

      skuInfo = {
        specKeys: this.getSpecKeys(goodsInfo),
        specVals: this.getSpecVals(goodsInfo)
      }

      logisInfo = {
        bulk: goodsInfo.bulk,
        weight: goodsInfo.weight,
        withShippingFree: goodsInfo.withShippingFree,
        freightTemplateName: goodsInfo.freightTemplateName,
        freightTemplateId: 1, // goodsInfo.freightTemplateId,
        returnContact: goodsInfo.returnContact,
        returnPhone: goodsInfo.returnPhone,
        returnAddress: goodsInfo.returnAddress
      }

      auditInfo = {
        auditStatus: goodsInfo.status,
        auditInfo: goodsInfo.auditInfo
      }
    }

    return (
      <div>
        <BaseCard data={baseInfo} />
        <SkuCard data={skuInfo} />
        <LogisCard data={logisInfo} />
        <AuditCard data={auditInfo} />
      </div>
    );
  }
}

export default GoodsDetail;