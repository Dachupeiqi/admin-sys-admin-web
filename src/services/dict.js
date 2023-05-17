import request, { methods } from '@/utils/request';

const router = 'dict';

// ----------------------------------------DictData--------------------------------------

// 查询字典data数据
export async function queryDictData(params) {
  return request(`/v1/${router}/data`, { params });
}

// 通过id查询字典data
export async function getDictData(id,params={}) {
  return request(`/v1/${router}/data/${id}`, { params });
}

// 创建字典data
export async function createDictData(data) {
  return request(`/v1/${router}/data`, {
    method: methods.POST,
    data,
  });
}

// 更新字典data
export async function updateDictData(id, data) {
  return request(`/v1/${router}/data/${id}`, {
    method: methods.PUT,
    data,
  });
}
export async function delDictData(id, params = {}) {
  return request(`/v1/${router}/data/${id}`, {
    method: methods.DELETE,
    params,
  });
}



// ----------------------------------------DictType--------------------------------------
// 查询字典Type数据
export async function queryDictType(params) {
  return request(`/v1/${router}/type`, { params });
}

// 通过id查询字典Type
export async function getDictType(id,params={}) {
  return request(`/v1/${router}/type/${id}`, { params });
}

// 创建字典Type
export async function createDictType(data) {
  return request(`/v1/${router}/type`, {
    method: methods.POST,
    data,
  });
}

// 更新字典Type
export async function updateDictType(id, data) {
  return request(`/v1/${router}/type/${id}`, {
    method: methods.PUT,
    data,
  });
}
export async function delDictType(id, params = {}) {
  return request(`/v1/${router}/type/${id}`, {
    method: methods.DELETE,
    params,
  });
}

