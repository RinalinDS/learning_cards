import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'

import { LinearProgress } from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'

import { logout } from '../../store/sagas/authSaga'

import { Button } from 'components/common'
import s from 'components/header/style/header.module.scss'
import { Paths } from 'enums'
import { useAppDispatch, useAppSelector } from 'hooks/useAppDispatchAndSelector'

const linksArrayAuthorized = [
  { path: Paths.Home, name: 'Packs' },
  { path: Paths.Profile, name: 'Profile' },
]
const linksArrayUnAuthorized = [
  { path: Paths.Auth, name: 'Auth' },
  { path: Paths.Login, name: 'Login' },
]

type HeaderLinkProps = {
  path: string
  title: string
}
const HeaderLink: FC<HeaderLinkProps> = ({ path, title }) => (
  <NavLink to={path}>
    {/* eslint-disable-next-line react/no-unused-prop-types */}
    {({ isActive }: { isActive: boolean }) => (
      <span className={`${s.link} ${isActive ? s.link_active : ''}`}>{title}</span>
    )}
  </NavLink>
)

export const Header = (): ReactElement => {
  const dispatch = useAppDispatch()
  const logoutHandler = useCallback(() => {
    dispatch(logout())
  }, [dispatch])
  const isAuthorized = useAppSelector(state => state.auth.isLoggedIn)
  const status = useAppSelector(state => state.app.status)
  const [links, setLinks] = useState(linksArrayUnAuthorized)
  useEffect(() => {
    if (isAuthorized) {
      setLinks(linksArrayAuthorized)
    }
    if (!isAuthorized) {
      setLinks(linksArrayUnAuthorized)
    }
  }, [isAuthorized])
  return (
    <>
      <header className={s.header}>
        <div className={s.container}>
          {links.map(link => (
            <HeaderLink path={link.path} title={link.name} key={link.name} />
          ))}
          {isAuthorized && (
            <Button type="submit" onClick={logoutHandler}>
              LogOut
            </Button>
          )}
        </div>
        {status === 'loading' && <LinearProgress color="secondary" />}
      </header>
      <main className={s.main}>
        <div className={s.mainContainer}>
          <Outlet />
        </div>
      </main>
    </>
  )
}
