import React from 'react';
import omit from 'lodash/omit'
type Key = string | number;
interface ReadOnlyComponentProps {
  onChange?: (value: Key) => void;
  value?: Key;
  readOnly: boolean;
}

class ReadOnlyComponent extends React.Component<ReadOnlyComponentProps, any> {
  render() {
    const { value, children, readOnly } = this.props;
    const otherProps = omit(this.props, ['readOnly', 'children'])
    return readOnly ? <span>{value}</span> : React.cloneElement(children as React.ReactElement, otherProps);
  }
}

export default ReadOnlyComponent;

