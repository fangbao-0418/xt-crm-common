/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React from 'react';
import { Card, Form, Input, Tabs, Button, message, Table, Popover, Radio, Select, Cascader, Checkbox  } from 'antd';
import UploadView from '../../components/upload';
import {
  map,
  size,
  indexOf,
  concat,
  filter,
  assign,
  forEach,
  cloneDeep,
  split,
  isNil,
  isNaN,
} from 'lodash';
import styles from './edit.module.scss';
import descartes from '../../util/descartes';
import { getStoreList, setProduct, getGoodsDetial, getCategoryList } from './api';
// import BraftEditor from 'braft-editor';
import { getAllId, parseQuery, gotoPage } from '@/util/utils';

const formatMoneyBeforeRequest = price => {
  if (isNil(price)) {
    return price;
  }

  const pasred = parseFloat(price);
  if (isNaN(pasred)) {
    return undefined;
  }

  return (pasred * 100).toFixed();
};
const replaceHttpUrl = imgUrl => {
  return imgUrl.replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
}

const initImgList = imgUrlWap => {
  if (imgUrlWap) {
    if (imgUrlWap.indexOf('http') !== 0) {
      imgUrlWap = 'https://assets.hzxituan.com/' + imgUrlWap;
    }
    return [
      {
        uid: `${-parseInt(Math.random() * 1000)}`,
        url: imgUrlWap,
        status: 'done',
        thumbUrl: imgUrlWap,
        name: imgUrlWap,
      },
    ];
  }
  return [];
};

function treeToarr(list = [], arr) {
  const results = arr || [];
  for (const item of list) {
    results.push(item);
    if (Array.isArray(item.childList)) {
      treeToarr(item.childList, results)
    }
  }
  return results;
}

const FormItem = Form.Item;
const TabsPane = Tabs.TabPane;
const { Option } = Select;

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};

function mapTree (org) {
  const haveChildren = Array.isArray(org.childList) && org.childList.length > 0;
  return {
      label: org.name,
      value: org.id,
      data: {...org},
      children: haveChildren ? org.childList.map(i => mapTree(i)) : []
  };
};

class GoodsEdit extends React.Component {
  state = {
    speSelect: [],
    spuName: [],
    GGName: '',
    data: [],
    supplier: [],
    propertyId1: '',
    propertyId2: '',
    productCategoryVO: {},
    noSyncList: [] // 供应商skuID，商品编码, 库存，警戒库存，
  };

  componentDidMount() {
    this.getStoreList();
    this.getCategoryList();
  }

  getCategoryList = () => {
    getCategoryList().then(res => {
      const arr = Array.isArray(res) ? res : [];
      const categoryList = arr.map(org => mapTree(org));
      this.setState({
        categoryList
      }, () => {
        this.getGoodsDetial(res)
      });

    })
  }

