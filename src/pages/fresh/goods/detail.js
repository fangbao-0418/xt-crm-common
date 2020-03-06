import React from 'react';
import { Card, Form, Input, Button, Radio, Table, message } from 'antd';
import { map, uniqWith, memoize } from 'lodash';
import CascaderCity from '@/components/cascader-city';
import MoneyRender from '@/components/money-render';
import { getStoreList, toAuditDetail } from './api';
import SkuUploadItem from './components/SkuUploadItem';
import Image from '@/components/Image';
import styles from './style.module.scss';
import { replaceHttpUrl, parseQuery } from '@/util/utils';
import { formatPrice } from '@/util/format';
import { auditGoods, getDetail } from './api';
const { TextArea } = Input;
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};

/**
 * 映射特定区域数组
 * {
 *  cost, // 金额
 *  describe,
 *  destinationList,
 *  rankNo,
 *  rankType
 * }[]
 * @param list
 */
const mapTemplateData = list => {
  return (list || []).map(item => {
    return {
      ...item,
      cost: item.cost && formatPrice(item.cost)
    };
  });
};

const collection = {
  property1: {
    value: 'propertyValue1',
    imageUrl: 'imageUrl1'
  },
  property2: {
    value: 'propertyValue2'
  }
};

/**
 * 过滤property
 * @param {*} obj
 */
function filterProp(obj) {
  obj = obj || {};
  return Object.keys(collection).filter(key => obj[key]);
}

/** 返回地址 */
function getAddress(...args) {
  args = args.filter(Boolean);
  return args.length > 0 ? args.join(' ') : '无';
}

/**
 * 获取动态列
 * @param {*} obj
 */
function getDynamicColumns(obj) {
  return filterProp(obj).map(prop => {
    const item = collection[prop] || {};
    return {
      title: obj[prop],
      dataIndex: item.value,
      key: item.value
    };
  });
}

/**
 * 获取sku卡片添加项
 * @param {*} obj
 * @param {*} list
 */
const getSpecs = memoize(function(obj) {
  obj = obj || {};
  return filterProp(obj).map(prop => {
    const item = collection[prop] || {}
    return {
      title: obj[prop],
      content: uniqWithProp(obj.skuList || [], item.value).map(v => {
        return item.imageUrl
          ? {
              specPicture: v[item.imageUrl],
              specName: v[item.value]
            }
          : {
              specName: v[item.value]
            };
      })
    };
  });
});

/**
 * 去重property
 */
function uniqWithProp(list, propName) {
  console.log('propName=>', propName);
  list = list || [];
  return uniqWith(list, (arrVal, othVal) => {
    return arrVal[propName] === othVal[propName];
  });
}

/**
 * 矫正videoUrl
 * @param {*} url
 */
