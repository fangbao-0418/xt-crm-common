import React from 'react'
import SearchFetch from '@/components/search-fetch'
import SelectFetch from '@/packages/common/components/select-fetch'
import UploadView from '@/components/upload'
import { OptionProps } from '@/packages/common/components/form/index'
import { OrderStatusEnum, MemberTypeEnum, PayTypeEnum, CompensatePayTypeEnum } from '../config'
import * as api from '../api'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      operateType: {
        label: '处理方式',
        type: 'radio',
        controlProps: {
          style: {
            width: 236
          }
        },
        options: [{
          label: '同意',
          value: 3
        }, {
          label: '拒绝',
          value: 2
        }],
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '处理方式必须选择' }
          ]
        }
      },
      responsibilityType: {
        label: '责任归属',
        type: 'select',
        options: [{
          label: '商家',
          value: 10
        }, {
          label: '平台',
          value: 20
        }, {
          label: '仓配',
          value: 30
        }, {
          label: '客服',
          value: 40
        }],
        controlProps: {
          allowClear: false
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '请选择责任归属' }
          ]
        }
      },
      compensateAmount: {
        type: 'number',
        label: '金额修改',
        controlProps: {
          style: {
            width: 236
          }
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '金额修改不能为空' }
          ]
        }
      },
      couponCode: {
        label: '优惠券',
        inner: (form) => {
          return form.getFieldDecorator('couponCode', {
            rules: [
              { required: true, message: '优惠券必须选择' }
            ]
          })(
            <SelectFetch
              allowClear={false}
              showSearch
              style={{ width: '100%' }}
              optionFilterProp='children'
              filterOption={(input, option) => {
                return (option.props.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
              placeholder='请选择'
              fetchData={() => {
                return api.getCouponsAllList({ orderBizType: 0 }).then((res: any) => {
                  return (res || []).map((item: any) => {
                    const result = item.faceValue.split(':')
                    return {
                      label: `满${(result[0] / 100) || 0}减${(result[1] / 100) || 0}`,
                      value: item.code
                    }
                  })
                })
              }}
            />
          )
        }
      },
      transferEvidenceImgs: {
        label: '补偿凭证',
        inner: (form) => {
          return form.getFieldDecorator('transferEvidenceImgs', {
            rules: [
              {
                required: true,
                message: '请上传补偿凭证'
              }
            ]
          })(
            <UploadView
              ossType='cos'
              placeholder='请上传'
              listType='picture-card'
              listNum={3}
              size={2}
            />
          )
        }
      },
      illustrate: {
        type: 'textarea',
        label: '备注说明',
        formItemProps: {
          extra: '1111'
        },
        controlProps: {
          maxLength: 200
        }
      },
      receiptorAccountName: {
        label: '姓名',
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '姓名不能为空' }
          ]
        }
      },
      receiptorAccountNo: {
        label: '转账账号',
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '转账账号不能为空' }
          ]
        }
      }
    }
  }
  return defaultConfig
}
/* 申请信息 */
export function getApplInfo (detail: any) {
  return [
    {
      label: '补偿原因',
      value: detail.reasonName || '-',
      span: 1,
      type: 'text'
    },
    {
      label: '发起人',
      value: detail.creatorName || '-',
      span: 1,
      type: 'text'
    },
    {
      label: '补偿类型',
      value: detail.compensatePayName,
      span: 1,
      type: 'text'
    },
    {
      label: '补偿归属',
      value: detail.responsibilityName,
      span: 1,
      type: 'text'
    },
    {
      label: '补偿金额',
      value: APP.fn.formatMoney(detail.compensateAmount),
      span: 2,
      type: 'text'
    },
    ...(
      CompensatePayTypeEnum['支付宝转账'] === detail.compensatePayType
        ? [
          {
            label: '转账方式',
            value: '支付宝',
            span: 2,
            type: 'text'
          },
          {
            label: '姓名',
            value: detail.receiptorAccountName || '-',
            span: 2,
            type: 'text'
          },
          {
            label: '转账账号',
            value: detail.receiptorAccountNo || '-',
            span: 2,
            type: 'text'
          }
        ] : []
    ),
    ...(
      CompensatePayTypeEnum['微信转账'] === detail.compensatePayType
        ? [
          {
            label: '转账方式',
            value: '微信转账',
            span: 2,
            type: 'text'
          },
          {
            label: '微信昵称',
            value: detail.receiptorAccountName || '-',
            span: 2,
            type: 'text'
          }
        ] : []
    ),
    ...(
      CompensatePayTypeEnum['优惠券'] === detail.compensatePayType
        ? [
          {
            label: '优惠券名称',
            value: detail?.couponDetail?.name || '-',
            span: 2,
            type: 'text'
          },
          {
            label: '有效期',
            value: detail?.couponDetail?.effectiveTime || '-',
            span: 2,
            type: 'text'
          }
        ] : []
    ),
    {
      label: '补偿凭证',
      value: detail.transferEvidenceImg ? JSON.parse(detail.transferEvidenceImg) : [],
      span: 2,
      type: 'image'
    },
    {
      label: '补偿说明',
      value: detail.illustrate || '-',
      span: 2,
      type: 'text'
    }
  ]
}
/* 订单信息 */
export function getOrderInfo (detail: any) {
  return [
    {
      label: '子订单号',
      value: detail.childOrderCode,
      span: 1,
      type: 'text'
    },
    {
      label: '订单状态',
      value: OrderStatusEnum[detail.orderInfoVO?.orderStatus],
      span: 1,
      type: 'text'
    },
    {
      label: '订单来源',
      value: detail.orderInfoVO?.platform || '-',
      span: 1,
      type: 'text'
    },
    {
      label: '买家名称',
      value: detail.orderInfoVO?.consignee || '-',
      span: 1,
      type: 'text'
    },
    {
      label: '联系电话',
      value: detail.orderInfoVO?.consigneePhone,
      span: 2,
      type: 'text'
    },
    {
      label: '收货信息',
      value: detail.orderInfoVO?.address || '-',
      span: 3,
      type: 'text'
    },
    {
      label: '用户备注',
      value: detail.orderInfoVO?.remark || '-',
      span: 1,
      type: 'text'
    },
    {
      label: '会员等级',
      value: MemberTypeEnum[detail.orderInfoVO?.orderMemberType] || '-',
      span: 2,
      type: 'text'
    },
    {
      label: '支付方式',
      value: PayTypeEnum[detail.orderInfoVO?.payType] || '-',
      span: 1,
      type: 'text'
    },
    {
      label: '支付时间',
      value: APP.fn.formatDate(detail.orderInfoVO?.payTime) || '-',
      span: 1,
      type: 'text'
    },
    {
      label: '交易流水号',
      value: detail.orderInfoVO?.paymentNumber || '-',
      span: 1,
      type: 'text'
    }
  ]
}
/* 物流信息 */
export function getLogisticsInfo (detail: any) {
  return detail.orderInfoVO?.expressVO || []
}
/* 商品信息 */
export function getGoodsInfo (detail: any) {
  const orderInfoVO = detail.orderInfoVO
  if (!orderInfoVO) {
    return []
  }
  return [
    {
      skuName: orderInfoVO.skuName,
      productImage: orderInfoVO.productImage,
      productId: orderInfoVO.productId,
      properties: orderInfoVO.properties,
      storeName: detail.storeName || '-',
      salePrice: orderInfoVO.salePrice,
      quantity: orderInfoVO.quantity,
      saleTotalPrice: orderInfoVO.saleTotalPrice,
      faceValue: orderInfoVO.faceValue,
      discountPrice: orderInfoVO.discountPrice,
      couponPrice: orderInfoVO.couponPrice,
      preferentialTotalPrice: orderInfoVO.preferentialTotalPrice,
      promotionReducePrice: orderInfoVO.promotionReducePrice
    }
  ]
}
/* 审核信息 */
export function getAuditInfo (detail: any) {
  return detail.auditList || []
}
/* 结果信息 */
export function getResultInfo (detail: any) {
  return [
    {
      label: '补偿金额',
      value: APP.fn.formatMoney(detail.compensateAmount),
      span: 1,
      type: 'text'
    },
    {
      label: '转账完成时间',
      value: APP.fn.formatDate(detail.compensateTime) || '-',
      span: 1,
      type: 'text'
    },
    {
      label: '转账凭证',
      value: detail.thirdTransferSn || '-',
      span: 1,
      type: 'text'
    }
  ]
}
