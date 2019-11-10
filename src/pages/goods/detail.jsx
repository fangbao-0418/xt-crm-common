import React from 'react';
import { Card, Form, Input, Button, message, Radio, Table } from 'antd';
import {
  map,
  uniqWith
} from 'lodash' 
import MoneyRender from '@/components/money-render'
import { mapTree, treeToarr, parseQuery } from '@/util/utils';
import { getStoreList, getGoodsDetial, getCategoryList } from './api';
import { gotoPage } from '@/util/utils';
import SkuUploadItem from './SkuUploadItem'
import Image from '@/components/Image'
import styles from './edit.module.scss';
import { replaceHttpUrl } from '@/util/utils'
const { TextArea } = Input
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
const columns = [
  {
    title: '供应商skuID',
    dataIndex: 'storeProductSkuId',
    key: 'storeProductSkuId',
    render: (text) => {
      return text || '无'
    }
  },
  {
    title: '商品编码',
    dataIndex: 'skuCode',
    key: 'skuCode',
    render: (text) => {
      return text || '无'
    }
  },
  {
    title: '发货方式',
    dataIndex: 'deliveryMode',
    render: (text) => {
      const deliveryMode = {
        '1': '仓库发货',
        '2': '供货商发货',
        '3': '其他'
      }
      return deliveryMode[String(text)]
    }
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    key: 'marketPrice',
    render: MoneyRender
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    key: 'costPrice',
    render: MoneyRender
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock'
  },
  {
    title: '销售价',
    dataIndex: 'salePrice',
    key: 'salePrice',
    render: MoneyRender
  },
  {
    title: '团长价',
    dataIndex: 'headPrice',
    key: 'headPrice',
    render: MoneyRender
  },
  {
    title: '社区管理员价',
    dataIndex: 'areaMemberPrice',
    key: 'areaMemberPrice',
    render:  MoneyRender
  },
  {
    title: '城市合伙人价',
    dataIndex: 'cityMemberPrice',
    key: 'cityMemberPrice',
    render: MoneyRender
  },
  {
    title: '公司管理员价',
    dataIndex: 'managerMemberPrice',
    key: 'managerMemberPrice',
    render: MoneyRender
  },
  {
    title: '警戒库存',
    dataIndex: 'stockAlert',
    key: 'stockAlert'
  }
]

const collection = {
  property1: {
    value: 'propertyValue1',
    imageUrl: 'imageUrl1'
  },
  property2: {
    value: 'propertyValue2'
  }
}

/**
 * 过滤property
 * @param {*} obj 
 */
function filterProp(obj) {
  obj = obj || {}
  return Object.keys(collection).filter((key) => obj[key])
}

/**
 * 获取动态列
 * @param {*} obj 
 */
function getDynamicColumns (obj) {
  return filterProp(obj).map(prop => {
    const item = collection[prop] || {}
    return {
      title: obj[prop],
      dataIndex: item.value,
      key: item.value
    }
  })
}

/**
 * 获取sku卡片添加项
 * @param {*} obj 
 * @param {*} list 
 */
function getSpecs(obj) {
  obj = obj || {}
  return filterProp(obj).map(prop => {
    const item = collection[prop] || {}
    return {
      title: obj[prop],
      content: uniqWithProp(obj.skuList || [], item.value).map(v => {
        return item.imageUrl ? ({
          specPicture: v[item.imageUrl],
          specName: v[item.value]
        }): {
          specName: v[item.value]
        }
      })
    }
  })
}

/**
 * 去重property
 */
function uniqWithProp(list, propName) {
  console.log('propName=>', propName)
  list = list || []
  return uniqWith(list, (arrVal, othVal) => {
    return arrVal[propName] === othVal[propName]
  })
}

class GoodsEdit extends React.Component {
  state = {
    supplier: [],
    detail: {}
  };
  componentDidMount() {
    this.getStoreList();
    this.getGoodsDetial();
  }

  // getCategoryList = () => {
  //   getCategoryList().then(res => {
  //     const arr = Array.isArray(res) ? res : [];
  //     const categoryList = arr.map(org => mapTree(org));
  //     this.setState({
  //       categoryList
  //     }, () => {
  //       this.getGoodsDetial(res)
  //     });

