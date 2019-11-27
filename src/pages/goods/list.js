import React from 'react';
import {
  Table,
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Modal,
  message,
} from 'antd';
import dateFns from 'date-fns';
import { getGoodsList, getStoreList, delGoodsDisable, enableGoods, exportFileList, getCategoryTopList} from './api';
import { map, size } from 'lodash';
import { setQuery, parseQuery, gotoPage } from '@/util/utils';
import { formatMoneyWithSign } from '../helper';
import Image from '@/components/Image';
import SelectFetch from '@/components/select-fetch'
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const replaceHttpUrl = imgUrl => {
  if (imgUrl.indexOf('http') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

class GoodsList extends React.Component {
  constructor(props) {
    super(props);
    const params = parseQuery();
    this.state = {
      selectedRowKeys: [],
      supplier: [],
      dataSource: [],
      page: {
        total: 0,
        current: +params.page || 1,
        pageSize: 10,
      }
    };
  }

  componentDidMount() {
    const params = parseQuery();
    this.props.form.setFieldsValue(params);
    this.fetchData(params);
    this.getStoreList();
  }
  /**
   * 获取商品列表 
   */
  fetchData(params = {}) {
    const { status } = this.props;
    const { page } = this.state;
    const options = {
      status,
      pageSize: page.pageSize,
      page: page.current,
      ...params
    }
    getGoodsList(options).then((res = {}) => {
      page.total = res.total;
      this.setState({
        dataSource: res.records,
        page,
      });
      setQuery(options)
    });
  }

  getStoreList = params => {
    getStoreList({ pageSize: 5000, ...params }).then((res = {}) => {
      this.setState({
        supplier: res.records,
      });
    });
  };
  /** 下架商品 */
  delGoodsDisable = ids => {
    Modal.confirm({
      title: '下架提示',
      content: '确认下架该商品吗?',
      onOk: () => {
        delGoodsDisable({ ids }).then(res => {
          if (res) {
            message.success('下架成功');
            this.fetchData();
          }
        });
      },
    });
  };

  enableGoods = ids => {
    Modal.confirm({
      title: '上架提示',
      content: '确认上架该商品吗?',
      onOk: () => {
        enableGoods({ ids }).then(res => {
          if (res) {
            message.success('上架成功');
            this.fetchData();
          }
        });
      },
    });
  };

  handleSearch = type => () => {
    const { validateFields } = this.props.form;
    const { status } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        const params = {
          ...vals,
          createStartTime: vals.goodsTime && vals.goodsTime[0] && +new Date(vals.goodsTime[0]),
          createEndTime: vals.goodsTime && vals.goodsTime[1] && +new Date(vals.goodsTime[1]),
          modifyStartTime: vals.optionTime && vals.optionTime[0] && +new Date(vals.optionTime[0]),
          modifyEndTime: vals.optionTime && vals.optionTime[1] && +new Date(vals.optionTime[1]),
          page: 1,
          pageSize: 10
        };
        delete params.goodsTime;
        delete params.optionTime;
        if (type === '搜索') {
          this.fetchData(params);
        }

        if (type === '导出') {
          exportFileList({ ...params, status, pageSize: 6000, page: 1 });
        }
      }
    });
  };

  handleChangeTable = e => {
    this.setState(
      {
        page: e,
      },
      () => {
        const params = parseQuery();
        this.fetchData({
          ...params,
          page: e.current,
          pageSize: e.pageSize
        });
      },
    );
  };

  /** 添加商品 */
  handleAdd = () => {
    APP.history.push('/goods/edit')
  }

  handleDisable = id => () => {
    this.delGoodsDisable([].concat(id));
  }

  /**
   * 批量下架商品
   */
  soldOut = () => {
    const { selectedRows } = this.state;
    if (size(selectedRows) <= 0) {
      message.error('请选择需要下架的商品');
      return false;
    }
    const selectRowsId = [];
    map(selectedRows, item => {
      selectRowsId.push(item.id);
    });
    this.delGoodsDisable(selectRowsId);
  };

  handleEnable = id => () => {
    this.enableGoods([].concat(id));
  };
  /**
   * 批量上架商品
   */
  putaway = () => {
    const { selectedRows } = this.state;
    if (size(selectedRows) <= 0) {
      message.error('请选择需要上架的商品');
      return false;
    }
    const selectRowsId = [];
    map(selectedRows, item => {
      selectRowsId.push(item.id);
    });
    this.enableGoods(selectRowsId);
  };

  /**
   * 选择项发生变化时的回调
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };
  /**
   * 重置条件
   */
  handleReset = () => {
    const { resetFields } = this.props.form;
    const { page } = this.state;
    setQuery({page: page.current, pageSize: page.pageSize}, true);
    resetFields();
    this.fetchData(parseQuery())
  }
  render() {
    const { selectedRowKeys, supplier, dataSource, page } = this.state;
    const {
      status,
      form: { getFieldDecorator },
    } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    console.log('status=>', status, typeof status);
    const columns = [
      {
        title: '商品ID',
        dataIndex: 'id',
      },
      {
        title: '主图',
        dataIndex: 'coverUrl',
        width:120,
        render: record => (
          <>
            <Image style={{ height: 100, width: 100,minWidth:100 }} src={replaceHttpUrl(record)} alt="主图" />
          </>
        ),
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
      },
      {
        title: '类目',
        dataIndex: 'categoryName'
      },
      {
        title: '成本价',
        dataIndex: 'costPrice',
        render: text => <>{formatMoneyWithSign(text)}</>,
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        render: text => <>{formatMoneyWithSign(text)}</>,
      },
      {
        title: '库存',
        dataIndex: 'stock',
      },
      {
        title: '累计销量',
        width: 100,
        dataIndex: 'saleCount',
      },
      {
        title: '供应商',
        dataIndex: 'storeName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200,
        render: record => <>{dateFns.format(record, 'YYYY-MM-DD HH:mm:ss')}</>,
      },
      {
        title: '最后操作时间',
        dataIndex: 'modifyTime',
        width: 200,
        render: record => <>{dateFns.format(record, 'YYYY-MM-DD HH:mm:ss')}</>,
      },
      {
        title: '操作',
        width: 160,
        render: record => (
          <>
            <Button
              type="link"
              onClick={() => {
                gotoPage(`/goods/edit/${record.id}`)
              }
            }>
                编辑
            </Button>
            {status === '0' && (
              <Button type="link" onClick={this.handleDisable(record.id)}>
                下架
              </Button>
            )}
            {status === '1' && (
              <Button type="link" onClick={this.handleEnable(record.id)}>
                上架
              </Button>
            )}
          </>
        ),
      },
    ];
    return (
      <>
        <Card title="筛选">
          <Form layout="inline">
            <FormItem label="商品名称">
              {getFieldDecorator('productName')(<Input placeholder="请输入商品名称" />)}
            </FormItem>
            <FormItem label="商品ID">
              {getFieldDecorator('productId')(<Input type='number' placeholder="请输入商品ID" />)}
            </FormItem>
            <FormItem label="供应商">
              {getFieldDecorator('storeId')(
                <Select
                  placeholder="请选择供货商"
                  showSearch
                  filterOption={(inputValue, option) => {
                    return option.props.children.indexOf(inputValue) > -1;
                  }}
                  style={{ width: 300 }}
                >
                  {map(supplier, item => (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="拦截状态">
              {getFieldDecorator('interceptor', {
                initialValue: ''
              })(
                <Select placeholder="请选择拦截状态" style={{ width: 300 }}>
                  <Option value=''>全部</Option>
                  <Option value='1'>是</Option>
                  <Option value='0'>否</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="创建时间">{getFieldDecorator('goodsTime')(<RangePicker showTime />)}</FormItem>
            <FormItem label="操作时间">{getFieldDecorator('optionTime')(<RangePicker showTime />)}</FormItem>
            <FormItem label="一级类目">{getFieldDecorator('categoryId')(
              <SelectFetch
                style={{ width: '174px' }}
                fetchData={() => {
                  return getCategoryTopList();
                }}
              />
            )}</FormItem>
            <FormItem>
              <Button onClick={this.handleReset}>
                清除条件
              </Button>
              <Button
                type="primary"
                style={{ margin: '0 10px' }}
                onClick={this.handleSearch('搜索')}
              >
                查询商品
              </Button>
              <Button type="primary" style={{ marginRight: 10 }} onClick={this.handleSearch('导出')}>
                导出商品
              </Button>
              <Button type="primary" onClick={this.handleAdd}>
                添加商品
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            pagination={page}
            onChange={this.handleChangeTable}
            rowKey={record => record.id}
          />
          {status === '1' && <Button type="danger" onClick={this.putaway}>批量上架</Button>}
          {status === '0' && <Button type="danger" onClick={this.soldOut}>批量下架</Button>}
        </Card>
      </>
    );
  }
}

export default Form.create()(GoodsList);
