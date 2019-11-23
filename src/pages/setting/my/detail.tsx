import React from 'react';
import { Card, Row, Col, Checkbox, Button, Icon } from 'antd';
import styles from './style.module.styl';
import * as api from './api'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form';
import Upload from '@/components/upload';
import homeIcon from '@/assets/images/home.png';
import yanxuanIcon from '@/assets/images/yanxuan.png';
import cartIcon from '@/assets/images/cart.png';
import myIcon from '@/assets/images/my.png';
import couponIcon from '@/assets/images/coupon.png';
interface options {
  label: string;
  value: number;
}
const portsOptions: options[] = [
  { label: 'Android', value: 1 },
  { label: 'iOS', value: 2 },
  { label: 'H5', value: 3 },
  { label: '小程序', value: 4 }
];
const memberTypesOptions: options[] = [
  { label: '未登录用户', value: -1 },
  { label: '普通会员', value: 0 },
  { label: '团长', value: 10 },
  { label: '区长', value: 20 },
  { label: '合伙人', value: 30 }
];
interface State {
  visible: boolean;
}
class Main extends React.Component<any, State> {
  public state: State = {
    visible: false
  };
  public form: FormInstance;
  public constructor(props: any) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.fetchData();
  }
  /**
   * 根据版本号id获取版本详情
   */
  public async fetchData() {
    const res = await api.getDetail()
    if (res) {
      this.form.setValues(res)
    }
  }
  /** 新增 */
  public handleAdd() {
    this.setState({
      visible: true
    });
  }
  /** 关闭 */
  public handleClose() {
    this.setState({
      visible: false
    });
  }
  /** 新增/编辑 */
  public handleSave () {

  }
  public render() {
    const { visible } = this.state;
    return (
      <Card>
        <Row className={styles.row}>
          <Col span={12} className={styles.col}>
            <h2 className={styles.title}>个人中心配置</h2>
            <div className={styles.wrap}>
              <div className={styles.linkBlock}>
                <div className={styles.linkPlus}>
                  <div className={styles.linkPlusBtn}>
                    <Icon type="plus" onClick={this.handleAdd} />
                  </div>
                </div>
                <div className={styles.link}>
                  <img src={couponIcon} alt=""/>
                  <p>优惠券</p>
                </div>
              </div>
              <div className={styles.footer}>
                <div className={styles.item}>
                  <img src={homeIcon} alt="" />
                  <p>首页</p>
                </div>
                <div className={styles.item}>
                  <img src={yanxuanIcon} alt="" />
                  <p>严选</p>
                </div>
                <div className={styles.item}>
                  <img src={cartIcon} alt="" />
                  <p>购物车</p>
                </div>
                <div className={styles.item}>
                  <img src={myIcon} alt="" />
                  <p className={styles.active}>我的</p>
                </div>
              </div>
            </div>
            <div className={styles.search}>
              <div>
                <Button.Group>
                  <Button>Android</Button>
                  <Button>iOS</Button>
                  <Button>H5</Button>
                  <Button>小程序</Button>
                </Button.Group>
              </div>
              <div className="mt10">
                <Button.Group>
                  <Button>未注册用户</Button>
                  <Button>普通用户</Button>
                  <Button>团长</Button>
                  <Button>区长</Button>
                  <Button>合伙人</Button>
                </Button.Group>
              </div>
            </div>
          </Col>
          {visible && (
            <Col span={12} className={styles.col}>
              <h2 className={styles.title}>
                <span>icon配置</span>
                <Icon type="close-circle" className={styles.closeCircle} onClick={this.handleClose} />
              </h2>
              <Form
                getInstance={ref => this.form=ref}
              >
                <FormItem
                  name="iconName"
                  type="input"
                  label="icon名称"
                  verifiable={true}
                  fieldDecoratorOptions={{
                    rules: [
                      {
                        required: true,
                        message: '请输入icon名称'
                      }
                    ]
                  }}
                  controlProps={{
                    style: {
                      width: 200
                    }
                  }}
                />
                <FormItem
                  label="上传图片"
                  verifiable={true}
                  fieldDecoratorOptions={{
                    rules: [
                      {
                        required: true,
                        message: '请上传图片'
                      }
                    ]
                  }}
                  inner={form => {
                    return form.getFieldDecorator('iconUrl')(
                      <Upload listType="picture-card" placeholder="上传" showUploadList={false} />
                    );
                  }}
                />
                <FormItem
                  name="sort"
                  type="number"
                  label="排序"
                  verifiable={true}
                  controlProps={{
                    placeholder: '排序越大越靠前',
                    style: {
                      width: 200
                    }
                  }}
                  fieldDecoratorOptions={{
                    rules: [
                      {
                        required: true,
                        message: '请输入排序'
                      }
                    ]
                  }}
                />
                <FormItem
                  name="url"
                  type="input"
                  label="地址"
                  verifiable={true}
                  controlProps={{
                    placeholder: '请输入内容',
                    style: {
                      width: 350
                    }
                  }}
                  fieldDecoratorOptions={{
                    rules: [
                      {
                        required: true,
                        message: '请输入地址'
                      }
                    ]
                  }}
                />
                <FormItem
                  label="显示端口"
                  inner={form => {
                    return form.getFieldDecorator('ports')(<Checkbox.Group options={portsOptions} />);
                  }}
                />
                <FormItem
                  label="显示用户"
                  inner={form => {
                    return form.getFieldDecorator('memberTypes')(<Checkbox.Group options={memberTypesOptions} />);
                  }}
                />
                <FormItem
                  inner={form => {
                    return (
                      <>
                        <Button type="primary" onClick={this.handleSave}>保存</Button>
                        <Button type="danger" className="ml10">
                          删除
                        </Button>
                      </>
                    );
                  }}
                />
              </Form>
            </Col>
          )}
        </Row>
      </Card>
    );
  }
}
export default Main;
