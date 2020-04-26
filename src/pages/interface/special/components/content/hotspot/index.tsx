import React from 'react'
import { Button, Radio, Input } from 'antd'
import { FormItem } from '@/packages/common/components/form'
import styles from './styles.m.styl'
import { ossUpload } from '@/components/upload'
import Hotsport from './components/hotsport'
import ShopModal from '@/components/shop-modal'
import CouponModal from '@/components/coupon-modal'

const defaultImg = require('@/assets/images/hotsport.png')

function replaceUrl (url: string) {
  if (!url) {
    return url
  }
  url = (url || '').trim().replace(/^https?:\/\/.+?\//, '')
  return url
}

function fillUrl (url: string) {
  return 'https://assets.hzxituan.com/' + replaceUrl(url)
}

interface State {
  coordinates: string[]
  current: number
  couponVisible: boolean
  value: ValueProps
}

interface ValueProps {
  url: string
  area: { coordinate: string, type: 1 | 2 | 3, value: any }[]
}

interface Props {
  value?: ValueProps
  onChange?: (value: any) => void
}

class Main extends React.Component<Props, State> {
  public initValue = Object.assign({ url: '', area: [] }, this.props.value) as ValueProps
  public state: State = {
    coordinates: [],
    current: -1,
    couponVisible: false,
    value: this.initValue
  }
  public componentWillReceiveProps (props: Props) {
    const value = Object.assign({ url: '', area: [] }, props.value) as ValueProps
    this.setState({
      value,
      coordinates: value.area.map((item) => item && item.coordinate)
    })
  }
  public uploadFile = () => {
    const el = document.createElement('input')
    el.setAttribute('type', 'file')
    el.setAttribute('accept', 'image/*')
    el.onchange = () => {
      const file = el.files && el.files[0]
      if (file) {
        APP.fn.handleLoading('start')
        ossUpload(file).then((res) => {
          const url = replaceUrl(res[0])
          const value = this.state.value
          value.url = url
          value.area = []
          this.initValue = value
          this.onChange(value)
          this.setState({
            current: -1
          })
        }).finally(() => {
          APP.fn.handleLoading('end')
        })
      }
    }
    el.click()
  }
  public onChange (value: ValueProps) {
    if (this.props.onChange) {
      this.props.onChange({
        ...value
      })
    }
  }
  public onBlockClick = (current: number) => {
    this.setState({
      current
    })
  }
  public render () {
    const { coordinates, couponVisible, current } = this.state
    const record = Object.assign({}, this.state.value.area[current])
    return (
      <div>
        <ShopModal
          type='radio'
          selectedRowKeys={record.type === 1 ? [record.value] : []}
          ref='shopmodal'
          onOk={(keys) => {
            const value = this.state.value
            value.area[current].type = 1
            value.area[current].value = keys[0]
            this.onChange({
              ...value
            })
          }}
        />
        <CouponModal
          type='radio'
          visible={couponVisible}
          selectedRowKeys={record.type === 2 && record.value ? [record.value.id] : []}
          onOk={(keys, rows) => {
            const value = this.state.value
            value.area[current].type = 2
            value.area[current].value = rows[0] && rows[0]
            this.onChange({
              ...value
            })
            this.setState({
              couponVisible: false
            })
          }}
          onCancel={() => {
            this.setState({
              couponVisible: false
            })
          }}
        />
        <div>
          <Button
            className='mr10'
            type='primary'
            onClick={this.uploadFile}
          >
            上传图片
          </Button>
          <Button
            type='primary'
            onClick={() => {
              if (!this.state.value.url) {
                APP.error('请先上传图片')
                return
              }
              const value = this.state.value
              const img = this.refs.img as any
              const width = img.clientWidth
              const height = img.clientHeight
              let x, y
              if (width > height) {
                y = 0.4
                x = y * height / width
              } else {
                x = 0.4
                y = x * width / height
              }
              console.log(x, y, 'add')
              value.area.push({
                coordinate: `0, 0, ${x}, ${y}`,
                type: 1,
                value: undefined
              })
              this.onChange({
                ...value
              })
            }}
          >
            添加热区
          </Button>
        </div>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles['image-area']}>
              <img
                ref='img'
                src={this.state.value.url ? fillUrl(this.state.value.url) : defaultImg}
                onLoad={() => {
                  this.setState({
                    coordinates: this.state.value.area.map((item) => item && item.coordinate)
                  })
                }}
              />
              {this.state.value.url && (
                <Hotsport
                  value={coordinates}
                  onBlockClick={this.onBlockClick}
                  onRemove={(index) => {
                    const value = this.state.value
                    value.area.splice(index, 1)
                    this.onChange({ ...value })
                    this.setState({
                      current: -1
                    })
                  }}
                  onChange={(val: string[]) => {
                    const value = this.state.value
                    val.map((item, index) => {
                      if (!value.area[index]) {
                        value.area[index] = {
                          type: 1,
                          coordinate: item,
                          value: ''
                        }
                      }
                      value.area[index].coordinate = item
                    })
                    this.onChange(value)
                  }}
                />
              )}
            </div>
          </div>
          <div className={styles.right}>
            <div style={{ fontSize: 12 }} className='mb10'>
              <span style={{ color: 'red' }}>*</span>
              <span style={{ color: '#999' }}>上传后可再次上传更新覆盖，根据屏幕宽度满屏展示；支持gif动图，大小不超过500KB；图片宽度建议750px及以上</span>
            </div>
            <FormItem
              className={styles['right-item']}
              label='点击类型'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <Radio.Group
                value={record.type}
                disabled={current === -1}
                onChange={(e) => {
                  const value = this.state.value
                  value.area[current].type = e.target.value
                  value.area[current].value = undefined
                  this.onChange({
                    ...value
                  })
                }}
              >
                <div>
                  <Radio value={1}>商品</Radio>
                  <Button
                    type='primary'
                    size='small'
                    disabled={current === -1}
                    onClick={() => {
                      const ref = this.refs.shopmodal as any
                      ref.setState({
                        visible: true
                      })
                    }}
                  >
                    选择商品
                  </Button>
                </div>
                <div>
                  <Radio value={2}>优惠券</Radio>
                  <Button
                    type='primary'
                    size='small'
                    disabled={current === -1}
                    onClick={() => {
                      this.setState({
                        couponVisible: true
                      })
                    }}
                  >
                    选择优惠券
                  </Button>
                </div>
                <div>
                  <Radio value={3}>平台链接</Radio>
                  <Input
                    style={{ width: 200 }}
                    value={record.type === 3 ? record.value : ''}
                    disabled={current === -1}
                    onChange={(e) => {
                      // const value = e.target.value
                      const value = this.state.value
                      value.area[current].type = 3
                      value.area[current].value = e.target.value
                      this.onChange({
                        ...value
                      })
                    }}
                  />
                </div>
              </Radio.Group>
            </FormItem>
          </div>
        </div>
      </div>
    )
  }
}
export default Main
