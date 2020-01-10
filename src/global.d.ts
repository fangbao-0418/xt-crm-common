type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
type useStateType<T> = [T, Dispatch<SetStateAction<T>>];
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
type useStateType = [boolean, Dispatch<SetStateAction<boolean>>];
declare type ApiEnv = 'dev' | 'test1' | 'test2' | 'pre' | 'prod';
/** 埋点工具 */
declare const Moon: any
declare const TcPlayer: any