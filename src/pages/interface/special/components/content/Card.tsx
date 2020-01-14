import React from 'react';
import { Card, Row, Col, Icon, Radio, Input, Modal } from 'antd';
import Shop from './shop';
import Coupon from './coupon';
import Upload from '@/components/upload';
import ShopModal from '@/components/shop-modal';
import CouponModal from '@/components/coupon-modal';
import { typeConfig } from '../../constant';
import { connect } from 'react-redux';
import ActivityList from '@/pages/activity/info/ActivityList';
import { namespace } from '../../content/model';
import GoodsTransfer from '@/components/goods-transfer';
import { concat, filter, includes } from 'lodash';

/**
 * 样式图片 1*1 1*2 1*3
 */
const images: any = {
  1: {
    plainCss: require('@/assets/images/plain1x1.png'),
    activityCss: require('@/assets/images/activity1x1.png')
  },
  2: {
    plainCss: require('@/assets/images/plain1x2.png'),
    activityCss: require('@/assets/images/activity1x2.png')
  },
  3: {
    plainCss: require('@/assets/images/plain1x3.png'),
    activityCss: require('@/assets/images/activity1x3.png')
  }
};

interface State {
  /** 优惠券显隐 */
  couponVisible: boolean;
  /** 选择活动列表显隐 */
  activeityListVisible: boolean;
}
interface Props {
  state: any;
  dispatch: any;
  detail: any;
  onChange?: (value?: any) => void;
}
class Main extends React.Component<Props, State> {
  public tempList: Shop.ShopItemProps[] = [];

  public tempCoupons: Coupon.CouponItemProps[] = [];

  public goodsTransfer: any = null;

  public state: State = {
    couponVisible: false,
    activeityListVisible: false
  };

  public onChange(detail?: Special.DetailContentProps) {
    if (this.props.onChange) {
      this.props.onChange(detail);
    }
  }

  public getSelectedRowKeys(list: any) {
    const ids: any[] = [];
    (list || []).map((item: any) => {
      if (item && item.id !== undefined && ids.indexOf(item.id) === -1) {
        ids.push(item.id);
      }
    });
    return ids;
  }

  public handleSelectActivity = (selectedRow: any) => {
    const { dispatch } = this.props;
    const result = dispatch[namespace].getGoodsListByActivityId({ promotionId: selectedRow.id });
    result.then(() => {
      this.goodsTransfer.showModal();
    });
  };

  public goodsTransferCancel = () => {
    this.goodsTransfer.closeModal();
  };
  public onClick = (src: string) => () => {
    window.open(src);
  };
  public goodsTransferOk = (selectedRowKeys: any) => {
    const { detail, state, dispatch } = this.props;
    const { goodsListByCurrentActivity } = state;
    const selectedRows = filter(goodsListByCurrentActivity, item => {
      return includes(selectedRowKeys, item.productId);
    });
    detail.products = concat(
      detail.products,
      selectedRows.map(item => {
        item.id = item.productId;
        return item;
      })
    );
    this.goodsTransfer.closeModal();
    this.onChange(detail);
  };

  /**
   * 渲染商品楼层
   */
  public renderShop() {
    const { detail, state } = this.props;
    const { goodsListByCurrentActivity } = state;
    const selectedRowKeys = this.getSelectedRowKeys(detail.products);
    this.tempList = Array.prototype.concat(detail.products || []);
    detail.style = detail.style || 1;
    detail.css = detail.css || 1;
    const plainCss = images[detail.css] && images[detail.css].plainCss;
    const activityCss = images[detail.css] && images[detail.css].activityCss;
    return (
      <div>
        <Row gutter={12} className="mb10">
          <Col span={3}>排列样式:</Col>
          <Col span={9}>
            <Radio.Group
              value={detail.css}
              onChange={e => {
                detail.css = e.target.value;
                this.onChange(detail);
              }}
            >
              <Radio value={1}>1*1</Radio>
              <Radio value={2}>1*2</Radio>
              <Radio value={3}>1*3</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row gutter={12} className="mb10">
          <Col span={3}>展示样式:</Col>
          <Col span={9}>
            <Radio.Group
              value={detail.style}
              style={{ display: 'flex' }}
              onChange={e => {
                console.log('e => ', e);
                detail.style = e.target.value;
                this.onChange(detail);
              }}
            >
              <div>
                <img width={100} height={100} src={plainCss} onClick={this.onClick(plainCss)} alt="" />
                <Radio value={1}>普通样式</Radio>
              </div>
              <div>
                <img width={100} height={100} src={activityCss} onClick={this.onClick(activityCss)} alt="" />
                <Radio value={2}>活动样式</Radio>
              </div>
            </Radio.Group>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={3}></Col>
          <Col span={21}>
            <Shop
              dataSource={detail.products}
              onChange={value => {
                detail.products = value;
                this.onChange(detail);
              }}
            />
            <ShopModal
              selectedRowKeys={selectedRowKeys}
              ref="shopmodal"
              onSelectAll={(selected, selectedRows, changeRows) => {
                if (selected) {
                  changeRows.map(item => {
                    this.tempList.push(item);
                  });
                } else {
                  const ids = changeRows.map(val => val.id);
                  this.tempList = this.tempList.filter(item => {
                    return ids.indexOf(item.id) === -1;
                  });
                }
              }}
              onSelect={(record, selected) => {
                if (selected) {
                  this.tempList.push(record);
                } else {
                  this.tempList = this.tempList.filter(item => item.id !== record.id);
                }
              }}
              onOk={() => {
                detail.products = this.tempList;
                this.onChange(detail);
              }}
            />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={3}></Col>
          <Col span={9}>
            <span
              className="href"
              style={{ marginRight: 8 }}
              onClick={() => {
                const ref: any = this.refs.shopmodal;
                ref.setState({ visible: true });
              }}
            >
              选择商品
            </span>
            <ActivityList text="选择活动商品" confirm={this.handleSelectActivity} />
            <GoodsTransfer
              ref={element => {
                this.goodsTransfer = element;
              }}
              title="选择商品"
              currentGoodsList={this.tempList}
              dataSource={goodsListByCurrentActivity}
              onCancel={this.goodsTransferCancel}
              onOk={this.goodsTransferOk}
            />
          </Col>
        </Row>
      </div>
    );
  }

