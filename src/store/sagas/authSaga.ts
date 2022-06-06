import { AxiosError, AxiosResponse } from 'axios'
import { SagaIterator } from 'redux-saga'
import { call, put, StrictEffect, takeEvery } from 'redux-saga/effects'

import { userApi } from 'api/userApi'
import { AppStatus, AuthTypeSaga } from 'enums'
import { setAppStatus, setError, setIsLoggedInAC, setUserInfo } from 'store/reducers'
import { LoginValues, UserType } from 'types'

function* loginWorker({
  payload,
}: loginType): Generator<StrictEffect, void, AxiosResponse<UserType>> {
  try {
    yield put(setAppStatus(AppStatus.loading))
    const res: AxiosResponse<UserType> = yield call(userApi.login, payload)
    yield put(setUserInfo(res.data))
    yield put(setIsLoggedInAC(true))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

function* logOutWorker(): Generator<StrictEffect, void, void> {
  try {
    yield put(setAppStatus(AppStatus.loading))
    yield call(userApi.logOut)
    yield put(setIsLoggedInAC(false))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

export const login = (payload: LoginValues) => ({ type: AuthTypeSaga.LoginSaga, payload } as const)

export const logout = () => ({ type: AuthTypeSaga.LogOutSaga } as const)

type loginType = ReturnType<typeof login>

export function* authWatcher(): SagaIterator {
  yield takeEvery(AuthTypeSaga.LogOutSaga, logOutWorker)
  yield takeEvery(AuthTypeSaga.LoginSaga, loginWorker)
}
