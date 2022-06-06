import { instance } from 'api/config'
import { LoginParamsType, ResponseType, SetNewPasswordRequestType } from 'types'

export const userApi = {
  register: async (body: Omit<LoginParamsType, 'rememberMe'>) => {
    const res = await instance.post('auth/register', body)
    return res.data
  },
  login: (body: LoginParamsType) => instance.post<ResponseType>('auth/login', body),
  me: () => instance.post<ResponseType>('auth/me', {}),
  logOut: () => instance.delete('auth/me'),
  update: (body: any) => instance.put('auth/me', body),
  setNewPassword: (body: SetNewPasswordRequestType) => instance.post('auth/set-new-password', body),
  forgot: async (email: string) => {
    const body = {
      email,
      from: 'you',
      message: `<div style='background-color: lime; padding: 15px'>password recovery link: 
                <a href='http://localhost:3000/#/set-new-password$token$'>link</a></div>`,
    }
    const res = await instance.post('auth/forgot', body)
    return res.data
  },
}