  getGoodsDetial = (list) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (!id) return;
    let { speSelect } = this.state;
    getGoodsDetial({ productId: id }).then((res = {}) => {
      speSelect.push({
        title: res.property1,
        fixed: 'left',
        width: 100,
        data: [],
      });
      speSelect.push({
        title: res.property2,
        fixed: 'left',
        width: 100,
        data: [],
      });
      const arr2 = treeToarr(list);
      const categoryId = res.productCategoryVO && res.productCategoryVO.id ? getAllId(arr2, [res.productCategoryVO.id], 'pid').reverse() : [];

      map(res.skuList, (item, key) => {
        item.spuName = [];
        item.propertyValue1 && item.spuName.push(item.propertyValue1);
        item.propertyValue2 && item.spuName.push(item.propertyValue2);
        if (speSelect[0].data.indexOf(item.propertyValue1) === -1) {
          speSelect[0].data.push(item.propertyValue1);
          speSelect[0].render = record => <>{size(record.spuName) > 0 && record.spuName[0]}</>;
        }
        if (speSelect[1].data.indexOf(item.propertyValue2) === -1) {
          speSelect[1].data.push(item.propertyValue2);
          speSelect[1].render = record => <>{size(record.spuName) > 1 && record.spuName[1]}</>;
        }
      });

      speSelect = filter(speSelect, item => !!item.title);

      map(res.skuList, item => {
        item.costPrice = Number(item.costPrice / 100);
        item.salePrice = Number(item.salePrice / 100);
        item.marketPrice = Number(item.marketPrice / 100);
        item.cityMemberPrice = Number(item.cityMemberPrice / 100);
        item.managerMemberPrice = Number(item.managerMemberPrice / 100);
        item.areaMemberPrice = Number(item.areaMemberPrice / 100);
        item.headPrice = Number(item.headPrice / 100);
      });
      let productImage = [];
      map(split(res.productImage, ','), (item, key) => {
        productImage = productImage.concat(initImgList(item));
      });

      let listImage = [];
      map(res.listImage ? res.listImage.split(',') : [], (item, key) => {
        listImage = listImage.concat(initImgList(item));
      });
      this.setState({
        data: res.skuList || [],
        speSelect,
        propertyId1: res.propertyId1,
        propertyId2: res.propertyId2,
      });
      setFieldsValue({
        description: res.description,
        productCode: res.productCode,
        productId: res.productId,
        productName: res.productName,
        productShortName: res.productShortName,
        property1: res.property1,
        property2: res.property2,
        storeId: res.storeId,
        status: res.status,
        bulk: res.bulk,
        weight: res.weight,
        withShippingFree: res.withShippingFree,
        coverUrl: initImgList(res.coverUrl),
        bannerUrl: initImgList(res.bannerUrl),
        listImage,
        productImage,
        storeProductId: res.storeProductId,
        categoryId
      });
    });
  };
  getStoreList = params => {
    getStoreList({ pageSize: 500, ...params }).then((res = {}) => {
      this.setState({
        supplier: res.records,
      });
    });
  };

  onSearch = val => {
    this.getStoreList({ name: val });
  };

  handleTabsAdd = () => {
    const { GGName } = this.state;
    if (!GGName) {
      message.error('请输入正确的规格名称');
      return false;
    }

    this.handleAdd(GGName);
  };

  handleTabsEdit = (e, action) => {
    if (action === 'remove') {
      this.handleRemove(e);
    }
  };

  handleRemove = e => {
    // 删除规格
    const { speSelect } = this.state;
    speSelect.splice(e, 1);
    let data = [];
    if(speSelect.length == 0) {
      return this.setState({ speSelect, data });
    }
    map(descartes(speSelect), (item, key) => {
      // if (key === 0) {
      const skuList = concat([], item);

      data[key] = {
        spuName: skuList,
        propertyValue1: size(skuList) > 0 && skuList[0],
        propertyValue2: (size(skuList) > 1 && skuList[1]) || '',
      };
    });
    speSelect[0] && (speSelect[0].render = record => <>{size(record.spuName) > 0 && record.spuName[0]}</>);
    speSelect[1] && (speSelect[1].render = record => <>{size(record.spuName) > 1 && record.spuName[1]}</>);
    this.setState({ speSelect, data: data });
  };

  handleAdd = title => {
    // 添加规格
    const { speSelect } = this.state;
    if (size(speSelect) >= 0 && size(speSelect) < 2) {
      speSelect.push({
        title,
        data: [],
      });
    }

    this.setState({
      speSelect,
      GGName: '',
    });
  };

  handleRemoveChange = (key, index) => () => {
    const { speSelect } = this.state;
    speSelect[key].data.splice(index, 1);

    const delData = [];
    map(descartes(speSelect), (item, $1) => {
      const skuList = concat([], item);
      delData[$1] = {
        spuName: skuList,
        propertyValue1: size(skuList) > 0 && skuList[0],
        propertyValue2: (size(skuList) > 1 && skuList[1]) || '',
      };
    });

    this.setState({ speSelect, data: delData });
  };

  handleClickChange = key => () => {
    const { speSelect, spuName, data } = this.state;
    if (indexOf(speSelect[key].data, spuName[key]) === -1) {
      speSelect[key].data.push(spuName[key]);
      speSelect[key].render = record => <>{size(record.spuName) > key && record.spuName[key]}</>;
    } else {
      message.error('请不要填写相同的规格');
      return false;
    }
    map(descartes(speSelect), (item, key) => {
      // if (key === 0) {
      const skuList = concat([], item);

      data[key] = {
        spuName: skuList,
        propertyValue1: size(skuList) > 0 && skuList[0],
        propertyValue2: (size(skuList) > 1 && skuList[1]) || '',
      };
    });

    this.setState({ speSelect, data });
  };

  handleChangeSpuName = key => e => {
    const { spuName } = this.state;
    spuName[key] = e.target.value;
    this.setState({ spuName });
  };

  handleChangeValue = (text, record, index) => e => {
    const { data, noSyncList } = this.state;
    const nosync = noSyncList.includes(text);
    if (!nosync) {
      data[index][text] = e.target.value;
    } else {
      data.forEach(item => {
        item[text] = e.target.value
      })
    }
    
    this.setState({ data });
  };

  handleSave = () => {
    const {
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;
    const { speSelect, data, propertyId1, propertyId2 } = this.state;
    validateFields((err, vals) => {
      if (!err) {
        debugger;
        return;
        if (size(speSelect) === 0) {
          message.error('请添加规格');
          return false;
        }

        if (size(data) === 0) {
          message.error('请添加sku项');
          return false;
        }

        const property = {};
        if (id) {
          assign(property, {
            propertyId1,
            propertyId2: speSelect[1] && propertyId2
          });
        }

        const skuAddList = forEach(cloneDeep(data), item => {
          item.costPrice = formatMoneyBeforeRequest(item.costPrice);
          item.salePrice = formatMoneyBeforeRequest(item.salePrice);
          item.marketPrice = formatMoneyBeforeRequest(item.marketPrice);
          item.cityMemberPrice = formatMoneyBeforeRequest(item.cityMemberPrice);
          item.managerMemberPrice = formatMoneyBeforeRequest(item.managerMemberPrice);
          item.areaMemberPrice = formatMoneyBeforeRequest(item.areaMemberPrice);
          item.headPrice = formatMoneyBeforeRequest(item.headPrice);
        });

        const productImage = [];
        map(vals.productImage, item => {
          productImage.push(replaceHttpUrl(item.url));
        });

        const listImage = [];
        map(vals.listImage, item => {
          listImage.push(replaceHttpUrl(item.url));
        });
        const params = {
          ...vals,
          property1: speSelect[0] && speSelect[0].title,
          property2: speSelect[1] && speSelect[1].title,
          skuAddList,
          coverUrl: vals.coverUrl && replaceHttpUrl(vals.coverUrl[0].url),
          listImage: listImage.join(','),
          productImage: productImage.join(','),
          ...property,
          bannerUrl: vals.bannerUrl && replaceHttpUrl(vals.bannerUrl[0].url),
          categoryId: Array.isArray(vals.categoryId) ? vals.categoryId[2] : '', 
        };

        setProduct({ productId: id, ...params }).then((res) => {
          if(!res) return;
          if (id) {
            res && message.success('编辑数据成功');
          } else {
            res && message.success('添加数据成功');
          }
          this.handleReturn();
        });
      }
    });
  };

  handleReturn = () => {
    gotoPage('/goods/list');
  };

  handleMainImage = fileList => { };

  // renderTitle = (text, id) => {
  //   return (
  //     <div>
  //       <span style={{ marginRight: 5, verticalAlign: 'middle' }}>{text}</span>
  //       <Switch size="small" onChange={this.onSwitchChange.bind(this, id)} />
  //     </div>
  //   )
  // }

  // onSwitchChange = (id, boolean) => {
  //   const { noSyncList } = this.state;
  //   if (boolean) {
  //     !noSyncList.includes(id) && noSyncList.push(id);
  //   } else {
  //     const index = noSyncList.indexOf(id);
  //     index !== -1 && noSyncList.splice(index, 1)
  //   };
  //   this.setState({
  //     noSyncList
  //   })
  // }

  render() {
    const columns = [
      {
        // title: this.renderTitle('供应商skuID', 'storeProductSkuId'),
        title: '供应商skuID',
        dataIndex: 'storeProductSkuId',
        width: 300,
        render: (text, record, index) => {
          return (
            <Input
              value={text}
              placeholder="请输入供应商skuid"
              onChange={this.handleChangeValue('storeProductSkuId', record, index)}
            />
          );
        },
      },
      {
        title: '商品编码',
        dataIndex: 'skuCode',
        width: 100,
        render: (text, record, index) => {
          return (
            <Input
              value={text}
              placeholder="请输入商品编码"
              onChange={this.handleChangeValue('skuCode', record, index)}
            />
          );
        },
      },
      {
        title: '成本价',
        dataIndex: 'costPrice',
        width: 100,
        render: (text, record, index) => (
          <Input
            value={text}
            placeholder="请输入成本价"
            onChange={this.handleChangeValue('costPrice', record, index)}
          />
        ),
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        width: 100,
        render: (text, record, index) => (
          <Input
            value={text}
            placeholder="请输入市场价"
            onChange={this.handleChangeValue('marketPrice', record, index)}
          />
        ),
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        width: 100,
        render: (text, record, index) => (
          <Input
            value={text}
            placeholder="请输入销售价"
            onChange={this.handleChangeValue('salePrice', record, index)}
          />
        ),
      },
      {
        title: '团长价',
        dataIndex: 'headPrice',
        width: 100,
        render: (text, record, index) => (
          <Input
            value={text}
            placeholder="请输入团长价"
            onChange={this.handleChangeValue('headPrice', record, index)}
          />
        ),
      },
      {
        title: '社区管理员价',
        dataIndex: 'areaMemberPrice',
        width: 150,
        render: (text, record, index) => (
          <Input
            value={text}
            placeholder="请输入社区管理员价"
            onChange={this.handleChangeValue('areaMemberPrice', record, index)}
          />
        ),
      },
      {
        title: '城市合伙人价',
        dataIndex: 'cityMemberPrice',
        width: 150,
        render: (text, record, index) => (
          <Input
            value={text}
            placeholder="请输入合伙人价"
            onChange={this.handleChangeValue('cityMemberPrice', record, index)}
          />
        ),
      },
      {
        title: '公司管理员价',
        dataIndex: 'managerMemberPrice',
        width: 150,
        render: (text, record, index) => (
          <Input
            value={text}
            placeholder="请输入公司管理员价"
            onChange={this.handleChangeValue('managerMemberPrice', record, index)}
          />
        ),
      },
      {
        title: '库存',
        dataIndex: 'stock',
        width: 100,
        render: (text, record, index) => (
          <Input
            value={text}
            placeholder="请输入库存"
            onChange={this.handleChangeValue('stock', record, index)}
          />
        ),
      },
      {
        title: '警戒库存',
        dataIndex: 'stockAlert',
        width: 100,
        render: (text, record, index) => (
          <Input
            value={text}
            placeholder="请输入警戒库存"
            onChange={this.handleChangeValue('stockAlert', record, index)}
          />
        ),
      },
    ];

    const { getFieldDecorator } = this.props.form;
    const { speSelect, spuName, GGName, data, supplier } = this.state;

    return (
      <Form {...formLayout}>
        <Card title="添加/编辑商品">
          <FormItem label="商品名称">
            {getFieldDecorator('productName', {
              rules: [
                {
                  required: true,
                  message: '请输入商品名称',
                },
              ],
            })(<Input placeholder="请输入商品名称" />)}
          </FormItem>
          <FormItem label="商品类目">
            {getFieldDecorator('categoryId', {
              // initialValue: 73,
              rules: [
                {
                  required: true,
                  message: '请选择商品类目',
                },
                {
                  validator(rule, value, callback) {
                    if (value.length !== 3) {
                      callback('请选择三级类目')
                    }
                    callback()
                  },
                }
              ],
            })(<Cascader options={this.state.categoryList}  placeholder="请输入商品类目" />)}
          </FormItem>
          <FormItem label="商品简称">
            {getFieldDecorator('productShortName', {
              rules: [
                {
                  required: true,
                  message: '请输入商品简称',
                },
              ],
            })(<Input placeholder="请输入商品简称" />)}
          </FormItem>
          <FormItem label="商品编码">
            {getFieldDecorator('productCode', {
              rules: [
                {
                  required: true,
                  message: '请输入商品编码',
                },
              ],
            })(<Input placeholder="请输入商品编码" />)}
          </FormItem>
          <FormItem label="商品简介">
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: '请输入商品简介',
                },
              ],  
            })(<Input placeholder="请输入商品简介" />)}
          </FormItem>
          <FormItem label="供货商">
            {getFieldDecorator('storeId', {
              rules: [
                {
                  required: true,
                  message: '请选择供应商',
                },
              ],
            })(
              <Select
                placeholder="请选择供货商"
                showSearch
                filterOption={(inputValue, option) =>{
                  return option.props.children.indexOf(inputValue) > -1;
                }}
              > 
                {map(supplier, item => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem label="供应商商品ID">
            {getFieldDecorator('storeProductId')(<Input placeholder="请填写供货商商品ID" />)}
          </FormItem>
          <FormItem label="是否新人专享">
            {getFieldDecorator('newuserExclusive')(<Checkbox>是</Checkbox>)}
          </FormItem>
          <FormItem label="是否会员专享">
            {getFieldDecorator('memberExclusive')(<Checkbox>是</Checkbox>)}
          </FormItem>
          <FormItem label="最少购买数量">
            {getFieldDecorator('minBuy',{
               initialValue: 0
            })(<Input placeholder="请填写供货商商品ID"  type="number"/>)}
          </FormItem>
          <FormItem label="最多购买数量">
            {getFieldDecorator('maxBuy',{
              initialValue: 0
          })(<Input placeholder="请填写供货商商品ID" type="number"/>)}
          </FormItem>
          <FormItem label="商品主图" required={true}>
            {getFieldDecorator('coverUrl', {
              rules: [
                {
                  required: true,
                  message: '请设置商品主图',
                },
              ],
            })(<UploadView placeholder="上传主图" listType="picture-card" listNum={1} size={.5} />)}
          </FormItem>
          <FormItem
            label="商品图片"
            required={true}
            help={
              <>
                <div>1.本地上传图片大小不能超过2M</div>
                <div>2.商品图片最多上传5张图片</div>
              </>
            }
          >
            {getFieldDecorator('productImage', {
              rules: [
                {
                  required: true,
                  message: '请上传商品图片',
                },
              ],
            })(
              <UploadView
                placeholder="上传商品图片"
                listType="picture-card"
                listNum={5}
                size={.5}
              />,
            )}
          </FormItem>
          <FormItem label="banner图片" required={true}>
            {getFieldDecorator('bannerUrl', {
              rules: [
                {
                  required: true,
                  message: '请设置banner图片',
                },
              ],
            })(<UploadView placeholder="上传主图" listType="picture-card" listNum={1} size={.5} />)}
          </FormItem>
        </Card>
        <Card
          title="添加规格项"
          style={{ marginTop: 10 }}
          extra={
            <Popover
              trigger="click"
              content={
                <div style={{ display: 'flex' }}>
                  <Input
                    placeholder="请添加规格名称"
                    value={GGName}
                    onChange={e => {
                      this.setState({ GGName: e.target.value });
                    }}
                  />
                  <Button type="primary" style={{ marginLeft: 5 }} onClick={this.handleTabsAdd}>
                    确定
                  </Button>
                </div>
              }
            >
              <a href="javascript:void(0);">添加规格</a>
            </Popover>
          }
        >
          <Tabs type="editable-card" onEdit={this.handleTabsEdit} hideAdd={true}>
            {map(speSelect, (item, key) => (
              <TabsPane tab={item.title} key={key}>
                <div className={styles.spulist}>
                  {map(item.data, (data, index) => (
                    <div className={styles.spuitem} key={`d-${index}`}>
                      <Input placeholder="请设置规格名称" value={data} disabled />
                      <Button
                        className={styles.spubtn}
                        type="danger"
                        onClick={this.handleRemoveChange(key, index)}
                      >
                        删除规格
                      </Button>
                    </div>
                  ))}
                  {size(item.data) < 10 && (
                    <div className={styles.spuitem}>
                      <Input
                        placeholder="请设置规格名称"
                        value={spuName[key]}
                        onChange={this.handleChangeSpuName(key)}
                      />
                      <Button
                        className={styles.spubtn}
                        type="primary"
                        onClick={this.handleClickChange(key)}
                      >
                        添加规格
                      </Button>
                    </div>
                  )}
                </div>
              </TabsPane>
            ))}
          </Tabs>
          <Table
            rowKey={record => record.id}
            style={{ marginTop: 10 }}
            scroll={{ x: 1650, y: 600 }}
            columns={[...speSelect, ...columns]}
            dataSource={data}
            pagination={false}
          />
        </Card>
        <Card title="物流信息" style={{ marginTop: 10 }}>
          <FormItem label="物流体积">
            {getFieldDecorator('bulk')(<Input placeholder="请设置物流体积" />)}
          </FormItem>
          <FormItem label="物流重量">
            {getFieldDecorator('weight')(<Input placeholder="请设置物流重量" />)}
          </FormItem>
          <FormItem label="运费设置">
            {getFieldDecorator('withShippingFree', {
              initialValue: 0,
            })(
              <Radio.Group>
                <Radio value={1}>包邮</Radio>
                <Radio value={0}>不包邮</Radio>
              </Radio.Group>,
            )}
          </FormItem>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <FormItem label="商品详情页">
            {getFieldDecorator('listImage')(
              <UploadView showUploadList={true} size={0.5}>
                <Button type="dashed">上传商品详情页</Button>
              </UploadView>,
            )}
          </FormItem>
          <FormItem label="上架状态">
            {getFieldDecorator('status', {
              initialValue: 0,
            })(
              <Radio.Group>
                <Radio value={1}>上架</Radio>
                <Radio value={0}>下架</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.handleSave} style={{ marginRight: 10 }}>
              保存
            </Button>
            <Button type="danger" onClick={this.handleReturn}>
              返回
            </Button>
          </FormItem>
        </Card>
      </Form>
    );
  }
}

export default Form.create()(GoodsEdit);
