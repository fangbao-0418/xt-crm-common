import React from 'react'
import { Input, Button, Checkbox, Popconfirm } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import If from '@/packages/common/components/if'
import classNames from 'classnames'
import styles from './style.module.styl'
import { getFieldsConfig } from './config'
import * as api from './api'
import { SceneItem } from './interface'

interface State {
  dataSource: SceneItem[]
  selectIndex: number
  loading: boolean
}

class Main extends React.Component<{}, State> {
  public state: State = {
    dataSource: [],
    selectIndex: -2,
    loading: false
  }
  public form: FormInstance
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    return api.fetchSceneList().then((res) => {
      const records: SceneItem[] = res?.records || []
      this.setState({
        dataSource: records
      })
      return records
    })
  }
  public addScene = () => {
    const { dataSource } = this.state
    if (dataSource.length >= 10) {
      APP.error('最多可添加10个场景')
      return
    }
    this.form.reset()
    this.setState({
      selectIndex: -1
    })
    // this.save()
  }
  public initValue (index: number) {
    const dataSource = this.state.dataSource
    const item = dataSource[index]
    api.fetchSceneDetail(item.id).then((res) => {
      const productCategoryVOS = (res.productCategoryVOS || []).map((item: { id: any, name: string }) => {
        return {
          id: item.id,
          title: item.name
        }
      })
      this.form.setValues({
        ...res,
        productCategoryVOS
      })
    })
    this.setState({
      selectIndex: index
    })
  }
  public save () {
    this.form.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      const productCategoryVOS = values.productCategoryVOS || []
      const res = {
        name: values.name,
        sort: values.sort,
        showType: 7,
        productCategoryVOS: productCategoryVOS.map((item: any) => {
          return {
            id: item.id,
            name: item.title,
            type: 2
          }
        })
      }
      let p: Promise<any>
      const { selectIndex, dataSource } = this.state
      if (selectIndex >= 0) {
        const record = dataSource[selectIndex]
        p = api.updateScene({
          ...res,
          id: record.id
        }).then(() => {
          APP.success('修改成功')
          this.fetchData().then((res) => {
            const index = res.findIndex((item) => {
              return item.id === record.id
            })
            this.setState({
              selectIndex: index
            })
          })
        })
      } else {
        p = api.addScene({
          ...res
        }).then((record) => {
          APP.success('添加成功')
          this.fetchData().then((res) => {
            const index = res.findIndex((item) => {
              return item.id === record.id
            })
            this.setState({
              selectIndex: index
            })
          })
        })
      }
    })
  }
  public remove () {
    const { dataSource, selectIndex } = this.state
    const record = dataSource[selectIndex]
    api.removeScene(record.id).then(() => {
      this.setState({
        selectIndex: -2
      })
      this.fetchData()
    })
  }
  public render () {
    const { dataSource, selectIndex } = this.state
    return (
      <div>
        <h3>场景管理</h3>
        <div>
          <div className={styles.tbtns}>
            {
              dataSource.map((item, index) => (
                <div
                  key={index}
                  className={classNames(styles.tbtn, { [styles.active]: selectIndex === index })}
                  onClick={() => {
                    this.initValue(index)
                  }}
                >
                  {item.name}
                </div>
              ))
            }
            <div
              className={classNames(styles.tbtn, styles.add)}
              onClick={this.addScene}
            >
              +新增场景
            </div>
          </div>

        </div>
        <div
          className={styles.content}
          style={{ display: selectIndex > -2 ? '' :'none' }}
        >
          <Form
            className={styles.form}
            config={getFieldsConfig()}
            getInstance={(ref) => {
              this.form = ref
            }}
          >
            <FormItem name='name' verifiable />
            <FormItem name='sort' verifiable />
            <FormItem required name='productCategoryVOS' verifiable />
          </Form>
        </div>
        <If condition={selectIndex > -2}>
          <div
            className='text-center'
          >
            {selectIndex > -1 && (
              <Popconfirm
                title='确定是否删除该场景吗？'
                onConfirm={() => {
                  this.remove()
                }}
              >
                <Button
                  //
                  className='mr10'
                >
                  删除
                </Button>
              </Popconfirm>
            )}
            <Button
              type='danger'
              onClick={() => {
                this.save()
              }}
            >
              保存
            </Button>
          </div>
        </If>
      </div>
    )
  }
}
export default Main
