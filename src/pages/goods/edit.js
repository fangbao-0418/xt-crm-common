/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React from 'react';
import { Modal, Card, Form, Input, Button, message, Radio, Select, Cascader } from 'antd';
import UploadView from '../../components/upload';
import { mapTree, treeToarr, formatMoneyBeforeRequest } from '@/util/utils';
import {
  map,
  size,
  concat,
  filter,
  assign,
  forEach,
  cloneDeep,
  split
} from 'lodash';
import descartes from '../../util/descartes';
import { getStoreList, setProduct, getGoodsDetial, getCategoryList } from './api';
import { getAllId, gotoPage, initImgList } from '@/util/utils';
import SkuList from './SkuList';
import styles from './edit.module.scss'
const replaceHttpUrl = imgUrl => {
  return imgUrl.replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
}

function barCodeValidator(rule, value, callback) {
  if (value) {
    if (/^\d{0,20}$/.test(value)) {
      callback()
    } else {
      callback('仅支持数字，20个字符以内')
    }
  } else {
    callback();
  }
}

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



class GoodsEdit extends React.Component {
  specs = []
  state = {
    speSelect: [],
    spuName: [],
    spuPicture: [],
    GGName: '',
    data: [],
    supplier: [],
    propertyId1: '',
    propertyId2: '',
    productCategoryVO: {},
    noSyncList: [], // 供应商skuID，商品编码, 库存，警戒库存，
    returnContact: '',
    returnPhone: '',
    returnAddress: '',
    showImage: false
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

    let { supplier } = this.state;
    if (!id) {
      setFieldsValue({
        showNum: 1
      })
      return
    };
    getGoodsDetial({ productId: id }).then((res = {}) => {
      const arr2 = treeToarr(list);
      const categoryId = res.productCategoryVO && res.productCategoryVO.id ? getAllId(arr2, [res.productCategoryVO.id], 'pid').reverse() : [];
      this.specs = [
        {
          title: res.property1,
          content: []
        },
        {
          title: res.property2,
          content: []
        }
      ]
      let showImage = false
      map(res.skuList, item => {
        item.costPrice = Number(item.costPrice / 100);
        item.salePrice = Number(item.salePrice / 100);
        item.marketPrice = Number(item.marketPrice / 100);
        item.cityMemberPrice = Number(item.cityMemberPrice / 100);
        item.managerMemberPrice = Number(item.managerMemberPrice / 100);
        item.areaMemberPrice = Number(item.areaMemberPrice / 100);
        item.headPrice = Number(item.headPrice / 100);
        if (item.imageUrl1) {
          showImage = true
        }
      });
      let productImage = [];
      map(split(res.productImage, ','), (item, key) => {
        productImage = productImage.concat(initImgList(item));
      });

      let listImage = [];
      map(res.listImage ? res.listImage.split(',') : [], (item, key) => {
        listImage = listImage.concat(initImgList(item));
      });
      this.specs = this.getSpecs(res.skuList);
      const currentSupplier = supplier.find(item => item.id === res.storeId) || {};
      this.setState({
        interceptionVisible: currentSupplier.category == 1 ? false : true,
        data: res.skuList || [],
        speSelect: this.specs,
        propertyId1: res.propertyId1,
        propertyId2: res.propertyId2,
        returnContact: res.returnContact,
        returnPhone: res.returnPhone,
        returnAddress: res.returnAddress,
        showImage
      });
      setFieldsValue({
        interception: res.interception,
        showNum: res.showNum !== undefined ? res.showNum : 1,
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
        videoCoverUrl: initImgList(res.videoCoverUrl),
        videoUrl: initImgList(res.videoUrl),
        deliveryMode: res.deliveryMode,
        barCode: res.barCode,
        bannerUrl: initImgList(res.bannerUrl),
        returnPhone: res.returnPhone,
        listImage,
        productImage,
        storeProductId: res.storeProductId,
        categoryId,
        isAuthentication: res.isAuthentication
      });
    });
  };
  /** 获取规格结婚 */
  getSpecs(skuList = []) {
    const specs = this.specs
    specs.map((item) => {
      item.content = []
      return item
    })
    map(skuList, (item, key) => {
      if (item.propertyValue1 && specs[0] && specs[0].content.findIndex(val => val.specName === item.propertyValue1) === -1) {
        specs[0].content.push({
          specName: item.propertyValue1,
          specPicture: item.imageUrl1
        })
      }
      if (item.propertyValue2 && specs[1] && specs[1].content.findIndex(val => val.specName === item.propertyValue2) === -1) {
        specs[1].content.push({
          specName: item.propertyValue2
        })
      }
    });
    this.specs = filter(specs, item => !!item.title)
    return this.specs
  }
  getStoreList = params => {
    getStoreList({ pageSize: 5000, ...params }).then((res = {}) => {
      this.setState({
        supplier: res.records,
      });
    });
  };

