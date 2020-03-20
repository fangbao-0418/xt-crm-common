import React from 'react';
import { Modal, Card, Input, Button, message, Radio, Select, Row, InputNumber } from 'antd';
import UploadView from '@/components/upload';
import { pick, map, size, filter, assign, isEmpty, flattenDeep } from 'lodash';
import { getStoreList, setProduct, getGoodsDetial, getStrategyByCategory, getCategoryList, get1688Sku, getTemplateList } from '../api';
import { gotoPage, parseQuery, getAllId, treeToarr } from '@/util/utils';
// import { radioStyle } from '@/config';
import SkuList from '../components/sku';
import SupplierSelect, { supplierItem } from '../components/supplier-select';
// import { TemplateList } from '@/components';
import styles from '../style.module.scss';
import { Form, FormItem, If } from '@/packages/common/components';
import ProductCategory from '../components/product-category';
// import ProductSelector from './components/product-seletor';
import { defaultConfig } from './config';
import DraggableUpload from '../components/draggable-upload';
import { RouteComponentProps } from 'react-router';
import { getBaseProduct, getBaseBarcode, setGroupProduct, getGroupProductDetail } from './api';
import { FormInstance } from '@/packages/common/components/form';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import SaleArea from '../../../../components/sale-area';
// function NumberValidator(rule: any, value: any, callback: any) {
//   if (!(/^\d{0,20}$/.test(value))) {
//     callback('仅支持数字，20个字符以内');
//   }
//   callback();
// }
interface SkuSaleFormState extends Record<string, any> {
  skuList: any[];
  specs: any[];
  templateOptions: any[];
  propertyId1: string;
  propertyId2: string;
  returnContact: string;
  returnPhone: string;
  returnAddress: string;
  showImage: boolean;
  strategyData: any;
  productCustomsDetailVOList: any[];
  supplierInfo: any;
  // interceptionVisible: boolean;
  freightTemplateId: string;
  checkType: 0 | 1;
  productBasicId?: number;
  // barCode: string;
  visible: boolean;
  // 1入库商品，0非入库商品
  // warehouseType: 0 | 1;
  productList: any[];
  isGroup: boolean;
  productCode: string;
  // checkedKeys: any[];
}
type SkuSaleFormProps = RouteComponentProps<{id: string}>;
class SkuSaleForm extends React.Component<SkuSaleFormProps, SkuSaleFormState> {
  form: FormInstance;
  state: SkuSaleFormState = {
    specs: [],
    templateOptions: [],
    skuList: [],
    propertyId1: '',
    propertyId2: '',
    returnContact: '',
    returnPhone: '',
    returnAddress: '',
    showImage: false,
    strategyData: null,
    productCustomsDetailVOList: [],
    supplierInfo: {},
    // interceptionVisible: false,
    freightTemplateId: '',
    checkType: 0,
    productBasicId: undefined,
    // barCode: '',
    // warehouseType: 1,
    visible: false,
    productList: [],
    isGroup: (parseQuery() as { isGroup: '0' | '1' }).isGroup === '1',
    productCode: '',
    // checkedKeys: []
  }
  id: number;
  modifyTime: number;
  constructor(props: SkuSaleFormProps) {
    super(props);
    this.id = +props.match.params.id;
  }
  componentDidMount() {
    // 编辑
    if (this.id !== -1) {
      this.fetchData();
    } else {
      getTemplateList().then((opts: any[]) => {
        this.setState({ templateOptions: opts });
      })
    }
  }
  // 重置状态
  initState() {
    this.setState({
      specs: [],
      skuList: [],
      propertyId1: '',
      propertyId2: '',
      returnContact: '',
      returnPhone: '',
      returnAddress: '',
      showImage: false,
      strategyData: null,
      productCustomsDetailVOList: [],
      supplierInfo: {},
      // interceptionVisible: false,
      freightTemplateId: '',
      checkType: 0,
      productBasicId: undefined,
      // barCode: '',
      visible: false,
      productList: [],
      productCode: ''
    })
  }
  /** 获取商品详情 */
  fetchData() {
    const payload = { productId: this.id }
    const promiseDetail = getGoodsDetial(payload);
    Promise.all([
      promiseDetail,
      getCategoryList(),
      getTemplateList()
    ]).then(([res, list, templateOptions]) => {
      this.modifyTime = res.modifyTime;
      // console.log('res.categoryId =>', res.categoryId);
      const categoryId = res.categoryId ? getAllId(treeToarr(list), [res.categoryId], 'pid').reverse() : [];
      categoryId[0] && this.getStrategyByCategory(categoryId[0]);
      this.getSupplierInfo(res.storeId);
      const isRepeat = templateOptions.some((opt: any) => opt.freightTemplateId === res.freightTemplateId)
      if (!isRepeat && res.freightTemplateId) {
        templateOptions = templateOptions.concat({
          freightTemplateId: res.freightTemplateId,
          templateName: res.freightTemplateName
        })
      }
      this.setState({
        templateOptions,
        specs: this.getSpecs([
          {
            title: res.property1,
            content: [],
          },
          {
            title: res.property2,
            content: [],
          },
        ], res.skuList),
        ...pick(res, [
          'productCode',
          'isGroup',
          // 'warehouseType',
          'freightTemplateId',
          'skuList',
          'specs',
          'propertyId1',
          'propertyId2',
          'returnContact',
          'returnPhone',
          'returnAddress',
          'showImage',
          'productCustomsDetailVOList'
        ])
      });
      this.form.setValues({
        categoryId,
        ...pick(res, [
          // 'warehouseType',
          'productType',
          'interception',
          'showNum',
          'description',
          'productId',
          'productName',
          'productShortName',
          // 'property1',
          // 'property2',
          'storeId',
          'status',
          'bulk',
          'weight',
          'withShippingFree',
          'coverUrl',
          'videoCoverUrl',
          'videoUrl',
          'deliveryMode',
          // 'barCode',
          'bannerUrl',
          'returnPhone',
          'listImage',
          'productImage',
          'storeProductId',
          'isAuthentication',
          'isCalculateFreight',
          'productSaleAreas'
        ])
      });
    });
  }

