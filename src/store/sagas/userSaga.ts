import { AxiosError, AxiosResponse } from 'axios'
import { call, put, StrictEffect, takeEvery, takeLatest } from 'redux-saga/effects'

import { AppStatus } from '../../enums'
import { setAppStatus, setError } from '../reducers'
import {
  requestChangePasswordType,
  requestChangeUserInfoType,
  setUserError,
  setUserInfo,
} from '../reducers/userReducer'

import { userApi } from 'api/userApi'
import { SagaActions } from 'enums/sagaActions'
import { setIsLoggedInAC } from 'store/reducers'
import { setNameUserResponseType } from 'types'

export function* setNameWorker(
  action: requestChangeUserInfoType,
): Generator<StrictEffect, void, AxiosResponse<setNameUserResponseType>> {
  try {
    yield put(setAppStatus(AppStatus.loading))
    const { name, avatar } = action.payload
    const res: AxiosResponse<setNameUserResponseType> = yield call(userApi.update, {
      name,
      avatar,
    })
    yield put(setUserInfo(res.data.updatedUser))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* setNewPasswordWorker(action: requestChangePasswordType) {
  try {
    yield put(setAppStatus(AppStatus.loading))
    // отправить запрос на изменение с токеном и паролем, если все ок залогиниться?
    yield call(userApi.setNewPassword, action.payload)
    // тут должен быть login запрос?
    yield put(setIsLoggedInAC(true))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

function* restoreWorker({ payload }: RestoreST) {
  try {
    yield put(setAppStatus(AppStatus.loading))
    yield call(userApi.forgot, payload)
  } catch (e) {
    yield put(setUserError((e as AxiosError)?.response?.data.error))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* UserWatcher() {
  yield takeLatest('REQUEST_CHANGE_USER_INFO', setNameWorker)
  yield takeLatest('REQUEST_CHANGE_PASS', setNewPasswordWorker)
  yield takeLatest(SagaActions.Restore, restoreWorker)
  yield takeEvery('REQUEST_CHANGE_PASS', setNewPasswordWorker)
}

export const restorePassS = (payload: string) => ({ type: SagaActions.Restore, payload } as const)
type RestoreST = ReturnType<typeof restorePassS>
