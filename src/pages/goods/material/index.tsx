import React from 'react'
import { Button, Modal } from 'antd'
import { If, ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { parseQuery, uuid } from '@/util/utils'

import { defaultConfig } from './config'
import columns from './columns'
import Add from './add'
import { getMaterial } from './api'

const tableProps: any = {
  scroll: {
    x: true
  }
}

class SkuStockList extends React.Component<any> {
  list: ListPageInstanceProps

  state = {
    modalVisible: false
  }
  changeModalVisible = (value: boolean) => {
    this.setState({
      modalVisible: value
    })
  }

  render () {
    const { modalVisible } = this.state
    const type = 'edit'
    const editSource = {}
    return (
      <>
        <ListPage
          reserveKey='skuSale'
          namespace='skuSale'
          className='vertical-align-table'
          style={{
            padding: '0px 16px 0'
          }}
          formConfig={defaultConfig}
          getInstance={ref => this.list = ref}
          processPayload={(payload) => {
            console.log(payload, 'payload')
            return {
              ...payload
              // status: this.state.status
            }
          }}
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
          // api={getMaterial}
          columns={columns}
          tableProps={tableProps}
          addonAfterSearch={(
            <Button
              type='primary'
              className='ml10'
              onClick={() => {
                this.changeModalVisible(true)
              }}
            >
              +添加素材
            </Button>
          )}
        />
        <Modal
          key={uuid()}
          title='添加素材'
          visible={modalVisible}
          maskClosable={false}
          width={1000}
          destroyOnClose
          footer={null}
          onCancel={() => {
            this.changeModalVisible(false)
          }}
        >
          <Add onCancel={this.changeModalVisible}></Add>
        </Modal>
      </>
    )
  }
}

export default SkuStockList