import React from 'react'
interface Props {

}
interface State {
  error: any
  errorInfo: any 
}
class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    // Catch errors in any components below and re-render with error message
    Moon.error(error) 
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }
  
  public render () {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children || null
  }
}
export default Main