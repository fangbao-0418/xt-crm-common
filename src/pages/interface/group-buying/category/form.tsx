import React from 'react'
import { Card, Button, Icon } from 'antd'
import Form, { FormInstance, FormItem} from '@/packages/common/components/form'
import styles from './style.module.styl'
import { cloneDeep } from 'lodash'
import ActivityModal from './components/ActivitySelector'
import { processCategory, queryCategoryDetail } from './api'
interface SelectedRowOpts {
  selectedRowKeys: string[] | number[]
  selectedRows: any[]
}
interface State {
  selectedRowOpts: SelectedRowOpts
  activityVisible: boolean
}
class Main extends React.Component<any, State> {
  public form: FormInstance
  public id: number = -1
  public state: State = {
    selectedRowOpts: {
      selectedRowKeys: [],
      selectedRows: []
    },
    activityVisible: false
  }
  public componentDidMount () {
    this.id = +this.props.match.params.id
    if (this.id !== -1) {
      this.fetchData()
    }
    this.form.setValues({
      status: 1
    })
  }

  /** 获取详情 */
  public async fetchData () {
    const res = await queryCategoryDetail(this.id)
    console.log('detail => ', res)
    this.form.setValues(res)
    if (!Array.isArray(res.productCategoryVOS)) res.productCategoryVOS = []
    this.setState({
      selectedRowOpts:{
        selectedRowKeys: res.productCategoryVOS.map((v: any) => v.id),
        selectedRows: res.productCategoryVOS.map((v: any) => ({id: v.id, title: v.name}))
      }
    })
  }
  
  public handleSave = () => {
    const { selectedRowOpts } = this.state 
    this.form.props.form.validateFields(async (err, vals) => {
      if (!err) {
        const res = await processCategory({
          ...vals,
          showType: 3,
          productCategoryVOS: selectedRowOpts.selectedRows.map((v: any) => ({
            id: v.id,
            level: 1,
            name: v.title,
            type: 2
          })),
          id: this.id !== -1 ? this.id : undefined
        })
        if (res) {
          APP.success(`${this.id !== -1 ? '编辑' : '新建'}分类成功`)
          this.goback()
        }
      }
    })
  }


  public goback () {
    APP.history.go(-1)
  }

  public render () {
    const {
      selectedRowOpts,
      activityVisible,
    } = this.state 
    return (
      <Card title='编辑分类'>
        <ActivityModal
          processPayload={(payload: any) => Object.assign(payload, { type: 9})}
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
              <Button className='ml10' onClick={this.goback}>取消</Button>
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
            name='status'
            type='radio'
            label='是否显示'
            options={[{
              label: 'A',
              value: 1
            }, {
              label: 'B',
              value: 0
            }]}
          />
          <FormItem
            label='关联活动'
            required
          >
            <div className={styles['intf-cat-rebox']}>
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
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Main