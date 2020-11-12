import React from 'react'
import { Modal, Card, Input, Button, message, Radio, Select, Row, InputNumber, Checkbox } from 'antd'
import UploadView, { VideoUpload } from '@/components/upload'
import { pick, map, size, filter, assign, isEmpty, flattenDeep } from 'lodash'
import { getStoreList, setProduct, getGoodsDetial, getStrategyByCategory, getCategoryList, get1688Sku, getTemplateList } from '../api'
import { gotoPage, parseQuery, getAllId, treeToarr } from '@/util/utils'
import { radioStyle } from '@/config'
import SkuList from '../components/sku'
import SupplierSelect, { supplierItem } from '../components/supplier-select'
import { TemplateList } from '@/components'
import styles from '../style.module.scss'
import { Form, FormItem, If } from '@/packages/common/components'
import ProductCategory from '../components/product-category'
import ProductSelector from './components/product-seletor'
import AdressReturn from './components/adress-return'
import { defaultConfig } from './config'
import DraggableUpload from '../components/draggable-upload'
import { RouteComponentProps } from 'react-router'
import { getBaseProduct, getBaseBarcode, setGroupProduct, getGroupProductDetail, checkCategory } from './api'
import { FormInstance } from '@/packages/common/components/form'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form'
import PageViewer from '@/components/page-viewer'
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
  barCode: string;
  visible: boolean;
  // 1入库商品，0非入库商品
  // warehouseType: 0 | 1;  已经不记到spu上，直接根据sku的选择进行区分
  productList: any[];
  isGroup: boolean;
  productCode: string;
  showFreightInsurance: boolean // 是否显示运费险
  enableFreightInsurance: 0 | 1
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
    barCode: '',
    visible: false,
    productList: [],
    isGroup: (parseQuery() as { isGroup: '0' | '1' }).isGroup === '1',
    productCode: '',
    showFreightInsurance: false,
    enableFreightInsurance: 0
  }
  id: number
  modifyTime: number
  adressReturnRef: any
  constructor (props: SkuSaleFormProps) {
    super(props)
    this.id = +props.match.params.id
  }
  componentDidMount () {
    // 编辑
    if (this.id !== -1) {
      this.fetchData()
    } else {
      getTemplateList().then((opts: any[]) => {
        this.setState({ templateOptions: opts })
      })
    }
  }
  // 重置状态
  initState () {
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
      barCode: '',
      visible: false,
      productList: [],
      productCode: ''
    })
  }
  /** 获取商品详情 */
  fetchData () {
    // 根据isGroup请求不同的接口
    const { isGroup } = this.state
    const payload = { productId: this.id }
    // const promiseDetail = isGroup ? getGroupProductDetail(payload): getGoodsDetial(payload);
    const promiseDetail = getGoodsDetial(payload)
    return Promise.all([
      promiseDetail,
      getCategoryList(),
      getTemplateList()
    ]).then(([res, list, templateOptions]) => {
      console.log(res, '77777')
      this.modifyTime = res.modifyTime
      // console.log('res.categoryId =>', res.categoryId);
      const categoryId = res.categoryId ? getAllId(treeToarr(list), [res.categoryId], 'pid').reverse() : []
      categoryId[0] && this.getStrategyByCategory(categoryId[0])
      this.getSupplierInfo(res.storeId)
      const isRepeat = templateOptions.some((opt: any) => String(opt.freightTemplateId) === String(res.freightTemplateId))
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
            content: []
          },
          {
            title: res.property2,
            content: []
          }
        ], res.skuList),
        ...pick(res, [
          'productCode',
          'isGroup',
          'freightTemplateId',
          'skuList',
          'specs',
          'propertyId1',
          'propertyId2',
          'returnContact',
          'returnPhone',
          'returnAddress',
          'showImage',
          'productCustomsDetailVOList',
          'enableFreightInsurance'
        ])
      })
      console.log('categoryId', categoryId)
      this.checkCategory(categoryId)
      this.form.setValues({
        categoryId,
        ...pick(res, [
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
          'barCode',
          'bannerUrl',
          'returnPhone',
          'listImage',
          'productImage',
          'storeProductId',
          'isAuthentication',
          'isCalculateFreight',
          'enableFreightInsurance'
        ]),
        storeAddress: {
          storeAddressId: res.storeAddressId + '',
          storeAddressTxt: `${res.returnContact} ${res.returnPhone} ${res.returnAddress}`
        }
      })
      if (res.storeId) {
        this.adressReturnRef.fetchData(res.storeId)
      }
    })
  }

  //通过类目id查询是否有定价策略
  getStrategyByCategory = (categoryId: number) => {
    if (!categoryId) {
      return
    }
    getStrategyByCategory({ categoryId })
      .then((strategyData: any[]) => {
        this.setState({
          strategyData
        })
      })
  }

  /** 获取规格结果 */
  getSpecs (specs: any[], skuList: any[] = []) {
    map(skuList, (item, key) => {
      if (
        item.propertyValue1
        && specs[0]
        && (specs[0].content as any[]).findIndex(val => val.specName === item.propertyValue1) === -1
      ) {
        specs[0].content.push({
          specName: item.propertyValue1,
          specPicture: item.imageUrl1
        })
      }
      if (
        item.propertyValue2
        && specs[1]
        && (specs[1].content as any[]).findIndex(val => val.specName === item.propertyValue2) === -1
      ) {
        specs[1].content.push({
          specName: item.propertyValue2
        })
      }
    })
    return filter(specs, item => !!item.title)
  }
  // 根据供应商ID查询供应商信息
  getSupplierInfo = (id: number) => {
    getStoreList({ pageSize: 5000, id }).then((res: any) => {
      const records = res.records || []
      let supplierInfo: any = {}
      if (records.length >= 1) {
        supplierInfo = records[0]
      }
      this.setState({
        supplierInfo
        // interceptionVisible: supplierInfo.category == 1 ? false : true,
      })
    })
  }
  sync1688Sku = () => {
    this.form && this.form.props.form.validateFields((err, vals) => {
      if (!vals.storeProductId) {
        return
      }
      get1688Sku(vals.storeProductId).then((data: any)=>{
        if (!data) {
          return
        }
        const skus = (data.skus || []).map((item: any) => {
          return {
            ...item,
            stock: item.inventory,
            storeProductSkuId: item.storeSkuId,
            deliveryMode: 2
          }
        })
        this.setState({
          specs: this.getSpecs([
            {
              title: data.attributeName1,
              content: []
            },
            {
              title: data.attributeName2,
              content: []
            }
          ], skus),
          skuList: skus
        })
      })
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
    this.form.props.form.validateFields((err, { storeAddress, ...vals }) => {
      this.forceUpdate()
      let msgs = []
      if (err) {
        const errs = flattenDeep(Object.keys(err).map(key => err[key].errors))
        msgs = errs.filter(item => item.pass).map(item => item.msg)
        console.log(errs, msgs)
        if (errs.length !== msgs.length) {
          APP.error('请检查输入项')
          return
        }
      }
      
      if (vals.videoUrl?.length) {
        if (!vals.videoCoverUrl?.length) {
          APP.error('请上传视频封面')
          return
        }
      }

      if (specs.find((item) => {
        return item.content.length === 0
      })) {
        APP.error('请添加商品规格')
        return
      }
      if (size(specs) === 0) {
        message.error('请添加规格')
        return false
      }

      if (size(skuList) === 0) {
        message.error('请添加sku项')
        return false
      }
      if (vals.withShippingFree === 0 && !freightTemplateId) {
        message.error('请选择运费模板')
        return
      }

      if (storeAddress.storeAddressId) {
        vals.storeAddressId = +storeAddress.storeAddressId
      } else {
        message.error('请选择退货地址')
        return
      }
    
      if (msgs.length) {
        Modal.confirm({
          title: <div style={{ textAlign: 'center' }}>商品价格提醒</div>,
          icon: null,
          width: 800,
          content: (
            <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
              {msgs.map((msg, i) => (
                <div key={i} style={{ marginBottom: '5px' }}>
                  {msg}
                </div>
              ))}
            </div>
          ),
          onOk: () => {
            this.handleSetProduct(vals, status)
          }
        })
      } else {
        this.handleSetProduct(vals, status)
      }
    })
  }

  handleSetProduct (vals:any, status?:number) {
    const {
      specs,
      skuList,
      propertyId1,
      propertyId2,
      freightTemplateId,
      isGroup,
      productCode
    } = this.state
    const property = {}
    if (this.id !== -1) {
      assign(property, {
        propertyId1,
        propertyId2: specs[1] && propertyId2
      })
    }
    /** 推送至仓库中即为下架，详情和列表页状态反了 */
    vals.status = status === undefined ? vals.status : status
    // 组合商品新增、编辑
    if (isGroup) {
      setGroupProduct({
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
        if (!res) {
          return
        }
        if (this.id !== -1) {
          APP.success('编辑数据成功')
        } else {
          APP.success('添加数据成功')
        }
        gotoPage('/goods/list')
      })
    } else {
      // 普通商品新增、编辑
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
        if (!res) {
          return
        }
        if (this.id !== -1) {
          APP.success('编辑数据成功')
        } else {
          APP.success('添加数据成功')
        }
        gotoPage('/goods/list')
      })
    }
  }
  handleDeleteAll = () => {
    Modal.confirm({
      title: '提示',
      content: '确认要删除全部图片吗?',
      onOk: () => {
        this.form.props.form.setFieldsValue({ listImage: [] })
      }
    })
  }
  handleInput: React.ChangeEventHandler<Record<string, any>> = (event) => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  supplierChange = (value: string, options: supplierItem[]) => {
    console.log(198288282)
    let skuList = this.state.skuList
    const { form: { resetFields, getFieldsValue, setFieldsValue } } = this.form.props
    const currentSupplier: any = options.find(item => item.id === +value) || {}
    const { category } = currentSupplier
    let { productType } = getFieldsValue()
    if (category === 1) {
      resetFields(['interception'])
      // this.setState({
      //   interceptionVisible: false
      // })
    } else {
      resetFields(['interception'])
      // this.setState({
      //   interceptionVisible: true
      // })
    }
    if (currentSupplier.category === 3) {
      productType = 10
    }
    // 普通供应商商品类型为0
    productType = [3, 4].indexOf(currentSupplier.category) > -1 ? productType : 0
    if (category === 4) {
      productType = 20
      this.form.props.form.setFieldsValue({ isAuthentication: 1 })
    } else if (category === 3) {
      productType = productType === 20 ? 0 : productType
      this.form.props.form.setFieldsValue({
        isAuthentication: 1
      })
    }
    setFieldsValue({
      productType,
      storeAddress: {
        storeAddressId: undefined,
        storeAddressTxt: ''
      }
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
    if (this.adressReturnRef) {
      this.adressReturnRef.fetchData(value)
    }
  }
  // 校验商品条码
  getSkuStockDetailByCode = () => {
    const { barCode } = this.state
    if (!barCode) {
      return void APP.error('请输入商品条码')
    }
    Promise.all([
      getBaseBarcode(barCode),
      getCategoryList()
    ])
    // 可通过条码集库存商品ID对商品进行关联，同一个条码存在多个商品时，需要进行选择后进行信息填充；唯一时，自动填充信息
      .then(([res, list]: any) => {
        if (!Array.isArray(res)) {
          return
        }

        // 存在唯一商品
        if (res.length === 1) {
          this.getSkuStockDetailById(res[0].productBasicId)
        }
        // 存在多个商品
        else if (res.length >= 1) {
          this.setState({
            visible: true,
            productList: res
          })
        }
      })
  }
  // 校验库存商品ID
  getSkuStockDetailById = (productBasicId?: number) => {
    if (!productBasicId) {
      return void APP.error('请输入库存商品ID')
    }
    Promise.all([
      getBaseProduct(productBasicId),
      getCategoryList()
    ])
      .then((value: any) => {
      // console.log(value, '|||||||||||||||||||||')
        this.setProductFileds(value)
      })
  }

  setProductFileds ([res, list]: any) {
    this.form.resetValues()
    this.initState()
    this.getSupplierInfo(res.storeId)
    const categoryId = res.categoryId ? getAllId(treeToarr(list), [res.categoryId], 'pid').reverse() : []
    categoryId[0] && this.getStrategyByCategory(categoryId[0])
    console.log('setProductFileds res =>//////////////////////// ', res)
    const specs = this.getSpecs([
      {
        title: res.property1,
        content: []
      },
      {
        title: res.property2,
        content: []
      }
    ], res.skuList)
    this.setState({
      // templateOptions,
      specs,
      ...pick(res, [
        'productCode',
        'isGroup',
        'productBasicId',
        'barCode',
        'freightTemplateId',
        'skuList',
        'propertyId1',
        'propertyId2',
        'returnContact',
        'returnPhone',
        'returnAddress',
        'showImage',
        'productCustomsDetailVOList'
      ])
    })
    this.form.setValues({
      categoryId,
      ...pick(res, [
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
        'barCode',
        'bannerUrl',
        'returnPhone',
        'listImage',
        'productImage',
        'storeProductId',
        'isAuthentication',
        'isCalculateFreight',
        'enableFreightInsurance'
      ]),
      storeAddress: {
        storeAddressId: res.storeAddressId ? res.storeAddressId + '' : undefined,
        storeAddressTxt: res.returnContact ? `${res.returnContact} ${res.returnPhone} ${res.returnAddress}` : ''
      }
    })
    if (res.storeId) {
      this.adressReturnRef.fetchData(res.storeId)
    }
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }
  checkCategory = async (val: number[]) => {
    if (!val || Array.isArray(val) && val.length === 0) {
      return
    }
    const showFreightInsurance = await checkCategory({
      firstCategoryId: val[0],
      secondCategoryId: val[1],
      thirdCategoryId: val[2]
    })
    this.setState({ showFreightInsurance })
  }
  render () {
    const {
      // interceptionVisible,
      productCustomsDetailVOList,
      supplierInfo,
      freightTemplateId,
      templateOptions,
      checkType,
      productBasicId,
      barCode,
      visible,
      productList,
      isGroup,
      productCode,
      showFreightInsurance,
      enableFreightInsurance
    } = this.state
    const { productType, status, storeId }: any = this.form ? this.form.getValues() : {}
    console.log(barCode, 'render123', storeId)
    return (
      <Form
        getInstance={ref => this.form = ref}
        config={defaultConfig}
        namespace='skuSale'
        onChange={() => {
          const pageViewer = this.refs.pageViewer as PageViewer
          pageViewer?.view?.()
        }}
      >
        <div ref='el'>
          <PageViewer
            ref='pageViewer'
            el={this.refs.el as any}
          />
          <ProductSelector
            dataSource={productList}
            visible={visible}
            onCancel={this.handleCancel}
            onOK={(value: any) => {
              this.handleCancel()
              this.getSkuStockDetailById(value)
            }}
          />
          <Card title='添加/编辑商品'>
            {/* 非组合商品才显示 */}
            <If condition={!isGroup}>
              <FormItem label='商品校验类型'>
                <Radio.Group
                  onChange={(e) => {
                    this.form.resetValues()
                    this.initState()
                    this.initState()
                    this.setState({
                      checkType: e.target.value
                    })
                  }}
                  value={checkType}
                  options={[{
                    label: '商品条码',
                    value: 0
                  }, {
                    label: '库存商品ID',
                    value: 1
                  }]}
                />
              </FormItem>
              <If condition={checkType === 0}>
                <FormItem
                  label='商品条码'
                >
                  <Input
                    value={barCode}
                    onChange={(e) => {
                      this.setState({
                        barCode: e.target.value
                      })
                    }}
                    style={{ width: '60%' }}
                    placeholder='请输入商品条码'
                  />
                  <Button
                    className='ml10'
                    onClick={this.getSkuStockDetailByCode}
                  >
                      校验
                  </Button>
                </FormItem>
              </If>
              <If condition={checkType === 1}>
                <FormItem
                  label='库存商品ID'
                >
                  <InputNumber
                    maxLength={20}
                    style={{ width: '60%' }}
                    placeholder='请输入库存商品ID'
                    value={productBasicId}
                    onChange={(productBasicId) => {
                      this.setState({
                        productBasicId
                      })
                    }}
                  />
                  <Button
                    className='ml10'
                    onClick={() => {
                      this.getSkuStockDetailById(this.state.productBasicId)
                    }}
                  >
                      校验
                  </Button>
                </FormItem>
              </If>
            </If>
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
                    validator (rule, value, callback) {
                      if (!value || value.length === 0) {
                        callback('请选择商品类目')
                      }
                      callback()
                    }
                  }],
                  onChange: (val: any[]) => {
                    // 校验类目是否支持展示运费险
                    this.checkCategory(val)
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
            <FormItem name='barCode' />
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
                      message: '请输入供应商名称'
                    }
                  ],
                  onChange: this.supplierChange
                } as GetFieldDecoratorOptions)(
                  <SupplierSelect
                    style={{ width: '60%' }}
                    disabled={this.id !== -1 && supplierInfo.category === 4}
                    options={isEmpty(supplierInfo) ? []: [supplierInfo]}
                  />
                )
              }}
            />
            {/* 只有非入库商品显示供应商商品ID，供应商发货 */}
            <FormItem
              label='供应商商品ID'
              inner={(form) => {
                return (
                  <>
                    {form.getFieldDecorator('storeProductId')(
                      <Input
                        style={{ width: '60%' }}
                        placeholder='请填写供货商商品ID'
                      />
                    )}
                    <If condition={this.id === -1}>
                      <Button
                        className='ml10'
                        onClick={this.sync1688Sku}
                      >
                        同步1688规格信息
                      </Button>
                    </If>
                  </>
                )
              }}
            />
            <FormItem
              name='interception'
              verifiable
              // hidden={!interceptionVisible}
              controlProps={{
                disabled: productType === 20,
                onChange: (event: any) => {
                  if (event.target.value === 1) {
                    this.form.setValues({ enableFreightInsurance: false })
                  }
                }
              }}
            />
            {/* 是否支持运费险 0:不支持,1:支持 */}
            {showFreightInsurance && (<FormItem
              label='服务保障'
              inner={(form) => {
                const interception = form.getFieldValue('interception')
                return (
                  <>
                    {form.getFieldDecorator('enableFreightInsurance', {
                      initialValue: enableFreightInsurance,
                      valuePropName: 'checked'
                    })(
                      <Checkbox disabled={interception === 1}>赠运费险</Checkbox>
                    )}
                    <span style={{ color: 'red' }}>拦截商品不支持运费险</span>
                  </>
                )
              }}
            />)}
            <FormItem
              label='商品类型'
              required
              hidden={![3, 4].includes(supplierInfo.category)}
              inner={(form) => {
                return form.getFieldDecorator('productType', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '请选择商品类型'
                    }
                  ]
                })(
                  <Select
                    style={{ width: '60%' }}
                    disabled={this.id !== -1 && supplierInfo.category !== 3}
                    onChange={(value: number) => {
                      /** 海淘商品 */
                      if ([10, 20].indexOf(value) > -1) {
                        this.form.props.form.setFieldsValue({
                          isAuthentication: 1
                        })
                      } else {
                        this.form.props.form.setFieldsValue({ isAuthentication: 0 })
                      }
                      if (value === 20) {
                        this.form.props.form.setFieldsValue({ interception: 0 })
                      }
                      const skuList = (this.state.skuList || []).map((item) => {
                        item.skuCode = ''
                        item.deliveryMode = value === 20 ? 4 : 2
                        return item
                      })
                      this.setState({
                        skuList
                      })
                    }}
                  >
                    {supplierInfo.category !== 4 && (
                      <Select.Option
                        value={0}
                      >
                        普通商品
                      </Select.Option>
                    )}
                    {supplierInfo.category === 3 && (
                      <Select.Option
                        value={10}
                      >
                        一般海淘商品
                      </Select.Option>
                    )}
                    {supplierInfo.category === 4 && (
                      <Select.Option
                        value={20}
                      >
                        保税仓海淘商品
                      </Select.Option>
                    )}
                  </Select>
                )
              }}
            />
            <FormItem
              verifiable
              name='isAuthentication'
              controlProps={{
                disabled: [10, 20].indexOf(productType) > -1
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
                          ossType='cos'
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
              label='商品视频'
              inner={(form) => {
                return form.getFieldDecorator('videoUrl')(
                  <VideoUpload
                    maxSize={5 * 1024 * 1024}
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
                            message: '请设置商品主图'
                          }
                        ]
                      })(
                        <UploadView
                          ossType='cos'
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
                          message: '请上传商品图片'
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
              label='banner图片'
              required={true}
              inner={(form) => {
                return (
                  <div className={styles['input-wrapper']}>
                    <div className={styles['input-wrapper-content']}>
                      {form.getFieldDecorator('bannerUrl', {
                        rules: [{
                          required: true,
                          message: '请设置banner图片'
                        }]
                      })(
                        <UploadView
                          ossType='cos'
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
            <FormItem verifiable name='showNum' />
          </Card>
          <SkuList
            isGroup={isGroup}
            form={this.form && this.form.props.form}
            type={productType}
            productCustomsDetailVOList={productCustomsDetailVOList}
            showImage={this.state.showImage}
            specs={this.state.specs}
            dataSource={this.state.skuList}
            strategyData={this.state.strategyData}
            onChange={(value, specs, showImage) => {
              this.setState({
                skuList: value,
                specs: specs,
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
              label='运费设置'
              inner={(form) => {
                return form.getFieldDecorator('withShippingFree', {
                  initialValue: 0
                })(
                  <Radio.Group>
                    <Radio
                      style={radioStyle}
                      value={1}
                    >
                      包邮
                    </Radio>
                    <Radio
                      style={radioStyle}
                      value={0}
                    >
                      <TemplateList
                        dataSource={templateOptions}
                        value={freightTemplateId}
                        onChange={(freightTemplateId) => {
                          this.setState({
                            freightTemplateId
                          })
                        }}
                      />
                    </Radio>
                  </Radio.Group>
                )
              }}
            />
            <FormItem
              required
              label='单独计算运费'
              inner={(form) => {
                return form.getFieldDecorator('isCalculateFreight', {
                  initialValue: 0,
                  rules: [
                    {
                      required: true,
                      message: '请选择是否进行单独计算运费'
                    }
                  ]
                })(
                  <Radio.Group>
                    <Radio value={0}>
                      否
                    </Radio>
                    <Radio value={1}>
                      是
                    </Radio>
                    <span style={{ color: 'red' }}>*商品会叠加运费</span>
                  </Radio.Group>,
                )
              }}
            />
            <FormItem
              hidden={!storeId}
              label='退货地址'
              required={!!storeId}
              inner={(form) => {
                return (
                  <div style={{ width: 500 }}>
                    {
                      form.getFieldDecorator('storeAddress', {
                        rules: [
                          {
                            required: !!storeId,
                            message: '请选择退货地址'
                          }
                        ]
                      })(
                        <AdressReturn storeId={storeId} ref={ref => this.adressReturnRef = ref} />
                      )
                    }
                  </div>
                )
              }}
            />
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
                const listImage = form.getFieldValue('listImage')
                const isExist = Array.isArray(listImage) && listImage.length > 0
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
                  APP.history.push('/goods/list')
                }}
              >
                返回
              </Button>
              <If condition={status === 2}>
                <Button
                  onClick={() => {
                    this.handleSave(3)
                  }}>
                  推送至待上架
                </Button>
              </If>
            </FormItem>
          </Card>
        </div>
      </Form>
    )
  }
}

export default SkuSaleForm
