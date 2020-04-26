import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { message, Form, Button, Card, Row, Col, Input, InputNumber, Table } from 'antd'
import { Alert } from '@/packages/common/components'
import { formItemLayout, formLeftButtonLayout } from '@/config'
import { getCouponDetail, modifyCouponBaseInfo, importShop } from '@/pages/fresh/coupon/api'
import { ProductSelector, ActivitySelector } from '@/components'
import { unionArray } from '@/util/utils'
import { formatAvlRange, formatFaceValue, formatReceiveRestrict, formatDateRange, formatUseTime, formatPlatformRestrict } from '@/pages/helper'
import If from '@/packages/common/components/if'
import './index.scss'
import { DownTemplate } from './index'
const { TextArea } = Input

const columns = [{
  title: 'ID',
  dataIndex: 'id',
  width: 100,
  key: 'id'
}, {
  title: '名称',
  width: 240,
  dataIndex: 'name',
  key: 'name'
}]

function CouponInfo (props) {
  const { form: { getFieldDecorator, getFieldsValue, setFieldsValue, validateFields }, history } = props
  const [detail, setDetail] = useState({})
  const [excludeProduct, setExcludeProduct] = useState([])
  const [activityList, setActivityList] = useState([])
  const productSelector = useRef()
  const [productSelectorVisible, setProductSelectorVisible] = useState(false)
  const [activitySelectorVisible, setActivitySelectorVisible] = useState(false)
  const { baseVO = {}, ruleVO = {} } = detail || {}
  const [chosenProduct, setChosenProduct] = useState(ruleVO.rangeVOList || [])

  // 获取详情
  const fetchDetail = async (id) => {
    const detail = await getCouponDetail(id) || {
      ruleVO: {
        rangeVOList: [{ id: 222 }],
        avlRange: 2
      }
    }
    setDetail(detail)
    const rangeVOList = detail.ruleVO && detail.ruleVO.rangeVOList || []
    setChosenProduct(rangeVOList)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search)
    const type = searchParams.get('type')
    const id = searchParams.get('id')
    if (type === 'edit') {
      fetchDetail(id)
    }
  }, [])

  // 是否显示排除商品按钮
  const hasExclude = () => {
    return ruleVO.avlRange !== 2
  }
  // 校验优惠券
  const validateName = (rule, value, callback) => {
    if (value && value.length > 20) {
      callback('优惠券最多20个字')
    } else {
      callback()
    }
  }
  // 选择商品添加数据到已排除商品或者已选择商品列表
  const onProductSelectorChange = (selectedRowKeys, selectedRows) => {
    console.log(chosenProduct, selectedRows, 'selectedRows')
    selectedRows.map((item) => {
      item.name = item.name || item.productName
    })
    if (hasExclude()) {
      setExcludeProduct(unionArray(excludeProduct, selectedRows))
    } else {
      setChosenProduct(unionArray(chosenProduct, selectedRows))
    }
  }
  // 选择活动添加数据到已选择活动列表里
  const onActivitySelectorChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows)
    setActivityList(unionArray(activityList, selectedRows))
  }
  const handleSave = async () => {
    validateFields(async (err, fields) => {
      if (!err) {
        const urlSearch = new URLSearchParams(history.location.search)
        detail.ruleVO.rangeVOList = chosenProduct
        detail.ruleVO.avlValues = chosenProduct.map((item) => item.id).join(',')
        detail.baseVO = {
          ... detail.baseVO,
          ...fields,
          id: +urlSearch.get('id')
        }
        const res = await modifyCouponBaseInfo(detail)
        if (res) {
          message.success('编辑优惠券成功')
          history.goBack()
        }
      }
    })
  }
  // 取消
  const handleCancel = () => {
    history.goBack()
  }
  const showExportMessage = (res) => {
    props.alert({
      footer: false,
      content: (
        <div style={{ lineHeight: '30px', marginBottom: 20 }}>
          成功导入 <span className='success'>{res.successNo}</span> 条&nbsp;&nbsp;&nbsp;&nbsp;
          {res.excelAddress && (
            <span
              className='href'
              onClick={() => {
                APP.fn.download(res.excelAddress, '导入失败商品清单')
              }}
            >
              查看失败商品清单
            </span>
          )}
        </div>
      )
    })
  }
  return (
    <Card>
      <ProductSelector
        visible={productSelectorVisible}
        onCancel={() => setProductSelectorVisible(false)}
        onChange={onProductSelectorChange}
        getInstance={(ref) => {
          productSelector.current = ref
        }}
      />
      <ActivitySelector visible={activitySelectorVisible} onCancel={() => setActivitySelectorVisible(false)} onChange={onActivitySelectorChange} />
      <Form {...formItemLayout}>
        <Row>
          <Col offset={3}>
            <h2 className='form-title'>基本信息</h2>
          </Col>
        </Row>
        <Form.Item label='优惠券名称'>
          {getFieldDecorator('name', { initialValue: baseVO.name, rules: [{ required: true, message: '请输入优惠券名称', whitespace: true }, { validator: validateName }] })(<Input placeholder='例：国庆优惠券，最多20个字' />)}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: (ruleVO.avlRange === 2 || ruleVO.excludeProductVOList && ruleVO.excludeProductVOList.length > 0) ? 0 : undefined }}
          label='适用范围'
        >
          {formatAvlRange(ruleVO.avlRange)}
        </Form.Item>
        <Form.Item
          style={{
            // marginTop: ruleVO.avlRange === 2 ? -20 : 0,
            marginBottom: 0
          }}
          wrapperCol={formLeftButtonLayout}
        >
          {chosenProduct.length > 0 && (
            <Table
              style={{ width: '400px' }}
              rowKey='id'
              pagination={{
                pageSize: 5
              }}
              columns={ruleVO.avlRange === 2 ? columns.concat([{
                title: '操作',
                render: (text, record, index) => {
                  return (
                    <span
                      className='href'
                      onClick={() => {
                        chosenProduct.splice(index, 1)
                        setChosenProduct([...chosenProduct])
                      }}
                    >
                      删除
                    </span>
                  )
                }
              }]) : columns}
              // dataSource={ruleVO.rangeVOList}
              dataSource={chosenProduct}
            />
          )}
          <If condition={ruleVO.avlRange === 2}>
            <span
              className='href mr8'
              onClick={() => {
                setProductSelectorVisible(true)
                const keys = (chosenProduct || []).map((item) => item.id)
                productSelector.current.setState({
                  selectedRowKeys: keys
                })
              }}
            >
              选择商品
            </span>
            <span
              className='href mr8'
              onClick={() => {
                importShop().then((res) => {
                  const data = (res.data || []).map((val) => {
                    val.name = val.productName
                    return val
                  })
                  let num = chosenProduct.length
                  const arr = unionArray(chosenProduct, data)
                  num = arr.length - num
                  showExportMessage({
                    successNo: num,
                    excelAddress: res.excelAddress
                  })
                  setChosenProduct(arr)
                })
              }}
            >
              导入商品
            </span>
            <DownTemplate />
          </If>
        </Form.Item>
        {ruleVO.excludeProductVOList && ruleVO.excludeProductVOList.length > 0 && (
          <Form.Item label='已排除商品'>
            <Table
              style={{ width: '400px' }}
              pagination={{
                pageSize: 5
              }}
              rowKey='id'
              columns={columns}
              dataSource={ruleVO.excludeProductVOList}
            />
          </Form.Item>
        )}
        <Form.Item label='优惠券价值'>{formatFaceValue(ruleVO)}</Form.Item>
        <Form.Item label='发放总量'>
          <Row type='flex'>
            <Col>{getFieldDecorator('inventory', { initialValue: baseVO.inventory, rules: [{ required: true, message: '请输入发放总量' }] })(<InputNumber min={baseVO.inventory} max={10000000} />)}</Col>
            <Col className='ml10'>张</Col>
          </Row>
          <p>修改优惠券总量时只能增加不能减少，请谨慎设置</p>
        </Form.Item>
        <Row>
          <Col offset={3}>
            <h2 className='form-title'>使用规则</h2>
          </Col>
        </Row>
        <Form.Item label='领取时间'>{formatDateRange(ruleVO)}</Form.Item>
        <Form.Item label='使用时间'>{formatUseTime(ruleVO)}</Form.Item>
        <Form.Item label='领取人限制'>{formatReceiveRestrict(ruleVO.receiveRestrict)}</Form.Item>
        <Form.Item label='每人限领次数'>{ruleVO.restrictNum}张</Form.Item>
        <Form.Item label='每日限领次数'>{ruleVO.dailyRestrict ? `${ruleVO.dailyRestrict}张` : '无'}</Form.Item>
        <Form.Item label='使用平台'>{formatPlatformRestrict(ruleVO.platformRestrict)}</Form.Item>
        {ruleVO.receivePattern === 1 && <Form.Item label='发券控制'>仅支持手动发券</Form.Item>}
        {ruleVO.receivePattern !== 1 && (<Form.Item label='商详显示'>{ruleVO.showFlag === 1 ? '显示' : '不显示'}</Form.Item>)}
        <Form.Item label='优惠券说明'>
          {getFieldDecorator('description', { initialValue: baseVO.description })(<TextArea placeholder='显示在优惠券下方，建议填写限制信息，如美妆个户、食品保健可用，仅团长专区商品可用等等（选填）' />)}
        </Form.Item>
        <Form.Item label='优惠券备注'>
          {getFieldDecorator('remark', { initialValue: baseVO.remark })(<TextArea placeholder='备注优惠券信息，不会在用户端显示（选填）' />)}
        </Form.Item>
        <Form.Item wrapperCol={formLeftButtonLayout}>
          <Button type='primary' onClick={handleSave}>保存</Button>
          <Button className='ml20' onClick={handleCancel}>取消</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

CouponInfo.propTypes = {
  alert: PropTypes.func,
  form: PropTypes.object,
  history: PropTypes.object
}

export default Form.create({ name: 'coupon-info' })(Alert(CouponInfo))