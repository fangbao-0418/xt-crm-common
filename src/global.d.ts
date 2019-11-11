type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
type useStateType<T> = [T, Dispatch<SetStateAction<T>>];
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
type useStateType = [boolean, Dispatch<SetStateAction<boolean>>];
