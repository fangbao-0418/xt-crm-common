import React from 'react';
import Form, { FormItem, FormInstance } from '@/packages/common/components/form';
import { Card, Input, Button, Modal } from 'antd';
import ProductCategory from '../components/product-category';
import { defaultConfig } from './config'
import { RouteComponentProps } from 'react-router'
import SupplierSelect from '../components/supplier-select';
import DraggableUpload from '../components/draggable-upload';
import styles from '../style.module.scss';
import UploadView from '@/components/upload';
import { pick, map, filter } from 'lodash';
import If from '@/packages/common/components/if';
import SkuList, { CSkuProps, Spec } from './components/sku';
import { addProduct, updateProduct, getProduct } from './api';
import { getGoodsDetial, getCategoryList } from '../api';
import { filterSkuList } from './adapter';
import { getAllId, treeToarr } from '@/util/utils';
interface SkuStockFormState {
  specs: Spec[];
  skuAddList: CSkuProps[];
  showImage: boolean;
  productId: string;
}

export interface SkuStockFormProps extends RouteComponentProps<{id: string}> {
  // 条形码
  barCode: string;
  // 商品名称
  productName: string;
  // 分类id
  categoryId: number;
  // 商品简称
  productShortName: string;
  // 商品简介
  description: string;
  // 商品编码
  productCode: string;
  // 供应商ID
  storeId: string;
  // 视频封面地址
  videoCoverUrl: any;
  // 视频地址
  videoUrl: any;
  // 封面图片地址
  coverUrl: any;
  productImage: any;
  // 商品图片，逗号分开
  bannerUrl: any;
  // 产品详情图
  listImage: any;
  // 库存商品sku新增参数
  skuAddList: CSkuProps[];
  [key: string]: any;
}
class SkuStockForm extends React.Component<SkuStockFormProps, SkuStockFormState> {
  specs: any[] = [];
  id: number;
  form: FormInstance;
  constructor(props: SkuStockFormProps) {
    super(props);
    this.id = +props.match.params.id;
    this.state = {
      specs: [],
      skuAddList: [],
      showImage: false,
      productId: ''
    }
  }
  componentDidMount() {
    this.id !== -1 && this.fetchData();
  }
  // 获取库存商品详情
  fetchData() {
    getProduct(this.id).then(res => {
      this.form.setValues(pick(res, [
        'bannerUrl',
        'barCode',
        'coverUrl',
        'description',
        'listImage',
        'productCode',
        'productImage',
        'productName',
        'productShortName',
        'videoCoverUrl',
        'videoUrl'
      ]));
      this.setState(pick(res, [
        'skuAddList',
        'showImage',
        'specs'
      ]));
    })
  }
  handleDeleteAll = () => {
    Modal.confirm({
      title: '提示',
      content: '确认要删除全部图片吗?',
      onOk: () => {
        this.form.props.form.setFieldsValue({ listImage: [] });
      }
    })
  }
  goBack = () => {
    APP.history.go(-1)
  }
  handleSave = () => {
    this.form.props.form.validateFields((errs, vals) => {
      if (!errs) {
        vals = { ...vals, skuAddList: this.state.skuAddList }
        const isAdd = this.id === -1;
        const promiseResult = isAdd ? addProduct(vals) : updateProduct(vals);
        promiseResult.then((res: boolean) => {
          if (res) {
            APP.success(`${isAdd ? '新增' : '编辑'}成功`);
            APP.history.go(-1);
          }
        })
      }
    })
  }
   /** 获取规格结果 */
   getSpecs(specs: any[], skuList: any[] = []) {
    map(skuList, (item, key) => {
      if (
        item.propertyValue1 &&
        specs[0] &&
        (specs[0].content as any[]).findIndex(val => val.specName === item.propertyValue1) === -1
      ) {
        specs[0].content.push({
          specName: item.propertyValue1,
          specPicture: item.imageUrl1,
        });
      }
      if (
        item.propertyValue2 &&
        specs[1] &&
        (specs[1].content as any[]).findIndex(val => val.specName === item.propertyValue2) === -1
      ) {
        specs[1].content.push({
          specName: item.propertyValue2,
        });
      }
    });
    return filter(specs, item => !!item.title);
  }
  // 获取销售商品详情，用于回显s
  fetchSaleProduct = () => {
    Promise.all([
      getGoodsDetial({ productId: this.state.productId }),
      getCategoryList()
    ]).then(([res, list]: any) => {
      const categoryId = res.productCategoryVO && res.productCategoryVO.id ?
        getAllId(treeToarr(list), [res.productCategoryVO.id], 'pid').reverse() :
        [];
      this.form.resetValues();
      this.form.setValues({
        categoryId,
        ...pick(res, [
          'bannerUrl',
          'barCode',
          'coverUrl',
          'description',
          'listImage',
          'productCode',
          'productImage',
          'productName',
          'productShortName',
          'videoCoverUrl',
          'videoUrl'
        ])
      });
      const skuList = filterSkuList(res.skuList);
      this.specs = this.getSpecs([
        {
          title: res.property1,
          content: [],
        },
        {
          title: res.property2,
          content: [],
        },
      ], skuList);
      this.setState({
        'skuAddList': skuList,
        'showImage': res.showImage,
        'specs': this.specs
      });
    });
  }
  render() {
    const {
      specs,
      skuAddList,
      showImage,
      productId
    } = this.state;
    return (
      <Form
        namespace='skuStock'
        config={defaultConfig}
        getInstance={ref => this.form = ref}
        addonAfter={(
          <FormItem className='mt10'>
            <Button
              type='primary'
              onClick={this.handleSave}
            >
              保存
            </Button>
            <Button
              className='ml10'
              onClick={this.goBack}
            >
              取消
            </Button>
          </FormItem>
        )}
      >
        <Card title='基本信息'>
          <FormItem label='销售商品ID'>
            <Input
              value={productId}
              onChange={e => this.setState({ productId: e.target.value })}
              placeholder='请输入销售商品ID'
              style={{ width: '60%' }}
            />
            <Button
              className='ml10'
              onClick={this.fetchSaleProduct}
            >
              校验
            </Button>
          </FormItem>
          <FormItem
            label='商品条码'
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('barCode')(
                    <Input
                      placeholder='请输入商品条码'
                      style={{ width: '60%' }}
                    />
                  )}
                  <Button className='ml10'>校验</Button>
                </>
              )
            }}
          />
          <FormItem
            verifiable
            name='productName'
            controlProps={{
              style: {
                width: '60%'
              }
            }}
          />
          <FormItem
            required
            label='商品类目'
            inner={(form) => {
              return form.getFieldDecorator('categoryId', {
                rules: [{
                  required: true,
                  message: '请选择商品类目'
                }]
              })(
                <ProductCategory
                  style={{ width: '60%' }}
                />
              )
            }}
          />
          <FormItem
            verifiable
            controlProps={{
              style: {
                width: '60%'
              }
            }}
            name='productShortName'
          />
          <FormItem verifiable name='description'/>
          <FormItem
            name='productCode'
            hidden={this.id === -1}
          />
          <FormItem
            label='供应商'
            inner={(form) => {
              return form.getFieldDecorator('storeId')(
                <SupplierSelect
                  style={{ width: '60%' }}
                />
              )
            }}
          />
          <FormItem
            label='商品视频封面'
            inner={(form) => {
              return (
                <div className={styles['input-wrapper']}>
                  <div className={styles['input-wrapper-content']}>
                    {form.getFieldDecorator('videoCoverUrl')(
                      <UploadView
                        placeholder="上传视频封面"
                        listType="picture-card"
                        listNum={1}
                        size={0.3}
                      />
                    )}
                  </div>
                  <div className={styles['input-wrapper-placeholder']}>（建议750*750px，300kb以内）</div>
                </div>
              )
            }}
          />
          <FormItem
            label='商品视频'
            inner={(form) => {
              return (
                <div>
                  <div>
                    {form.getFieldDecorator('videoUrl')(
                      <UploadView
                        placeholder="上传视频"
                        fileType="video"
                        listType="picture-card"
                        listNum={1}
                        size={5}
                      />
                    )}
                  </div>
                </div>
              )
            }}
          />
          <FormItem
            label='商品主图'
            required={true}
            inner={(form) => {
              return (
                <div className={styles['input-wrapper']}>
                  <div className={styles['input-wrapper-content']}>
                    {form.getFieldDecorator('coverUrl', {
                      rules: [
                        {
                          required: true,
                          message: '请设置商品主图',
                        },
                      ],
                    })(
                      <UploadView
                        placeholder="上传主图"
                        listType="picture-card"
                        listNum={1}
                        size={0.3}
                      />
                    )}
                  </div>
                  <div className={styles['input-wrapper-placeholder']}>（建议750*750px，300kb以内）</div>
                </div>
              )
            }}
          />
          <FormItem
            label='商品图片'
            required={true}
            inner={(form) => {
              return (
                <div className={styles['input-wrapper']}>
                  <div className={styles['input-wrapper-content']}>
                    {form.getFieldDecorator('productImage')(
                      <DraggableUpload
                        className={styles['goods-detail-draggable']}
                        listNum={5}
                        size={0.3}
                        placeholder="上传商品图片"
                      />
                    )}
                  </div>
                  <div className={styles['input-wrapper-placeholder']}>（建议750*750px，300kb以内，最多可添加5张）</div>
                </div>
              )
            }}
          />
          <FormItem
            label='banner图'
            required={true}
            inner={(form) => {
              return (
                <div className={styles['input-wrapper']}>
                  <div className={styles['input-wrapper-content']}>
                    {form.getFieldDecorator('bannerUrl')(
                      <UploadView
                        placeholder="上传banner图"
                        listType="picture-card"
                        listNum={1}
                        size={0.3}
                      />
                    )}
                  </div>
                  <div className={styles['input-wrapper-placeholder']}>（建议700*300px，300kb以内）</div>
                </div>
              )
            }}
          />
        </Card>
        <SkuList
          showImage={showImage}
          specs={specs}
          dataSource={skuAddList}
          form={this.form && this.form.props.form}
          onChange={(skuAddList, specs, showImage) => {
            this.setState({
              skuAddList,
              specs,
              showImage,
            });
          }}
        />
        <Card
          style={{ marginTop: 10 }}
          title={(
            <div>
              商品详情
              <span
                style={{
                  fontSize: 14,
                  color: '#999'
                }}
              >
                （建议图片宽度750px，单张图片300kb内）
              </span>
            </div>
          )}
        >
          <FormItem
            label='商品详情页'
            inner={(form) => {
              const listImage = form.getFieldValue('listImage');
              const isExist = Array.isArray(listImage) && listImage.length > 0;
              return (
                <>
                  <div className='mb20'>
                    {form.getFieldDecorator('listImage')(
                      <DraggableUpload
                        className={styles['goods-draggable']}
                        listNum={20}
                        size={0.3}
                        placeholder="上传商品详情图"
                      />
                    )}
                  </div>
                  
                  <If condition={isExist}>
                    <Button
                      type='primary'
                      onClick={this.handleDeleteAll}
                    >
                      一键删除
                    </Button>
                  </If>
                </>
              )
            }}
          />
        </Card>
      </Form>
    )
  }
}

export default SkuStockForm;