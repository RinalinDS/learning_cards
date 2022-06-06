import {configureStore} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import {cardsReducer} from '../reducers/cardsReducer'

import {appReducer} from 'store/reducers/appReducer'
import {authReducer} from 'store/reducers/authReducer'
import {userReducer} from 'store/reducers/userReducer'
import rootSaga from 'store/sagas'
import {packsReducer} from '../reducers/packsReducer';

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    user: userReducer,
    cards: cardsReducer,
    packs: packsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
})
sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store
