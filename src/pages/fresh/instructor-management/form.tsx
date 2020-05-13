import React from 'react'
import { Form, FormItem, SelectFetch } from '@/packages/common/components'
import { Card, Row, Col, Button } from 'antd'
import { NAME_SPACE, defaultConfigForm } from './config'
import styles from './style.module.scss'
import UploadView from '@/components/upload'
import CitySelect from '@/components/city-select'
import { FormInstance } from '@/packages/common/components/form'
import If from '@/packages/common/components/if'
import { addShop, updateShop, getShopDetail } from './api'
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
class AreaForm extends React.Component<Props, StoreFormState> {
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
  render () {
    const { readonly } = this.state
    return (
      <Form
        readonly={readonly}
        getInstance={ref => this.form = ref}
        namespace={NAME_SPACE}
        config={defaultConfigForm}
        addonAfter={(
          <div style={{ width: '60%' }}>
            <FormItem>
              <If condition={!readonly}>
                <Button type='primary' onClick={this.handleSave} className='mr10'>保存</Button>
              </If>
              <Button
                type='primary'
                onClick={() => {
                  APP.history.push('/fresh/area')
                }}>
                  返回
              </Button>
            </FormItem>
          </div>
        )}
      >
        <Card title='基本信息'>
          <div style={{ width: '60%' }}>
            <FormItem name='code' type='text' hidden={this.id === '-1'} />
            <FormItem
              verifiable
              name='name'
            />
            <FormItem
              verifiable
              name='inviteShopName'
            />
            <FormItem
              verifiable
              name='remark'
            />
            <FormItem
              verifiable
              name='rule'
            />
            <FormItem
              verifiable
              name='rule1'
            />
           
          </div>
        </Card>
      </Form>
    )
  }
}

export default AreaForm