import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CardT, PackT } from 'types'

const initialState = {
  currentPackId: '',
  currentPack: {
    cards: [] as CardT[],
    cardsTotalCount: 0,
    maxGrade: 0,
    minGrade: 0,
    page: 0,
    pageCount: 0,
    packUserId: '',
  },
}

const slice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setOnePackCards: (state, action: PayloadAction<PackT>) => {
      state.currentPack = action.payload
    },
    setCurrentPackId: (state, action: PayloadAction<string>) => {
      state.currentPackId = action.payload
    },
    setCardUpdatedGrade: (state, action: PayloadAction<any>) => {
      const index = state.currentPack.cards.findIndex(
        // eslint-disable-next-line no-underscore-dangle
        s => s._id === action.payload.updatedGrade.card_id,
      )
      state.currentPack.cards[index] = {
        ...state.currentPack.cards[index],
        grade: action.payload.updatedGrade.grade,
      }
    },
  },
})

export const cardsReducer = slice.reducer

// ACTION CREATORS
export const { setOnePackCards, setCurrentPackId, setCardUpdatedGrade } = slice.actions