  //通过类目id查询是否有定价策略
  getStrategyByCategory = (categoryId: number) => {
    getStrategyByCategory({ categoryId })
      .then((strategyData: any[]) => {
        this.setState({
          strategyData
        })
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
  // 根据供应商ID查询供应商信息
  getSupplierInfo = (id: number) => {
    getStoreList({ pageSize: 5000, id }).then((res: any) => {
      const records = res.records || []
      let supplierInfo: any = {}
      if (records.length >= 1) {
        supplierInfo = records[0];
      }
      this.setState({
        supplierInfo,
        // interceptionVisible: supplierInfo.category == 1 ? false : true,
      });
    })
  }

  /**
   * 新增/编辑操作
   */
  handleSave = (status?: number) => {
    const {
      specs,
      skuList,
      freightTemplateId
    } = this.state
    if (!this.form) {
      return
    }
    this.form.props.form.validateFields((err, vals) => {
      this.forceUpdate()
      let msgs: any[] = []
      if (err) {
        const errs = flattenDeep(Object.keys(err).map(key => err[key].errors));
        msgs = errs.filter(item => item.pass).map(item => item.msg)
        if (errs.length !== msgs.length) {
          APP.error('请检查输入项')
          return
        }
      }
      if (specs.find((item) => { return item.content.length === 0 })) {
        APP.error('请添加商品规格')
        return
      }
      if (size(specs) === 0) {
        message.error('请添加规格');
        return false;
      }

      if (size(skuList) === 0) {
        message.error('请添加sku项');
        return false;
      }
      this.handleSetProduct(vals, status)
    });
  };
  handleSetProduct(vals:any, status?:number) {
    const {
      specs,
      skuList,
      propertyId1,
      propertyId2,
      freightTemplateId,
      isGroup,
      productCode
    } = this.state;
    const property = {};
    if (this.id !== -1) {
      assign(property, {
        propertyId1,
        propertyId2: specs[1] && propertyId2,
      });
    }
    /** 推送至仓库中即为下架，详情和列表页状态反了 */
    vals.status =  status === undefined ? vals.status : status
    // vals.productSaleAreas = [{
    //   cityId: '330100',
    //   districtId: '330110',
    //   provinceId: '330000'
    // }]
    setProduct({
      productCode,
      isGroup,
      modifyTime: this.modifyTime,
      productId: this.id,
      freightTemplateId,
      property1: specs[0] && specs[0].title,
      property2: specs[1] && specs[1].title,
      skuList,
      ...vals,
      ...pick(this.state, [
        'returnContact',
        'returnPhone',
        'returnAddress'
      ]),
      ...property
    }).then((res: any) => {
      if (!res) return;
      if (this.id !== -1) {
        APP.success('编辑数据成功');
      } else {
        APP.success('添加数据成功');
      }
      gotoPage('/fresh/goods/list');
    })
  }
  handleDeleteAll = () => {
    Modal.confirm({
      title: '提示',
      content: '确认要删除全部图片吗?',
      onOk: () => {
        this.form.props.form.setFieldsValue({ listImage: [] });
      },
    });
  }
  handleInput: React.ChangeEventHandler<Record<string, any>> = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }

  supplierChange = (value: string, options: supplierItem[]) => {
    let skuList = this.state.skuList
    const { form: { resetFields, getFieldsValue, setFieldsValue } } = this.form.props;
    const currentSupplier: any = options.find(item => item.id === +value) || {};
    const { category } = currentSupplier
    let { productType } = getFieldsValue()
    if (category === 1) {
      resetFields(['interception']);
    } else {
      resetFields(['interception']);
    }
    if (currentSupplier.category === 3) {
      productType = 10
    }
    // 普通供应商商品类型为0
    productType = [3, 4].indexOf(currentSupplier.category) > -1 ? productType : 0
    if (category === 4) {
      productType = 20
      this.form.props.form.setFieldsValue({isAuthentication: 1})
    } else if (category === 3) {
      productType = productType === 20 ? 0 : productType
      this.form.props.form.setFieldsValue({
        isAuthentication: 1
      })
    }
    setFieldsValue({
      productType
    })
    if (currentSupplier.category === 4) {
      skuList = skuList.map((item) => {
        return {
          ...item,
          deliveryMode: productType === 20 ? 4 : (item.deliveryMode === 4 ? 2 : item.deliveryMode)
        }
      })
    } else {
      skuList = skuList.map((item) => {
        return {
          ...item,
          deliveryMode: item.deliveryMode === 4 ? 2 : item.deliveryMode
        }
      })
    }
    this.setState({
      skuList,
      supplierInfo: currentSupplier
    })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }
  render() {
    const {
      // interceptionVisible,
      productCustomsDetailVOList,
      supplierInfo,
      freightTemplateId,
      templateOptions,
      checkType,
      // warehouseType,
      productBasicId,
      // barCode,
      visible,
      productList,
      productCode,
      // checkedKeys
    } = this.state;
    const { productType, status }: any = this.form ? this.form.getValues() : {}
    return (
      <Form
        getInstance={ref => this.form = ref}
        config={defaultConfig}
        namespace='freshSku'
      >
        {/* <ProductSelector
          dataSource={productList}
          visible={visible}
          onCancel={this.handleCancel}
          onOK={(value: any) => {
            this.handleCancel();
            this.getSkuStockDetailById(value)
          }}
        /> */}
        <Card title='添加/编辑商品'>
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
            label='商品类目'
            required={true}
            inner={(form) => {
              return form.getFieldDecorator('categoryId', {
                rules: [{
                  validator(rule, value, callback) {
                    if (!value || value.length === 0) {
                      callback('请选择商品类目');
                    }
                    callback();
                  }
                }],
                onChange: (val: any[]) => {
                  this.getStrategyByCategory(val[0])
                }
              } as GetFieldDecoratorOptions)(
                <ProductCategory
                  style={{ width: '60%' }}
                />
              )
            }}
          />
          <FormItem verifiable name='productShortName' />
          {/* <If condition={isGroup || warehouseType === 0}>
            <FormItem name='barCode' />
          </If> */}
          {/* <FormItem name='barCode' /> */}
          <If condition={!!productCode}>
            <FormItem label='商品编码'>{productCode}</FormItem>
          </If>
          <FormItem verifiable name='description' />
          <FormItem
            required={true}
            label='供应商'
            inner={(form) => {
              return form.getFieldDecorator('storeId', {
                rules: [
                  {
                    required: true,
                    message: '请输入供应商名称',
                  }
                ],
                onChange: this.supplierChange
              } as GetFieldDecoratorOptions)(
                <SupplierSelect
                  type='fresh'
                  style={{ width: '60%' }}
                  disabled={this.id !== -1 && supplierInfo.category === 4}
                  options={isEmpty(supplierInfo) ? []: [supplierInfo]}
                />
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
                        placeholder='上传主图'
                        listType='picture-card'
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
                    {form.getFieldDecorator('productImage', {
                      rules: [{
                        required: true,
                        message: '请上传商品图片',
                      }]
                    })(<DraggableUpload
                      className={styles['goods-detail-draggable']}
                      listNum={5}
                      size={0.3}
                      placeholder='上传商品图片'
                    />)}
                    </div>
                  <div className={styles['input-wrapper-placeholder']}>（建议750*750px，300kb以内，最多可添加5张）</div>
                </div>
              )
            }}
          />
          <FormItem
            label='商品视频'
            inner={(form) => {
              return form.getFieldDecorator('videoUrl')(
                <UploadView
                  placeholder='上传视频'
                  fileType='video'
                  listType='picture-card'
                  listNum={1}
                  size={5}
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
                        placeholder='上传视频封面'
                        listType='picture-card'
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
            label='banner图片'
            required={true}
            inner={(form) => {
              return (
                <div className={styles['input-wrapper']}>
                  <div className={styles['input-wrapper-content']}>
                    {form.getFieldDecorator('bannerUrl', {
                        rules: [{
                          required: true,
                          message: '请设置banner图片',
                        }]
                      })(
                        <UploadView
                          placeholder='上传banner图片'
                          listType='picture-card'
                          listNum={1}
                          size={.3}
                        />
                      )}
                  </div>
                  <div className={styles['input-wrapper-placeholder']}>（建议700*320px，300kb以内）</div>
                </div>
              )
            }}
          />
          {/* <FormItem verifiable name='showNum' /> */}
        </Card>
        <SkuList
          form={this.form && this.form.props.form}
          showImage={this.state.showImage}
          specs={this.state.specs}
          dataSource={this.state.skuList}
          strategyData={this.state.strategyData}
          onChange={(value, specs, showImage) => {
            this.setState({
              skuList: value,
              specs,
              showImage
            })
          }}
        />
        <Card
          title='物流信息'
          style={{
            marginTop: 10
          }}
        >
          <FormItem name='bulk' />
          <FormItem name='weight' />
          <FormItem
            label='可售区域'
            required
            inner={(form) => {
              return form.getFieldDecorator('productSaleAreas', {
                rules: [{
                  validator: async (rules, value) => {
                    if (!value || Array.isArray(value) && value.length === 0) {
                      throw new Error('请选择可售区域');
                    }
                    return value;
                  }
                }]
              })(<SaleArea/>)
            }
          }/>
        </Card>
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
                        placeholder='上传商品详情图'
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
          <FormItem
            name='status'
            hidden={status === 2}
          />
          <FormItem>
            <Button
              className='mr10'
              type='primary'
              onClick={() => {
                this.handleSave()
              }}
            >
              保存
            </Button>
            <Button
              className='mr10'
              type='danger'
              onClick={() => {
                APP.history.go(-1)
              }}
            >
              返回
            </Button>
            <If condition={status === 2}>
              <Button
                onClick={() => {
                  this.handleSave(3)
                }}
              >
                推送至待上架
              </Button>
            </If>
          </FormItem>
        </Card>
      </Form>
    )
  }
}

export default SkuSaleForm
