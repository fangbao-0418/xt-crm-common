import React from "react";
import { Form, FormItem } from "@/packages/common/components";
import { Checkbox, Button, Radio, Icon } from "antd";
import CategoryModal, { CategoryModalProps } from './CategoryModal';
import ActicityModal, { ActicityModalProps } from './ActicityModal';
import { saveFrontCategory, updateFrontCategory } from '../api'
import { FormInstance } from "@/packages/common/components/form";

interface State {
  checkCate: boolean;
  checkAct: boolean;
  actText: any[];
  cateText: any[];
}
class Main extends React.Component<{}, State> {
  public modalRef: CategoryModalProps | null
  public acticityModal: ActicityModalProps | null
  public state = {
    checkCate: false,
    checkAct: false,
    actText: [],
    cateText: [],
  }
  public formRef: FormInstance
  public handleAdd = () => {
    this.modalRef?.open()
  }
  public handleAddActivity = () => {
    this.acticityModal?.open()
  }
  /**
   * 接口文档
   * http://192.168.20.21/project/428/interface/api/61671
   */
  public handleSave = () => {
    this.formRef.props.form.validateFields((errs, vals) => {
      if (!errs) {
        let actText: any[] = this.state.actText
        let cateText: any[] = this.state.cateText
        console.log('actText', actText)
        console.log('cateText', cateText)
        // 关联活动
        actText = actText.map((v: any) => ({
          name: v.title,
          id: v.promotionId,
          type: 1,
          level: 1
        }))
        // 关联商品
        cateText = cateText.map((v: any) => ({
          id: v.categoryId,
          name: v.categoryName,
          type: 2,
          level: 1
        }))
        const params = {
          productCategoryVOS: [...actText, ...cateText],
          ...vals
        }
        saveFrontCategory(params)
      }
    })
  }
  public render() {
    const selectedRowKeys = this.state.actText.map((item: any) => item.promotionId)
    return (
      <>
        <CategoryModal
          ref={(ref) => this.modalRef = ref }
          onOk={(res) => {
            this.setState({ cateText: res })
          }}
        />
        <ActicityModal
          selectedRowKeys={selectedRowKeys}
          ref={(ref) => this.acticityModal = ref}
          onOk={(selectedRow: any[]) => {
            this.setState({ actText: selectedRow })
          }}
        />
        <Form getInstance={ref => this.formRef = ref}>
          <FormItem
            name="name"
            verifiable
            label="前台类目名称"
            fieldDecoratorOptions={{
              rules: [
                {
                  required: true,
                  message: "请输入前台类目名称",
                },
                {
                  max: 5,
                  message: "最大支持五个字符!",
                },
              ],
            }}
          />
          <FormItem
            name="sort"
            label="排序"
            type="number"
            verifiable
            controlProps={{
              style: {
                width: "100%",
              },
            }}
            fieldDecoratorOptions={{
              rules: [
                {
                  required: true,
                  message: "请输入排序数字",
                },
              ],
            }}
          />
          <FormItem
            name="relationShop"
            label="关联店铺"
            verifiable
            fieldDecoratorOptions={{
              rules: [
                {
                  required: true,
                  message: "请输入关联店铺",
                },
              ],
            }}
            inner={(form) => {
              return (
                <div>
                  <Checkbox
                    checked={this.state.checkCate}
                    onChange={(e) => {
                      this.setState({
                        checkCate: e.target.checked,
                      });
                    }}
                  >
                    关联类目
                  </Checkbox>
                  {this.state.checkCate ? (
                    <div className="intf-cat-rebox">
                      {this.state.cateText.map((val: any, i: number) => {
                        return (
                          <div className="intf-cat-reitem" key={i}>
                            {val.categoryName}
                            <span
                              className="close"
                              onClick={() => {
                                const cateText = this.state.cateText;
                                cateText.splice(i, 1);
                                this.setState({ cateText });
                              }}
                            >
                              <Icon type="close" />
                            </span>
                          </div>
                        );
                      })}
                      <Button type="link" onClick={this.handleAdd}>+添加类目</Button>
                    </div>
                  ) : (
                    ""
                  )}
                  <Checkbox
                    checked={this.state.checkAct}
                    onChange={(e) => {
                      this.setState({
                        checkAct: e.target.checked,
                      });
                    }}
                  >
                    关联活动
                  </Checkbox>
                  {this.state.checkAct ? (
                    <div className="intf-cat-rebox">
                      {this.state.actText.map((val: any, i: number) => {
                        return (
                          <div className="intf-cat-reitem" key={i}>
                            {val.title}
                            <span
                              className="close"
                              onClick={() => {
                                const actText = this.state.actText;
                                actText.splice(i, 1);
                                this.setState({ actText });
                              }}
                            >
                              <Icon type="close" />
                            </span>
                          </div>
                        );
                      })}
                      <Button type="link" onClick={this.handleAddActivity}>+添加活动</Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            }}
          />
          <FormItem
            label="类目开关"
            required
            fieldDecoratorOptions={{
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: "请选择类目开关",
                },
              ],
            }}
            inner={(form) => {
              return form.getFieldDecorator('status')(
                <Radio.Group>
                  <Radio value={1} style={{ display: "block" }}>
                    展示
                  </Radio>
                  <Radio value={2} style={{ display: "block" }}>
                    不展示
                  </Radio>
                </Radio.Group>
              );
            }}
          />
          <FormItem>
            <div style={{ textAlign: "right" }}>
              <Button type="danger" ghost style={{ marginRight: "10px" }}>
                删除
              </Button>
              <Button type="primary" onClick={this.handleSave}>保存</Button>
            </div>
          </FormItem>
        </Form>
      </>
    );
  }
}

export default Main;
