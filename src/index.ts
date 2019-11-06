import forEach from "lodash/forEach";

export default { alert, getAuthCode, httpRequest, redirectTo };

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