  //   })
  // }
  setDefaultValue = (filedValue) => {
    return filedValue || (this.readOnly ? '无' : '');
  }
  getGoodsDetial = () => {
    // const {
    //   form: { setFieldsValue },
    // } = this.props;
    // const {
    //   match: {
    //     params: { id },
    //   },
    // } = this.props;

    // let { supplier } = this.state;
    // if (!id) {
    //   setFieldsValue({
    //     showNum: 1
    //   })
    //   return
    // };
    getGoodsDetial({ productId: this.props.match.params.id }).then((res = {}) => {
      let { supplier } = this.state;
      const currentSupplier = (supplier || []).find(item => item.id === res.storeId) || {};
      res.listImage = res.listImage ? res.listImage.split(',') : []
      res.productImage = res.productImage ? res.productImage.split(','): []
      res.combineName = res.productCategoryVO && res.productCategoryVO.combineName
      res.interceptionVisible = currentSupplier.category == 1 ? false : true
      res.barCode = this.setDefaultValue(res.barCode)
      res.videoCoverUrl = replaceHttpUrl(res.videoCoverUrl) 
      this.setState({
        showImage: false,
        showNum: res.showNum !== undefined ? res.showNum : 1,
        detail: res
      });
    });
  };
  getStoreList = params => {
    getStoreList({ pageSize: 5000, ...params }).then((res = {}) => {
      this.setState({
        supplier: res.records,
      });
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      supplier,
      detail,
      detail: {
        interceptionVisible,
        productShortName,
        productCode,
        description,
        barCode,
        storeId,
        storeProductId,
        interception,
        isAuthentication,
        showNum,
        videoCoverUrl,
        productName,
        combineName,
        listImage,
        withShippingFree,
        coverUrl,
        bannerUrl,
        productImage,
        bulk,
        weight,
        returnContact,
        returnPhone,
        returnAddress,
        skuList,
        videoUrl
      }
    } = this.state;
    console.log('detail=>', detail)
    const storeItem = (supplier || []).find(v => v.id === storeId) || {};
    const {
      match: {
        params: { id },
      },
    } = this.props;
    console.log('DynamicColumns=>', getDynamicColumns(detail))
    console.log('specs=>', getSpecs(detail))
    return (
      <Form {...formLayout}>
        <Card title="商品审核/详情">
          <Form.Item label="商品名称">{productName || '无'}</Form.Item>
          <Form.Item label="商品类目">{combineName || '无'}</Form.Item>
          <Form.Item label="商品简称">{productShortName || '无'}</Form.Item>
          <Form.Item label="商品编码">{productCode || '无'}</Form.Item>
          <Form.Item label="商品简介">{description || '无'}</Form.Item>
          <Form.Item label="商品条码">{barCode || '无'}</Form.Item>
          <Form.Item label="供货商">{storeItem.name}</Form.Item>
          <Form.Item label="供应商商品ID">{storeProductId || '无'}</Form.Item>
          {
            interceptionVisible ? 
              <Form.Item label="是否可拦截发货">{interception === 1 ? '是': '否'}</Form.Item> :
              null
          }
           <Form.Item label="实名认证">{isAuthentication === 1 ? '是': '否'}</Form.Item>
          <Form.Item label="商品视频封面">
            <Image
              style={{width: '102px', height: '102px'}}
              src={videoCoverUrl}
            />
          </Form.Item>
          <Form.Item label="商品视频">
          {videoUrl ? <vidio src={videoUrl} controls="controls" height={102} width={102}></vidio>: '无'}
          </Form.Item>
          <Form.Item label="商品主图">
            <Image
              style={{
                width: '102px',
                height: '102px',
                marginRight: '10px'
              }}
              src={coverUrl}
            />
          </Form.Item>
          <Form.Item
            label="商品图片"
          >
            {(productImage || []).map(url => (
              <Image
                style={{
                  width: '102px',
                  height: '102px',
                  marginRight: '10px'
                }}
                key={url}
                src={url}
              />
            ))}
          </Form.Item>
          <Form.Item label="banner图片">
            <Image
              style={{
                width: '102px',
                height: '102px'
              }}
              src={bannerUrl}
            />
          </Form.Item>
          <Form.Item label="累计销量">{showNum ? '展示': '不展示'}</Form.Item>
        </Card>
        <Card title="商品规格">
        {getSpecs(detail).map((spec, key) => {
          return (
            <Card
              key={key}
              type="inner"
              title={spec.title}
            >
              <div className={styles.spulist}>
                {map(spec.content, (item, index) => (
                  <SkuUploadItem
                    value={item}
                    key={`d-${index}`}
                    disabled
                    index={key}
                    showImage={item.specPicture}
                  >
                  </SkuUploadItem>
                ))}
              </div>
            </Card>
          )
        })}
          <Table
            rowKey={(record) => record.id}
            style={{ marginTop: 10 }}
            columns={getDynamicColumns(detail).concat(columns)}
            dataSource={skuList}
            pagination={false}
          />
        </Card>
        <Card title="物流信息" style={{ marginTop: 10 }}>
          <Form.Item label="物流体积">{bulk || '无'}</Form.Item>
          <Form.Item label="物流重量">{weight || '无'}</Form.Item>
          <Form.Item label="运费设置">{withShippingFree === 1 ? '包邮': '不包邮'}</Form.Item>
          <Form.Item label="退货地址"
            wrapperCol={{
              span: 18
            }}
          >
            {[returnContact, returnPhone, returnAddress].filter(Boolean).join(' ')}
          </Form.Item>
        </Card>
        <Card title="商品详情" style={{ marginTop: 10 }}>
          <Form.Item label="商品详情页">
            {Array.isArray(listImage) && listImage.length > 0 ? listImage.map(url => (
              <Image
                style={{
                  width: '102px',
                  height: '102px',
                  marginRight: '10px'
                }}
                src={url}
              />
            )) : '无'}
          </Form.Item>
          <Form.Item label="上架状态">{this.state.status === 1 ? '上架': '下架'}</Form.Item>
        </Card>
        <Card title="审核结果">
          <Form.Item label="审核结果">
            {getFieldDecorator('auditStatus')(
              <Radio.Group>
                <Radio value={2}>通过</Radio>
                <Radio value={3}>不通过</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="审核说明">
            {getFieldDecorator('auditInfo')(<TextArea placeholder="请输入审核说明"/>)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleSave} style={{ marginRight: 10 }}>
              保存
            </Button>
            <Button type="danger" onClick={() => gotoPage('/goods/list')}>
              返回
            </Button>
          </Form.Item>
        </Card>
      </Form>
    );
  }
}

export default Form.create()(GoodsEdit);
