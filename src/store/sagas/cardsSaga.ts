import { AxiosError, AxiosResponse } from 'axios'
import { SagaIterator } from 'redux-saga'
import { call, put, select, StrictEffect, takeLatest } from 'redux-saga/effects'

import { AppStatus } from '../../enums'
import { RootState } from '../config'
import { setCardUpdatedGrade } from '../reducers'

import { cardsApi } from 'api/cardsApi'
import { SagaActions } from 'enums/sagaActions'
import { setOnePackCards, setPacks } from 'store/reducers'
import { setAppStatus, setError } from 'store/reducers/appReducer'
import { CardT, PackT } from 'types'
import { GetPacksPayload, GetPacksResponseT, GetPacksWorkerT } from 'types/PacksType'
import { CardTypePartial, UpdatedGradeRequestT, UpdatedGradeT } from 'types/PackTypes'

function* packsWorker({
  payload,
}: GetPacksWorkerT): Generator<StrictEffect, void, AxiosResponse<GetPacksResponseT>> {
  try {
    yield put(setAppStatus(AppStatus.loading))
    const response = yield call(cardsApi.getPacks, payload)
    yield put(setPacks(response.data))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data.error))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

function* onePackCardsWorker({
  payload,
}: any): Generator<StrictEffect, void, AxiosResponse<PackT>> {
  try {
    yield put(setAppStatus(AppStatus.loading))
    const response: AxiosResponse<PackT> = yield call(cardsApi.getOnePackCards, payload)
    yield put(setOnePackCards(response.data))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

export const getOnePackS = (payload: CardTypePartial) =>
  ({ type: SagaActions.GetOnePack, payload } as const)

export const deleteOneCard = (payload: string) =>
  ({ type: SagaActions.DeleteCard, payload } as const)

const getCurrentPackId = (state: RootState):string => state.cards.currentPackId
const getCardsTotalCount = (state: RootState):number => state.cards.currentPack.cardsTotalCount

function* deleteOneCardFromPackWorker({
  payload,
}: any): Generator<StrictEffect, void, AxiosResponse<CardT>> {
  try {
    yield put(setAppStatus(AppStatus.loading))
    yield call(cardsApi.deleteCardFromCurrentPack, payload)
    // eslint-disable-next-line camelcase
    const cardsPack_id = yield select(getCurrentPackId)
    const max = yield select(getCardsTotalCount)
    // eslint-disable-next-line camelcase
    yield put({ type: SagaActions.GetOnePack, payload: { cardsPack_id, max } })
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

function* updateOneCardFromPackWorker({
  payload,
}: any): Generator<StrictEffect, void, AxiosResponse<CardT>> {
  try {
    yield put(setAppStatus(AppStatus.loading))
    yield call(cardsApi.updateCardInCurrentPack, payload)
    // eslint-disable-next-line camelcase
    const cardsPack_id = yield select(getCurrentPackId)
    const max = yield select(getCardsTotalCount)
    // eslint-disable-next-line camelcase
    yield put({ type: SagaActions.GetOnePack, payload: { cardsPack_id, max } })
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

export const updateOneCard = (payload: CardTypePartial) =>
  ({ type: SagaActions.UpdateCard, payload } as const)

function* createNewCardInPackWorker({
  payload,
}: any): Generator<StrictEffect, void, AxiosResponse<CardT>> {
  try {
    yield put(setAppStatus(AppStatus.loading))
    yield call(cardsApi.createCardInCurrentPack, payload)
    // eslint-disable-next-line camelcase
    const cardsPack_id = yield select(getCurrentPackId)
    const max = yield select(getCardsTotalCount)
    // eslint-disable-next-line camelcase
    yield put({ type: SagaActions.GetOnePack, payload: { cardsPack_id, max } })
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data.error))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

export const createNewCard = (payload: CardTypePartial) =>
  ({ type: SagaActions.CreateCard, payload } as const)

function* rateCardWorker({ payload }: any): Generator<StrictEffect, void, UpdatedGradeT> {
  try {
    yield put(setAppStatus(AppStatus.loading))
    const response: UpdatedGradeT = yield call(cardsApi.rateCard, payload)
    yield put(setCardUpdatedGrade(response))
  } catch (e) {
    yield put(setError((e as AxiosError)?.response?.data))
  } finally {
    yield put(setAppStatus(AppStatus.idle))
  }
}

export const rateCard = (payload: UpdatedGradeRequestT) =>
  ({ type: SagaActions.RateCard, payload } as const)

export const getPacksS = (payload: Partial<GetPacksPayload>) =>
  ({ type: SagaActions.GetPacks, payload } as const)

export function* cardsWatcher(): SagaIterator {
  yield takeLatest(SagaActions.GetPacks, packsWorker)
  yield takeLatest(SagaActions.GetOnePack, onePackCardsWorker)
  yield takeLatest(SagaActions.DeleteCard, deleteOneCardFromPackWorker)
  yield takeLatest(SagaActions.UpdateCard, updateOneCardFromPackWorker)
  yield takeLatest(SagaActions.CreateCard, createNewCardInPackWorker)
  yield takeLatest(SagaActions.RateCard, rateCardWorker)
}
