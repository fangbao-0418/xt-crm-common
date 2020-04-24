import React from 'react'
import { Button, Radio, Input } from 'antd'
import { FormItem } from '@/packages/common/components/form'
import styles from './styles.m.styl'
import { ossUpload } from '@/components/upload'
import Hotsport from './components/hotsport'

interface State {
  url: string
}

class Main extends React.Component<{}, State> {
  public state: State = {
    url: require('@/assets/images/hotsport.png')
  }
  public uploadFile = () => {
    const el = document.createElement('input')
    el.setAttribute('type', 'file')
    el.setAttribute('accept', 'image/*')
    el.onchange = () => {
      const file = el.files && el.files[0]
      if (file) {
        ossUpload(file).then((res) => {
          console.log(res[0], 'res')
          this.setState({
            url: res[0]
          })
        })
      }
    }
    el.click()
  }
  public render () {
    return (
      <div>
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
          >
            添加热区
          </Button>
        </div>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles['image-area']}>
              <img src={this.state.url} />
              <Hotsport />
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
                defaultValue={1}
              >
                <div>
                  <Radio value={1}>商品</Radio>
                  <Button
                    type='primary'
                    size='small'
                  >
                    选择商品
                  </Button>
                </div>
                <div>
                  <Radio value={2}>优惠券</Radio>
                  <Button
                    type='primary'
                    size='small'
                  >
                    选择优惠券
                  </Button>
                </div>
                <div>
                  <Radio value={3}>平台链接</Radio>
                  <Input
                    style={{ width: 200 }}
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
