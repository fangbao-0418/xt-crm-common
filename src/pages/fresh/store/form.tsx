import React from 'react';
import { Form, FormItem } from '@/packages/common/components';
import { Card, Row, Col, Button } from 'antd';
import { defaultConfig, NAME_SPACE } from './config';
import styles from './style.module.scss';
import UploadView from '@/components/upload';
import CitySelect from '@/components/city-select';
import { FormInstance } from '@/packages/common/components/form';
import { addShop, updateShop, getShopDetail } from './api';
import { RouteComponentProps } from 'react-router';
import { parseQuery } from '@/util/utils';
type Props = RouteComponentProps<{id: string}>;

class StoreForm extends React.Component<Props, any> {
  form: FormInstance;
  id: string = '-1';
  readOnly: boolean = !!(parseQuery() as any).readOnly;
  address: string = '';
  citylocation: any;
  constructor(props: Props) {
    super(props);
    this.id = props.match.params.id;
  }
  componentDidMount() {
    this.init();
    this.id !== '-1' && this.fetchData();
  }
  init() {
    this.citylocation = new (window as any).qq.maps.CityService({
      complete: (results: any) => {
        const { lat, lng } = results.detail.latLng;
        this.form.setValues({
          longitude: lat,
          latitude: lng
        })
      }
    })
  }
  fetchData() {
    getShopDetail(this.id).then(res => {
      this.form.setValues(res);
    })
  }
  handleSave = () => {
    this.form.props.form.validateFields((err, vals) => {
      if (!err) {
        const isAdd = this.id === '-1'
        const promiseResult = isAdd ? addShop(vals) : updateShop({ ...vals, id: this.id });
        promiseResult.then((res: any) => {
          if (res) {
            APP.history.push('/fresh/store');
          }
        })
      }
    })
  }
  render() {
    return (
      <Form
        readonly={this.readOnly}
        getInstance={ref => this.form = ref}
        namespace={NAME_SPACE}
        config={defaultConfig}
        addonAfter={(
          <div style={{ width: '60%' }}>
            <FormItem>
              <Button type='primary' onClick={this.handleSave}>保存</Button>
              <Button
                type='primary'
                className='ml10'
                onClick={() => {
                  APP.history.push('/fresh/store');
                }}>
                  返回
                </Button>
            </FormItem>
          </div>
        )}
      >
        <Card title='门店基础信息'>
          <div style={{ width: '60%' }}>
            <FormItem name='code' type='text' hidden={this.id === '-1'}/>
            <FormItem
              verifiable
              name='name'
            />
            <FormItem
              verifiable
              name='type'
            />
            <FormItem
              verifiable
              name='memberPhone'
            />
          </div>
        </Card>
        <Card title='门店信息'>
          <div style={{ width: '60%' }}>
            <FormItem
              label='门店地址'
              required
              inner={(form) => {
                return form.getFieldDecorator('address', {
                  rules: [{
                    required: true,
                    message: '请选择省市区'
                  }]
                })(<CitySelect
                    getSelectedValues={(value: any[]) => {
                      this.address = value.reduce((prev, curr) => prev + curr.label, '')
                    }}
                  />);
              }}
            />
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ offset: 4 }}
              name='detailAddress'
              controlProps={{
                placeholder: '请输入详细地址',
                onChange: (e: any) => {
                  const localcity = `${this.address}${e.target.value}`;
                  this.citylocation.searchCityByName(localcity);
                }
              }}
              verifiable
              fieldDecoratorOptions={{
                rules: [{
                  required: true,
                  message: '请输入详细地址'
                }]
              }}
            />
            <Row>
              <Col offset={4} style={{ display: 'flex'}}>
                <FormItem style={{ width: 300 }} label='经度' name='longitude' type='text'/>
                <FormItem style={{ width: 300, marginLeft: 30 }} label='维度' name='latitude' type='text' />
              </Col>
            </Row>
            <FormItem
              verifiable
              name='phone'
            />
            <FormItem
              verifiable
              name='desc'
            />
            <FormItem
              label='门店图片'
              inner={(form) => {
                return (
                  <div className={styles['input-wrapper']}>
                    <div className={styles['input-wrapper-content']}>
                      {form.getFieldDecorator('pictrueUrl')(
                        <UploadView
                          placeholder='上传门店图片'
                          listType='picture-card'
                          listNum={3}
                          size={0.3}
                        />
                      )}
                    </div>
                    <div className={styles['input-wrapper-placeholder']}>（建议720*500px，300kb以内，最多可添加3张）</div>
                  </div>
                )
              }}
            />
          </div>
        </Card>
      </Form>
    )
  }
}

export default StoreForm;