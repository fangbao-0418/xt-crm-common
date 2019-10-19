interface PageProps<Item = any> {
  /** 总页数 */
  pages?: number
  current?: number
  total: number
  size?: number
  records?: Item[]
}

type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
type useStateType<T> = [T, Dispatch<SetStateAction<T>>];