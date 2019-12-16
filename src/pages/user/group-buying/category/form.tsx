import React from 'react'
import { Card, Checkbox, Button, Icon } from 'antd'
import Form, { FormInstance, FormItem} from '@/packages/common/components/form'
import styles from './style.module.styl'
import { cloneDeep } from 'lodash'
import classnames from 'classnames'
import CategoryModal from './components/CategorySelector'
import ActivityModal from './components/ActivitySelector'
interface SelectedRowOpts {
  selectedRowKeys: string[] | number[]
  selectedRows: any[]
}
interface State {
  checkedVals: any[],
  selectedRowOpts: SelectedRowOpts
  cateText: any[]
  activityVisible: boolean,
  categoryVisible: boolean
}
class Main extends React.Component<any, State> {
  public form: FormInstance
  public state: State = {
    cateText: [],
    checkedVals: [],
    selectedRowOpts: {
      selectedRowKeys: [],
      selectedRows: []
    },
    activityVisible: false,
    categoryVisible: false
  }
  public constructor (props: any) {
    super(props)
    this.handleSave = this.handleSave.bind(this)
  }
  public componentDidMount () {
    this.form.setValues({
      display: 1
    })
  }
  public handleSave () {
    this.form.props.form.validateFields((err, vals) => {
      if (!err) {
        console.log(vals)
      }
    })
  }
  public render () {
    const {
      checkedVals,
      selectedRowOpts,
      cateText,
      categoryVisible,
      activityVisible
    } = this.state 
    return (
      <Card title='编辑分类'>
        <CategoryModal
          visible={categoryVisible}
          cateText={cateText}
          onOk={(cateText: any[]) => {
            this.setState({
              cateText,
              categoryVisible: false
            })
          }}
          onClose={() => this.setState({ categoryVisible: false})}
        />
        <ActivityModal
          selectedRowOpts={selectedRowOpts}
          visible={activityVisible}
          onOk={(selectedRowOpts: SelectedRowOpts) => {
            this.setState({
              activityVisible: false,
              selectedRowOpts
            })
          }}
          onClose={() => this.setState({ activityVisible: false })}
        />
        <Form
          getInstance={ref => this.form = ref}
          addonAfterCol={{offset: 4}}
          addonAfter={
            <FormItem>
              <Button type='primary' onClick={this.handleSave}>保存</Button>
            </FormItem>
          }
        >
          <FormItem
            name='name'
            label='团购会分类名称'
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                required: true,
                message: '请输入团购会分类名称'
              }]
            }}
            controlProps={{
              style: {
                width: 172
              }
            }}
          />
          <FormItem
            name='sort'
            type='number'
            label='排序'
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                required: true,
                message: '请输入排序'
              }]
            }}
            controlProps={{
              style: {
                width: 172
              },
              min: 0
            }}
          />
          <FormItem
            name='display'
            type='radio'
            label='是否显示'
            options={[{
              label: 'A',
              value: 1
            }, {
              label: 'B',
              value: 2
            }]}
          />
          <FormItem
            label='关联商品'
            required
            inner={(form) => {
              return form.getFieldDecorator('relatedProduct', {
                rules: [{
                  required: true,
                  message: '请选择关联活动'
                }]
              })(
                <Checkbox.Group
                  onChange={(checkedVals) => {
                    console.log('checkedVals => ', checkedVals)
                    this.setState({
                      checkedVals
                    })
                  }
                }>
                  <Checkbox value={1}>关联类目</Checkbox>
                  {checkedVals.includes(1) && (
                    <div className={classnames(styles['intf-cat-rebox'], 'mt10')}>
                      {cateText.map((item: any, index: number) => {
                        return (
                          <div className={styles['intf-cat-reitem']} key={index}>
                            {item.name}
                            <span
                              className={styles['close']}
                              onClick={() => {
                                const copyCateText = cloneDeep(cateText)
                                copyCateText.splice(index, 1)
                                this.setState({
                                  cateText: copyCateText
                                })
                              }}
                            >
                              <Icon type='close' />
                            </span>
                          </div>
                        )
                      })}
                      <Button
                        type='link'
                        onClick={() => this.setState({ categoryVisible: true })}
                      >
                        +添加类目
                      </Button>
                    </div>
                  )}
                  <Checkbox value={2}>关联活动</Checkbox>
                  {checkedVals.includes(2) && (
                      <div className={classnames(styles['intf-cat-rebox'], 'mt10')}>
                        {selectedRowOpts.selectedRows.map((item: any, index: number) => {
                        return (
                          <div className={styles['intf-cat-reitem']} key={index}>
                            {item.title}
                            <span
                              className={styles['close']}
                              onClick={() => {
                                const copySelectedRowOpts = cloneDeep(selectedRowOpts)
                                copySelectedRowOpts.selectedRows.splice(index, 1)
                                copySelectedRowOpts.selectedRowKeys.splice(index, 1)
                                this.setState({
                                  selectedRowOpts: copySelectedRowOpts
                                })
                              }}
                            >
                              <Icon type='close' />
                            </span>
                          </div>
                        )
                      })}
                      <Button
                        type='link'
                        onClick={() => {
                          this.setState({
                            activityVisible: true
                          })
                        }}>
                        +添加活动
                      </Button>
                    </div>
                  )}
                </Checkbox.Group>
              )
            }}
          />
        </Form>
      </Card>
    )
  }
}

export default Main