type Dispatch<A> = (value: A) => void
type SetStateAction<S> = S | ((prevState: S) => S)
type useStateType<T> = [T, Dispatch<SetStateAction<T>>]
type Dispatch<A> = (value: A) => void
type SetStateAction<S> = S | ((prevState: S) => S)
type useStateType = [boolean, Dispatch<SetStateAction<boolean>>]
declare type EnvType = 'dev' | 'test' | 'test2' | 'pre' | 'prod'
declare type ApiEnv = EnvType
declare const __ENV__: EnvType
/** 埋点工具 */
declare const Moon: any
declare const BUILD_TIME: number
declare const TcPlayer: any
declare const Observer: any