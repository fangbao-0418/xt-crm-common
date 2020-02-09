import React from 'react';
import omit from 'lodash/omit'
import { Moment } from 'moment';
type Key = string | number;
interface ReadOnlyComponentProps {
  onChange?: (value: Key) => void;
  value?: Key;
  readOnly: boolean;
}

class ReadOnlyComponent extends React.Component<ReadOnlyComponentProps, any> {
  render() {
    const { value, children, readOnly } = this.props;
    const otherProps = omit(this.props, ['readOnly', 'children']);
    const _children = children as React.ReactElement;
    let text = value;
    // RangePicker组件
    if (Array.isArray(value) && value.length === 2) {
      text = (value as Moment[]).map(m => m.format && m.format('YYYY-MM-DD HH:mm:ss')).join('~');
    }
    return readOnly ? <span>{text}</span> : React.cloneElement(_children, otherProps);
  }
}

export default ReadOnlyComponent;

