import React from "react";
import { Form, FormItem } from "@/packages/common/components";
import { Checkbox, Button, Radio, Icon, Modal } from "antd";
import CategoryModal, { CategoryModalProps } from './CategoryModal';
import ActicityModal, { ActicityModalProps } from './ActicityModal';
import { delCategory, saveFrontCategory, updateFrontCategory } from '../api'
import { FormInstance } from "@/packages/common/components/form";

interface Props {
  detail: any
  currId: number
  getCategorys(id?: any): void
}
interface State {
  checkCate: boolean;
  checkAct: boolean;
  actText: any[];
  cateText: any[];
}
class Main extends React.Component<Props, State> {
  public modalRef: CategoryModalProps | null
  public acticityModal: ActicityModalProps | null
  public state = {
    checkCate: false,
    checkAct: false,
    actText: [],
    cateText: [],
  }
  public formRef: FormInstance
  public componentWillReceiveProps(nextProps: any) {
    const detail = nextProps.detail
    if (detail && this.props.detail !== detail) {
      if (nextProps.currId === -1) {
        // 新增
        this.clear()
      } else {

        // 编辑
        this.init(detail)
      }
    }
  }
  public clear() {
    this.formRef.resetValues()
    this.setState({
      actText: [],
      cateText: [],
      checkAct: false,
      checkCate: false
    })
  }
  public init (res: any) {
    const productCategoryVOS: any[] = res.productCategoryVOS || []
    let actText: any[] = []
    let cateText: any[] = []
    productCategoryVOS.forEach((item) => {
      // 关联类目
      if (item.type === 1) {
        cateText.push({
          categoryId: item.id,
          categoryName: item.name
        })
      }
      // 关联活动
      else if (item.type === 2) {
        actText.push({
          title: item.name,
          promotionId: item.id
        })
      }
    })
    this.setState({
      actText,
      cateText,
      checkAct: !!actText.length,
      checkCate: !!cateText.length
    })
    this.formRef.setValues({
      name: res.name,
      sort: res.sort,
      status: res.status
    })
  }
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
    this.formRef.props.form.validateFields(async (errs, vals) => {
      if (!errs) {
        let actText: any[] = this.state.actText
        let cateText: any[] = this.state.cateText
        // 关联类目
        cateText = cateText.map((v: any) => ({
          id: v.categoryId,
          name: v.categoryName,
          type: 1,
          level: 1
        }))
        // 关联活动
        actText = actText.map((v: any) => ({
          name: v.title,
          id: v.promotionId,
          type: 2,
          level: 1
        }))
        const params = {
          productCategoryVOS: [...actText, ...cateText],
          ...vals,
          showType: 8 // 展示位置（0：首页展示，1：行业类目展示 2:助力类目，3：团购会类目，8：好店首页类目）
        }
        let res
        if (this.props.currId === -1) {
          // 新增
          res = await saveFrontCategory(params)

        } else {

          // 编辑
          res = await updateFrontCategory({ ...params, id: this.props.currId })
        }
        if (res && res.id) {
          APP.success('保存成功')
          this.props.getCategorys(res.id)
        }
      }
    })
  }
  public delete = () => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要删除该类目吗？',
      onOk: async () => {
        const res = await delCategory(this.props.currId)
        if (res) {
          APP.success("删除成功");
          this.props.getCategorys();
          this.clear();
        }
      }
    })
  }
  public render() {
    const selectedRowKeys = this.state.actText.map((item: any) => item.promotionId)
    const checkedValue = this.state.cateText.map((item: any) => item.categoryId)
    return (
      <>
        <CategoryModal
          checkedValue={checkedValue}
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
          <FormItem label="关联店铺">
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
          </FormItem>
          <FormItem
            label="类目开关"
            required
            inner={(form) => {
              return form.getFieldDecorator('status', {
                rules: [
                  {
                    required: true,
                    message: "请选择类目开关",
                  },
                ],
              })(
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
              {this.props.currId !== -1 && (
                <Button
                  type="danger"
                  ghost
                  style={{ marginRight: "10px" }}
                  onClick={this.delete}
                >
                  删除
                </Button>
              )}
              <Button type="primary" onClick={this.handleSave}>保存</Button>
            </div>
          </FormItem>
        </Form>
      </>
    );
  }
}

export default Main;
