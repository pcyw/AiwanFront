import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserProfile = (token) => {
  return axios.request({
    url: 'user/api/user/profile',
    params: {
      access_token: getToken()
    },
    method: 'get'
  })
}

export const queryUser = (pageNum, pageSize, name) => {
  return axios.request({
    url: 'user/api/user',
    method: 'get',
    params: {
      access_token: getToken(),
      pageNum,
      pageSize,
      name
    }
  })
}

export const getUserInfo = (id) => {
  return axios.request({
    url: 'user/api/user/' + id,
    method: 'get',
    params: {
      access_token: getToken()
    }
  })
}

export const removeUser = (id) => {
  return axios.request({
    url: 'user/api/user/' + id,
    method: 'delete',
    params: {
      access_token: getToken()
    }
  })
}

export const savaUser = (id, user) => {
  if(id==null){
    return createUser(user);
  }else{
    return updateUser(id, user);
  }
}

export const createUser = (user) => {
  return axios.request({
    url: 'user/api/user',
    method: 'post',
    params: {
      access_token: getToken()
    },
    data:user
  })
}

export const updateUser = (id,user) => {
  return axios.request({
    url: 'user/api/user/' + id,
    method: 'put',
    params: {
      access_token: getToken()
    },
    data:user
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
