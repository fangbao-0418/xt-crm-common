type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
type useStateType = [boolean, Dispatch<SetStateAction<boolean>>];
