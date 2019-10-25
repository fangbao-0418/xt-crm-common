import React from 'react'
import { Props } from './index'
export interface ContextProps {
  props: Props
}
const FormContext = React.createContext<any>({})
export default FormContext
