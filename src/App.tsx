import React, { ReactElement, useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { ErrorSnackbar } from './components/common/ErrorSnackbar/ErrorSnackbar'

import s from 'App.module.scss'
import preloader from 'assets/Rocket.gif'
import { Router } from 'components/routes'
import { useAppSelector } from 'hooks'
import { requestInitialize } from 'store/reducers/appReducer'

const App = (): ReactElement => {
  const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
  const isEditMode = useAppSelector<boolean>(state => state.app.isEditMode)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLoggedIn) return
    dispatch(requestInitialize())
  }, [])

  if (!isInitialized && !isLoggedIn) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '30%',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <img src={preloader} alt="preloader" />
      </div>
    )
  }

  return (
    <div className={isEditMode ? `${s.appScrollHidden} ${s.app}` : s.app}>
      <Router />
      <ErrorSnackbar />
    </div>
  )
}

export default App
