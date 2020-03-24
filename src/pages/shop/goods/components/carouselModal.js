import React, { Component } from 'react';
import { Modal, Carousel, Icon, message } from 'antd';
import { replaceHttpUrl } from '@/util/utils';
import styles from '../style.module.scss'

const CarouselItem = ({ item }) => {
  return (
    <div>
      <img alt="img" src={item.value} />
      <p style={{ textAlign: 'center' }}>{item.label}</p>
    </div>
  )
}

class CarouselModal extends Component {
  state = {
    visible: false,
    activeSlide: 0
  }

  /** 上一张图片 */
  handlePrev = () => {
    const { activeSlide } = this.state
    if (activeSlide === 0) {
      message.warn('已经第一张了')
      return
    }
    this.sliderRef.slick.slickPrev();
  }

  /** 下一张图片 */
  handleNext = () => {
    const { activeSlide } = this.state
    const { currentGoods } = this.props
    const carouselsInfos = this.getCarouselsInfos(currentGoods)
    if (activeSlide === carouselsInfos.length - 1) {
      message.warn('已经最后一张了')
      return
    }
    this.sliderRef.slick.slickNext();
  }

  /** 图片切换 */
  handleBeforeChange = (current, next) => {
    this.setState({
      activeSlide: next
    })
  }

  /** 隐藏模态框 */
  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  /** 显示模态框 */
  showModal = () => {
    this.setState({
      visible: true
    })
  }

  /** 取消操作 */
  handleCancel = () => {
    this.hideModal()
  }

  /** 窗口彻底关闭回调 */
  handleClose = () => {
    this.setState({
      activeSlide: 0
    })
    this.props.ondestroy();
  }

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

  render() {
    const { visible, activeSlide } = this.state;

    const { currentGoods } = this.props

    if (!currentGoods) return null;

    const carouselsInfos = this.getCarouselsInfos(currentGoods)

    return (
      <Modal
        visible={visible}
        bodyStyle={{
          padding: '24px 64px 12px'
        }}
        className={styles.slider}
        footer={null}
        title={`商品【${currentGoods.productName}】的图片`}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
      >
        <Carousel
          dots={false}
          infinite={true}
          beforeChange={this.handleBeforeChange}
          ref={ref => (this.sliderRef = ref)}
        >
          {carouselsInfos.map((item, i) => <CarouselItem key={i} item={item} />)}
        </Carousel>
        <p className={styles.hint}>
          { activeSlide + 1 } / { carouselsInfos.length }
        </p>
        <Icon className={[ styles.action, styles.actionPre ]} type="left-circle" onClick={this.handlePrev} />
        <Icon className={[ styles.action, styles.actionNext ]} type="right-circle" onClick={this.handleNext} />
      </Modal>
    )
  }
}

export default CarouselModal