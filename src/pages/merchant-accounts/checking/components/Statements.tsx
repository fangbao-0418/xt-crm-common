/** 结算单 */
import React from 'react'
import { Button } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'
import Upload, { formatValue } from '@/components/upload'
import SelectFetch from '@/packages/common/components/select-fetch'
import { GetListOnPageResponse } from '../interface'
import Area from './Area'
import If from '@/packages/common/components/if'
import * as api from '../api'
interface Props {
  selectedRows: GetListOnPageResponse[]
  onOk?: () => void
  onCancel?: () => void
}
interface State {
  /** 账户类型，2 支付宝，3 个人银行卡，4 对公银行账户 */
  type: 2 | 3 | 4
  /** 1-新账户 0-已有账户 */
  newAccount: 0 | 1
}
class Main extends React.Component<Props> {
  public form: FormInstance
  public state: State = {
    type: 2,
    newAccount: 1
  }
  public toAdd () {
    this.form.props.form.validateFields((err, values) => {
      if (err) {
        APP.error('请检查输入项')
        return
      }
      const area = values.area
      if (area) {
        values.province = area[0].name
        values.provinceId = Number(area[0].value)
        values.city = area[1].name
        values.cityId = Number(area[1].value)
      }
      delete values.area
      values.accIdList = this.props.selectedRows.map((item) => item.id)
      values.invoiceUrl = formatValue(values.invoiceUrl)
      api.addSettlement(values).then(() => {
        if (this.props.onOk) {
          this.props.onOk()
        }
      })
    })
  }
  public render () {
    const selectedRows = this.props.selectedRows
    const { type, newAccount } = this.state
    return (
      <div>
        <Form
          config={getFieldsConfig()}
          namespace='statements'
          formItemStyle={{
            marginBottom: 10
          }}
          labelCol={{span: 5}}
          wrapperCol={{span: 16}}
          getInstance={(ref) => {
            this.form = ref
          }}
        >
          <FormItem
            type='text'
            label='对账单ID'
            inner={() => {
              const text = selectedRows.map((item) => item.serialNo).join(',')
              return (
                <div
                  title={text}
                  style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  {text}
                </div>
              )
            }}
          />
          <FormItem name='currency' />
          <FormItem
            name='newAccount'
            label='收款账户'
            controlProps={{
              onChange: (e: any) => {
                this.setState({
                  newAccount: e.target.value
                })
              }
            }}
          />
          <If condition={newAccount === 0}>
            <FormItem
              verifiable
              label='收款账户'
              required
              inner={(form) => {
                return form.getFieldDecorator('accountId')(
                  <SelectFetch
                    fetchData={() => {
                      const { id } = this.props.selectedRows[0]
                      return api.fetchGatheringAccountList(id).then((res) => {
                        return res
                      })
                    }}
                  />
                )
              }}
            />
          </If>
          <If condition={newAccount === 1}>
            <FormItem
              name='accountType'
              verifiable
              controlProps={{
                onChange: (e: any) => {
                  this.setState({
                    type: e.target.value
                  })
                }
              }}
            />
            <FormItem name='accountName' />
            <FormItem name='accountCode' />
            <If condition={[1, 2].indexOf(type) === -1}>
              <FormItem name='bankName' verifiable />
            </If>
            <If condition={type === 4}>
              <FormItem
                label='银行所在地区'
                required
                inner={(form) => {
                  return form.getFieldDecorator('area', {
                    rules: [{
                      validator: (rule, value, cb) => {
                        console.log(value, '-----')
                        if (!value || value.length < 2) {
                          cb('请选择省市')
                        }
                        cb()
                      }
                    }]
                  })(
                    <Area />
                  )
                }}
              />
              <FormItem name='bankBranchName' verifiable />
            </If>
          </If>
          <FormItem
            label='发票凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('invoiceUrl')(
                    <Upload
                      listType='picture-card'
                      multiple
                    >
                    </Upload>
                  )}
                  <div style={{fontSize: 12, color: '#999'}}>- 支持png、jipg、jpeg格式，最多可上传5张图片，最大支持2MB</div>
                  <div style={{fontSize: 12, color: '#999'}}>- 添加文件和图片凭证，可提高审核效率哦～</div>
                </div>
              )
            }}
          />
        </Form>
        <hr style={{opacity: .3}} />
        <div className='text-right'>
          <Button
            className='mr10'
            onClick={() => {
              this.toAdd()
            }}
            type='primary'
          >
            确定
          </Button>
          <Button
            onClick={() => {
              if (this.props.onCancel) {
                this.props.onCancel()
              }
            }}
          >
            取消
          </Button>
        </div>
      </div>
    )
  }
}
export default Main
