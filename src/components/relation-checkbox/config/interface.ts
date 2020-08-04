export type ValueProp = string | number

export type ValuesProp = Array<ValueProp>

export interface Option {
  label: React.ReactNode,
  value: ValueProp,
  children?: Option[],
  checked?: boolean
}
