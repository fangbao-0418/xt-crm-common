/*
 * @Author: fangbao
 * @Date: 2020-04-10 19:50:42
 * @LastEditors: fangbao
 * @LastEditTime: 2020-06-02 16:29:16
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/global.d.ts
 */
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
type useStateType<T> = [T, Dispatch<SetStateAction<T>>];
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
type useStateType = [boolean, Dispatch<SetStateAction<boolean>>];
declare type ApiEnv = 'dev' | 'test1' | 'test2' | 'pre' | 'prod';
/** 埋点工具 */
declare const Moon: any
declare const BUILD_TIME: number
declare const TcPlayer: any
declare const Observer: any