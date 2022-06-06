import { AxiosResponse } from 'axios'

import { CardT, CardTypePartial, UpdatedGradeRequestT, UpdatedGradeT } from '../types/PackTypes'

import { instance } from './config'

import { GetPacksPayload } from 'types/PacksType'

export const cardsApi = {
  getPacks: (payload: GetPacksPayload): Promise<AxiosResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const { packName, min, sortPacks, userId, max, pageCount = 10, page } = payload
    return instance.get(`cards/pack`, {
      params: {
        packName,
        min,
        max,
        sortPacks,
        pageCount,
        page,
        user_id: userId,
      },
    })
  },
  addPack: (payload: AddPackT): Promise<AxiosResponse> => instance.post(`cards/pack`, payload),
  updatePack: (payload: AddPackT): Promise<AxiosResponse> => instance.put(`cards/pack`, payload),
  deletePack: (payload: string): Promise<AxiosResponse> =>
    instance.delete(`cards/pack`, {
      params: {
        id: payload,
      },
    }),
  getOnePackCards: (payload: any = '') =>
    instance.get(
      // TODO: сделать полный набор параметров, не только cardsPack
      // Я добавил зачем-то чтобы запрашивались все карточки из пака сразу.
      `cards/card?cardsPack_id=${payload.cardsPack_id}&page=1&pageCount=${payload.max}`,
    ),
  createCardInCurrentPack: async (payload: CardTypePartial) => {
    const res: AxiosResponse<CardT> = await instance.post(`cards/card`, { card: payload })
    return res.data
  },
  deleteCardFromCurrentPack: async (payload: string) => {
    const res: AxiosResponse<CardT> = await instance.delete(`cards/card?id=${payload}`)
    return res.data
  },
  updateCardInCurrentPack: async (payload: CardTypePartial) => {
    const res: AxiosResponse<CardT> = await instance.put(`cards/card`, { card: payload })
    return res.data
  },
  rateCard: async (payload: UpdatedGradeRequestT) => {
    const res: AxiosResponse<UpdatedGradeT> = await instance.put(`cards/grade`, payload)
    return res.data
  },
}
export type AddPackT = {
  cardsPack: {
    _id?: string
    name: string
    deckCover?: string
    private: boolean
  }
}
