interface Props {
  className?: string
  src: string
  style?: React.CSSProperties
  alt?: string
  title?: string
  width?: number | string
  height?: number |string
}
export default (props: Props) => React.ReactNode