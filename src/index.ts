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
  showToast,
  showLoading,
  hideLoading,
  showActionSheet,
  uploadFile,
  downloadFile,
};

/**
 * 警告框
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 交互反馈}
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
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 交互反馈}
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
 * 显示一个弱提示，可选择多少秒之后消失
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 交互反馈}
 * @param content 文字内容
 * @param type toast 类型，展示相应图标，默认 none，支持 success / fail / exception / none。其中 exception 类型必须传文字信息
 * @param duration 显示时长，单位为 ms，默认 2000。按系统规范，android只有两种(<=2s >2s)
 */
export function showToast(opt: {
  content?: string;
  type?: string;
  duration?: number;
}) {
  return new Promise((resolve, reject) => {
    dd.showToast({
      ...opt,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 显示加载提示
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 交互反馈}
 * @param content loading的文字内容
 * @param delay 延迟显示，单位 ms，默认 0。如果在此时间之前调用了 dd.hideLoading 则不会显示
 */
export function showLoading(opt: {
  content?: string;
  delay?: number;
}) {
  return new Promise((resolve, reject) => {
    dd.showLoading({
      ...opt,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 隐藏加载提示
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 交互反馈}
 */
export function hideLoading() {
  return dd.hideLoading();
}

/**
 * 显示操作菜单
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 交互反馈}
 * @param title 菜单标题
 * @param items 菜单按钮文字数组
 * @param cancelButtonText 取消按钮文案。注：Android平台此字段无效，不会显示取消按钮
 */
export function showActionSheet(opt: {
  title?: string;
  items: Array<string>;
  cancelButtonText?: string;
}) {
  return new Promise((resolve, reject) => {
    dd.showActionSheet({
      ...opt,
      /** @returns index 被点击的按钮的索引，从0开始。点击取消或蒙层时返回 -1 */
      success: (res: {
        index: number,
      }) => {
        resolve(res);
      },
      fail: reject,
    })
  })
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
 * {@link https://ding-doc.dingtalk.com/doc#/dev/httprequest 网络}
 * @param url 目标服务器url
 * @param headers 设置请求的 HTTP 头，默认 {'Content-Type': 'application/x-www-form-urlencoded'}
 * @param method 默认GET，目前支持GET，POST
 * @param data  请求参数
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
 * 上传本地资源到开发者服务器
 * {@link https://ding-doc.dingtalk.com/doc#/dev/frd69q 网络=>上传下载}
 * @param url 开发者服务器地址
 * @param filePath 要上传文件资源的本地定位符
 * @param fileName 文件名，即对应的 key, 开发者在服务器端通过这个 key 可以获取到文件二进制内容
 * @param fileType 文件类型，image / video
 * @param header HTTP 请求 Header
 * @param formData HTTP 请求中其他额外的 form 数据
 */
export function uploadFile(opt: {
  url: string;
  filePath: string;
  fileName: string;
  fileType: string;
  header?: any;
  formData?: any;
}) {
  return new Promise((resolve, reject) => {
    dd.uploadFile({
      ...opt,
      /**
       * @returns data 服务器返回的数据
       * @returns statusCode HTTP 状态码
       * @returns header 服务器返回的 header
       */
      success: (res: {
        data: string,
        statusCode: string,
        header: any
      }) => {
        resolve(res);
      },
      fail: reject,
    })
  })
}

/**
 * 下载文件资源到本地
 * {@link https://ding-doc.dingtalk.com/doc#/dev/frd69q 网络=>上传下载}
 * @param url 下载文件地址
 * @param header HTTP 请求 Header
 */
export function downloadFile(opt: {
  url: string;
  header?: any;
}) {
  return new Promise((resolve, reject) => {
    dd.downloadFile({
      ...opt,
      /** @returns filePath 文件临时存放的位置 */
      success: (res: {
        filePath: string,
      }) => {
        resolve(res);
      },
      fail: reject,
    })
  })
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
 * 获取系统信息
 * {@link https://ding-doc.dingtalk.com/doc#/dev/system-info 系统信息}.
 */
export function getSystemInfoSync() {
  return dd.getSystemInfoSync();
}

/**
 * 创建 canvas 绘图上下文
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-canvas 画布}.
 * @param canvasId 定义在 上的 id
 */
export function createCanvasContext(canvasId: string) {
  return dd.createCanvasContext(canvasId);
}

/**
 * 获取一个节点查询对象 SelectorQuery
 * {@link https://ding-doc.dingtalk.com/doc#/dev/selector-query 节点查询}.
 */
export function createSelectorQuery() {
  return dd.createSelectorQuery();
}
