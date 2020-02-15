import React from 'react';
import Form, { FormItem, FormInstance } from '@/packages/common/components/form';
import { Card, Input, Button, Modal } from 'antd';
import ProductCategory from '../components/product-category';
import { defaultConfig } from './config'
import { RouteComponentProps } from 'react-router'
import SupplierSelect from '../components/supplier-select';
import DraggableUpload from '../components/draggable-upload';
import styles from '../edit.module.scss';
import UploadView from '@/components/upload';
import If from '@/packages/common/components/if';
import SkuList, { CSkuProps, Spec } from './components/sku';
import { addProduct, updateProduct, getProduct } from './api';
interface SkuStockFormState {
  speSelect: Spec[];
  data: CSkuProps[];
  showImage: boolean;
}

export interface SkuStockFormProps extends RouteComponentProps<{id: string}> {
  productId: string;
  barCode: string;
  productName: string;
  categoryId: string;
  productShortName: string;
  description: string;
  productCode: string;
  storeId: string;
  videoCoverUrl: any;
  videoUrl: any;
  coverUrl: any;
  productImage: any;
  bannerUrl: any;
  listImage: any;
  skuAddList: CSkuProps[];
  [key: string]: any;
}
class SkuStockForm extends React.Component<SkuStockFormProps, SkuStockFormState> {
  id: number;
  form: FormInstance;
  constructor(props: SkuStockFormProps) {
    super(props);
    this.id = +props.match.params.id;
    this.state = {
      speSelect: [],
      data: [],
      showImage: false
    }
  }
  componentDidMount() {
    this.id !== -1 && this.fetchData();
  }
  // 获取库存商品详情
  fetchData() {
    getProduct().then(res => {
      this.form.setValues(res);
      this.setState({
        data: res.skuAddList,
        showImage: res.showImage,
        speSelect: res.speSelect
      })
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
        vals = { ...vals, skuAddList: this.state.data }
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
  render() {
    const { speSelect, data, showImage } = this.state;
    return (
      <Form
        namespace='csku'
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
          <FormItem
            label='销售商品ID'
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('productId')(
                    <Input
                      placeholder='请输入销售商品ID'
                      style={{ width: 172 }}
                    />
                  )}
                  <Button className='ml10'>校验</Button>
                </>
              )
            }}
          />
          <FormItem
            label='商品条码'
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('barCode')(
                    <Input
                      placeholder='请输入商品条码'
                      style={{ width: 172 }}
                    />
                  )}
                  <Button className='ml10'>校验</Button>
                </>
              )
            }}
          />
          <FormItem verifiable name='productName'/>
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
                  style={{ width: 250 }}
                />
              )
            }}
          />
          <FormItem verifiable name='productShortName'/>
          <FormItem verifiable name='description'/>
          <FormItem name='productCode'/>
          <FormItem
            label='供应商'
            inner={(form) => {
              return form.getFieldDecorator('storeId')(
                <SupplierSelect
                  style={{ width: 172 }}
                />
              )
            }}
          />
          <FormItem
            label='视频封面'
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
                  <span className={styles['input-wrapper-placeholder']}>（建议750*750px，300kb以内）</span>
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
            inner={(form) => {
              return (
                <div className={styles['input-wrapper']}>
                  <div className={styles['input-wrapper-content']}>
                    {form.getFieldDecorator('coverUrl')(
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
          specs={speSelect}
          dataSource={data}
          form={this.form && this.form.props.form}
          onChange={(value, specs, showImage) => {
            this.setState({
              data: value,
              speSelect: specs,
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