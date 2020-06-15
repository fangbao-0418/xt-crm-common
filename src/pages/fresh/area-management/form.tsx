import React from 'react'
import { Form, FormItem } from '@/packages/common/components'
import { Card, Button, Radio } from 'antd'
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
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
}
interface StoreFormState {
  record: Partial<RecordProps>
  readonly: boolean
  isAllArea: 0 | 1
}
class AreaForm extends React.Component<Props, StoreFormState> {
  readonly: boolean = !!(parseQuery() as any).readOnly
  disabledDatas: string[]
  state: StoreFormState = {
    record: {},
    readonly: this.readonly,
    isAllArea: 0
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
      res.districtIds=res.addressList
      this.setState({
        record: res || {},
        readonly: this.readonly,
        isAllArea: res?.isAllArea
      })
      this.form.setValues(res)
    })
  }
  getDisabledDatas () {
    getDistricts(this.id==='-1'?0:this.id).then(res => {
      const arr: string[]=[]
      if (res&&res.length>0) {
        res.map((item: string)=>{
          arr.push(item+'')
        })
      }
      this.disabledDatas=arr
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
        vals.trainImage = vals.trainImage[0].url||vals.trainImage
        vals.isAllArea = this.state.isAllArea
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
        {...formItemLayout}
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
              required={false}
              verifiable
              name='areaRemark'
            />
            <FormItem
              label='区域'
              required
              inner={(form) => {
                return (
                  <>
                    {form.getFieldDecorator('districtIds', {
                      rules: [{
                        validator: async (rules, value) => {
                          if (!value || Array.isArray(value) && value.length === 0) {
                            throw new Error('请选择区域')
                          }
                          return value
                        }
                      }]
                    })(
                      <SaleArea readOnly={readonly} title={'区域'} disabledDatas={readonly?[]:this.disabledDatas} />
                    )}
                    <div>
                      <Radio
                        checked={this.state.isAllArea == 1}
                        onClick={() => {
                          const isAllArea = this.state.isAllArea
                          this.setState({
                            isAllArea: isAllArea === 0 ? 1 : 0
                          })
                        }}
                      >
                        支持区域内跨三级地址开拓团长
                      </Radio>
                    </div>
                  </>
                )
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
                          fileType={['jpg', 'jpeg', 'gif', 'png']}
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