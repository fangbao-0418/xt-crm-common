import React from 'react';
import { Button } from 'antd';
import Form, {
  FormItem,
  FormInstance,
} from '@/packages/common/components/form';
import UploadView from '@/components/upload';
import styles from './style.module.styl'
import { setShareConfig, getShareDetail } from '../api'
import { If } from '@/packages/common/components';
import moment from 'moment'

interface Props {
  onCancel?:
    | ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void)
    | undefined;
  planId?: number;
  readonly: boolean;
}

class InvitationList extends React.Component<Props> {
  public formRef: FormInstance
  public state = {
    isOpen: false
  }
  public onOk = async () => {
    this.formRef.props.form.validateFields(async (error, values) => {
      if (!error) {
        const res = await setShareConfig({ ...values, livePlanId: this.props.planId });
        if (res.data) {
          APP.success('保存设置成功');
        }
      }
    })
  }
  public componentDidMount() {
    this.fetchData()
  }
  public async fetchData() {
    if (this.props.planId) {
      const res = await getShareDetail(this.props.planId)
      this.setState({ isOpen: res.isOpen })
      this.formRef.setValues(res)
    }
  }
  public render() {
    const { onCancel, planId, readonly } = this.props
    console.log('readonly', readonly)
    return (
      <div style={{ margin: '-20px' }}>
        <Form
          readonly={readonly}
          getInstance={(ref) => {
            this.formRef = ref
          }}
          style={{ padding: 20 }}
        >
          <FormItem
            fieldDecoratorOptions={{ initialValue: 0 }}
            name='isOpen'
            label='邀请榜单'
            type='select'
            options={[{
              label: '开启',
              value: 1
            }, {
              label: '关闭',
              value: 0
            }]}
            controlProps={{
              style: { width: 220 },
              onChange: (isOpen: number) => {
                this.setState({ isOpen })
              }
            }}
          />
          <If condition={!!this.state.isOpen}>
            <FormItem
              label='分享背景'
              required
              inner={(form) => (
                <div className={styles['input-wrapper']}>
                  <div className={styles['input-wrapper-content']}>
                    {form.getFieldDecorator('shareBackground', {
                      rules: [{
                        required: true,
                        message: '请上传分享背景图片'
                      }]
                    })(
                      <UploadView
                        style={{ width: '102px' }}
                        ossType='cos'
                        placeholder='上传图片'
                        listType='picture-card'
                        listNum={1}
                        size={0.3}
                      />
                    )}
                  </div>
                  <a href={require('@/assets/images/example.png')} target="_blank">查看示例</a>
                </div>
              )}
            />
            <FormItem
              label='活动说明'
              required
              inner={(form) => (
                <div className={styles['input-wrapper']}>
                  <div className={styles['input-wrapper-content']}>
                    {form.getFieldDecorator('shareInstructions', {
                      rules: [{
                        required: true,
                        message: '请上传活动说明图片'
                      }]
                    })(
                      <UploadView
                        ossType='cos'
                        placeholder='上传图片'
                        listType='picture-card'
                        listNum={1}
                        size={0.3}
                      />
                    )}
                  </div>
                  <a href={require('@/assets/images/example02.png')} target="_blank">查看示例</a>
                </div>
              )}
            />
            <FormItem
              label='转发按钮'
              inner={(form) => (
                <div className={styles['input-wrapper']}>
                  <div className={styles['input-wrapper-content']}>
                    {form.getFieldDecorator('shareIcon')(
                      <UploadView
                        ossType='cos'
                        placeholder='上传图片'
                        listType='picture-card'
                        listNum={1}
                        size={0.3}
                      />
                    )}
                  </div>
                  <a href={require('@/assets/images/example03.png')} target="_blank">查看示例</a>
                </div>
              )}
            />
            <FormItem
              label='邀请榜单'
            >
              <span>邀请英雄榜_{planId}_{moment().format('MMDDHHmm')}.xlsx</span>
              <span className='href' style={{ marginLeft: 20 }}>点击下载</span>
            </FormItem>
          </If>
        </Form>
        <div className='ant-modal-footer'>
          <div>
            <Button onClick={onCancel}>取消</Button>
            <Button type='primary' onClick={this.onOk}>保存设置</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default InvitationList;
