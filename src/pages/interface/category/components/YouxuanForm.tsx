import React from "react";
import {
  Button,
  Checkbox,
  Form,
  Icon,
  Input,
  Modal,
  Radio,
  Switch,
} from "antd";
import Ctree from "../tree";
import {
  FormComponentProps,
  GetFieldDecoratorOptions,
} from "antd/lib/form/Form";
import GetActivityModal from "./GetActivity";
import { initImgList } from "@/util/utils";
import { getPromotionList } from "@/pages/activity/api";
import SecondaryCategory from "./secondaryCategory";
import {
  delCategory,
  getFrontCategorys,
  saveFrontCategory,
  updateFrontCategory,
} from "../api";
import _ from "lodash";
const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout: any = {
  wrapperCol: {
    xs: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

interface Props extends FormComponentProps {
  detail: any;
  getCategorys(id?: any): void;
  currId: number;
}
interface State {
  checkCate: boolean;
  checkAct: boolean;
  visible1: boolean;
  visible2: boolean;
  isShow: boolean;
  visible1Type: string | null;
  secondName: string;
  secondCategoryVOS: any[];
  cateText: any[];
  actText: any[];
  selectedSecondary: any[];
  secondaryIndex: number | null;
  secondaryActText: any[];
  selectedRows: any[];
  cateList: any[];
  selectedRowKeys: any[];
  selectedKeys: any[];
  modalPage: {
    current: 1;
    total: 0;
    pageSize: 10;
  };
  actList: any[];
  productCategoryVOS: any[];
  checkData: any[];
  secondStatus: boolean;
  activityParams: any;
}
class Main extends React.Component<Props, State> {
  public cateText = [];

  public componentWillReceiveProps(nextProps: any) {
    const detail = nextProps.detail;
    console.log('nextProps.currId', detail, nextProps.currId)
    if (this.props.detail !== detail) {
      if (nextProps.currId === -1) {
        // 新增
        this.addCategory();
      } else {
        // 编辑
        this.init(nextProps.detail);
      }
    }
  }

  public init(data: any) {
    const { secondStatus, secondCategoryVOS } = data;
    const actText: any[] = [];
    const cateText: any[] = [];
    data.productCategoryVOS.forEach((val: any) => {
      if (val.type == 1) {
        cateText.push(val);
      } else if (val.type == 2) {
        actText.push({
          id: val.id,
          title: val.name,
        });
      }
    });
    const productCategoryVOS = [...actText, ...cateText];
    let { showType } = data;
    if (!showType && showType !== 0) {
      showType = 1;
    }

    this.props.form.setFieldsValue({
      name: data.name,
      sort: data.sort,
      showType: showType,
      secondName: data.secondName,
      styleType: !data.styleType ? 1 : data.styleType,
    });

    const filterIconsecondCategoryVOS =
      secondCategoryVOS.map((item: any) => {
        const category: any[] = [];
        const productCategory: any[] = [];
        (item.productCategoryVOS || []).forEach((item: any) => {
          if (item.type === 1) {
            category.push(item);
          } else {
            productCategory.push(item);
          }
        });
        item.categoryVOS = category;
        item.productCategoryVOS = productCategory;
        item.icon = initImgList(item.icon);
        return item;
      }) || [];

    this.setState({
      checkCate: cateText.length !== 0,
      checkAct: actText.length !== 0,
      cateText,
      actText,
      productCategoryVOS,
      // isShow: true,
      secondStatus: secondStatus === 1 ? true : false,
      secondCategoryVOS: filterIconsecondCategoryVOS,
      secondaryActText: [],
      secondName: data.secondName,
    });
  }

  public state: State = {
    checkCate: false,
    checkAct: false,
    visible1: false,
    visible2: false,
    isShow: false,
    visible1Type: "",
    secondName: "",
    secondCategoryVOS: [],
    cateText: [],
    actText: [],
    selectedSecondary: [],
    secondaryIndex: null,
    secondaryActText: [],
    selectedRows: [],
    cateList: [],
    selectedRowKeys: [],
    selectedKeys: [],
    modalPage: {
      current: 1,
      total: 0,
      pageSize: 10,
    },
    actList: [],
    productCategoryVOS: [],
    checkData: [],
    secondStatus: false,
    activityParams: {},
  };
  public handleCancelModal = () => {
    this.setState({
      visible1: false,
    });
  };
  public handleOkModal = (e: any) => {
    const {
      visible1Type,
      secondCategoryVOS,
      secondaryIndex,
      selectedSecondary,
    } = this.state;

    if (visible1Type !== null) {
      if (
        secondaryIndex !== null &&
        secondCategoryVOS[secondaryIndex].type !== 4
      ) {
        secondCategoryVOS[
          secondaryIndex
        ].productCategoryVOS = selectedSecondary;
      }
      return this.setState({
        secondaryActText: selectedSecondary,
        visible1: false,
        secondCategoryVOS,
      });
    }

    this.setState({
      actText: this.state.selectedRows,
      productCategoryVOS: [...this.state.cateText, ...this.state.selectedRows],
      visible1: false,
    });
  };
  public getPromotionList = (params?: any) => {
    const { activityParams, modalPage } = this.state;

    const nowParams = params || activityParams;
    getPromotionList({
      ...nowParams,
      page: params ? 1 : modalPage.current,
      pageSize: modalPage.pageSize,
    }).then((res: any) => {
      modalPage.total = res.total;

      this.setState({
        actList: res.records,
        modalPage: { ...modalPage, current: params ? 1 : modalPage.current },
        activityParams: nowParams,
      });
    });
  };
  /** 关联类目 */
  public handleClickModalC = () => {
    this.setState({
      /** 清除二级类目添加类目的visible1Type值s s */
      visible1Type: "",
      visible2: true,
      checkData: this.state.cateText,
    });
  };
  /** 二级类目内容添加活动/类目打开弹框 */
  public handleClickModal = (data: any = {}) => {
    const { type, index, secondaryActText, categoryVOS } = data;
    // 类目
    if (type === "category") {
      console.log(secondaryActText, "selectedSecondary");
      this.setState({
        visible2: true,
        visible1Type: type,
        checkData: categoryVOS,
        secondaryIndex: index,
        secondaryActText,
        selectedRowKeys: secondaryActText
          ? secondaryActText.map((val: any) => val.id)
          : [],
        selectedSecondary: secondaryActText || [],
      });
      return;
    }

    if (this.state.actList.length == 0) {
      this.getPromotionList();
    }

    if (type === "secondary") {
      this.setState({
        visible1Type: type,
        visible1: true,
        secondaryIndex: index,
        selectedRowKeys: secondaryActText
          ? secondaryActText.map((val: any) => val.id)
          : [],
        selectedSecondary: secondaryActText || [],
      });
    } else {
      this.setState({
        visible1Type: null,
        visible1: true,
        selectedRowKeys: this.state.actText.map((val) => val.id),
        selectedRows: this.state.actText,
      });
    }
  };
  //updateSecondtegoryVOS二级类目组件更新数据
  public updateSecondtegoryVOS = (dataSource: any) => {
    this.setState({
      secondCategoryVOS: dataSource,
    });
  };
  //处理二级类目按钮开关
  public handleSwitchChange = (val: any) => {
    this.setState({
      secondStatus: val,
    });
  };
  //保持类目信息
  public handleSave = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err: any, vals: any) => {
      const { secondStatus } = this.state;
      let secondCategoryVOS = this.state.secondCategoryVOS;
      /** 处理二级类目内容合并活动&类目到productCategoryVOS字段上 */
      secondCategoryVOS = secondCategoryVOS.map((item) => {
        /** 类目type设置为1 */
        const categoryVOS = (item.categoryVOS || []).map((item2: any) => {
          return {
            ...item2,
            type: 1,
          };
        });
        /** 活动type设置2 */
        const productCategoryVOS = (item.productCategoryVOS || []).map(
          (item2: any) => {
            return {
              ...item2,
              type: 2,
            };
          }
        );
        return {
          ...item,
          productCategoryVOS: productCategoryVOS.concat(categoryVOS || []),
          categoryVOS: undefined,
        };
      });
      const newSecondCategoryVOS = _.cloneDeep(secondCategoryVOS);
      //开关校验
      if (secondStatus && !secondCategoryVOS.length) {
        return APP.error("请填写二级类目的所有内容");
      }
      // 二级类目内容细节校验
      const noValue = secondCategoryVOS.filter((item) => {
        if (item.type === 2) {
          if (!item.productCategoryVOS || !item.productCategoryVOS.length) {
            return item;
          }
        }
        if (item.type === 4 && !item.url) {
          return item;
        }
        if (!item.name || !item.icon) {
          return item;
        }
      });

      if (secondStatus && noValue && noValue.length) {
        return APP.error("请填写二级类目的所有内容");
      }
      if (!err) {
        const list: any[] = [];
        const vosLength = newSecondCategoryVOS.length - 1;
        //过滤所有二级类目数据，对接后端接口
        const filterSecondCategoryVOS = newSecondCategoryVOS.map(
          (item, index) => {
            const { type, icon } = item;
            let productCategoryVOS = null;

            if (type === 2 && item.productCategoryVOS) {
              productCategoryVOS = item.productCategoryVOS.map((vos: any) => {
                return {
                  id: vos.id,
                  type: vos.type,
                };
              });
            }
            return Object.assign(item, {
              productCategoryVOS: productCategoryVOS
                ? productCategoryVOS
                : item.productCategoryVOS,
              sort: vosLength - index,
              icon: icon ? icon[0].url : "",
            });
          }
        );
        this.state.checkAct &&
          this.state.actText.forEach((val) => {
            list.push({
              id: val.id,
              name: val.title,
              type: 2,
            });
          });

        this.state.checkCate &&
          this.state.cateText.forEach((val) => {
            list.push({
              id: val.id,
              level: val.level,
              name: val.name,
              type: 1,
            });
          });
        const data: any = {
          name: vals.name,
          sort: vals.sort,
          showType: vals.showType,
          styleType: vals.styleType ? vals.styleType : 1,
          secondName: vals.secondName,
          productCategoryVOS: list,
          secondStatus: secondStatus ? 1 : 0,
          secondCategoryVOS: filterSecondCategoryVOS,
        };
        if (this.props.currId == -1) {
          data.id = this.props.currId;
        }
        (this.props.currId !== -1 ? updateFrontCategory : saveFrontCategory)(
          data
        ).then((data) => {
          if (data && data.id) {
            APP.success("保存成功");
            this.props.getCategorys(data.id);
          }
        });
      }
    });
  };
  public delCategory = () => {
    Modal.confirm({
      title: "系统提示",
      content: "确定要删除该类目吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        delCategory(this.props.currId).then((data) => {
          data && APP.success("删除成功");
          this.props.getCategorys();
          this.addCategory();
        });
      },
    });
  };
  //添加新的一级目录
  public addCategory() {
    this.props.form.setFieldsValue({
      name: "",
      sort: "",
      showType: 1,
    });
    this.initState();
  }
  //初始化
  public initState() {
    this.setState({
      checkCate: false,
      checkAct: false,
      cateText: [],
      actText: [],
      productCategoryVOS: [],
      checkData: [],
      isShow: true,
      secondStatus: false,
      secondaryActText: [],
      secondCategoryVOS: [],
      secondaryIndex: null,
    });
  }
  /** 选择类目回调确认 */
  setCateText() {
    const {
      visible1Type,
      secondaryIndex,
      selectedSecondary,
      secondCategoryVOS,
    } = this.state;
    if (visible1Type === "category") {
      secondCategoryVOS[secondaryIndex as number].categoryVOS = this.cateText;
      console.log(this.cateText, "secondCategoryVOS");
      this.setState({
        visible2: false,
        secondCategoryVOS: [...secondCategoryVOS],
      });
      return;
    }
    this.setState({
      cateText: this.cateText,
      productCategoryVOS: [...this.cateText, ...this.state.selectedRowKeys],
      visible2: false,
    });
  }

  public handleTabChangeModal = (e: any) => {
    this.setState(
      {
        modalPage: e,
      },
      () => {
        this.getPromotionList();
      }
    );
  };

  public handlenChanageSelectio = (selectedRowKeys: any, selectedRows: any) => {
    const { visible1Type, selectedSecondary } = this.state;
    const objKeys: Record<string, any> = {};
    let currSelectedRows = [];
    if (visible1Type !== null) {
      selectedSecondary.forEach((val) => {
        objKeys[val.id] = val;
      });
    } else {
      this.state.selectedRows.forEach((val) => {
        objKeys[val.id] = val;
      });
    }

    selectedRows.forEach((val: any) => {
      objKeys[val.id] = val;
    });
    for (const key in objKeys) {
      currSelectedRows.push(objKeys[key]);
    }
    currSelectedRows = currSelectedRows.filter((val) => {
      return selectedRowKeys.includes(val.id);
    });

    if (visible1Type !== null) {
      return this.setState({
        selectedRowKeys,
        selectedSecondary: currSelectedRows,
      });
    }

    this.setState({
      selectedRowKeys,
      selectedRows: currSelectedRows,
    });
  };

  public render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      modalPage,
      visible1,
      visible2,
      selectedRowKeys,
      actList,
      productCategoryVOS,
      secondStatus,
      secondaryIndex,
      secondaryActText,
      secondCategoryVOS,
    } = this.state;
    const showType = getFieldValue("showType");
    const secondName = getFieldValue("secondName") || this.state.secondName;
    return (
      <>
        <Form {...formLayout}>
          <FormItem label="前台类目名称">
            {getFieldDecorator("name", {
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
            })(<Input placeholder="请输入前台类目名称" />)}
          </FormItem>
          <FormItem label="展示位置">
            {getFieldDecorator("showType", {
              initialValue: 1,
            })(
              <Radio.Group>
                <Radio value={0}>首页展示</Radio>
                <Radio value={1}>行业类目展示</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {showType === 0 && (
            <>
              <FormItem
                label="副标题"
                style={{ display: showType === 0 ? "block" : "none" }}
              >
                {getFieldDecorator("secondName", {
                  initialValue: secondName,
                  rules: [
                    {
                      required: true,
                      message: "请输入副标题名称",
                    },
                    {
                      max: 5,
                      message: "最大支持五个字符!",
                    },
                  ],
                })(<Input placeholder="请输入副标题" />)}
              </FormItem>
              <FormItem
                label="商品展示方式"
                style={{ display: showType === 0 ? "block" : "none" }}
              >
                {getFieldDecorator("styleType", {
                  initialValue: 1,
                })(
                  <Radio.Group>
                    <Radio value={1}>1行1品</Radio>
                    <Radio value={2}>1行2品</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </>
          )}
          <FormItem label="排序">
            {getFieldDecorator("sort", {
              rules: [
                {
                  required: true,
                  message: "请输入排序数字",
                },
              ],
            })(<Input type="number" placeholder="请输入排序数字" />)}
          </FormItem>
          <FormItem label="关联商品">
            {getFieldDecorator("productCategoryVOS", {
              initialValue: productCategoryVOS,
              rules: [
                {
                  required: true,
                  message: "请输入关联商品",
                },
              ],
            })(
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
                    {this.state.cateText.map((val, i) => {
                      return (
                        <div className="intf-cat-reitem" key={i}>
                          {val.name}
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
                    <Button type="link" onClick={this.handleClickModalC}>
                      +添加类目
                    </Button>
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
                    {this.state.actText.map((val, i) => {
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
                    <Button type="link" onClick={this.handleClickModal}>
                      +添加活动
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          </FormItem>
          {showType === 1 && (
            <FormItem label="二级类目开关">
              {getFieldDecorator("secondStatus", {
                onChange: this.handleSwitchChange,
              } as GetFieldDecoratorOptions)(<Switch checked={secondStatus} />)}
              <span style={{ paddingLeft: "10px", color: "red" }}>
                只控制前台是否展示
              </span>
            </FormItem>
          )}
          {secondStatus && showType === 1 && (
            <FormItem label="二级类目内容">
              <SecondaryCategory
                key={this.props.currId}
                secondaryIndex={secondaryIndex}
                secondCategoryVOS={secondCategoryVOS}
                secondaryActText={secondaryActText}
                handleClickModal={this.handleClickModal}
                updateSecondtegoryVOS={this.updateSecondtegoryVOS}
              />
            </FormItem>
          )}
          <Form.Item {...tailFormItemLayout}>
            <div style={{ textAlign: "right" }}>
              {this.props.currId !== -1 ? (
                <Button
                  type="danger"
                  ghost
                  style={{ marginRight: "10px" }}
                  onClick={this.delCategory}
                >
                  删除
                </Button>
              ) : (
                ""
              )}
              <Button type="primary" onClick={this.handleSave}>
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
        <Modal
          title="选择类目"
          wrapClassName="intf-cat-tree-box"
          visible={visible2}
          width={800}
          onCancel={() => {
            this.setState({
              visible2: false,
            });
          }}
          onOk={() => {
            this.setCateText();
          }}
        >
          <Ctree
            setList={(cateText: any) => {
              this.cateText = cateText;
            }}
            checkData={this.state.checkData}
          />
        </Modal>
        <GetActivityModal
          handleCancelModal={this.handleCancelModal}
          handleOkModal={this.handleOkModal}
          actList={actList}
          selectedRowKeys={selectedRowKeys}
          modalPage={modalPage}
          visible1={visible1}
          handleTabChangeModal={this.handleTabChangeModal}
          handlenChanageSelectio={this.handlenChanageSelectio}
          getPromotionList={this.getPromotionList}
        />
      </>
    );
  }
}

export default Form.create<Props>()(Main);
