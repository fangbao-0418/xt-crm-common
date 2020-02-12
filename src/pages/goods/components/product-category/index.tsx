import React from 'react';
import { mapTree } from '@/util/utils';
import { getCategoryList } from '../../api';
import { Cascader } from 'antd';

interface ProductCategoryProps {
  style?: React.CSSProperties;
  value?: any;
  onChange?: (value: any) => void;
}

interface ProductCategoryState {
  categoryList: any[]
}

class ProductCategory extends React.Component<ProductCategoryProps, ProductCategoryState> {
  state = {
    categoryList: []
  }
  componentDidMount() {
    this.fetchData();
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
  render() {
    const { value, onChange, style } = this.props;
    const { categoryList } = this.state;
    return (
      <Cascader
        style={style}
        placeholder='请输入商品类目'
        options={categoryList}
        value={value}
        onChange={onChange}
      />
    )
  }
}

export default ProductCategory;