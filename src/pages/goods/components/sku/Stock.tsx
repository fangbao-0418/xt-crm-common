/**
 * 库存信息
 */
import React, { useEffect, useRef } from 'react'
import Form, { FormItem,  FormInstance } from '@/packages/common/components/form'
import { getStockInfo } from '../../api'
interface Props {
  id: any
}

function Stock (props: Props) {
  const formRef = useRef<FormInstance>()
  const id = props.id
  useEffect(() => {
    getStockInfo(id).then((res) => {
      console.log(res)
      const form = formRef.current
      if (form) {
        form.setValues(res)
      }
    })
  }, [id])
  // console.log(stockRef, 'stockRef')
  return (
    <Form
      // ref={ref}
      labelCol={{span: 10}}
      wrapperCol={{span: 14}}
      getInstance={(ref) => {
        formRef.current = ref
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
