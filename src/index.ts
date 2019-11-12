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
  navigateTo,
  navigateBack,
  reLaunch,
  setNavigationBar,
  switchTab,
  datePicker,
};

/**
 * 警告框
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 界面=>交互反馈}
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
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 界面=>交互反馈}
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
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 界面=>交互反馈}
 * @param {string} content 文字内容
 * @param {string} type toast 类型，展示相应图标，默认 none，支持 success / fail / exception / none。其中 exception 类型必须传文字信息
 * @param {number} duration 显示时长，单位为 ms，默认 2000。按系统规范，android只有两种(<=2s >2s)
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
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 界面=>交互反馈}
 * @param {string} content loading的文字内容
 * @param {number} delay 延迟显示，单位 ms，默认 0。如果在此时间之前调用了 dd.hideLoading 则不会显示
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
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 界面=>交互反馈}
 */
export function hideLoading() {
  return dd.hideLoading();
}

/**
 * 显示操作菜单
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 界面=>交互反馈}
 * @param {string} title 菜单标题
 * @param {Array<string>} items 菜单按钮文字数组
 * @param {string} cancelButtonText 取消按钮文案。注：Android平台此字段无效，不会显示取消按钮
 */
export function showActionSheet(opt: {
  title?: string;
  items: Array<string>;
  cancelButtonText?: string;
}) {
  return new Promise((resolve, reject) => {
    dd.showActionSheet({
      ...opt,
      /** @returns {number} index 被点击的按钮的索引，从0开始。点击取消或蒙层时返回 -1 */
      success: (res: {
        index: number,
      }) => {
        resolve(res.index);
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
 * {@link https://ding-doc.dingtalk.com/doc#/dev/httprequest 网络=>发送网络请求}
 * @param {string} url 目标服务器url
 * @param {any} headers 设置请求的 HTTP 头，默认 {'Content-Type': 'application/x-www-form-urlencoded'}
 * @param {string} method 默认GET，目前支持GET，POST
 * @param {any} data  请求参数
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
 * @param {string} url 开发者服务器地址
 * @param {string} filePath 要上传文件资源的本地定位符
 * @param {string} fileName 文件名，即对应的 key, 开发者在服务器端通过这个 key 可以获取到文件二进制内容
 * @param {string} fileType 文件类型，image / video
 * @param {any} header HTTP 请求 Header
 * @param {any} formData HTTP 请求中其他额外的 form 数据
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
       * @returns {string} data 服务器返回的数据
       * @returns {string} statusCode HTTP 状态码
       * @returns {any} header 服务器返回的 header
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
 * @param {string} url 下载文件地址
 * @param {any} header HTTP 请求 Header
 */
export function downloadFile(opt: {
  url: string;
  header?: any;
}) {
  return new Promise((resolve, reject) => {
    dd.downloadFile({
      ...opt,
      /** @returns {string} filePath 文件临时存放的位置 */
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
 * {@link https://ding-doc.dingtalk.com/doc#/dev/system-info 设备=>系统信息}.
 */
export function getSystemInfoSync() {
  return dd.getSystemInfoSync();
}

/**
 * 创建 canvas 绘图上下文
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-canvas 界面=>画布}.
 * @param {string} canvasId 定义在 上的 id
 */
export function createCanvasContext(canvasId: string) {
  return dd.createCanvasContext(canvasId);
}

/**
 * 获取一个节点查询对象 SelectorQuery
 * {@link https://ding-doc.dingtalk.com/doc#/dev/selector-query 界面=>节点查询}.
 */
export function createSelectorQuery() {
  return dd.createSelectorQuery();
}

/**
 * 关闭当前页面，跳转到应用内的某个指定页面
 * @param {string} url 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用?分隔，参数键与参数值用=相连，不同参数必须用&分隔；如path?key1=value1&key2=value2
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
 * 保留当前页面，跳转到应用内的某个指定页面，可以使用 dd.navigateBack 返回到原来页面。
 * 注意：页面最大深度为5，即可连续调用 5 次 navigateTo
 * {@ink https://ding-doc.dingtalk.com/doc#/dev/ui-navigate 界面=>导航栏}
 * @param {string} url 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用?分隔，参数键与参数值用=相连，不同参数必须用&分隔；如 path?key1=value1&key2=value2
 */
export function navigateTo(url: string) {
  return new Promise((resolve, reject) => {
    dd.navigateTo({
      url,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 关闭当前页面，返回上一级或多级页面。可通过 getCurrentPages 获取当前的页面栈信息，决定需要返回几层。
 * {@ink https://ding-doc.dingtalk.com/doc#/dev/ui-navigate 界面=>导航栏}
 * @param {number} delta 默认值1，返回的页面数，如果 delta 大于现有打开的页面数，则返回到当前页面栈最顶部的页
 */
export function navigateBack(delta: number) {
  return dd.navigateBack({
    delta,
  })
}

/**
 * 关闭当前所有页面，跳转到应用内的某个指定页面。
 * {@ink https://ding-doc.dingtalk.com/doc#/dev/ui-navigate 界面=>导航栏}
 * @param {string} url 页面路径。如果页面不为 tabbar 页面则路径后可以带参数。参数规则如下：路径与参数之间使用?分隔，参数键与参数值用=相连，不同参数必须用&分隔；如path?key1=value1&key2=value2
 */
export function reLaunch(url: string) {
  return new Promise((resolve, reject) => {
    dd.reLaunch({
      url,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 设置导航栏文字及样式
 * {@ink https://ding-doc.dingtalk.com/doc#/dev/ui-navigate 界面=>导航栏}
 * @param {string} title 导航栏标题
 * @param {string} backgroundColor 导航栏背景色，支持十六进制颜色值
 * @param {boolean} reset 是否重置导航栏为钉钉默认配色，默认 false
 */
export function setNavigationBar(opt: {
  title?: string;
  backgroundColor?: string;
  reset?: boolean;
}) {
  return new Promise((resolve, reject) => {
    dd.setNavigationBar({
      ...opt,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 跳转到指定 tabBar 页面，并关闭其他所有非 tabBar 页面。
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-tabbar 界面=>TabBar}
 * @param {string} url 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
 */
export function switchTab(url: string) {
  return new Promise((resolve, reject) => {
    dd.switchTab({
      url,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 打开日期选择列表
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-date 界面=>选择日期}
 * @param {string} format 返回的日期格式， 1.yyy-MM-dd（默认） 2.HH:mm 3.yyyy-MM-dd HH:mm 4.yyyy-MM
 * @param {string} currentDate 初始选择的日期时间，默认当前时间
 */
export function datePicker(opt: {
  format?: string;
  currentDate?: string;
}) {
  return new Promise((resolve, reject) => {
    dd.datePicker({
      ...opt,
      /** @returns {string} date 选择的日期 */
      success(res: any) {
        resolve(res.date);
      },
      fail: reject,
    })
  })

 * 下拉刷新操作
 * {@link https://ding-doc.dingtalk.com/doc#/dev/pulldown 界面=>下拉刷新}
 * 在 Page 中自定义 onPullDownRefresh 函数，可以监听该页面用户的下拉刷新事件。
 * 需要在页面对应的 .json 配置文件中配置 "pullRefresh": true 选项，才能开启下拉刷新事件。
 */
export function onPullDownRefresh() {
  console.log('onPullDownRefresh', new Date());
}

/**
 * 停止当前页面的下拉刷新
 * {@link https://ding-doc.dingtalk.com/doc#/dev/pulldown 界面=>下拉刷新}
 * 当处理完数据刷新后，调用 dd.stopPullDownRefresh 可以停止当前页面的下拉刷新。
 */
export function stopPullDownRefresh() {
  return dd.stopPullDownRefresh();
}
