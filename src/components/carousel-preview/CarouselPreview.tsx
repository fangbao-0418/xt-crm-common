import React, { PureComponent } from 'react'
import { Modal, Carousel, Icon, message } from 'antd'
import classNames from 'classnames'
import { debounce } from 'lodash'
import { defaultCarouselPreviewProps } from './config/config'
import CarouselItem from './components/CarouselItem'
import { ListItem } from './config/interface'
import styles from './style.module.styl'

type CarouselPreviewProps = {
  /* 模态框点击关闭或者取消的回调 */
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
  /* 模态框消失之后的回调 */
  afterClose?: () => void
  afterAddon?: React.ReactNode
} & Partial<typeof defaultCarouselPreviewProps>

interface CarouselPreviewState {
  activeSlide: number
  list: Array<ListItem>
}

class CarouselPreview extends PureComponent<
  CarouselPreviewProps,
  CarouselPreviewState
> {
  private static defaultProps = defaultCarouselPreviewProps

  private static getDerivedStateFromProps (
    nextProps: CarouselPreviewProps
  ) {
    if (
      nextProps.visible
      && (nextProps.list && nextProps.list.length)
    ) {
      return {
        activeSlide: nextProps?.activeSlide || 0,
        list: nextProps.list
      }
    }
    return null
  }

  public state: CarouselPreviewState = {
    activeSlide: 0,
    list: []
  }

  private sliderRef: any

  public handleSlideRef = (ref: any) => {
    this.sliderRef = ref
  }

  public handleAfterClose = () => {
    this.setState(
      {
        activeSlide: 0,
        list: []
      },
      () => {
        if (this.props.afterClose) {
          this.props.afterClose()
        }
      }
    )
  }

  /** 图片切换 */
  public handleBeforeChange = (
    current: any,
    next: number
  ) => {
    this.setState({
      activeSlide: next
    })
  }

  /** 上一张图片 */
  public handlePrev = (hint: boolean = false) => {
    const { activeSlide } = this.state
    if (activeSlide === 0) {
      hint && message.warn('已经第一张了')
      return
    }
    this.sliderRef.slick.slickPrev()
  }

  /** 下一张图片 */
  public handleNext = (hint: boolean = false) => {
    const { activeSlide } = this.state
    const { list = [] } = this.props
    if (activeSlide === list.length - 1) {
      hint && message.warn('已经最后一张了')
      return
    }
    this.sliderRef.slick.slickNext()
  }

  /** 滚轮上一张下一张 */
  handleWheel = (event: any) => {
    const deltaY = event.deltaY
    if (deltaY > 0) {
      // 下一张
      debounce(this.handleNext)()
    } else {
      // 上一张
      debounce(this.handlePrev)()
    }
  }

  public render () {
    const { title, visible, onCancel, afterAddon } = this.props
    const { list, activeSlide } = this.state

    return (
      <div onWheel={this.handleWheel}>
        <Modal
          visible={visible}
          bodyStyle={{
            padding: '24px 64px 12px'
          }}
          className={styles.slider}
          footer={null}
          title={title}
          onCancel={onCancel}
          afterClose={this.handleAfterClose}
        >
          <Carousel
            dots={false}
            infinite={true}
            beforeChange={this.handleBeforeChange}
            ref={this.handleSlideRef}
          >
            {list.map((item, i) => (
              <CarouselItem key={i} item={item} />
            ))}
          </Carousel>
          {
            afterAddon
          }
          <p className={styles.hint}>
            {activeSlide + 1} / {list.length}
          </p>
          <Icon
            className={classNames(
              styles.action,
              styles.actionPre
            )}
            type='left'
            onClick={this.handlePrev.bind(this, true)}
          />
          <Icon
            className={classNames(
              styles.action,
              styles.actionNext
            )}
            type='right'
            onClick={this.handleNext.bind(this, true)}
          />
        </Modal>
      </div>
    )
  }
}

export default CarouselPreview
