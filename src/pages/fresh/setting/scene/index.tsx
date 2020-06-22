import React from 'react'
import { Input, Button, Checkbox, Popconfirm } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
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
      console.log(values, 'values')
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
        })
      }
      // p.then(() => {
      //   this.fetchData()
      // })
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
            {/* <Popconfirm
              title='确认发布icon吗'
              onConfirm={this.toPublish}
            >
              <Button
                type='primary'
                className={styles.release}
              >
                发布
              </Button>
            </Popconfirm> */}
          </div>

        </div>
        <div
          className={styles.content}
          // style={{ display: selectIndex > -2 ? '' :'none' }}
        >
          <Form
            className={styles.form}
            config={getFieldsConfig()}
            getInstance={(ref) => {
              this.form = ref
            }}
          >
          </Form>
        </div>
        <div
          className='text-center'
        >
          <Button
            //
            className='mr10'
          >
            删除
          </Button>
          <Button
            type='danger'
            onClick={() => {
              this.save()
            }}
          >
            保存
          </Button>
        </div>
      </div>
    )
  }
}
export default Main
