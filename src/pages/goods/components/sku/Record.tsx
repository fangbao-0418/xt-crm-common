import React from 'react'
import Form, { FormItem,  FormInstance } from '@/packages/common/components/form'
class Main extends React.Component {
  public form: FormInstance
  public componentDidMount () {
    this.form.setValues({
      a: '222'
    })
  }
  public render () {
    return (
      <Form
        labelCol={{span: 6}}
        wrapperCol={{span: 18}}
        getInstance={(ref) => {
          this.form = ref
        }}
      >
        <FormItem
          type='text'
          label='abc'
          name='SKU编码（唯一码）'
        />
        <FormItem
          type='text'
          label='SKU规格值'
          name='a'
        />
        <FormItem
          type='text'
          label='产品名称'
          name='a'
        />
        <FormItem
          type='text'
          label='海关备案状态'
          name='a'
        />
        <FormItem
          type='text'
          label='海关品名'
          name='a'
        />
        <FormItem
          type='text'
          label='海关编码'
          name='a'
        />
        <FormItem
          type='text'
          label='产品品牌'
          name='a'
        />
        <FormItem
          type='text'
          label='产品重量'
          name='a'
        />
        <FormItem
          type='text'
          label='产品申报价'
          name='a'
        />
        <FormItem
          type='text'
          label='原产国'
          name='a'
        />
        <FormItem
          type='text'
          label='海关编码'
          name='a'
        />
        <FormItem
          type='text'
          label='综合税率'
          name='a'
        />
        <FormItem
          type='text'
          label='免税额'
          name='a'
        />
        <FormItem
          type='text'
          label='创建时间'
          name='a'
        />
        <FormItem
          type='text'
          label='最后更新时间'
          name='a'
        />
      </Form>
    )
  }
}
export default Main
