import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError, AxiosResponse } from 'axios'
import { SagaIterator } from 'redux-saga'
import { call, put, takeLatest } from 'redux-saga/effects'

import { AppStatus } from '../../enums'

import { setUserInfo } from './userReducer'

import { userApi } from 'api'
import { setIsLoggedInAC } from 'store/reducers/authReducer'
import { GenericReturnType, UserType } from 'types'

const initialState = {
  isInitialized: false,
  error: '',
  isEditMode: false,
  status: 'idle',
}

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setInitializeAC: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload
    },
    setAppStatus: (state, action: PayloadAction<AppStatus>) => {
      state.status = action.payload
    },
  },
})

export const appReducer = slice.reducer

export const { setInitializeAC, setError, setEditMode, setAppStatus } = slice.actions

export const requestInitialize = () => ({ type: 'REQUEST_INITIALIZE' } as const)

export function* setInitializeWorker(): SagaIterator {
  try {
    yield put(setAppStatus(AppStatus.loading))
    const response: AxiosResponse<UserType> = yield call(userApi.me)
    yield put(setUserInfo(response.data))
    yield put(setIsLoggedInAC(true))
  } catch (e) {
    console.warn(e as AxiosError)
  } finally {
    yield put(setInitializeAC(true))
    yield put(setAppStatus(AppStatus.idle))
  }
}

export function* AppWatcher(): GenericReturnType {
  yield takeLatest('REQUEST_INITIALIZE', setInitializeWorker)
}

// export type NullableType<T> = null | T
// export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
