import request from '@/utils/request'
/**
 * 获取文章列表数据
 * @param {integer} channelId - 频道ID
 * @param {string} timestamp - 时间戳，相当于页码
 */
export const getArticles = (channelId, timestamp) => {
  return request('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}
/**
 * 对文章不感兴趣
 * @param {String} id
 */
export const disLike = (id) => {
  return request('app/v1_0/article/dislikes', 'post', {
    target: id
  })
}
/**
 * 举报文章
 * @param {BigInt} articleId
 * @param {integer} type
 */
export const report = (articleId, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}

/**
 * 联想建议（自动补全）
 * @param {String} q
 */
export const suggest = (q) => {
  return request('app/v1_0/suggestion', 'get', {
    q
  })
}

/**
 * 获取搜索结果
 * @param {integer} page  当前页码
 * @param {integer} perPage  每页数量
 * @param {String} q  搜索关键字
 */
export const searchArticles = ({ page = 1, perPage = 20, q }) => {
  return request('app/v1_0/search', 'get', {
    page,
    per_page: perPage,
    q
  })
}

/**
 * 获取文章详情
 * @param {String} articleId
 */
export const getArticleDetail = (articleId) => {
  return request(`/app/v1_0/articles/${articleId}`, 'get')
}

/**
 * 对文章不喜欢
 * @param {String} articleId
 */
export const disLikes = (articleId) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: articleId
  })
}

/**
 * 取消对文章不喜欢
 * @param {String} articleId
 */
export const unDisLikes = (articleId) => {
  return request(`/app/v1_0/article/dislikes/${articleId}`, 'delete')
}

/**
 * 对文章点赞
 * @param {String} articleId
 */
export const likings = (articleId) => {
  return request('/app/v1_0/article/likings', 'post', {
    target: articleId
  })
}

/**
 * 取消对文章点赞
 * @param {String} articleId
 */
export const unLikings = (articleId) => {
  return request(`/app/v1_0/article/likings/${articleId}`, 'delete')
}

/**
  * 获取评论或回复
 * @param {String} type - a 查询文章的评论  c 查询评论的回复
 * @param {String} source - 如果查询评论是文章的ID  如果查询回复是评论的ID
 * @param {String} offset - 查询每一页数据的最后一个数据的ID，当作下一页的偏移量
 * @param {String} limit - 每页显示多少条
 */
export const getCommentsOrReplys = ({ type, source, offset, limit = 10 }) => {
  return request('/app/v1_0/comments', 'get', {
    type, source, offset, limit
  })
}

/**
 * 提交评论或者回复
 * @param {String} target - 做评论的时候：文章ID   做回复的时候：评论ID
 * @param {String} content - 内容
 * @param {String} artId - 文章ID  当你做回复的时候
 */
export const commentOrReply = (target, content, artId = null) => {
  return request('/app/v1_0/comments', 'post', {
    target,
    content,
    art_id: artId
  })
}
