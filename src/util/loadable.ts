import { connect } from 'react-redux'
import Loadable from 'react-loadable'
import { view as loadingComponent } from '@/components/loader'

export default (loader: any, loading = loadingComponent) => {
  return Loadable({
    loader,
    loading,
  })
}
  