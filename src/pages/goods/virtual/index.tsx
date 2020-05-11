import React from 'react'
import { Modal, Card, Input, Button, message, Radio, Select, Row, InputNumber } from 'antd'
import UploadView from '@/components/upload'
import { pick, map, size, filter, assign } from 'lodash'
import { setProduct, getGoodsDetial, getStrategyByCategory, getCategoryList } from '../api'
import { parseQuery, getAllId, treeToarr } from '@/util/utils'
import SkuList from './components/sku'
import SupplierSelect from '../components/supplier-select'
import styles from '../style.module.scss'
import { Form, FormItem, If } from '@/packages/common/components'
import ProductCategory from '../components/product-category'
import { defaultConfig } from './config'
import { RouteComponentProps } from 'react-router'
// import { getBaseProduct, getBaseBarcode, setGroupProduct } from './api'
import { FormInstance } from '@/packages/common/components/form'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form'

interface SkuSaleFormState extends Record<string, any> {
  skuList: any[];
  specs: any[];
  propertyId1: string;
  propertyId2: string;
  returnContact: string;
  returnPhone: string;
  returnAddress: string;
  showImage: boolean;
  supplierInfo: any;
  checkType: 0 | 1;
  productBasicId?: number;
  barCode: string;
  visible: boolean;
  // 1入库商品，0非入库商品
  // warehouseType: 0 | 1;  已经不记到spu上，直接根据sku的选择进行区分
  productList: any[];
  isGroup: boolean;
  productCode: string;
}
type SkuSaleFormProps = RouteComponentProps<{id: string}>;
class SkuSaleForm extends React.Component<SkuSaleFormProps, SkuSaleFormState> {
  form: FormInstance;
  state: SkuSaleFormState = {
    specs: [],
    skuList: [],
    propertyId1: '',
    propertyId2: '',
    returnContact: '',
    returnPhone: '',
    returnAddress: '',
    showImage: false,
    supplierInfo: {},
    // interceptionVisible: false,
    checkType: 0,
    productBasicId: undefined,
    barCode: '',
    visible: false,
    productList: [],
    isGroup: (parseQuery() as { isGroup: '0' | '1' }).isGroup === '1',
    productCode: ''
  }
  id = +this.props.match.params.id
  modifyTime: number
  componentDidMount () {
    if (this.id !== -1) {
      this.fetchData()
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
      supplierInfo: {},
      // interceptionVisible: false,
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
    const payload = { productId: this.id }
    const promiseDetail = getGoodsDetial(payload)
    Promise.all([
      promiseDetail,
      getCategoryList()
    ]).then(([res, list]) => {
      this.modifyTime = res.modifyTime
      // console.log('res.categoryId =>', res.categoryId);
      const categoryId = res.categoryId ? getAllId(treeToarr(list), [res.categoryId], 'pid').reverse() : []
      this.setState({
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
          'skuList',
          'specs',
          'propertyId1',
          'propertyId2',
          'showImage'
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
          'withShippingFree',
          'coverUrl',
          'videoCoverUrl',
          'videoUrl',
          'deliveryMode',
          'barCode',
          'bannerUrl',
          'listImage',
          'productImage',
          'storeProductId'
        ])
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

  /**
   * 新增/编辑操作
   */
  handleSave = (status?: number) => {
    const {
      specs,
      skuList
    } = this.state
    if (!this.form) {
      return
    }
    this.form.props.form.validateFields((err, vals) => {
      this.forceUpdate()
      // let msgs = []
      if (err) {
        // const errs = flattenDeep(Object.keys(err).map(key => err[key].errors))
        // msgs = errs.filter(item => item.pass).map(item => item.msg)
        APP.error('请检查输入项')
        return
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
      this.handleSetProduct(vals, status)
    })
  }

  handleSetProduct (vals:any, status?:number) {
    const {
      specs,
      skuList,
      propertyId1,
      propertyId2,
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

    // 普通商品新增、编辑
    setProduct({
      productCode,
      modifyTime: this.modifyTime,
      productId: this.id,
      property1: specs[0] && specs[0].title,
      property2: specs[1] && specs[1].title,
      skuList,
      ...vals,
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
      APP.history.push('/goods/list')
    })
  }
  render () {
    const { productType, status }: any = this.form?.getValues() || {}
    return (
      <Form
        getInstance={ref => this.form = ref}
        config={defaultConfig}
        namespace='skuSale'
      >
        <Card title='添加/编辑商品'>
          {/* 非组合商品才显示 */}
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
                }]
              } as GetFieldDecoratorOptions)(
                <ProductCategory
                  style={{ width: '60%' }}
                />
              )
            }}
          />
          <FormItem
            verifiable
            name='productType'
          />
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
                ]
              } as GetFieldDecoratorOptions)(
                <SupplierSelect
                  style={{ width: '60%' }}
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
        </Card>
        <SkuList
          form={this.form?.props?.form}
          type={productType}
          showImage={this.state.showImage}
          specs={this.state.specs}
          dataSource={this.state.skuList}
          onChange={(value, specs, showImage) => {
            this.setState({
              skuList: value,
              specs: specs,
              showImage
            })
          }}
        />
        <Card
          style={{ marginTop: 10 }}
          title={(
            <div>
              商品状态
            </div>
          )}
        >
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
              }
              }>
              返回
            </Button>
            {/* <If condition={status === 2}>
              <Button
                onClick={() => {
                  this.handleSave(3)
                }}>
                推送至待上架
              </Button>
            </If> */}
          </FormItem>
        </Card>
      </Form>
    )
  }
}

export default SkuSaleForm
