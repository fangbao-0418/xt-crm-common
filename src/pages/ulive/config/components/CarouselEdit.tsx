import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'
import { CarouselItem } from '../interface'
import * as api from '../api'

interface Props {
  record?: CarouselItem
}

class Main extends React.Component<Props> {
  public form: FormInstance
  public save () {
    const record = this.props.record
    return new Promise((resove, reject) => {
      this.form.props.form.validateFields((err, values) => {
        if (err) {
          return
        }
        if (record && record.id) {
          api.updateCarousel({
            ...values
          }).then((res) => {
            resove(res)
          }, () => {
            reject()
          })
        } else {
          api.addCarousel({
            ...values
          }).then((res) => {
            resove(res)
          }, () => {
            reject()
          })
        }
      })
    })
  }
  public componentDidMount () {
    const record = this.props.record
    if (record) {
      this.form.setValues({
        ...record
      })
    }
  }
  public render () {
    const record = Object.assign({}, this.props.record)
    return (
      <div>
        <Form
          config={getFieldsConfig()}
          labelCol={{span: 7}}
          wrapperCol={{span: 16}}
          getInstance={(ref) => {
            this.form = ref
          }}
          namespace='carousel'
        >
          <FormItem
            name='id'
            verifiable
            readonly={record.id !== undefined}
            controlProps={{
              style: {width: 200}
            }}
          />
          <FormItem
            name='carouselSort'
            controlProps={{
              style: {width: 200}
            }}
          />
        </Form>
      </div>
    )
  }
}
export default Main
