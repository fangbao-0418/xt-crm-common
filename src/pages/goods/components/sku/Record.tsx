/**
 * 库存信息
 */
import React, { useEffect, useRef } from 'react'
import Form, { FormItem,  FormInstance } from '@/packages/common/components/form'
export interface RecordProps {
  skuId: any
  skuCode: string
  skuValue: string
  productName: string
  customsStatusInfo: string
  hsCode: string
  brand: string
  hsProductName: string
  weightInfo: string
  declaredPriceInfo: string
  originCountry: string
  generalTaxRateInfo: string
  exemptValueInfo: string
  createTime: number
  lastUpdateTime: number
}
interface Props {
  detail: RecordProps
}
function Record (props: Props) {
  const formRef = useRef<FormInstance>()
  useEffect(() => {
    const form = formRef.current
    if (form) {
      const detail = props.detail || {}
      form.setValues({
        ...detail,
        createTime: APP.fn.formatDate(detail.createTime),
        lastUpdateTime: APP.fn.formatDate(detail.lastUpdateTime)
      })
    }
  }, [props.detail])
  return (
    <Form
      labelCol={{span: 10}}
      wrapperCol={{span: 14}}
      getInstance={(ref) => {
        formRef.current = ref
      }}
    >
      <FormItem
        type='text'
        label='SKU编码（唯一码）'
        name='skuCode'
      />
      <FormItem
        type='text'
        label='SKU规格值'
        name='skuValue'
      />
      <FormItem
        type='text'
        label='产品名称'
        name='productName'
      />
      <FormItem
        type='text'
        label='海关备案状态'
        name='customsStatusInfoIn fo'
      />
      <FormItem
        type='text'
        label='海关品名'
        name='hsProductName'
      />
      <FormItem
        type='text'
        label='海关编码'
        name='hsCode'
      />
      <FormItem
        type='text'
        label='产品品牌'
        name='brand'
      />
      <FormItem
        type='text'
        label='产品重量'
        name='weightInfo'
      />
      <FormItem
        type='text'
        label='产品申报价'
        name='declaredPriceInfoIn fo'
      />
      <FormItem
        type='text'
        label='原产国'
        name='originCountry'
      />
      <FormItem
        type='text'
        label='综合税率'
        name='generalTaxRateInfo'
      />
      <FormItem
        type='text'
        label='免税额'
        name='exemptValueInfo'
      />
      <FormItem
        type='text'
        label='创建时间'
        name='createTime'
      />
      <FormItem
        type='text'
        label='最后更新时间'
        name='lastUpdateTime'
      />
    </Form>
  )
}
export default Record