  handleTabsEdit = (e, action) => {
    if (action === 'remove') {
      this.handleRemove(e);
    }
  };

  /**
   * 删除规格
   */
  handleRemove = e => {
    const { speSelect } = this.state;
    speSelect.splice(e, 1);
    let data = [];
    if (speSelect.length === 0) {
      return this.setState({ speSelect, data });
    }
    map(descartes(speSelect), (item, key) => {
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
        // let isExistImg = true
        // let isNotExistImg = true
        const skuAddList = forEach(cloneDeep(data), item => {
          // if (item.imageUrl1) {
          //   isNotExistImg = false
          // }
          // if (!item.imageUrl1) {
          //   isExistImg = false
          // }
          item.costPrice = formatMoneyBeforeRequest(item.costPrice);
          item.salePrice = formatMoneyBeforeRequest(item.salePrice);
          item.marketPrice = formatMoneyBeforeRequest(item.marketPrice);
          item.cityMemberPrice = formatMoneyBeforeRequest(item.cityMemberPrice);
          item.managerMemberPrice = formatMoneyBeforeRequest(item.managerMemberPrice);
          item.areaMemberPrice = formatMoneyBeforeRequest(item.areaMemberPrice);
          item.headPrice = formatMoneyBeforeRequest(item.headPrice);
        });
        /** isNotExistImg为false存在图片上传, isExistImg为false存在未上传图片*/
        // if (!isNotExistImg && !isExistImg) {
        //   APP.error('存在未上传的商品图')
        //   return
        // }
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
          returnContact: this.state.returnContact,
          returnPhone: this.state.returnPhone,
          returnAddress: this.state.returnAddress,
          property1: speSelect[0] && speSelect[0].title,
          property2: speSelect[1] && speSelect[1].title,
          skuAddList,
          coverUrl: vals.coverUrl && replaceHttpUrl(vals.coverUrl[0].durl),
          videoCoverUrl: vals.videoCoverUrl && vals.videoCoverUrl[0] ? replaceHttpUrl(vals.videoCoverUrl[0].durl) : '',
          videoUrl: vals.videoUrl && vals.videoUrl[0] ? replaceHttpUrl(vals.videoUrl[0].durl) : '',
          listImage: listImage.join(','),
          productImage: productImage.join(','),
          ...property,
          bannerUrl: vals.bannerUrl && replaceHttpUrl(vals.bannerUrl[0].url),
          categoryId: Array.isArray(vals.categoryId) ? vals.categoryId[2] : '',
        };

        setProduct({ productId: id, ...params }).then((res) => {
          if (!res) return;
          if (id) {
            res && message.success('编辑数据成功');
          } else {
            res && message.success('添加数据成功');
          }
          gotoPage('/goods/list');
        });
      }
    });
  };
  handleDeleteAll = () => {
    Modal.confirm({
      title: '提示',
      content: '确认要删除全部图片吗?',
      onOk: () => {
        this.props.form.setFieldsValue({ 'listImage': [] })
      }
    });
  }
  isShowDeleteAll = () => {
    const listImage = this.props.form.getFieldValue('listImage');
    return listImage && listImage.length > 0;
  }
  handleInput = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }

  supplierChange = (value) => {
    const { supplier } = this.state;
    const { form: { resetFields } } = this.props;
    const currentSupplier = supplier.find(item => item.id === value) || {};
    if (currentSupplier.category == 1) {
      resetFields('interception');
      this.setState({
        interceptionVisible: false
      })
    } else {
      resetFields('interception', '0');
      this.setState({
        interceptionVisible: true
      })
    }
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    const { supplier, interceptionVisible } = this.state;

    return (
      <Form {...formLayout}>
        <Card title="添加/编辑商品">
          <Form.Item label="商品名称">
            {getFieldDecorator('productName', {
              rules: [
                {
                  required: true,
                  message: '请输入商品名称',
                },
              ],
            })(<Input placeholder="请输入商品名称" />)}
          </Form.Item>
          <Form.Item label="商品类目">
            {getFieldDecorator('categoryId', {
              rules: [
                {
                  required: true,
                  message: '请选择商品类目',
                },
                {
                  validator(rule, value, callback) {
                    if (!value || value.length === 0) {
                      callback('请选择类目')
                    }
                    callback()
                  },
                }
              ],
            })(<Cascader options={this.state.categoryList} placeholder="请输入商品类目" />)}
          </Form.Item>
          <Form.Item label="商品简称">
            {getFieldDecorator('productShortName', {
              rules: [
                {
                  required: true,
                  message: '请输入商品简称',
                },
              ],
            })(<Input placeholder="请输入商品简称" />)}
          </Form.Item>
          <Form.Item label="商品编码">
            {getFieldDecorator('productCode', {
              rules: [
                {
                  required: true,
                  message: '请输入商品编码',
                },
              ],
            })(<Input placeholder="请输入商品编码" />)}
          </Form.Item>
          <Form.Item label="商品简介">
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: '请输入商品简介',
                },
              ],
            })(<Input placeholder="请输入商品简介" />)}
          </Form.Item>
          <Form.Item label="商品条码">
            {getFieldDecorator('barCode', {
              rules: [
                {
                  validator: barCodeValidator
                },
              ],
            })(<Input placeholder="请输入商品条码" />)}
          </Form.Item>
          <Form.Item label="供货商">
            {getFieldDecorator('storeId', {
              rules: [
                {
                  required: true,
                  message: '请选择供应商',
                },
              ],
              onChange: this.supplierChange
            })(
              <Select
                placeholder="请选择供货商"
                showSearch
                filterOption={(inputValue, option) => {
                  return option.props.children.indexOf(inputValue) > -1;
                }}
              >
                {map(supplier, item => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="供应商商品ID">
            {getFieldDecorator('storeProductId')(<Input placeholder="请填写供货商商品ID" />)}
          </Form.Item>
          {
            interceptionVisible ?
              <Form.Item label="是否可拦截发货">
                {getFieldDecorator('interception', {
                  initialValue: 0,
                })(
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item> :
              null
          }
           <Form.Item label="实名认证" required>
            {getFieldDecorator('isAuthentication', {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: '请选择实名认证'
                }
              ]
            })(
              <Radio.Group>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="商品视频封面">
            {getFieldDecorator('videoCoverUrl')(<UploadView placeholder="上传视频封面" listType="picture-card" listNum={1} size={0.3} />)}
          </Form.Item>
          <Form.Item label="商品视频">
            {getFieldDecorator('videoUrl')(<UploadView placeholder="上传视频" fileType='video' listType="picture-card" listNum={1} size={5} />)}
          </Form.Item>
          <Form.Item label="商品主图" required={true}>
            {getFieldDecorator('coverUrl', {
              rules: [
                {
                  required: true,
                  message: '请设置商品主图',
                },
              ],
            })(<UploadView placeholder="上传主图" listType="picture-card" listNum={1} size={.3} />)}
          </Form.Item>
          <Form.Item
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
                size={.3}
              />,
            )}
          </Form.Item>
          <Form.Item label="banner图片" required={true}>
            {getFieldDecorator('bannerUrl', {
              rules: [
                {
                  required: true,
                  message: '请设置banner图片',
                },
              ],
            })(<UploadView placeholder="上传主图" listType="picture-card" listNum={1} size={.3} />)}
          </Form.Item>
          <Form.Item label="累计销量" required={true}>
            {getFieldDecorator('showNum', {
              rules: [
                {
                  required: true,
                  message: '请选择累计销量'
                }
              ]
            })(
              <Radio.Group>
                <Radio value={1}>展示</Radio>
                <Radio value={0}>不展示</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Card>
        <SkuList
          showImage={this.state.showImage}
          specs={this.state.speSelect}
          dataSource={this.state.data}
          onChange={(value, specs, showImage) => {
            console.log(specs, 'skulist change')
            this.setState({
              data: value,
              speSelect: specs,
              showImage
            })
          }}
        />
        <Card title="物流信息" style={{ marginTop: 10 }}>
          <Form.Item label="物流体积">
            {getFieldDecorator('bulk')(<Input placeholder="请设置物流体积" />)}
          </Form.Item>
          <Form.Item label="物流重量">
            {getFieldDecorator('weight')(<Input placeholder="请设置物流重量" />)}
          </Form.Item>
          <Form.Item label="运费设置">
            {getFieldDecorator('withShippingFree', {
              initialValue: 0,
            })(
              <Radio.Group>
                <Radio value={1}>包邮</Radio>
                <Radio value={0}>不包邮</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item
            label="退货地址"
            wrapperCol={{
              span: 18
            }}
          >
            <div>
              <Input
                style={{width: 160, marginRight: 10}}
                className={styles['no-error']}
                name="returnContact"
                placeholder="收货人姓名"
                value={this.state.returnContact}
                onChange={this.handleInput}
              />
              {getFieldDecorator('returnPhone', {
                rules: [
                  // {required: true, message: '收货人电话不能为空'},
                  {
                    max: 12,
                    message: '收货人电话格式不正确'
                  }
                ]
              })(
                <Input
                  style={{width: 160, marginRight: 10}}
                  placeholder="收货人电话"
                  name="returnPhone"
                  value={this.state.returnPhone}
                  type="tel"
                  maxLength={12}
                  onChange={this.handleInput}
                />
              )}
              <Input
                style={{width: 250}}
                className={styles['no-error']}
                name="returnAddress"
                value={this.state.returnAddress}
                placeholder="收货人详细地址"
                onChange={this.handleInput}
              />
            </div>
          </Form.Item>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Form.Item label="商品详情页">
            <div className="mb20">
              {getFieldDecorator('listImage')(
                <UploadView showUploadList={true} size={0.3}>
                  <Button type="dashed">上传商品详情页</Button>
                </UploadView>,
              )}
            </div>
            {this.isShowDeleteAll() && <Button type="primary" onClick={this.handleDeleteAll}>一键删除</Button>}
          </Form.Item>
          <Form.Item label="上架状态">
            {getFieldDecorator('status', {
              initialValue: 0,
            })(
              <Radio.Group>
                <Radio value={1}>上架</Radio>
                <Radio value={0}>下架</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleSave} style={{ marginRight: 10 }}>
              保存
            </Button>
            <Button type="danger" onClick={() => gotoPage('/goods/list')}>
              返回
            </Button>
          </Form.Item>
        </Card>
      </Form>
    );
  }
}

export default Form.create()(GoodsEdit);
