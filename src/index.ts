import forEach from "lodash/forEach";

export default {
  alert,
  confirm,
  getAuthCode,
  httpRequest,
  redirectTo,
  getSystemInfoSync,
  createCanvasContext,
  createSelectorQuery,
};

/**
 * 警告框
 */
export function alert({
  title,
  content,
  buttonText
}: {
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 按钮文字 */
  buttonText?: string;
}) {
  return new Promise((resolve, reject) => {
    dd.alert({
      title,
      content,
      buttonText,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * 确认框
 */
export function confirm(opt: {
  /** confirm 框的标题 */
  title: string;
  /** confirm 框的内容 */
  content: string;
  /** 确认按钮文字 */
  confirmButtonText?: string;
  /** 取消按钮文字 */
  cancelButtonText?: string;
}) {
  return new Promise((resolve, reject) => {
    dd.confirm({
      ...opt,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * 获取免登 code
 */
export function getAuthCode() {
  return new Promise((resolve, reject) => {
    dd.getAuthCode({
      success(res: any) {
        resolve(res.authCode);
      },
      fail: reject
    });
  });
}

/**
 * 发送网络请求
 */
export function httpRequest(opt: {
  url: string;
  method: string;
  headers?: any;
  data?: any;
}) {
  let { headers = {}, data, ...rest } = opt;
  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
    data = JSON.stringify(data);
  }
  return new Promise((resolve, reject) => {
    dd.httpRequest({
      headers,
      data,
      success: (res: {
        data: string | object;
        status: number;
        headers: object;
      }) => {
        res.headers = getHeaders(res.headers);
        resolve(res);
      },
      fail: reject,
      ...rest
    });
  });
}

/**
 * 关闭当前页面，跳转到应用内的某个指定页面
 * @param {string} url
 */
export function redirectTo(url: string) {
  return new Promise((resolve, reject) => {
    dd.redirectTo({
      url,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * 专为处理钉钉 httpRequest 问题
 */
function getHeaders(origin: any) {
  if (Array.isArray(origin)) {
    const obj = {};
    forEach(origin, v => {
      Object.assign(obj, v);
    });
    return obj;
  }
  return origin;
}

/**
 * getSystemInfoSync 获取系统信息
 */
export function getSystemInfoSync() {
  return new Promise((resolve, reject) => {
    dd.getSystemInfoSync({
      success(res: any) {
        resolve(res);
      },
      fail: reject
    });
  });
}

/**
 * createCanvasContext 创建 canvas 绘图上下文
 */
export function createCanvasContext(canvasId: string) {
  return Promise.resolve(dd.createCanvasContext(canvasId));
}

/**
 * createSelectorQuery 获取一个节点查询对象 SelectorQuery
 */
export function createSelectorQuery(params: object) {
  return Promise.resolve(dd.createSelectorQuery(params));
}