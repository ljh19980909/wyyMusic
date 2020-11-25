/*
    Store把action和reduser联系起来，我们将来其实操作的是Store这个对象
*/
// import {createStore} from "redux"
// import reducer from "../reducer/reducer"
// //通过createStore方法创建store对象
// let store =createStore(reducer)
// //导出store对象
// export default store

import { createStore } from 'redux';
import reducer from '../Reducers/Reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const myReducer = persistReducer(
    {
        key: 'root',
        storage,
    },
    reducer
);
//通过createStore方法创建store对象
let myStore = createStore(myReducer);
export const persistor = persistStore(myStore);
//导出store对象
export default myStore;
