import React from 'react'
import { Card, Row, Col, Icon, Radio, Input, Modal } from 'antd'
import Shop from './shop'
import Coupon from './coupon'
import Upload from '@/components/upload'
import Draggable from '@/components/draggable'
import ShopModal from '@/components/shop-modal'
import CouponModal from '@/components/coupon-modal'
import * as api from '../../api'
import { typeConfig } from '../../constant'
import styles from './style.module.sass'
interface State {
  /** 优惠券心音 */
  couponVisible: boolean
}
interface Props {
  detail: Special.DetailContentProps
  onChange?: (value?: Special.DetailContentProps) => void
}
class Main extends React.Component<Props, State> {
  public tempList: Shop.ShopItemProps[] = [];
  public tempCrmCoupons: Coupon.CouponItemProps[] = [];
  public state: State = {
    couponVisible: false
  }
  public onChange(detail?: Special.DetailContentProps) {
    if (this.props.onChange) {
      this.props.onChange(detail)
    }
  }
  public getSelectedRowKeys(list: any) {
    return (list || []).map((item: any) => item.id)
  }
  public renderShop(): React.ReactNode {
    const { detail } = this.props
    const selectedRowKeys = this.getSelectedRowKeys(detail.list)
    this.tempList = Array.prototype.concat(detail.list)
    detail.css = detail.css || 1
    return (
      <div>
        <Row gutter={12}>
          <Col span={3}>
            样式:
          </Col>
          <Col span={9}>
            <Radio.Group
              value={detail.css}
              onChange={(e) => {
                detail.css = e.target.value
                this.onChange(detail)
              }}
            >
              <Radio value={1}>1*1</Radio>
              <Radio value={2}>1*2</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={3}></Col>
          <Col span={21}>
            <Shop
              dataSource={detail.list}
              onChange={(value) => {
                detail.list = value
                this.onChange(detail)
              }}
            />
            <ShopModal
              selectedRowKeys={selectedRowKeys}
              ref='shopmodal'
              onSelectAll={(selected, selectedRows, changeRows) => {
                if (selected) {
                  changeRows.map((item) => {
                    this.tempList.push(item)
                  })
                } else {
                  const ids = changeRows.map(val => val.id)
                  this.tempList = this.tempList.filter((item) => {
                    return ids.indexOf(item.id) === -1
                  })
                }
              }}
              onSelect={(record, selected) => {
                if (selected) {
                  this.tempList.push(record)
                } else {
                  this.tempList = this.tempList.filter((item) => item.id !== record.id)
                }
              }}
              onOk={() => {
                detail.list = this.tempList
                this.onChange(detail)
              }}
            />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={3}></Col>
          <Col span={9}>
            <span
              className="href"
              onClick={() => {
                const ref: any = this.refs.shopmodal
                ref.setState({ visible: true })
              }}
            >
              选择商品
            </span>
          </Col>
        </Row>
      </div>
    )
  }
  public renderAd(): React.ReactNode {
    const { detail } = this.props
    return (
      <Draggable
        className={styles['shop-draggable']}
        dragElement=".ant-upload-list-item"
      >
        <Upload
          value={detail.advertisementUrl && [
            {
              uid: 'advertisementUrl0',
              url: detail.advertisementUrl,
            }
          ]}
          size={0.3}
          listType="picture-card"
          onChange={(value: any) => {
            const detail = this.props.detail
            console.log(value, 'picture change')
            if (value[0] && value[0].url) {
              this.onChange({
                ...detail,
                advertisementUrl: value[0].url
              })
            } else {
              this.onChange({
                ...detail,
                advertisementUrl: undefined
              })
            }
          }}
        />
      </Draggable>
    )
  }
  public renderCoupon(): React.ReactNode {
    const { detail } = this.props;
    detail.css = detail.css || 1;
    const selectedRowKeys = this.getSelectedRowKeys(detail.crmCoupons)
    this.tempCrmCoupons =  Array.prototype.concat(detail.crmCoupons);
    return (
      <div>
        <Row gutter={12}>
          <Col span={3}>
            样式:
          </Col>
          <Col span={9}>
            <Radio.Group
              value={detail.css}
              onChange={(e) => {
                detail.css = e.target.value
                this.onChange(detail)
              }}
            >
              <Radio value={1}>1*1</Radio>
              <Radio value={2}>1*2</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={21} offset={3}>
            {detail.crmCoupons && <Coupon
              dataSource={detail.crmCoupons}
              onChange={(value) => {
                detail.crmCoupons = value
                console.log('crmCoupons=>', detail.crmCoupons);
                this.onChange(detail)
              }}
            />}
            <CouponModal
              visible={this.state.couponVisible}
              selectedRowKeys={selectedRowKeys}
              onCancel={() => {
                this.setState({ couponVisible: false })
              }}
              onSelectAll={(selected, selectedRows, changeRows) => {
                console.log('onSelectAll=>', selected, selectedRows, changeRows)
                if (selected) {
                  changeRows.map((item) => {
                    this.tempCrmCoupons.push(item)
                  })
                } else {
                  const ids = changeRows.map(val => val.id)
                  this.tempCrmCoupons = this.tempCrmCoupons.filter((item) => {
                    return ids.indexOf(item.id) === -1
                  })
                }
              }}
              onSelect={(record, selected) => {
                console.log('onSelect=>', record, selected)
                if (selected) {
                  this.tempCrmCoupons.push(record)
                } else {
                  this.tempCrmCoupons = this.tempCrmCoupons.filter((item) => item.id !== record.id)
                }
              }}
              onOk={() => {
                console.log('onOk=>', this.tempCrmCoupons);
                detail.crmCoupons = this.tempCrmCoupons
                this.onChange(detail)
                this.setState({ couponVisible: false })
              }}
            />
            <span
              className="href"
              onClick={() => {
                this.setState({ couponVisible: true })
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
    const { detail: { type } } = this.props
    switch (type) {
      case 1:
        return this.renderShop()
      case 2:
        return this.renderCoupon()
      case 3:
        return this.renderAd()
    }
  }
  public render() {
    const detail = this.props.detail
    return (
      <Card
        size="small"
        title={typeConfig[detail.type].title}
        style={{ width: 800 }}
        extra={(
          <div>
            序号：
            <Input
              size="small"
              style={{ width: 60, marginRight: 10 }}
              value={detail.sort}
              onChange={(e) => {
                this.onChange({
                  ...detail,
                  sort: Number(e.target.value)
                })
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
                    this.onChange()
                  }
                })
              }}
            />
          </div>
        )}
      >
        {this.renderLayout()}
      </Card>
    )
  }
}
export default Main