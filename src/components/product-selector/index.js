/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { Modal, Input } from 'antd'
import { formatMoneyWithSign } from '../../pages/helper'
import { isFunction } from 'lodash'
import { Image, CommonTable } from '@/components'
import { getProductList, getFreshProductList } from './api'
import { unionArray } from '@/util/utils'
const goodsColumns = (data = []) => {
  return [
    {
      title: '序号',
      render: (text, row, index) => {
        return index + 1
      },
      width: 60
    },
    {
      title: '商品ID',
      dataIndex: 'id',
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      width: 200
    },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      width: 60,
      render: text => <Image style={{ height: 60, width: 60 }} src={text} alt='主图' />
    },
    {
      title: '库存',
      dataIndex: 'stock'
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      render: text => <>{formatMoneyWithSign(text)}</>
    },
    {
      title: '市场价',
      dataIndex: 'marketPrice',
      render: text => <>{formatMoneyWithSign(text)}</>
    },
    {
      title: '销售价',
      dataIndex: 'salePrice',
      render: text => <>{formatMoneyWithSign(text)}</>
    },
    ...data
  ]
}
class ProductSelector extends Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    val: '',
    goodsList: [],
    loading: false,
    pagination: {
      page: 1,
      total: 0,
      pageSize: 10
    }
  }
  componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
    }
  }
  componentDidMount () {
    this.fetchData()
  }
  // 页码改变的回调
  handleChangePagination = (params) => {
    console.log('params=>', params)
    this.setState(state => ({ pagination: Object.assign(state.pagination, params) }), this.fetchData)
  };
  // 获取商品数据
  fetchData = async (params) => {
    //type 默认为优选调用的商品接口，1为买菜优惠券调用的接口
    try {
      this.setState({ loading: true })
      const res = this.props.type===1?await getFreshProductList({
        status: 0,
        productName: this.state.val.trim(),
        ...this.state.pagination,
        ...params
      }): await getProductList({
        status: 0,
        productName: this.state.val.trim(),
        ...this.state.pagination,
        ...params
      })
      console.log('res=>', res)
      // 设置表格数据
      this.setState({
        loading: false,
        goodsList: res.records,
        pagination: {
          ...this.state.pagination,
          total: res.total,
          pageSize: res.size
        }
      })
    } catch (err) {
      this.setState({ loading: true })
    }
  }
  // 条件查询商品名称
  handleSearch = (val) => {
    this.setState({
      val,
      pagination: {
        ...this.state.pagination,
        page: 1
      }
    }, this.fetchData)
  }
  // 取消对话框
  handleCancel = () => {
    console.log('cancel called')
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    isFunction(this.props.onCancel) && this.props.onCancel()
  }
  // 确认对话框
  handleOkModal = () => {
    isFunction(this.props.onChange) && this.props.onChange(this.state.selectedRowKeys, this.state.selectedRows)
    this.handleCancel()
  }
  handleInputChange = (event) => {
    // this.setVal(event.target.value)
    this.setState({
      val: event.target.value
    })
    console.log(this.state.val)
  }
  render () {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys=>', selectedRowKeys)
        const unionArrs = unionArray(this.state.selectedRows, selectedRows)
        console.log('selectedRows=>', unionArrs.filter(v => selectedRowKeys.includes(v.id)))
        this.setState({ selectedRowKeys, selectedRows: unionArrs.filter(v => selectedRowKeys.includes(v.id)) })
      }
    }

    return (
      <Modal
        title='选择商品'
        visible={this.props.visible}
        width='60%'
        onCancel={this.handleCancel}
        onOk={this.handleOkModal}
      >
        <Input.Search
          placeholder='请输入需要搜索的商品'
          value={this.state.val}
          onChange={this.handleInputChange}
          style={{ marginBottom: 10 }}
          onSearch={this.handleSearch}
        />
        <CommonTable
          loading={this.state.loading}
          rowSelection={rowSelection}
          columns={goodsColumns()}
          dataSource={this.state.goodsList}
          onChange={this.handleChangePagination}
          rowKey={record => record.id}
          current={this.state.pagination.page}
          total={this.state.pagination.total}
        />
      </Modal>
    )
  }
}
export default ProductSelector