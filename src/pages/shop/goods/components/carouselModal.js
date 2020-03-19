import React, { Component } from 'react';
import { Modal, Carousel, Icon } from 'antd';
import styles from '../style.module.scss'

const CarouselItem = (src) => {
  return (
    <div>
      <img alt="img" src={src} />
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
    this.sliderRef.slick.slickPrev();
  }

  /** 下一张图片 */
  handleNext = () => {
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
    this.props.ondestroy();
  }

  render() {
    const { visible, activeSlide } = this.state;

    const { currentGoods } = this.props

    if (!currentGoods) return null;

    const carousels = [currentGoods.coverUrl]

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
          {carousels.map((item, i) => <CarouselItem key={i} src={item} />)}
        </Carousel>
        <p className={styles.hint}>
          { activeSlide } / { carousels.length }
        </p>
        <Icon className={[ styles.action, styles.actionPre ]} type="left-circle" onClick={this.handlePrev} />
        <Icon className={[ styles.action, styles.actionNext ]} type="right-circle" onClick={this.handleNext} />
      </Modal>
    )
  }
}

export default CarouselModal