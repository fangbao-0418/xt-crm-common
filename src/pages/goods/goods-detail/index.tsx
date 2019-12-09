import React from 'react';
import { Card, Row, Col, Table, Upload, Button, Modal } from 'antd';
import { connect } from '@/util/utils';
import styles from './index.module.scss';
import { formatMoneyWithSign } from '@/util/helper';
import { initImgList } from '@/util/utils';
import { compact } from 'lodash';
const nameSpace = 'goods.goodsDetail';

class Main extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false
    };
  }
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id }
      }
    } = this.props;
    dispatch[nameSpace].getGoodsInfo({
      productId: id
    });

    (document as any).querySelector('section.ant-layout').getElementsByClassName('ant-layout')[0].scrollTop = 0;
  }

  render() {
    const { goodsInfo = {} } = this.props;
    const { productCategoryVO = {}, skuList = [] } = goodsInfo;
    const columns = [
      {
        title: '供应商商品ID',
        dataIndex: 'storeProductSkuId',
        key: 'storeProductSkuId',
        fixed: true,
        width: 200,
        render: (value: any) => value || '-'
      },
      {
        title: '商品编码',
        dataIndex: 'skuCode',
        key: 'skuCode',
        fixed: true,
        width: 200,
        render: (value: any) => value || '-'
      },
      {
        title: '发货方式',
        dataIndex: 'deliveryMode',
        key: 'deliveryMode',
        fixed: true,
        width: 120,
        render: (value: any) => {
          return value === 1 ? '仓库发货' : value === 2 ? '供应商发货' : '其他';
        }
      },
      {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock',
        fixed: true,
        width: 100,
        render: (value: any) => value || '-'
      },
      {
        title: '警戒库存',
        dataIndex: 'stockAlert',
        key: 'stockAlert',
        fixed: true,
        width: 100,
        render: (value: any) => value || '-'
      },
      {
        title: '成本价',
        dataIndex: 'costPrice',
        key: 'costPrice',
        width: 150,
        render: (value: any) => (value ? formatMoneyWithSign(value) : '-')
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        key: 'marketPrice',
        width: 150,
        render: (value: any) => (value ? formatMoneyWithSign(value) : '-')
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        width: 150,
        render: (value: any) => (value ? formatMoneyWithSign(value) : '-')
      },
      {
        title: '团长价',
        dataIndex: 'headPrice',
        key: 'headPrice',
        width: 150,
        render: (value: any) => (value ? formatMoneyWithSign(value) : '-')
      },
      {
        title: '社区管理员价',
        dataIndex: 'areaMemberPrice',
        key: 'areaMemberPrice',
        width: 150,
        render: (value: any) => (value ? formatMoneyWithSign(value) : '-')
      },
      {
        title: '城市合伙人价',
        dataIndex: 'cityMemberPrice',
        key: 'cityMemberPrice',
        width: 150,
        render: (value: any) => (value ? formatMoneyWithSign(value) : '-')
      },
      {
        title: '公司管理员价',
        dataIndex: 'managerMemberPrice',
        key: 'managerMemberPrice',
        width: 150,
        render: (value: any) => (value ? formatMoneyWithSign(value) : '-')
      },
      {
        title: '查看',
        dataIndex: 'imageUrl1',
        key: 'imageUrl1',
        fixed: 'right' as any,
        width: 120,
        render: (value: any, skuInfo: any) => {
          return value ? (
            <Button type="link" style={{ padding: 0 }} onClick={() => this.viewSKUImg(skuInfo)}>
              规格图片
            </Button>
          ) : (
            '-'
          );
        }
      }
    ];
    if (goodsInfo.property2) {
      columns.unshift({
        title: goodsInfo.property2,
        dataIndex: 'propertyValue2',
        key: 'propertyValue2',
        fixed: true,
        width: 100,
        render: (value: any) => value || '-'
      });
    }
    if (goodsInfo.property1) {
      columns.unshift({
        title: goodsInfo.property1,
        dataIndex: 'propertyValue1',
        key: 'propertyValue1',
        fixed: true,
        width: 100,
        render: (value: any) => value || '-'
      });
    }

    const productImageList = compact(
      ((goodsInfo.productImage || '') as String).split(',').map((url: any) => initImgList(url)[0])
    );

    const listImage = compact(
      (goodsInfo.listImage || '').split(',').map((url: string) => initImgList(url)[0])
    )

    const { visible, skuInfo = {} } = this.state;
    return (
      <>
        <Card title="商品信息">
          <Row>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>商品名称：</span>
                <span className={styles['item-box']} title={goodsInfo.productName}>
                  {goodsInfo.productName || '无'}
                </span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>商品类目：</span>
                <span className={styles['item-box']} title={productCategoryVO.combineName}>
                  {productCategoryVO.combineName || '无'}
                </span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>商品简称：</span>
                <span className={styles['item-box']}>{goodsInfo.productShortName || '无'}</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>商品编码：</span>
                <span className={styles['item-box']}>{goodsInfo.productCode || '无'}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>商品条码：</span>
                <span className={styles['item-box']}>{goodsInfo.barCode || '无'}</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>展示销量：</span>
                <span className={styles['item-box']}>{goodsInfo.showNum === 1 ? '展示' : '不展示'}</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>供应商：</span>
                <span className={styles['item-box']}>{goodsInfo.storeName || '无'}</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>供应商商品ID：</span>
                <span className={styles['item-box']}>{goodsInfo.storeProductId || '无'}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>拦截发货：</span>
                <span className={styles['item-box']}>{goodsInfo.interception === 1 ? '可拦截' : '不可拦截'}</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>实名认证：</span>
                <span className={styles['item-box']}>{goodsInfo.isAuthentication === '1' ? '需要' : '不需要'}</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>上架状态：</span>
                <span className={styles['item-box']}>{goodsInfo.status === '1' ? '上架' : '下架'}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={styles['item']}>
                <span className={styles['item-title']}>商品简介：</span>
                <span style={{ wordBreak: 'break-all' }}>{goodsInfo.description || '无'}</span>
              </div>
            </Col>
          </Row>
        </Card>
        <Card title="规格信息">
          <Table bordered columns={columns} dataSource={skuList} scroll={{ x: 1500 }} pagination={false} />
        </Card>
        <Card title="物流信息">
          <Row>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>运费设置：</span>
                <span className={styles['item-box']}>
                  {goodsInfo.withShippingFree === 1 ? '包邮' : `运费模板（${goodsInfo.freightTemplateName || '无'}）`}
                </span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>物流体积：</span>
                <span className={styles['item-box']}>{goodsInfo.bulk || '无'}</span>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles['item']}>
                <span className={styles['item-title']}>物流重量：</span>
                <span className={styles['item-box']}>{goodsInfo.weight || '无'}</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={styles['item']}>
                <span className={styles['item-title']}>退货地址：</span>
                <span className={styles['item-box']}>
                  {goodsInfo.returnContact && goodsInfo.returnContact && goodsInfo.returnAddress
                    ? `${goodsInfo.returnContact} ${goodsInfo.returnContact} ${goodsInfo.returnAddress}`
                    : '无'}
                </span>
              </div>
            </Col>
          </Row>
        </Card>
        <Card title="图片信息" className={styles['img']}>
          {goodsInfo.videoCoverUrl ? (
            <Row>
              <Col span={24}>
                <div className={styles['item']}>
                  <span className={styles['item-title']}>视频封面：</span>
                  <span className={styles['item-box']}>
                    (
                    <Upload listType="picture-card" fileList={initImgList(goodsInfo.videoCoverUrl) as any} />)
                  </span>
                </div>
              </Col>
            </Row>
          ) : null}
          {goodsInfo.videoUrl ? (
            <Row>
              <Col span={24}>
                <div className={styles['item']}>
                  <span className={styles['item-title']}>商品视频：</span>
                  <span className={styles['item-box']}>
                    <Upload listType="picture-card" fileList={initImgList(goodsInfo.videoUrl) as any} />
                  </span>
                </div>
              </Col>
            </Row>
          ) : null}
          {goodsInfo.coverUrl ? (
            <Row>
              <Col span={24}>
                <div className={styles['item']}>
                  <span className={styles['item-title']}>商品主图（正方形）：</span>
                  <span className={styles['item-box']}>
                    <Upload listType="picture-card" fileList={initImgList(goodsInfo.coverUrl) as any} />
                  </span>
                </div>
              </Col>
            </Row>
          ) : null}
          {goodsInfo.bannerUrl ? (
            <Row>
              <Col span={24}>
                <div className={styles['item']}>
                  <span className={styles['item-title']}>商品主图（长方形）：</span>
                  <span className={styles['item-box']}>
                    <Upload listType="picture-card" fileList={initImgList(goodsInfo.bannerUrl) as any} />
                  </span>
                </div>
              </Col>
            </Row>
          ) : null}
          {productImageList.length ? (
            <Row>
              <Col span={24}>
                <div className={styles['item']}>
                  <span className={styles['item-title']}>商品图片：</span>
                  <span className={styles['item-box']}>
                    <Upload listType="picture-card" fileList={productImageList as any} />
                  </span>
                </div>
              </Col>
            </Row>
          ) : null}
          {listImage.length ? (
            <Row>
              <Col span={24}>
                <div className={styles['item']}>
                  <span className={styles['item-title']}>商品详情图：</span>
                  <span className={styles['item-box']}>
                    <Upload listType="picture-card" fileList={listImage as any} />
                  </span>
                </div>
              </Col>
            </Row>
          ) : null}
        </Card>
        <Modal
          title={`规格图片(
            ${skuInfo.propertyValue1 ? skuInfo.propertyValue1 : ''}
            ${skuInfo.propertyValue1 && skuInfo.propertyValue2 ? '+' : ''}
            ${skuInfo.propertyValue2 ? skuInfo.propertyValue2 : ''}
            )`}
          visible={visible}
        >
          <img src={skuInfo.imageUrl1} />
        </Modal>
      </>
    );
  }

  viewSKUImg = (skuInfo: any) => {
    this.setState({
      visible: true,
      skuInfo
    });
  };
}

export default connect((state: any) => ({
  goodsInfo: state[nameSpace].goodsInfo
}))(Main);
