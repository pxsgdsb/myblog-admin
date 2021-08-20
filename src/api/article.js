import request from '@/utils/request'

export function getArticleList(params) {
  return request({
    url: '/user/Table',
    method: 'get',
    params
  })
}

export function setArticleAdd(data) {
    return request({
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // },
        url: '/article/setArticleAdd',
        method: 'post',
        data
    })
}
