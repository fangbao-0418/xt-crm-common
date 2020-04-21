import React from 'react'
import { Form, FormItem, SelectFetch } from '@/packages/common/components'
import { Card, Row, Col, Button } from 'antd'
import { defaultConfig, NAME_SPACE } from './config'
import styles from './style.module.scss'
import UploadView from '@/components/upload'
import CitySelect from '@/components/city-select'
import { FormInstance } from '@/packages/common/components/form'
import If from '@/packages/common/components/if'
import { addShop, updateShop, getShopDetail, getTypeEnum, refuse, pointCenterList } from './api'
import { RouteComponentProps } from 'react-router'
import { parseQuery } from '@/util/utils'
import Image from '@/components/Image'
import { RecordProps } from './interface'

type Props = RouteComponentProps<{id: string}>;

interface StoreFormState {
  address: string
  pictrueUrl: any[]
  /** 未知 -1, 新建 = 1, 上线 = 2, 下线 = 3, 待审核 = 4, 驳回 = 5 */
  status: -1 | 1 | 2 | 3 | 4 | 5
  record: Partial<RecordProps>
  readonly: boolean
}
class StoreForm extends React.Component<Props, StoreFormState> {
  readonly: boolean = !!(parseQuery() as any).readOnly
  state: StoreFormState = {
    address: '',
    pictrueUrl: [],
    status: -1,
    record: {},
    readonly: this.readonly
  }
  form: FormInstance;
  id: string = '-1'
  provinceName: string;
  cityName: string;
  areaName: string;
  constructor (props: Props) {
    super(props)
    this.id = props.match.params.id
  }
  componentDidMount () {
    this.id !== '-1' && this.fetchData()
  }
  fetchData () {
    getShopDetail(this.id).then(res => {
      this.provinceName = res.provinceName
      this.cityName = res.cityName
      this.areaName = res.areaName
      this.setState({
        address: res.provinceName + '' + res.cityName + '' + res.areaName,
        pictrueUrl: res.pictrueUrl,
        status: res.status,
        record: res || {},
        readonly: this.readonly || res.status === 5
      })
      this.form.setValues(res)
    })
  }
  handleSave = () => {
    this.form.props.form.validateFields((err, vals) => {
      if (!err) {
        // 合并省市区名称
        vals = Object.assign(vals, {
          provinceName: this.provinceName,
          cityName: this.cityName,
          areaName: this.areaName
        })
        const isAdd = this.id === '-1'
        const promiseResult = isAdd ? addShop(vals) : updateShop({ ...vals, id: this.id })
        promiseResult.then((res: any) => {
          if (res) {
            if (this.state.status === 4) {
              APP.success('审核通过')
            }
            APP.history.push('/fresh/store')
          }
        })
      }
    })
  }
  refuse = () => {
    refuse(this.id).then(() => {
      APP.success('拒绝操作已完成')
      this.fetchData()
    })
  }
  render () {
    const { status, record, readonly } = this.state
    return (
      <Form
        readonly={readonly}
        getInstance={ref => this.form = ref}
        namespace={NAME_SPACE}
        config={defaultConfig}
        addonAfter={(
          <div style={{ width: '60%' }}>
            <FormItem>
              <If condition={[-1, 1, 2, 3].indexOf(status) > -1 && !readonly}>
                <Button type='primary' onClick={this.handleSave} className='mr10'>保存</Button>
              </If>
              <If condition={[4].indexOf(status) > -1 && !readonly}>
                <Button type='primary' onClick={this.handleSave} className='mr10'>通过</Button>
                <Button type='danger' onClick={this.refuse} className='mr10'>不通过</Button>
              </If>
              <Button
                type='primary'
                onClick={() => {
                  APP.history.push('/fresh/store')
                }}>
                  返回
              </Button>
            </FormItem>
          </div>
        )}
      >
        <Card title='门店基础信息'>
          <div style={{ width: '60%' }}>
            <FormItem name='code' type='text' hidden={this.id === '-1'} />
            <FormItem
              verifiable
              name='name'
            />
            <FormItem
              verifiable
              // name='type'
              label='门店类型'
              inner={(form) => {
                return form.getFieldDecorator(
                  'type',
                  {}
                )(<SelectFetch
                  readonly={readonly}
                  fetchData={getTypeEnum}
                />)
              }}
            />
            <FormItem
              verifiable
              name='memberPhone'
              disabled={this.id !== '-1'}
            />
            <FormItem
              verifiable
              // name='type'
              label='区域仓'
              inner={(form) => {
                return form.getFieldDecorator(
                  'areaWarehouseCode',
                  {}
                )(<SelectFetch
                  readonly={readonly}
                  fetchData={pointCenterList}
                />)
              }}
            />
            <If condition={!!(record.inviteShopName || record.inviteShopPhone)}>
              <FormItem
                readonly
                name='inviteShopName'
              />
              <FormItem
                readonly
                name='inviteShopPhone'
              />
            </If>
          </div>
        </Card>
        <Card title='门店信息'>
          <div style={{ width: '60%' }}>
            <FormItem
              label='门店地址'
              required
              inner={(form) => {
                return readonly ? this.state.address : form.getFieldDecorator('address', {
                  rules: [{
                    required: true,
                    message: '请选择省市区'
                  }]
                })(<CitySelect
                  getSelectedValues={(value: any[]) => {
                    if (Array.isArray(value) && value.length === 3) {
                      this.provinceName = value[0].label
                      this.cityName = value[1].label
                      this.areaName = value[2].label
                    }
                  }}
                />)
              }}
            />
            <FormItem
              label='详细地址'
              name='detailAddress'
              type='textarea'
              controlProps={{
                placeholder: '请输入详细地址，不能超过60字符',
                maxLength: 60
              }}
              verifiable
              fieldDecoratorOptions={{
                rules: [{
                  required: true,
                  message: '请输入详细地址'
                }]
              }}
            />
            <div style={{ display: 'flex' }}>
              <FormItem
                type='number'
                label='纬度'
                name='latitude'
                verifiable
                style={{ width: '50%' }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                controlProps={{
                  precision: 6,
                  style: {
                    width: 250,
                    marginLeft: 4
                  },
                  max: 180,
                  min: -180
                }}
                fieldDecoratorOptions={{
                  rules: [{
                    validator: async (rules, value) => {
                      if ([undefined, null].indexOf(value) > -1) {
                        throw new Error('请输入纬度')
                      }
                      if (value < -180) {
                        throw new Error('纬度不能低于负180度')
                      }
                      if (value > 180) {
                        throw new Error('纬度不能超过正180度')
                      }
                      return value
                    }
                  }]
                }}
              />
              <FormItem
                label='经度'
                name='longitude'
                type='number'
                verifiable
                style={{
                  marginLeft: 30,
                  width: '50%'
                }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                controlProps={{
                  precision: 6,
                  style: {
                    width: 250,
                    marginLeft: 4
                  },
                  max: 180,
                  min: -180
                }}
                fieldDecoratorOptions={{
                  rules: [{
                    validator: async (rules, value) => {
                      if ([undefined, null].indexOf(value) > -1) {
                        throw new Error('请输入经度')
                      }
                      if (value < -180) {
                        throw new Error('经度不能低于负180度')
                      }
                      if (value > 180) {
                        throw new Error('经度不能超过正180度')
                      }
                      return value
                    }
                  }]
                }}
              />
            </div>
            <FormItem
              verifiable
              name='phone'
            />
            <FormItem
              verifiable
              name='pointDesc'
            />
            <FormItem
              label='门店图片'
              inner={(form) => {
                const { pictrueUrl } = this.state
                return readonly ? (pictrueUrl.length > 0 ? <Image src={pictrueUrl[0] && pictrueUrl[0].url} />: '') : (
                  <div className={styles['input-wrapper']}>
                    <div className={styles['input-wrapper-content']}>
                      {form.getFieldDecorator('pictrueUrl')(<UploadView
                        placeholder='上传门店图片'
                        listType='picture-card'
                        listNum={1}
                        size={0.3}
                      />)}
                    </div>
                    <div className={styles['input-wrapper-placeholder']}>（建议720*500px，300kb以内）</div>
                  </div>
                )
              }}
            />
          </div>
        </Card>
      </Form>
    )
  }
}

export default StoreForm