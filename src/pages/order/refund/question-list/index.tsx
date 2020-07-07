import React from 'react'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { ListPage, Alert } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { getUniqueId } from '@/packages/common/utils/index'
import { Button, Radio } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig } from './config'
import SearchFetch from '@/packages/common/components/search-fetch'
import BraftEditor from 'braft-editor'
import saveService from '../common/saveService'
import 'braft-editor/dist/index.css'
import * as api from './api'
interface Props extends AlertComponentProps {
}

interface Data {
  announcement: string
  applicationQuestion: any[]
  originalQuestion: any[]
}
interface State {
  /** 原始数据 */
  data: Data
  itemData: any
  /** 要展示的数据 */
  showDataSource: any[]
  searchTitle: string
}

class Main extends React.Component<Props, State> {
  public listpage: ListPageInstanceProps
  public data: Data = {
    announcement: '',
    applicationQuestion: [],
    originalQuestion: []
  }
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '问题标题',
    dataIndex: 'title',
    width: 300
  }, {
    title: '问题内容',
    dataIndex: 'content',
    render: (text) => {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: `<pre style="white-space: pre-wrap!important;">${text}</pre>`
          }}
        >
        </div>
      )
    }
  },
  {
    title: '操作',
    align: 'center',
    width: 200,
    render: (text, record) => {
      return (
        <div>
          <span
            className='href'
            onClick={this.operation(record)}
          >
            修改
          </span>
        </div>
      )
    }
  }]
  public state: State = {
    data: {
      announcement: '',
      applicationQuestion: [],
      originalQuestion: []
    },
    itemData: null,
    showDataSource: [],
    searchTitle: ''
  }
  public componentDidMount () {
    api.fetchQuestion().then(res => {
      this.data = res
      this.setState({
        data: Object.assign({ announcement: '', applicationQuestion: [], originalQuestion: [] }, res),
        showDataSource: res.originalQuestion || []
      })
    })
  }

  public refresh () {
    this.listpage.refresh()
  }
  public operation = (detail:any) => () => {
    if (this.props.alert) {
      let form: FormInstance
      const hide = this.props.alert({
        title: detail? '修改问题':'新增问题',
        width: 700,
        content: (
          <Form
            getInstance={(ref) => {
              form = ref
              ref.setValues({
                content: BraftEditor.createEditorState(null)
              })
            }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            config={getFieldsConfig()}
            mounted={() => {
              if (detail) {
                form.setValues({
                  ...detail,
                  multiText: BraftEditor.createEditorState(detail.content)
                })
              }
            }}
          >
            <FormItem
              label='问题标题'
              verifiable
              required
              name='title'
            />
            <FormItem
              label='标题字色'
              verifiable
              required
              name='fontSize'
            />
            <FormItem
              label='问题内容'
              inner={(form) => {
                return form.getFieldDecorator('multiText')(
                  <BraftEditor
                    onChange={(value) => {
                      value?.toHTML()
                    }}
                    style={{ height: 250, overflow: 'auto', border: '1px solid #d9d9d9', borderRadius: 4 }}
                    controls={['text-color', 'bold', 'italic', 'underline']}
                  />
                )
              }}
            />
          </Form>
        ),
        onOk: () => {
          if (form) {
            form.props.form.validateFields((err, values) => {
              debugger
              if (err) {
                return
              }
              const { title, fontSize, multiText } = values
              const saveContent = multiText.toHTML()
              const { originalQuestion, applicationQuestion } = this.state.data
              if (detail) {
                applicationQuestion.forEach((item) => {
                  item.question.forEach((questionItem: any) => {
                    if (questionItem.id === detail.id) {
                      questionItem = Object.assign(questionItem, {
                        title,
                        fontSize,
                        content: saveContent
                      })
                    }
                    questionItem.item.forEach((secondary: any) => {
                      if (secondary.id === detail.id) {
                        secondary = Object.assign(secondary, {
                          title,
                          fontSize,
                          content: saveContent
                        })
                      }
                    })
                  })
                })
                originalQuestion.forEach((item, index) => {
                  if (item.id === detail.id) {
                    item = Object.assign(item, {
                      title,
                      fontSize,
                      content: saveContent
                    })
                  }
                })
              } else {
                originalQuestion.unshift({
                  id: getUniqueId(),
                  title,
                  fontSize,
                  content: saveContent
                })
              }
              this.setState({
                data: { ...this.state.data, originalQuestion, applicationQuestion },
                showDataSource: originalQuestion
              }, () => {
                this.save()
              })
              hide()
            })
          }
        },
        onCancel: () => {
          hide()
        }
      })
    }
  }
  /**
   * 保存数据
   */
  save = () => {
    const { data } = this.state
    console.log(1111)
    saveService(data)
  }

  /**
   * 搜索
   *
   * @memberof Main
   */
  searchSubmit = () => {
    const { searchTitle } = this.state
    const originalQuestion = this.data.originalQuestion
    if (!searchTitle) {
      this.setState({
        showDataSource: originalQuestion
      })
      return
    }
    const filterRes = originalQuestion.filter(item => item.title === searchTitle)
    this.setState({
      showDataSource: filterRes
    })
  }

  /**
   * 重置搜索
   *
   * @memberof Main
   */
  searchReset = () => {
    this.setState({
      searchTitle: ''
    }, () => {
      this.searchSubmit()
      this.listpage.refresh(true)
    })
  }

  public render () {
    const { showDataSource, searchTitle } = this.state
    return (
      <div
        style={{
          background: '#FFFFFF'
        }}
      >
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          tableProps={{
            rowKey: 'id',
            dataSource: showDataSource
          }}
          onSubmit={this.searchSubmit}
          onReset={this.searchReset}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={this.operation(null)}
              >
                新增问题
              </Button>
            </div>
          )}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem
                name='title'
                inner={(form) => {
                  return form.getFieldDecorator('title')(
                    <SearchFetch
                      style={{ width: 300 }}
                      api={(areaName) => {
                        const { originalQuestion } = this.data
                        return new Promise((resolve, reject) => {
                          if (areaName) {
                            const res = originalQuestion.filter((item: any) => item.title.indexOf(areaName) !== -1).map((item: any) => ({ text: item.title, value: item.id }))
                            resolve(res)
                          }
                        })
                      }}
                      onChange={(v)=>{
                        const { originalQuestion } = this.data
                        const res = originalQuestion?.find((item: { id: any }) => {
                          return String(item.id) === String(v)
                        })
                        this.setState({
                          searchTitle: res?.title || ''
                        })
                      }}
                      placeholder='请输入问题标题关键字下拉搜索'
                    />
                  )
                }} />
            </>
          )}
        />
      </div>
    )
  }
}
export default Alert(Main)
