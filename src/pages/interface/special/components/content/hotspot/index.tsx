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
  public state: State = {
    coordinates: [],
    current: 0,
    couponVisible: false,
    value: Object.assign({ url: '', area: [] }, this.props.value)
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
        ossUpload(file).then((res) => {
          const url = replaceUrl(res[0])
          const value = this.state.value
          value.url = url
          this.onChange(value)
        })
      }
    }
    el.click()
  }
  public onChange (value: ValueProps) {
    // const res: State = {
    //   ...this.state,
    //   ...value
    // }
    // const current = res.current
    // this.setState(res)
    // const coordinates = res.coordinates || []
    // const area: any[] = []
    // const val = this.props.value || { url: '', area: [] }
    // coordinates.map((coordinate, index) => {
    //   area.push({
    //     coordinate,
    //     ...val.area[index]
    //   })
    // })
    // val.area[current] = {
    //   ...val.area[current]
    // }
    this.setState({
      value
    })
    if (this.props.onChange) {
      this.props.onChange({
        ...value
      })
    }
  }
  public onBlockClick = (current: number) => {
    console.log(current, 'onBlockClick')
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
              const res = coordinates.concat(['0,0,0.1,0.1'])
              this.setState({
                coordinates: res
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
                src={fillUrl(this.state.value.url) || defaultImg}
                // onLoad={() => {
                //   // console.log('on loaded')
                //   this.forceUpdate()
                // }}
              />
              {this.state.value.url && (
                <Hotsport
                  value={coordinates}
                  onBlockClick={this.onBlockClick}
                  onRemove={(index) => {
                    const value = this.state.value
                    value.area.splice(index, 1)
                    this.onChange(value)
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
                    // console.log(val, value.area, '----')
                    this.onChange(value)
                  }}
                />
              )}
            </div>
          </div>
          <div className={styles.right}>
            <FormItem
              className={styles['right-item']}
              label='点击类型'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <Radio.Group
                value={record.type}
                onChange={(e) => {
                  const value = this.state.value
                  value.area[current].type = e.target.value
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
                    onClick={() => {
                      const ref = this.refs.shopmodal as any
                      // this.onChange({
                      //   type: 1
                      // })
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
                    onClick={() => {
                      // this.onChange({
                      //   type: 2
                      // })
                      this.setState({
                        // type: 2,
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
