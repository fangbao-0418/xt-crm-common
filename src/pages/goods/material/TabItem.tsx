import React from 'react'
import { Button, Switch, Modal, message } from 'antd'
import Image from '@/components/Image'
import Page from '@/components/page'
import If from '@/packages/common/components/if'
import { ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { uuid, replaceHttpUrl } from '@/util/utils'
import dateFns from 'date-fns'
import * as api from './api'
import Add from './add'
import AuditAndDetail from './audit'
import { defaultConfig } from './config'
import styles from './style.module.scss'

// 审核状态文案
enum enumAuditStatus {
  通过 = 1,
  未通过 = 2,
  待审核 = 3
}
// 审核状态文字颜色
enum enumAuditStatusColor {
  '#00A206' = 1,
  '#E30202' = 2,
  '#FFA551' = 3
}
const tableProps: any = {
  scroll: {
    x: true
  }
}

interface Props {
  status: string
}

type ActionType = 'edit' | 'view' | 'audit'

interface State {
  /** modal关闭状态 */
  modalVisible: boolean
  // 素材详情
  materialDetail: any
  // 是否审核
  actionType?: ActionType
  // 查看和审核弹窗关闭状态
  auditModalVisible: boolean
}
class MaterialTabItem extends React.Component<Props, State> {
  list: ListPageInstanceProps
  columns = [
    {
      title: '商品ID',
      width: 60,
      dataIndex: 'productId'
    },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      width: 80,
      render: (record: any) => (
        <Image
          style={{
            height: 100,
            width: 100,
            minWidth: 100
          }}
          src={replaceHttpUrl(record)}
          alt='主图'
        />
      )
    },
    {
      title: '商品名称',
      width: 120,
      dataIndex: 'productName'
    },
    {
      title: '内容',
      width: 100,
      dataIndex: 'content',
      render: (text: string) => {
        return (
          <div className={styles.content}>
            {text}
          </div>
        )
      }
    },
    {
      title: '发布人',
      width: 100,
      dataIndex: 'author'
    },
    {
      title: '手机号',
      width: 100,
      dataIndex: 'authorPhone'
    },
    {
      title: '发布时间',
      width: 100,
      dataIndex: 'createTime',
      render: (record: any) => <>{dateFns.format(record, 'YYYY-MM-DD HH:mm:ss')}</>
    },
    {
      title: '推荐',
      width: 50,
      dataIndex: 'isStickUp',
      render: (isStickUp: number, record: any) => {
        const isChecked = isStickUp === 1
        const { id, auditStatus } = record
        return (
          <If condition={auditStatus === 1}>
            <Switch
              onChange={() => this.stickUp(id)}
              checked={isChecked}
              checkedChildren='开'
              unCheckedChildren='关'
            />
          </If>
        )
      }
    },
    {
      title: '显示状态',
      width: 50,
      dataIndex: 'status',
      render: (status: number, record: any) => {
        const { id, auditStatus } = record
        return (
          <div>
            <If condition={auditStatus === 1}>
              <Button
                type={status === 1 ? 'danger' : 'primary'}
                onClick={() => this.editShowStatus(id)}
              >
                {status === 1 ? '隐藏' : '显示'}
              </Button>
            </If>
            <If condition={auditStatus !== 1}>
              <span style={{ color: 'green' }}>
                --
              </span>
            </If>
          </div>

        )
      }
    },
    {
      title: '状态',
      width: 60,
      dataIndex: 'auditStatus',
      render: (auditStatus: number) => {
        return (
          <div style={{ color: enumAuditStatusColor[auditStatus] }}>
            {enumAuditStatus[auditStatus]}
          </div>
        )
      }
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 160,
      render: (record: any) => {
        const { id, auditStatus } = record
        return (
          <div>
            <If condition={auditStatus === 3}>
              <span
                className='href mr10'
                onClick={() => this.editMaterial(id, 'audit')}
              >
              审核
              </span>
            </If>
            <If condition={auditStatus === 1 || auditStatus === 2}>
              <span
                className='href mr10'
                onClick={() => this.editMaterial(id, 'view')}
              >
              查看
              </span>
            </If>
            <If condition={auditStatus === 1}>
              <span
                className='href mr10'
                onClick={() => this.editMaterial(id, 'edit')}
              >
              编辑
              </span>
            </If>
            <If condition={auditStatus === 1 || auditStatus === 2}>
              <span
                className='href'
                onClick={() => this.deleteMaterial(id)}
              >
              删除
              </span>
            </If>
          </div>
        )
      }
    }
  ]

  state: State = {
    // modal关闭状态
    modalVisible: false,
    // 素材详情
    materialDetail: null,
    // 是否审核
    actionType: undefined,
    // 查看和审核弹窗关闭状态
    auditModalVisible: false
  }

  /**
   * 设置显示还是隐藏
   *
   * @memberof SkuStockList
   */
  editShowStatus = (materialId: number) => {
    api.editShowStatus(materialId).then(res => {
      message.success('设置成功')
      this.list.fetchData()
    })
  }
  /**
   * 推荐素材
   * materialId 素材id
   * @memberof SkuStockList
   */
  stickUp = (materialId: number) => {
    api.stickUp(materialId).then(res => {
      message.success('设置成功')
      this.list.fetchData()
    })
  }
  /**
   * 删除素材
   * materialId 素材id
   *
   * @memberof SkuStockList
   */
  deleteMaterial = (materialId: number) => {
    Modal.confirm({
      title: '确定要删除吗？',
      onOk: () => {
        api.deleteMaterial(materialId).then((res) => {
          message.success('删除成功')
          this.list.fetchData()
        })
      }
    })
  }
  /**
   * 新增素材
   * @memberof SkuStockList
   */
  addMaterial = () => {
    this.setState({
      materialDetail: null
    })
    this.changeModalVisible(true)
  }
  /**
   * 是否显示增加/编辑弹窗
   *
   * @memberof SkuStockList
   */
  changeModalVisible = (value: boolean, update?: boolean) => {
    const { actionType } = this.state
    if (update) {
      this.list.fetchData()
    }
    if (actionType === 'view' || actionType === 'audit') {
      return this.setState({
        auditModalVisible: value
      })
    }
    this.setState({
      modalVisible: value
    })
  }
  /**
   * 关闭弹窗，清楚所有状态
   */
  onCancel = () => {
    this.setState({
      modalVisible: false
    })
  }

  /**
   * 编辑素材
   *  materialId: 素材id
   *  actionType: 类型 audit: '审核':, view: '查看', edit: '编辑'
   * @memberof SkuStockList
   */
  editMaterial = async (materialId: number, actionType: ActionType) => {
    const materialDetail = await api.getProductMaterialId(materialId)
    this.setState({
      materialDetail,
      actionType
    }, () => {
      this.changeModalVisible(true)
    })
  }

  render () {
    const { status } = this.props
    const { modalVisible, materialDetail, auditModalVisible, actionType } = this.state
    const reserveKey = 'material/list-' + status
    return (
      <Page>
        <ListPage
          reserveKey={reserveKey}
          namespace='MaterialTabItem'
          className='vertical-align-table'
          style={{
            padding: '0px 16px 0'
          }}
          formConfig={defaultConfig}
          getInstance={ref => this.list = ref}
          rangeMap={{
            startCreate: {
              fields: ['startCreateTime', 'endCreateTime']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='productName' />
              <FormItem name='productId' />
              <FormItem name='authorPhone' />
              <FormItem name='startCreate' />
            </>
          )}
          processPayload={(payload) => {
            return {
              ...payload,
              auditStatus: +status
            }
          }}
          api={api.getProductMaterialList}
          columns={this.columns}
          tableProps={tableProps}
          addonAfterSearch={(
            <Button
              type='primary'
              className='ml10'
              onClick={this.addMaterial}
            >
              +添加素材
            </Button>
          )}
        />
        <Modal
          key={uuid()}
          title={materialDetail ? '编辑素材' : '添加素材'}
          destroyOnClose
          visible={modalVisible}
          maskClosable={false}
          width={1000}
          footer={null}
          onCancel={() => {
            this.changeModalVisible(false)
          }}
        >
          <Add
            dataSource={materialDetail}
            onCancel={(value) => this.changeModalVisible(value, true)}
          >
          </Add>
        </Modal>
        <Modal
          key={uuid()}
          title={actionType === 'view' ? '查看素材' : actionType === 'audit' ? '审核素材' : ''}
          destroyOnClose
          visible={auditModalVisible}
          maskClosable={false}
          width={1000}
          footer={null}
          onCancel={() => {
            this.changeModalVisible(false)
          }}
        >
          <AuditAndDetail
            actionType={actionType}
            dataSource={materialDetail}
            onCancel={(value) => this.changeModalVisible(value, true)}
          >
          </AuditAndDetail>
        </Modal>
      </Page>
    )
  }
}

export default MaterialTabItem