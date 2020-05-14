import React from 'react'
import { mapTree } from '@/util/utils'
import { getCategoryList } from '../../api'
import { Cascader } from 'antd'

interface ProductCategoryProps {
  labelInValue?: boolean
  style?: React.CSSProperties;
  value?: string[];
  onChange?: (value: string[]) => void;
}

interface ProductCategoryState {
  categoryList: any[]
  value: any[]
}

class ProductCategory extends React.Component<ProductCategoryProps, ProductCategoryState> {
  state: ProductCategoryState = {
    categoryList: [],
    value: []
  }
  static getDrivedStateFromProps (nextProps: ProductCategoryProps) {
    if (nextProps.value) {
      return {
        value: nextProps.value
      }
    }
    return null
  }

  componentDidMount () {
    this.fetchData()
  }
  fetchData = () => {
    getCategoryList().then((res: any) => {
      if (!Array.isArray(res)) {
        res = []
      }
      this.setState({
        categoryList: res.map(mapTree)
      })
    })
  }

  onChange = (value: any, selectedOptions: any) => {
    const { onChange, labelInValue } = this.props
    if (onChange) {
      if (labelInValue) {
        onChange(selectedOptions)
      } else {
        onChange(value)
      }
    }
  }

  render () {
    const { value = [], style, labelInValue } = this.props
    const { categoryList } = this.state
    let val = []
    if (labelInValue) {
      val = value.map((item: any) => item.value)
    } else {
      val = value
    }
    return (
      <Cascader
        style={style}
        placeholder='请输入商品类目'
        options={categoryList}
        value={val}
        onChange={this.onChange}
      />
    )
  }
}

export default ProductCategory