import React from 'react'
import { Card, Row, Col, Icon, Radio, Input } from 'antd'
import Shop from './shop'
import Upload from '@/components/upload'
import Draggable from '@/components/draggable'
import ShopModal from '@/components/shop-modal'
import * as api from '../../api'
import { typeConfig } from '../../constant'
import styles from './style.module.sass'
interface Props {
  detail: Special.DetailContentProps
  onChange?: (value?: Special.DetailContentProps) => void
}
class Main extends React.Component<Props> {
  public tempList: Shop.ShopItemProps[] = []
  public onChange (detail?: Special.DetailContentProps) {
    if (this.props.onChange) {
      this.props.onChange(detail)
    }
  }
  public getSelectedRowKeys () {
    const { detail } = this.props
    const ids: any[] = []
    detail.list.map((item) => {
      ids.push(item.id)
    })
    return ids
  }
  public renderShop (): React.ReactNode {
    const { detail } = this.props
    const selectedRowKeys = this.getSelectedRowKeys()
    this.tempList = Array.prototype.concat(detail.list)
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
                console.log(this.tempList, 'tempList')
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
                const ref: any= this.refs.shopmodal
                ref.setState({visible: true})
              }}
            >
              添加商品
            </span>
          </Col>
        </Row>
      </div>
    )
  }
  public renderAd (): React.ReactNode {
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
          listType="picture-card"
          onChange={(value: any) => {
            const detail = this.props.detail
            if (value[0] && value[0].url) {
              this.onChange({
                ...detail,
                advertisementUrl: value[0].url
              })
            }
          }}
        />
      </Draggable>
    )
  }
  public renderLayout (): React.ReactNode {
    const { detail: { type } } = this.props
    switch (type) {
      case 1:
        return this.renderShop()
      case 3:
        return this.renderAd()
    }
  }
  public render () {
    const detail = this.props.detail
    return (
      <Card
        size="small"
        title={typeConfig[detail.type].title}
        style={{width: 800}}
        extra={(
          <div>
            序号：
            <Input
              size="small"
              style={{width: 60, marginRight: 10}}
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
                this.onChange()
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