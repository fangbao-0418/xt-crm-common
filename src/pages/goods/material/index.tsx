import React from 'react'
import { Button, Modal, Switch, message } from 'antd'
import Image from '@/components/Image'
import Page from '@/components/page'
import { ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { uuid, replaceHttpUrl } from '@/util/utils'
import dateFns from 'date-fns'
import * as api from './api'
import { defaultConfig } from './config'
import Add from './add'
import styles from './style.module.scss'


const tableProps: any = {
  scroll: {
    x: true
  }
}

class SkuStockList extends React.Component<any> {
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
        const { id } = record
        return (
          <Switch
            onChange={() => this.stickUp(id)}
            checked={isChecked}
            checkedChildren='开'
            unCheckedChildren='关'
          />
        )
      }
    },
    {
      title: '显示状态',
      width: 50,
      dataIndex: 'status',
      render: (status: number, record: any) => {
        const { id } = record
        return (
          <Button
            type={status === 1 ? 'danger' : 'primary'}
            onClick={() => this.editShowStatus(id)}
          >
            {status === 1 ? '隐藏' : '显示'}
          </Button>
        )
      }
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 200,
      render: (record: any) => {
        const { id } = record
        return (
          <div>
            <span
              className='href mr10'
              onClick={() => this.editMaterial(id, 'readOnly')}
            >
              查看
            </span>
            <span
              className='href mr10'
              onClick={() => this.editMaterial(id, 'edit')}
            >
              编辑
            </span>
            <span
              className='href'
              onClick={() => this.deleteMaterial(id)}
            >
              删除
            </span>
          </div>
        )
      }
    }
  ]
  state = {
    // modal关闭状态
    modalVisible: false,
    // 是否是只读
    isReadOnly: false,
    // 素材详情
    materialDetail: null
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
    api.deleteMaterial(materialId).then((res) => {
      message.success('删除成功')
      this.list.fetchData()
    })
  }
  /**
   * 新增素材
   * @memberof SkuStockList
   */
  addMaterial = () => {
    this.setState({
      materialDetail: null,
      isReadOnly: false
    })
    this.changeModalVisible(true)
  }
  /**
   * 是否显示增加/编辑弹窗
   *
   * @memberof SkuStockList
   */
  changeModalVisible = (value: boolean, update?: boolean) => {
    this.setState({
      modalVisible: value
    })
    if (update) {
      this.list.fetchData()
    }
  }

  /**
   * 编辑素材
   *  materialId: 素材id
   *  type: 类型 readOnly: '查看', edit: '编辑'
   * @memberof SkuStockList
   */
  editMaterial = async (materialId: number, type: string) => {
    const  materialDetail = await api.getProductMaterialId(materialId)
    console.log(materialDetail, 'materialDetail')
    this.setState({
      materialDetail,
      isReadOnly: type === 'readOnly' ? true : false
    }, () => {
      this.changeModalVisible(true)
    })
  }

  render () {
    const { modalVisible, materialDetail, isReadOnly } = this.state
    return (
      <Page>
        <ListPage
          reserveKey='skuSale'
          namespace='skuSale'
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
              <FormItem name='productName'/>
              <FormItem name='productId' />
              <FormItem name='author_phone' />
              <FormItem name='startCreate' />
            </>
          )}
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
          title='添加素材'
          destroyOnClose
          visible={modalVisible}
          maskClosable={false}
          width={1000}
          footer={null}
          onCancel={() => {
            this.changeModalVisible(false)
          }}
        >
          <Add isReadOnly={isReadOnly} dataSource={materialDetail}  onCancel={(value) => this.changeModalVisible(value, true)}></Add>
        </Modal>
      </Page>
    )
  }
}

export default SkuStockList