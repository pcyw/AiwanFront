import axios from '@/libs/api.request'

export const token = ({ userName, password }) => {
  const data = {
    username: userName,
    password,
    grant_type: 'password',
    client_id: 'client',
    client_secret: '123456'
  }
  return axios.request({
    url: 'auth/oauth/token?username=' + userName + '&password=' + password + '&grant_type=password&client_id=client&client_secret=123456',
    data,
    method: 'post'
  })
}
