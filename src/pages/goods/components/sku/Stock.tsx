/**
 * 库存信息
 */
import React, { useEffect } from 'react'
import Form, { FormItem,  FormInstance } from '@/packages/common/components/form'
function Stock () {
  let form: FormInstance
  useEffect(() => {
    form.setValues({
      sellableQty: 'sellableQty',
      onwayQty: 'onwayQty',
      pendingQty: 'pendingQty',
      reservedQty: 'reservedQty',
      unsellableQty: 'unsellableQty'
    })
  }, [])
  return (
    <Form
      labelCol={{span: 10}}
      wrapperCol={{span: 14}}
      getInstance={(ref) => {
        form = ref
      }}
    >
      <FormItem
        type='text'
        label='可用数量'
        name='sellableQty'
      />
      <FormItem
        type='text'
        label='在途数量'
        name='onwayQty'
      />
      <FormItem
        type='text'
        label='未上架数量'
        name='pendingQty'
      />
      <FormItem
        type='text'
        label='不可用数量'
        name='unsellableQty'
      />
      <FormItem
        type='text'
        label='冻结数量'
        name='reservedQty'
      />
    </Form>
  )
}
export default Stock