function normalizeVideoUrl(url) {
  url = url || ''
  const index = url.indexOf('?')
  return url.indexOf('?') !== -1 ? url.slice(0, index): url
}
const styleObject = {
  backgroundColor: '#fafafa',
  padding: '0 16px'
};
class GoodsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.productId = props.match.params.id;
    this.auditStatus = parseQuery().auditStatus;
  }
  supplier = [];
  state = {
    detail: {},
    commonCost: '',
    templateName: '',
    templateData: [],
    destinationList: []
  };
  componentDidMount() {
    this.getStoreList();
  }

  setDefaultValue = filedValue => {
    return filedValue || (this.readOnly ? '无' : '');
  };
  /**
   * 获取详情数据
   */
  toAuditDetail = () => {
    toAuditDetail({ productId: this.productId }).then((res = {}) => {
      const currentSupplier = (this.supplier || []).find(item => item.id === res.storeId) || {};
      res.combineName = res.productCategoryVO && res.productCategoryVO.combineName;
      res.interceptionVisible = +currentSupplier.category === 1 ? false : true;
      res.barCode = this.setDefaultValue(res.barCode);
      /** 商品详情页 */
      res.listImage = res.listImage ? res.listImage.split(',') : [];
      /** 商品图片 */
      res.productImage = res.productImage ? res.productImage.split(',') : [];
      /** 商品视频 */
      res.videoUrl = normalizeVideoUrl(res.videoUrl);
      res.skuList = res.productSkuVOList || []
      this.setState({
        showNum: res.showNum !== undefined ? res.showNum : 1,
        detail: res
      });
    });
  };
  getStoreList = params => {
    getStoreList({ pageSize: 5000, ...params }).then((res = {}) => {
      this.supplier = res.records;
      this.toAuditDetail();
    });
  };
  handleSave = () => {
    this.props.form.validateFields(async (errors, values) => {
      if (!errors) {
        const res = await auditGoods({
          productId: this.productId,
          ...values
        });
        if (res) {
          message.success('审核成功');
          APP.history.go(-1);
        } else {
          message.error('审核失败');
        }
      }
    });
  };
  render() {
    const editColumns = [
      {
        title: '编号',
        key: 'index',
        width: 80,
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '目的地',
        dataIndex: 'destinationList',
        key: 'destinationList',
        width: '60%',
        render: (destinationList, record, index) => {
          return (
            <div className={styles.areas}>
              <div style={{ maxWidth: '90%' }}>
                {destinationList.map(v => (
                  <span key={v.id}>
                    {v.name}（{v.children.length}）
                  </span>
                ))}
              </div>
              <div className={styles.operate}>
                <Button
                  type="link"
                  onClick={() => {
                    this.setState({
                      destinationList,
                      visible: true
                    });
                  }}
                >
                  查看
                </Button>
              </div>
            </div>
          );
        }
      },
      {
        title: '运费/元',
        key: 'fare',
        render: (text, record, index) => {
          return record.rankType === 1 ? record.cost : '不发货';
        }
      }
    ];
    const columns = [
      {
        title: '规格编码',
        dataIndex: 'skuCode',
        key: 'skuCode',
        render: text => {
          return text || '无';
        }
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
        render: MoneyRender
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        render: MoneyRender
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock'
      },
      {
        title: '自提佣金%',
        dataIndex: 'commissionPercentage'
      }
    ];
    const { getFieldDecorator } = this.props.form;
    const {
      detail,
      detail: {
        /** 是否可拦截 */
        interceptionVisible,
        /** 商品简称 */
        productShortName,
        /** 商品编码 */
        productCode,
        /** 商品简介 */
        description,
        /** 商品条码 */
        barCode,
        /** 供应商ID */
        storeId,
        /** 供应商商品ID */
        storeProductId,
        /** 是否可被拦截发货 */
        interception,
        /** 是否需要实名认证 */
        isAuthentication,
        /** 是否展示销量 */
        showNum,
        /** 视频封面地址 */
        videoCoverUrl,
        /** 商品名称 */
        productName,
        /** 商品类目 */
        combineName,
        /** 商品详情图 */
        listImage,
        /** 运费设置 */
        withShippingFree,
        /** 商品主图 */
        coverUrl,
        /** banner图片 */
        bannerUrl,
        /** 商品图片 */
        productImage,
        /** 物流体积 */
        bulk,
        /** 物流重量 */
        weight,
        /** 退货联系人 */
        returnContact,
        /** 退货联系电话 */
        returnPhone,
        /** 退货地址 */
        returnAddress,
        /** sku列表 */
        skuList,
        /** 视频地址 */
        videoUrl,
        /** 审核结果 */
        auditStatus,
        /** 审核说明 */
        auditInfo
      }
    } = this.state;
    const storeItem = (this.supplier || []).find(v => v.id === storeId) || {};
    return (
      <>
        <CascaderCity
          disabled={true}
          visible={this.state.visible}
          value={this.state.destinationList}
          onCancel={() => {
            this.setState({
              visible: false
            });
          }}
        />
        <Form {...formLayout}>
          <Card title="商品审核/详情">
            <Form.Item label="商品名称">{productName || '无'}</Form.Item>
            <Form.Item label="商品类目">{combineName || '无'}</Form.Item>
            <Form.Item label="商品简称">{productShortName || '无'}</Form.Item>
            <Form.Item label="商品编码">{productCode || '无'}</Form.Item>
            <Form.Item label="商品简介">{description || '无'}</Form.Item>
            <Form.Item label="商品条码">{barCode || '无'}</Form.Item>
            <Form.Item label="供货商">{storeItem.name}</Form.Item>
            {/* <Form.Item label="供应商商品ID">{storeProductId || '无'}</Form.Item> */}
            <Form.Item label="商品主图">
              {coverUrl ? (
                <Image
                  style={{
                    width: '102px',
                    height: '102px',
                    marginRight: '10px'
                  }}
                  src={coverUrl}
                />
              ) : (
                '无'
              )}
            </Form.Item>
            <Form.Item label="商品图片">
              {Array.isArray(productImage) && productImage.length > 0
                ? productImage.map(url => (
                    <Image
                      style={{
                        width: 102,
                        height: 102,
                        marginRight: 10,
                        marginBottom: 10
                      }}
                      key={url}
                      src={url}
                    />
                  ))
                : '无'}
            </Form.Item>
            <Form.Item label="商品视频封面">
              {videoCoverUrl ? <Image style={{ width: '102px', height: '102px' }} src={videoCoverUrl} /> : '无'}
            </Form.Item>
            <Form.Item label="商品视频">
              {videoUrl ? <video src={replaceHttpUrl(videoUrl)} controls="controls" height={102} width={102} /> : '无'}
            </Form.Item>
            <Form.Item label="banner图片">
              {bannerUrl ? (
                <Image
                  style={{
                    width: '102px',
                    height: '102px'
                  }}
                  src={bannerUrl}
                />
              ) : (
                '无'
              )}
            </Form.Item>
            {/* <Form.Item label="累计销量">{showNum ? '展示' : '不展示'}</Form.Item> */}
          </Card>
          <Card title="商品规格">
            {getSpecs(detail).map((spec, key) => {
              return (
                <Card key={key} type="inner" title={spec.title}>
                  <div className={styles.spulist}>
                    {map(spec.content, (item, index) => (
                      <SkuUploadItem
                        value={item}
                        key={`d-${index}`}
                        disabled
                        index={key}
                        showImage={item.specPicture}
                      ></SkuUploadItem>
                    ))}
                  </div>
                </Card>
              );
            })}
            <Table
              rowKey="skuId"
              style={{ marginTop: 10 }}
              columns={getDynamicColumns(detail).concat(columns)}
              dataSource={skuList}
              pagination={false}
            />
          </Card>
          <Card title="物流信息" style={{ marginTop: 10 }}>
            <Form.Item label="商品体积">{bulk || '无'}</Form.Item>
            <Form.Item label="商品重量">{weight || '无'}</Form.Item>
          </Card>
          <Card title="商品详情" style={{ marginTop: 10 }}>
            <Form.Item label="商品详情页">
              {Array.isArray(listImage) && listImage.length > 0
                ? listImage.map(url => (
                    <Image
                      style={{
                        width: 102,
                        height: 102,
                        marginRight: 10,
                        marginBottom: 10
                      }}
                      key={url}
                      src={url}
                    />
                  ))
                : '无'}
            </Form.Item>
            {/* <Form.Item label='上架状态'>{status === 1 ? '上架': '下架'}</Form.Item> */}
          </Card>
          <Card title="审核结果">
            {this.auditStatus === '1' ? (
              <>
                <Form.Item label="审核结果" required>
                  {getFieldDecorator('auditStatus', {
                    rules: [
                      {
                        required: true,
                        message: '请选择审核结果'
                      }
                    ]
                  })(
                    <Radio.Group>
                      <Radio value={2}>通过</Radio>
                      <Radio value={3}>不通过</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
                <Form.Item label="审核说明">
                  {getFieldDecorator('auditInfo', {
                    rules: [
                      {
                        validator: (rule, value = '', callback) => {
                          const { getFieldValue } = this.props.form;
                          if (getFieldValue('auditStatus') === 3 && !value.trim()) {
                            callback('请输入审核说明');
                          } else {
                            callback();
                          }
                        }
                      }
                    ]
                  })(<TextArea placeholder="请输入审核说明" maxLength={255} />)}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.handleSave} style={{ marginRight: 10 }}>
                    保存
                  </Button>
                  <Button
                    type="danger"
                    onClick={() => {
                      APP.history.go(-1);
                    }}
                  >
                    返回
                  </Button>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item label="审核结果">{auditStatus === 2 ? '通过' : '不通过'}</Form.Item>
                <Form.Item label="审核说明">{auditInfo || '无'}</Form.Item>
              </>
            )}
          </Card>
        </Form>
      </>
    );
  }
}

export default Form.create()(GoodsEdit);
