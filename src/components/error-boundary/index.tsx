import React from 'react'
type Props = {}
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
    APP.moon.error(error)
    this.setState({
      error,
      errorInfo
    })
  }

  public render () {
    if (this.state.errorInfo) {
      return (
        <div style={{margin: 8}}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }
    return this.props.children || null
  }
}
export default Main