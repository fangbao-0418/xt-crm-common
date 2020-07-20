import React from 'react';
import { Button } from 'antd';
import Form, {
  FormItem,
  FormInstance,
} from '@/packages/common/components/form';
import UploadView from '@/components/upload';

interface Props {
  onCancel?:
    | ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void)
    | undefined;
}
class InvitationList extends React.Component<Props> {
  public render() {
    return (
      <div style={{ margin: '-20px' }}>
        <Form style={{ padding: 20 }}>
        <FormItem
          name='switch'
          label='邀请榜单'
          type='select'
          options={[{ label: '开启', value: 'on' }]}
          controlProps={{ style: { width: 220 } }}
        />
        <FormItem
          label='分享背景'
          required
          inner={(form) => form.getFieldDecorator('shareBg')(
            <UploadView
              ossType='cos'
              placeholder='上传图片'
              listType='picture-card'
              listNum={1}
              size={0.3}
            />
          )}
        />
        <FormItem
          label='活动说明'
          required
          inner={(form) => form.getFieldDecorator('shareDes')(
            <UploadView
              ossType='cos'
              placeholder='上传图片'
              listType='picture-card'
              listNum={1}
              size={0.3}
            />
          )}
        />
        <FormItem
          label='转发按钮'
          inner={(form) => form.getFieldDecorator('forwardButton')(
            <UploadView
              ossType='cos'
              placeholder='上传图片'
              listType='picture-card'
              listNum={1}
              size={0.3}
            />
          )}
        />
        <FormItem
          label='邀请榜单'
        >
          <span>邀请英雄榜_510798_07131405.xlsx</span>
        </FormItem>
      </Form>
      <div className='ant-modal-footer'>
        <div>
          <Button>取消</Button>
          <Button type='primary'>保存设置</Button>
        </div>
      </div>
      </div>
    );
  }
}

export default InvitationList;
