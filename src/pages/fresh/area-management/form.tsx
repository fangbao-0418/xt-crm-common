import React from 'react'
import { Form, FormItem } from '@/packages/common/components'
import { Card, Button } from 'antd'
import { NAME_SPACE, defaultConfigForm } from './config'
import UploadView from '@/components/upload'
import { FormInstance } from '@/packages/common/components/form'
import If from '@/packages/common/components/if'
import { addUpdateArea, getDetail, getDistricts } from './api'
import { RouteComponentProps } from 'react-router'
import { parseQuery } from '@/util/utils'
import { RecordProps } from './interface'
import SaleArea from '../../../components/sale-area'

type Props = RouteComponentProps<{id: string}>;

interface StoreFormState {
  record: Partial<RecordProps>
  readonly: boolean
}
class AreaForm extends React.Component<Props, StoreFormState> {
  readonly: boolean = !!(parseQuery() as any).readOnly
  disabledDatas: string[]
  state: StoreFormState = {
    record: {},
    readonly: this.readonly
  }
  form: FormInstance;
  id: string = '-1'
  constructor (props: Props) {
    super(props)
    this.id = props.match.params.id
  }
  componentDidMount () {
    this.getDisabledDatas()
  }
  fetchData () {
    getDetail(this.id).then(res => {
      this.setState({
        record: res || {},
        readonly: this.readonly
      })
      this.form.setValues(res)
    })
  }
  getDisabledDatas () {
    getDistricts().then(res => {
      this.disabledDatas=['56468', '110101', '110102', '110103', '110104', '110105', '110106', '110107', '110108', '110109', '110111', '110112', '110113', '110114', '110115', '110116', '110117', '110118', '456461']
      this.id !== '-1' && this.fetchData()
    })
  }
  handleSave = () => {
    this.form.props.form.validateFields((err, vals) => {
      if (!err) {
        const isAdd = this.id === '-1'
        if (!isAdd) {
          vals.id=this.id
        }
        vals.districtIds = (vals.districtIds || []).map((item: { districtId: any }) => {
          return parseInt(item.districtId)
        })
        console.log(vals.trainImage[0])
        vals.trainImage = vals.trainImage[0].rurl
        const promiseResult = addUpdateArea(vals)
        promiseResult.then((res: any) => {
          if (res) {
            APP.success('保存成功')
            APP.history.push('/fresh/area')
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
            <FormItem name='id' type='text' hidden={this.id === '-1'} />
            <FormItem
              verifiable
              name='areaName'
            />
            <FormItem
              name='areaRemark'
            />
            <FormItem
              label='区域'
              required
              inner={(form) => {
                return form.getFieldDecorator('districtIds', {
                  rules: [{
                    validator: async (rules, value) => {
                      if (!value || Array.isArray(value) && value.length === 0) {
                        throw new Error('请选择区域')
                      }
                      return value
                    }
                  }]

                })(<SaleArea readOnly={readonly} title={'区域'} disabledDatas={this.disabledDatas} />)
              }
              } />
            <FormItem
              verifiable
              name='areaRuleDesc'
            />
            <FormItem
              verifiable
              name='limitCommonNum'
            />
            <FormItem
              verifiable
              name='limitSuperiorNum'
            />
            <FormItem
              verifiable
              name='limitInstructorNum'
            />
            <FormItem
              label='培训群二维码'
              required
              inner={(form) => {
                return (
                  <>
                    <div>
                      {form.getFieldDecorator(
                        'trainImage',
                        {
                          rules: [
                            {
                              validator: (rule, value, cb) => {
                                console.log(value)
                                if (!value) {
                                  cb('培训群二维码不能为空')
                                }
                                cb()
                              }
                            }
                          ]
                        }
                      )(
                        <UploadView
                          listType='picture-card'
                        />
                      )}
                    </div>
                  </>
                )
              }}
            />
            <FormItem
              verifiable
              name='answerUrl'
            />
          </div>
        </Card>
      </Form>
    )
  }
}

export default AreaForm