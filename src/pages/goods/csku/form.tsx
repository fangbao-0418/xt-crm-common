import React from 'react';
import Form, { FormItem, FormInstance } from '@/packages/common/components/form';
import { Card, Input, Button, Row, Modal } from 'antd';
import ProductCategory from '../components/product-category';
import { defaultConfig } from './config'
import SupplierSelect from '../components/supplier-select';
import DraggableUpload from '../components/draggable-upload';
import styles from '../edit.module.scss';
import UploadView from '@/components/upload';
import SkuList from '../components/sku';
class CSkuForm extends React.Component {
  form: FormInstance;
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
  render() {
    return (
      <Form
        namespace='csku'
        config={defaultConfig}
        getInstance={ref => this.form = ref}
        addonAfter={(
          <FormItem className='mt10'>
            <Button type='primary'>保存</Button>
            <Button className='ml10' onClick={this.goBack}>取消</Button>
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
            name='categoryId'
            inner={(form) => {
              return form.getFieldDecorator('ProductCategory', {
                rules: [{
                  required: true
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
          form={this.form && this.form.props.form}
          type={0}
          productCustomsDetailVOList={[]}
          showImage={true}
          specs={[]}
          dataSource={[]}
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
              return (
                <>
                  {form.getFieldDecorator('listImage')(
                    <DraggableUpload
                      className={styles['goods-draggable']}
                      listNum={20}
                      size={0.3}
                      placeholder="上传商品详情图"
                    />
                  )}
                  <div className='mt20'>
                  <Button
                    type='primary'
                    onClick={this.handleDeleteAll}
                  >
                    一键删除
                  </Button>
                  </div>
                </>
              )
            }}
          />
        </Card>
      </Form>
    )
  }
}

export default CSkuForm;