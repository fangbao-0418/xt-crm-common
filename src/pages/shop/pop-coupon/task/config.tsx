import React from 'react'
import moment from 'moment'
import { OptionProps } from '@/packages/common/components/form'
import { DatePicker } from 'antd'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      name: {
        type: 'input',
        label: '任务名称'
      },
      id: {
        type: 'input',
        label: '任务ID',
        controlProps: {
          type: 'number'
        }
      },
      receiveUserGroup: {
        type: 'select',
        label: '用户目标类型',
        controlProps: {
          style: {
            width: 150
          }
        },
        options: [
          { label: '全部用户', value: 0 },
          { label: '按用户等级', value: 1 },
          { label: '指定用户', value: 2 },
          { label: 'Excel文件上传', value: 3 }
        ]
      },
      startTime: {
        type: 'rangepicker',
        label: '发送时间',
        inner: (form) => {
          return form.getFieldDecorator('startTime')(
            <DatePicker.RangePicker
              defaultPickerValue={[moment().startOf('d')]}
              showTime
            />
          )
        }
      },
      code: {
        type: 'input',
        label: '优惠券编号'
      },
      status: {
        type: 'select',
        label: '状态',
        controlProps: {
          style: {
            width: 150
          }
        },
        options: [
          { label: '未开始', value: 0 },
          { label: '进行中', value: 1 },
          { label: '已完成', value: 2 },
          { label: '已停止', value: 3 },
          { label: '已失效', value: 4 }
        ]
      }
    }
  }
  return defaultConfig
}

/** 用户类型 */
export enum UserTypeEnum {
  全部用户 = 0,
  按用户等级 = 1,
  指定用户 = 2,
  Excel文件上传 = 3
}

/** 发送状态 */
export enum StatusEnum {
  未开始 = 0,
  进行中 = 1,
  已完成 = 2,
  已停止 = 3,
  已失效 = 4
}

export function getUserLevelText (ids: any[]) {
  const userMap: {[id: number]: string} = {
    0: '普通用户',
    10: '店长',
    20: '高级店长',
    30: '服务商',
    40: '管理员'
  }
  return ids.map((item: number) => {
    return userMap[item]
  }).join(',')
}