  /**
   * 渲染广告楼层
   */
  public renderAd(): React.ReactNode {
    const { detail } = this.props;
    return (
      // <Draggable
      //   className={styles['shop-draggable']}
      //   dragElement=".ant-upload-list-item"
      // >
      <div>
        <Upload
          value={
            detail.advertisementUrl ? [
              {
                uid: 'advertisementUrl0',
                url: detail.advertisementUrl,
              },
            ] : undefined
          }
          size={0.3}
          listType="picture-card"
          onChange={(value: any) => {
            const detail = this.props.detail;
            if (value[0] && value[0].url) {
              this.onChange({
                ...detail,
                advertisementImgUrl: value[0].url
              });
            } else {
              this.onChange({
                ...detail,
                advertisementImgUrl: undefined
              });
            }
          }}
        />
        <div>
          <Input
            name="advertisementJumpUrl"
            style={{ width: 200 }}
            placeholder="请输入正确的链接地址"
            value={detail.advertisementJumpUrl}
            onChange={e => {
              const value = e.target.value;
              this.onChange({
                ...detail,
                advertisementJumpUrl: value
              });
            }}
          />
        </div>
      </div>
      // </Draggable>
    );
  }

  /**
   * 渲染优惠券楼层
   */
  public renderCoupon(): React.ReactNode {
    const { detail } = this.props;
    detail.css = detail.css || 1;
    const selectedRowKeys = this.getSelectedRowKeys(detail.coupons);
    this.tempCoupons = Array.prototype.concat(detail.coupons || []);
    return (
      <div>
        <Row gutter={12}>
          <Col span={3}>样式:</Col>
          <Col span={9}>
            <Radio.Group
              value={detail.css}
              onChange={e => {
                detail.css = e.target.value;
                this.onChange(detail);
              }}
            >
              <Radio value={1}>1*1</Radio>
              <Radio value={2}>1*2</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={21} offset={3}>
            {detail.coupons && (
              <Coupon
                dataSource={detail.coupons}
                onChange={value => {
                  detail.coupons = value;
                  console.log('coupons=>', detail.coupons);
                  this.onChange(detail);
                }}
              />
            )}
            <CouponModal
              visible={this.state.couponVisible}
              selectedRowKeys={selectedRowKeys}
              onCancel={() => {
                this.setState({ couponVisible: false });
              }}
              onSelectAll={(selected, selectedRows, changeRows) => {
                console.log('onSelectAll=>', selected, selectedRows, changeRows);
                if (selected) {
                  changeRows.map(item => {
                    this.tempCoupons.push(item);
                  });
                } else {
                  const ids = changeRows.map(val => val.id);
                  this.tempCoupons = this.tempCoupons.filter(item => {
                    return ids.indexOf(item.id) === -1;
                  });
                }
              }}
              onSelect={(record, selected) => {
                if (!record) {
                  return;
                }
                if (selected) {
                  if (record) {
                    this.tempCoupons.push(record);
                  }
                } else {
                  this.tempCoupons = this.tempCoupons.filter(item => item && item.id !== record.id);
                }
              }}
              onOk={() => {
                this.tempCoupons = this.tempCoupons.filter(item => !!item);
                detail.coupons = this.tempCoupons;
                this.onChange(detail);
                this.setState({ couponVisible: false });
              }}
            />
            <span
              className="href"
              onClick={() => {
                this.setState({ couponVisible: true });
              }}
            >
              添加优惠券
            </span>
          </Col>
        </Row>
      </div>
    );
  }

  public renderLayout(): React.ReactNode {
    const {
      detail: { type }
    } = this.props;
    switch (type) {
      case 1:
        return this.renderShop();
      case 2:
        return this.renderCoupon();
      case 3:
        return this.renderAd();
    }
  }

  public render() {
    const detail = this.props.detail;
    return (
      <Card
        size="small"
        title={typeConfig[detail.type].title}
        style={{ width: 800 }}
        extra={
          <div>
            序号：
            <Input
              size="small"
              style={{ width: 60, marginRight: 10 }}
              value={detail.sort}
              onChange={e => {
                this.onChange({
                  ...detail,
                  sort: Number(e.target.value)
                });
              }}
            />
            <Icon
              className="pointer"
              type="delete"
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: '是否删除楼层',
                  onOk: () => {
                    this.onChange();
                  }
                });
              }}
            />
          </div>
        }
      >
        {this.renderLayout()}
      </Card>
    );
  }
}

export default connect((state: any) => {
  return {
    state: state[namespace]
  };
})(Main) as any;
