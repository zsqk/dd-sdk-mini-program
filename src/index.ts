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
  createAnimation,
  hideKeyboard,
  onKeyboardShow,
  pageScrollTo,
  complexChoose,
  chooseDepartments,
  createGroupChat,
  choosePhonebook,
  chooseExternalUsers,
  editExternalUser,
  chooseUserFromList,
  openLocation,
  setStorage,
  setStorageSync,
  getStorage,
  getStorageSync,
  removeStorage,
  removeStorageSync,
};

/** 毫秒 */
type Millisecond = number;

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
      fail: reject,
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
      fail: reject,
    });
  });
}

/**
 * 显示一个弱提示，可选择多少秒之后消失
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 界面=>交互反馈}
 * @param content 文字内容
 * @param type toast 类型，展示相应图标，默认 none，支持 success / fail / exception / none。其中 exception 类型必须传文字信息
 * @param duration 显示时长，单位为 ms，默认 2000。按系统规范，android只有两种(<=2s >2s)
 */
export function showToast({
  content,
  type = 'none',
  duration = 2000,
}: {
  content?: string;
  type?: 'success' | 'fail' | 'exception' | 'none';
  duration?: Millisecond;
} = {}) {
  return new Promise((resolve, reject) => {
    dd.showToast({
      content,
      type,
      duration,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 显示加载提示
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-feedback 界面=>交互反馈}
 * @param content loading的文字内容
 * @param delay 延迟显示，单位 ms，默认 0。如果在此时间之前调用了 dd.hideLoading 则不会显示
 */
export function showLoading({
  content,
  delay = 0,
}: {
  content?: string;
  delay?: Millisecond;
} = {}) {
  return new Promise((resolve, reject) => {
    dd.showLoading({
      content,
      delay,
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
      fail: reject,
    });
  });
}

/**
 * 发送网络请求
 * {@link https://ding-doc.dingtalk.com/doc#/dev/httprequest 网络=>发送网络请求}
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
 * @param canvasId 定义在 上的 id
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
 * @param url 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用?分隔，参数键与参数值用=相连，不同参数必须用&分隔；如path?key1=value1&key2=value2
 */
export function redirectTo(url: string) {
  return new Promise((resolve, reject) => {
    dd.redirectTo({
      url,
      success: resolve,
      fail: reject,
    });
  });
}

/**
 * 保留当前页面，跳转到应用内的某个指定页面，可以使用 dd.navigateBack 返回到原来页面。
 * 注意：页面最大深度为5，即可连续调用 5 次 navigateTo
 * {@ink https://ding-doc.dingtalk.com/doc#/dev/ui-navigate 界面=>导航栏}
 * @param url 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用?分隔，参数键与参数值用=相连，不同参数必须用&分隔；如 path?key1=value1&key2=value2
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
 * @param delta 默认值1，返回的页面数，如果 delta 大于现有打开的页面数，则返回到当前页面栈最顶部的页
 */
export function navigateBack(delta = 1) {
  return dd.navigateBack({
    delta,
  })
}

/**
 * 关闭当前所有页面，跳转到应用内的某个指定页面。
 * {@ink https://ding-doc.dingtalk.com/doc#/dev/ui-navigate 界面=>导航栏}
 * @param url 页面路径。如果页面不为 tabbar 页面则路径后可以带参数。参数规则如下：路径与参数之间使用?分隔，参数键与参数值用=相连，不同参数必须用&分隔；如path?key1=value1&key2=value2
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
 * @param title 导航栏标题
 * @param backgroundColor 导航栏背景色，支持十六进制颜色值
 * @param reset 是否重置导航栏为钉钉默认配色，默认 false
 */
export function setNavigationBar({
  title,
  backgroundColor,
  reset = false,
}: {
  title?: string;
  backgroundColor?: string;
  reset?: boolean;
} = {}) {
  return new Promise((resolve, reject) => {
    dd.setNavigationBar({
      title,
      backgroundColor,
      reset,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 跳转到指定 tabBar 页面，并关闭其他所有非 tabBar 页面。
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-tabbar 界面=>TabBar}
 * @param url 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
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
 * @param format 返回的日期格式， 1.yyy-MM-dd（默认） 2.HH:mm 3.yyyy-MM-dd HH:mm 4.yyyy-MM
 * @param currentDate 初始选择的日期时间，默认当前时间
 */
export function datePicker(opt: {
  format?: string;
  currentDate?: string;
}) {
  return new Promise((resolve, reject) => {
    dd.datePicker({
      ...opt,
      /** @returns date 选择的日期 */
      success(res: any) {
        resolve(res.date);
      },
      fail: reject,
    })
  })
}

/**
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

/**
 * 创建动画实例animation。调用实例的方法来描述动画，最后通过动画实例的export方法将动画数据导出并传递给组件的animation属性
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-animation 界面=>动画}
 * @param duration 动画的持续时间，单位 ms，默认值 400
 * @param timeFunction 定义动画的效果，默认值"linear"，有效值："linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
 * @param delay 动画延迟时间，单位 ms，默认值 0
 * @param transformOrigin 设置transform-origin，默认值 "50"
 */
export function createAnimation({
  duration = 400,
  timeFunction = 'linear',
  delay = 0,
  transformOrigin = '50',
}: {
  duration?: Millisecond;
  timeFunction?: "linear" | "ease" | "ease-in" | "ease-in-out" | "ease-out" | "step-start" | "step-end";
  delay?: Millisecond;
  transformOrigin?: string;
} = {}) {
  return dd.createAnimation({
    duration,
    timeFunction,
    delay,
    transformOrigin,
  })
}

/**
 * 监听键盘弹起事件，并返回键盘高度
 * 键盘高度可以在回调参数的data.height参数中取到，单位为px。
 * 需要在page中设置该回调。
 */
export function onKeyboardShow(res: any) {
  return res.data.height;
}

/**
 * 监听键盘收起事件。
 * 需要在page中设置该回调。
 * 调用 onKeyboardHide()
 */

/**
 * 隐藏键盘
 * {@link https://ding-doc.dingtalk.com/doc#/dev/ui-hidekeyboard 界面=>键盘}
 */
export function hideKeyboard() {
  return dd.hideKeyboard();
}

/**
 * 滚动到页面的目标位置
 * {@link https://ding-doc.dingtalk.com/doc#/dev/scroll 界面=>滚动}
 * @param scrollTop 滚动到页面的目标位置，单位 px
 */
export function pageScrollTo(scrollTop: number) {
  return dd.pageScrollTo({
    scrollTop,
  })
}

/**
 * 获取用户当前的地理位置信息
 * {@link https://ding-doc.dingtalk.com/doc#/dev/location 位置}
 * @param cacheTimeout 钉钉客户端经纬度定位缓存过期时间，单位秒。默认 30s。使用缓存会加快定位速度，缓存过期会重新定位。
 * @param type 0：获取经纬度； 1：默认，获取经纬度和详细到区县级别的逆地理编码数据
 */
export function getLocation({
  cacheTimeout = 30,
  type,
}: {
  cacheTimeout?: Number,
  type?: number,
} = {}) {
  return new Promise((resolve, reject) => {
    dd.getLocation({
      cacheTimeout,
      type,
      /**
       * @returns longitude 经度
       * @returns latitude 纬度
       * @returns accuracy 精确度，单位 米
       * @returns province 省份(type>0生效)
       * @returns city 城市(type>0生效)
       * @returns address 格式化地址，如：北京市朝阳区南磨房镇北京国家广告产业园区(type>0生效)
       */
      success: (res: {
        longitude: string,
        latitude: string,
        accuracy: string,
        province: string,
        city: string,
        address: string,
      }) => {
        resolve(res);
      },
      fail: reject,
    })
  })
}

/**
 * 使用内置地图查看位置
 * {@link https://ding-doc.dingtalk.com/doc#/dev/location 位置}
 * @param longitude 经度
 * @param latitude 纬度
 * @param name 位置名称
 * @param address 地址的详细说明
 * @param scale 缩放比例，范围 3~19，默认为 15
 */
export function openLocation({
  longitude,
  latitude,
  name,
  address,
  scale = 15,
}: {
  longitude: string;
  latitude: string;
  name: string;
  address: string;
  scale?: number;
}) {
  return new Promise((resolve, reject) => {
    dd.openLocation({
      longitude,
      latitude,
      name,
      address,
      scale,
      success: resolve,
      fail: reject,
    });
  })
}

/**
 * 调用扫一扫功能
 * {@link https://ding-doc.dingtalk.com/doc#/dev/vglq4x 开放接口=>扫码}
 * @param type 扫码样式(默认 qr)：1, qr，扫码框样式为二维码扫码框 2.bar，扫码样式为条形码扫码框
 */
export function scan(type = 'qr') {
  return new Promise((resolve, reject) => {
    dd.scan({
      type,
      /**
       * @returns code 扫码所得数据
       * @returns qrCode 扫描二维码时返回二维码数据
       * @returns barCode 扫描条形码时返回条形码数据
       */
      success: (res: {
        code: string,
        qrCode: string,
        barCode: string,
      }) => {
        resolve(res);
      },
      fail: reject,
    })
  })
}

/**
 * 通讯录选人===>选人和部门
 * {@link https://ding-doc.dingtalk.com/doc#/dev/yskexi 开放接口=>通讯录选人}
 * @param title 标题
 * @param multiple 是否多选
 * @param limitTips 超过限定人数返回提示
 * @param maxUsers 	最大可选人数
 * @param pickedUsers 已选用户，值为userId列表
 * @param pickedDepartments 已选部门
 * @param disabledUsers 不可选用户，值为userId列表
 * @param disabledDepartments 不可选部门
 * @param requiredUsers 必选用户（不可取消选中状态），值为userId列表
 * @param requiredDepartments 必选部门（不可取消选中状态）
 * @param permissionType 选人权限，目前只有GLOBAL这个参数
 * @param responseUserOnly true：返回人员信息 false：返回人员和部门信息
 * @param startWithDepartmentId 仅支持0和-1两个值： 0表示从企业最上层开始； -1表示从自己部门开始，为-1时仅在Android端生效
 */
export function complexChoose(opt: {
  title: string;
  multiple: boolean;
  limitTips: string;
  maxUsers: number;
  pickedUsers: Array<string>;
  pickedDepartments: Array<string>;
  disabledUsers: Array<string>;
  disabledDepartments: Array<string>;
  requiredUsers: Array<string>;
  requiredDepartments: Array<string>;
  permissionType: string;
  responseUserOnly: boolean;
  startWithDepartmentId: number;
}) {
  return new Promise((resolve, reject) => {
    dd.complexChoose({
      ...opt,
      /**
       * @returns selectedCount 选择人数
       * @returns users 返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），userId（用户工号）三个字段
       * @returns departments 返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、count（部门人数）
       * 
       */
      success: (res: {
        selectedCount: number,
        users: Array<object>,
        departments: Array<object>,
      }) => {
        resolve(res);
      },
      fail: reject,
    })
  })
}

/**
 * 通讯录选人===>选择部门信息
 * {@link https://ding-doc.dingtalk.com/doc#/dev/yskexi 开放接口=>通讯录选人}
 * @param title 标题
 * @param multiple 是否多选
 * @param limitTips 超过限定人数返回提示
 * @param maxDepartments 	最大可选部门数
 * @param pickedDepartments 已选部门
 * @param disabledDepartments 不可选部门
 * @param requiredDepartments 必选部门（不可取消选中状态）
 * @param permissionType 选人权限，目前只有GLOBAL这个参数
 */
export function chooseDepartments(opt: {
  title: string;
  multiple: boolean;
  limitTips: string;
  maxDepartments: number;
  pickedDepartments: Array<string>;
  disabledDepartments: Array<string>;
  requiredDepartments: Array<string>;
  permissionType: string;
}) {
  return new Promise((resolve, reject) => {
    dd.chooseDepartments({
      ...opt,
      /**
       * @returns selectedCount 选择人数
       * @returns departmentsCount 选择的部门数
       * @returns departments 返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
       * 
       */
      success: (res: {
        userCount: number,
        departmentsCount: number,
        departments: Array<object>,
      }) => {
        resolve(res);
      },
      fail: reject,
    })
  })
}

/**
 * 通讯录选人===>创建企业群聊天
 * {@link https://ding-doc.dingtalk.com/doc#/dev/yskexi 开放接口=>通讯录选人}
 * @param users 默认选中的userId列表
 */
export function createGroupChat(users: Array<string>) {
  return new Promise((resolve, reject) => {
    dd.createGroupChat({
      users,
      /**@returns id 企业群id */
      success: (res: {
        id: Array<string>
      }) => {
        resolve(res.id);
      },
      fail: reject,
    })
  })
}

/**
 * 通讯录选人===>选取手机通讯录
 * {@link https://ding-doc.dingtalk.com/doc#/dev/yskexi 开放接口=>通讯录选人}
 * @param title 如果你需要修改选人页面的title，可以在这里赋值
 * @param multiple 是否多选： true多选，false单选； 默认true
 * @param maxUsers 人数限制，当multiple为true才生效，可选范围1-1500
 * @param limitTips 超过人数限制的提示语可以用这个字段自定义
 */
export function choosePhonebook({
  title,
  multiple = true,
  limitTips,
  maxUsers,
}: {
  title: string;
  multiple?: boolean;
  limitTips: string;
  maxUsers: number;
}) {
  return new Promise((resolve, reject) => {
    dd.choosePhonebook({
      title,
      multiple,
      limitTips,
      maxUsers,
      /**
       * @returns name 姓名
       * @returns avatar 头像图片id，可能为空
       * @returns mobile 用户手机号
       */
      success: (res: Array<object>) => {
        resolve(res);
      },
      fail: reject,
    })
  })
}

/**
 * 通讯录选人===>选择外部联系人
 * {@link https://ding-doc.dingtalk.com/doc#/dev/yskexi 开放接口=>通讯录选人}
 * @param title 选择联系人标题
 * @param multiple 是否多选： true多选，false单选； 默认true
 * @param maxUsers 最多选择的人数
 * @param limitTips 限制选择人数，0为不限制
 * @param pickedUsers 默认选中的人，值为userId列表。注意:已选中可以取消
 * @param disabledUsers 不能选的人，值为userId列表
 * @param requiredUsers 默认选中且不可取消选中状态的人，值为userId列表
 */
export function chooseExternalUsers({
  title,
  multiple = true,
  limitTips,
  maxUsers,
  pickedUsers,
  disabledUsers,
  requiredUsers,
}: {
  title: string;
  multiple?: boolean;
  limitTips: string;
  maxUsers: number;
  pickedUsers: Array<string>;
  disabledUsers: Array<string>;
  requiredUsers: Array<string>;
}) {
  return new Promise((resolve, reject) => {
    dd.chooseExternalUsers({
      title,
      multiple,
      limitTips,
      maxUsers,
      pickedUsers,
      disabledUsers,
      requiredUsers,
      /**
       * @returns name 姓名
       * @returns avatar 头像图片url，可能为空
       * @returns userId 用户id
       * @returns orgName 公司名字
       */
      success: (res: Array<object>) => {
        resolve(res);
      },
      fail: reject,
    })
  })
}

/**
 * 通讯录选人===>编辑外部联系人
 * {@link https://ding-doc.dingtalk.com/doc#/dev/yskexi 开放接口=>通讯录选人}
 * @param title 标题
 * @param emplId 需要编辑的员工id，不填，则为新增外部联系人
 * @param name 需要新增的外部联系人的名字
 * @param mobile 需要预填的手机号
 * @param companyName 需要预填的公司名
 * @param deptName 预填部门名字
 * @param job 预填职位
 * @param remark 备注信息
 */
export function editExternalUser(opt: {
  title: string;
  emplId: string;
  name: string;
  mobile: string;
  companyName: string;
  deptName: string;
  job: string;
  remark: string;
}) {
  return new Promise((resolve, reject) => {
    dd.editExternalUser({
      ...opt,
      /**
       * @returns userId 需要编辑的员工id，不填，则为新增外部联系人
       * @returns name 需要新增的外部联系人的名字，emplID为空时生效
       * @returns mobile 需要预填的手机号，emplID为空时生效
       * @returns companyName 需要预填的公司名，emplID为空时生效
       * @returns deptName 预填部门名字，emplID为空时生效
       * @returns job 预填职位，emplID为空时生效
       * @returns remark	备注信息，emplId为空时生效
       */
      success: (res: {
        userId: string,
        name: string,
        mobile: string,
        companyName: string,
        deptName: string,
        job: string,
        remark: string,
      }) => {
        resolve(res);
      },
      fail: reject,
    })
  })
}

/**
 * 通讯录选人===>单选自定义联系人
 * {@link https://ding-doc.dingtalk.com/doc#/dev/yskexi 开放接口=>通讯录选人}
 * @param title 标题
 * @param users 一组员工userId
 * @param isShowCompanyName 是否显示公司名称
 * @param disabledUsers 不能选择的人；PC端不支持此参数
 */
export function chooseUserFromList({
  title,
  users,
  isShowCompanyName = false,
  disabledUsers,
}: {
  title: string;
  users: Array<string>;
  isShowCompanyName?: boolean;
  disabledUsers: Array<string>;
}) {
  return new Promise((resolve, reject) => {
    dd.chooseUserFromList({
      title,
      users,
      isShowCompanyName,
      disabledUsers,
       /**
        * @returns name 姓名
        * @returns avatar 头像图片url，可能为空
        * @returns userId 即员工userid
       */
      success: (res: Array<object>) => {
        resolve(res);
      },
      fail: reject,
    })
  })
}

/**
 * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的数据
 * {@link https://ding-doc.dingtalk.com/doc#/dev/storage 缓存}
 * @param key 缓存数据的key
 * @param data 要缓存的数据
 */
export function setStorage(opt: {
  key: string;
  data: object | string;
}) {
  return new Promise((resolve, reject) => {
    dd.setStorage({
      ...opt,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 同步将数据存储在本地缓存中指定的 key 中
 * 同步数据IO操作可能会影响小程序流畅度，建议使用异步接口，或谨慎处理调用异常
 * {@link https://ding-doc.dingtalk.com/doc#/dev/storage 缓存}
 * @param key 缓存数据的key
 * @param data 要缓存的数据
 */
export function setStorageSync(opt: {
  key: string;
  data: object | string;
}) {
  return dd.setStorageSync(opt);
}

/**
 * 获取缓存数据
 * {@link https://ding-doc.dingtalk.com/doc#/dev/storage 缓存}
 * @param key 要缓存的数据
 */
export function getStorage(key: string) {
  return new Promise((resolve, reject) => {
    dd.getStorage({
      key,
      /** @returns data key对应的内容（不存在时返回 null） */
      success: (res: {
        data: object | string,
      }) => {
        resolve(res.data);
      },
      fail: reject,
    })
  })
}

/**
 * 同步获取缓存数据
 * 同步数据IO操作可能会影响小程序流畅度，建议使用异步接口，或谨慎处理调用异常
 * {@link https://ding-doc.dingtalk.com/doc#/dev/storage 缓存}
 * @param key 缓存数据的key
 */
export function getStorageSync(key: string) {
  return dd.getStorageSync({key});
}

/**
 * 删除缓存数据
 * {@link https://ding-doc.dingtalk.com/doc#/dev/storage 缓存}
 * @param key 缓存数据的key
 */
export function removeStorage(key: string) {
  return new Promise((resolve, reject) => {
    dd.removeStorage({
      key,
      success: resolve,
      fail: reject,
    })
  })
}

/**
 * 同步删除缓存数据
 * 同步数据IO操作可能会影响小程序流畅度，建议使用异步接口，或谨慎处理调用异常
 * {@link https://ding-doc.dingtalk.com/doc#/dev/storage 缓存}
 * @param key 缓存数据的key
 */
export function removeStorageSync(key: string) {
  return dd.removeStorageSync({
    key,
  });
}
