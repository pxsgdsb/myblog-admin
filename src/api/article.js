import request from '@/utils/request'

//获取文章list
export function getArticleList(data) {
  return request({
      url: '/article/getArticleList',
      method: 'post',
      data
  })
}

//提交文章添加
export function setArticleAdd(data) {
    return request({
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: '/article/setArticleAdd',
        method: 'post',
        data
    })
}

//编辑文章
export function editorArticle(data) {
  return request({
      url: '/article/EditorArticle',
      method: 'post',
      data
  })
}


//删除文章
export function deletArticle(data) {
  return request({
      url: '/article/DeletArticle',
      method: 'post',
      data
  })
}


//添加分类
export function AddClass(data) {
  return request({
      url: '/article/AddClass',
      method: 'post',
      data
  })
}

//添加标签
export function AddLabel(data) {
  return request({
      url: '/article/AddLabel',
      method: 'post',
      data
  })
}

//获取分类列表
export function getClassList() {
  return request({
      url: '/article/getClassList',
      method: 'get'
  })
}

//获取标签列表
export function getLabelList() {
  return request({
      url: '/article/getLabelList',
      method: 'get'
  })
}

//图片上传
export function upload(data) {
  return request({
      headers: {'Content-Type': 'multipart/form-data'},
      url: '/article/upload',
      method: 'post',
      data
  })
}

//删除图片
export function deleteImage(data){
  return request({
      url: '/article/deleteFile',
      method: 'post',
      data
  })
}

