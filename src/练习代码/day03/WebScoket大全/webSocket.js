import { wsUrl } from './base.js'; // 基本信息文件
import store from './../store/index';
import { formatImg, formatTime, arrayGetValue } from './index';
import Parser from 'common/xmldom';
import { getNetworkType } from '@/utils/wxApi.js';
import loginInit from '@/utils/loginInit.js';
import Request from '@/utils/newRequest.js';
const DOMParser = Parser.DOMParser;
class WebSocket {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.socketOpen = false; // 是否已经连接上了 socket
    this.socketMsgQueue = []; // 消息队列
    this.pinkTime = 50000;
    this.connectTimes = 0; // 重连次数
    this.isconnectSucc = true; // 是否连接成功
    this.offLineTimes = 0; // 断网重连次数
    (this.isRunToGame = 0), // 是否轮到游戏
      // 抖音下编译
      // #ifdef MP-TOUTIAO
      (this.bytedanceSocketTask =
        uni.getStorageSync('bytedanceSocketTask') || null); //抖音链接socket的实例
    // #endif
    // 除抖音外都编译
    // #ifndef MP-TOUTIAO
    // 监听 WebSocket 连接打开事件
    uni.onSocketOpen(this.onSocketOpen());
    //  监听 WebSocket 接受到服务器的消息事件
    uni.onSocketMessage(this.socketMessage());
    // 监听 WebSocket 错误事件
    uni.onSocketError(this.socketError());
    // 监听 WebSocket 连接关闭事件
    uni.onSocketClose(this.socketClose());
    // #endif
  }

  // 创建WEBSOCKET连接
  createWS() {
    // ++this.connectTimes;
    if (!store.getters.sessionId) {
      uni.showToast({
        icon: 'none',
        title: '服务器连接未打开~',
        duration: '',
      });
      return;
    }
    // 抖音下编译
    // #ifdef MP-TOUTIAO
    this.bytedanceSocketTask = tt.connectSocket({
      url: `${this.wsUrl}?sid=${store.getters.sessionId}`, // Socket url
    });
    uni.setStorageSync('bytedanceSocketTask', this.bytedanceSocketTask);
    // 监听 WebSocket 连接打开事件
    this.bytedanceSocketTask.onOpen(this.onSocketOpen());
    //  监听 WebSocket 接受到服务器的消息事件
    this.bytedanceSocketTask.onMessage(this.socketMessage());
    // 监听 WebSocket 错误事件
    this.bytedanceSocketTask.onError(this.socketError());
    // 监听 WebSocket 连接关闭事件
    this.bytedanceSocketTask.onClose(this.socketClose());
    // #endif
    // 除抖音外都编译
    // #ifndef MP-TOUTIAO
    uni.connectSocket({
      url: `${this.wsUrl}?sid=${store.getters.sessionId}`, // Socket url
    });
    // #endif
    store.commit('setNetWorkErr', false);
    global._logger.writeLogs(`创建WEBSOCKET连接`);
  }

  // 关闭 WebSocket 连接
  closeWS() {
    if (this.socketOpen) {
      // 抖音下编译
      // #ifdef MP-TOUTIAO
      if (!!this.bytedanceSocketTask) {
        this.bytedanceSocketTask.close();
      }
      // #endif
      // 除抖音外都编译
      // #ifndef MP-TOUTIAO
      uni.closeSocket();
      // #endif
      global._logger.writeLogs(`关闭webSocket连接`);
    }
  }

  // 发送 WebSocket
  sendSocketMessage(msg) {
    if (this.socketOpen) {
      // 抖音下编译
      // #ifdef MP-TOUTIAO
      this.bytedanceSocketTask.send({
        data: `${msg}\n`,
      });
      // #endif
      // 除抖音外都编译
      // #ifndef MP-TOUTIAO
      uni.sendSocketMessage({
        data: `${msg}\n`,
      });
      // #endif
    } else {
      this.socketMsgQueue.push(msg);
      this.reconnection();
    }
    global._logger.writeLogs(`发送 WebSocket，信息：${msg}`);
  }

  // 心跳
  setPink() {
    clearTimeout(global.WSPink);
    global.WSPink = null;
    global.WSPink = setTimeout(() => {
      this.sendSocketMessage(
        `<iq id="${new Date().getTime()}" type="set" from="${
          store.getters.userId
        }" to="ping.mk"><ping xmlns="urn:xmpp:ping"/></iq>`
      );
      global._logger.writeLogs(`WebSocket心跳`);
    }, this.pinkTime);
  }

  // 监听 WebSocket 连接打开事件
  onSocketOpen() {
    return (res) => {
      this.socketOpen = true;
      // 开流(连接到IM)
      this.sendSocketMessage(
        `<stream:stream sessionId="${store.getters.sessionId}" xmlns:stream="http://etherx.jabber.org/streams"/>`
      );
      clearTimeout(global.intervalCreateWS);
      global.intervalCreateWS = null;
      this.socketMsgQueue.forEach((msg) => {
        this.sendSocketMessage(msg);
      });
      this.socketMsgQueue = [];
      this.isconnectSucc = true;
      this.connectTimes = 0;
      this.offLineTimes = 0;
    };
  }

  //  监听 WebSocket 接受到服务器的消息事件
  socketMessage() {
    return async (res) => {
      this.setPink();
      const domParser = new DOMParser().parseFromString(res.data, 'text/xml');
      // 新版游戏iq(2021.2.25)
      if (res.data.indexOf('jabber:iq:game') > -1) {
        let _status = 0;
        // 新版游戏选中iq
        if (res.data.indexOf('jabber:iq:game:selected') > -1) {
          _status = 1;
          // 新版游戏取消选中iq
        } else if (res.data.indexOf('jabber:iq:game:un:selected') > -1) {
          _status = 0;
          // 新版游戏购买成功iq
        } else if (res.data.indexOf('jabber:iq:game:buy') > -1) {
          _status = 2;
        }
        this.gameSocketCallback(
          domParser.getElementsByTagName('open')[0].attributes,
          _status
        );

        // 开盒结果通知
      } else if (res.data.indexOf('jabber:iq:box:openResult') !== -1) {
        this.openResultFunc(domParser);
        global._logger.writeLogs(
          `开盒结果通知。服务器消息：`,
          JSON.stringify(res.data)
        );
        // 系统消息
      } else if (res.data.indexOf('message') !== -1) {
        this.messageFunc(domParser);
        global._logger.writeLogs(
          `系统消息。服务器消息：`,
          JSON.stringify(res.data)
        );
        // 抢登
      } else if (res.data.indexOf('accountConflict') !== -1) {
        this.accountConflictFunc();
        global._logger.writeLogs('抢登。服务器消息：', res.data);
        // 个人中心红点
      } else if (res.data.indexOf('jabber:iq:red:dot:prompt') !== -1) {
        if (uni.showTabBarRedDot) {
          uni.showTabBarRedDot({
            index: 4,
            fail: function (err) {
              // 本地缓存添加红点事件
              uni.setStorageSync('meTabBarRedDot', '1');
            },
          }); // 个人中心添加红点
        }
        // 砌墙
      } else if (res.data.indexOf('jabber:iq:wall') !== -1) {
        let _status = 0;
        // 砌墙选中iq
        if (res.data.indexOf('jabber:iq:wall:selected') !== -1) {
          _status = 1;
          // 砌墙取消选中iq
        } else if (res.data.indexOf('jabber:iq:wall:un:selected') !== -1) {
          // _status = 0;
          // 砌墙购买成功iq
        } else if (res.data.indexOf('jabber:iq:wall:buy') !== -1) {
          _status = 2;
        }
        this.wallSocketCallback(
          domParser.getElementsByTagName('open')[0].attributes,
          _status
        );
        // 一番赏
      } else if (res.data.indexOf('jabber:iq:first:draw') !== -1) {
        let firstStatus = 0;
        if (res.data.indexOf('jabber:iq:first:draw:change') !== -1) {
          // 一番赏队列变化
          firstStatus = 1;
        } else if (res.data.indexOf('jabber:iq:first:draw:play') !== -1) {
          // 一番赏上场
          firstStatus = 2;
        }
        this.firstDrawSocketCallback(domParser, firstStatus);
      } else {
        // ping 或者其他消息
        global._logger.writeLogs(`或者其他消息。服务器消息：`, res.data);
      }
    };
  }

  // 砌墙的这几个iq服务器下发的结构和字段相同，统一处理
  wallSocketCallback(xmlDom, type) {
    // xmlDom 返回带有指定标签名的对象的集合 attributes 返回指定节点属性的集合
    // type 0--砌墙取消选中  1--砌墙选中 2--砌墙购买成功
    let swWsObj = {
      userid: arrayGetValue(xmlDom, 'name', 'userid', 'value'),
      nick:
        arrayGetValue(xmlDom, 'name', 'nick', 'value').length > 4
          ? arrayGetValue(xmlDom, 'name', 'nick', 'value').slice(0, 4) + '...'
          : arrayGetValue(xmlDom, 'name', 'nick', 'value'),
      avatar: formatImg(arrayGetValue(xmlDom, 'name', 'avatar', 'value')),
      actId: arrayGetValue(xmlDom, 'name', 'actId', 'value'),
      boxid: arrayGetValue(xmlDom, 'name', 'boxid', 'value'),
      swType: type,
    };
    if (type == 2) {
      store.commit('newFlutter', swWsObj);
    }
    store.commit('setWallInfo', swWsObj);
    uni.$emit('WALLING_STAMP');
  }

  // 一番赏消息处理
  firstDrawSocketCallback(domParser, type) {
    const actId = domParser.getElementsByTagName('actId')[0].textContent;
    const suiteId = domParser.getElementsByTagName('suiteId')[0].textContent;
    const userRank = !!domParser.getElementsByTagName('userRank')[0]
      ? domParser.getElementsByTagName('userRank')[0].textContent
      : 0;
    const countdown = !!domParser.getElementsByTagName('countdown')[0]
      ? domParser.getElementsByTagName('countdown')[0].textContent
      : 0;

    if (type == 1) {
      // 队列变化
      // 区分是否在一番赏
      if (!!store.getters.drawRoomId && !!store.getters.drawSuiteId) {
        // 一番赏房间中
        if (
          store.getters.drawRoomId == actId &&
          store.getters.drawSuiteId == suiteId
        ) {
          // 处于排队的房间中，更新队列人数
          store.commit('setLineUpNum', userRank);
        }
      }
    } else if (type == 2) {
      // 上场
      // 区分是否在一番赏
      if (!!store.getters.drawRoomId && !!store.getters.drawSuiteId) {
        // 一番赏房间中
        if (
          store.getters.drawRoomId == actId &&
          store.getters.drawSuiteId == suiteId
        ) {
          // 处于排队的房间中，直接进入可购买状态
          store.commit('setLineUpStatus', -1);
          store.commit('setLineUpNum', 0);
          // 通知详情页，用户开始游戏
          uni.$emit('PAGE_firstDrawStart_REFRESH');
        } else {
          // 不在排队的一番赏房间中，确认是否上场弹窗
          store.commit('setPlayNoticeInfo', {
            actId,
            suiteId,
            countdown,
          });
          store.commit('setShowPlayNoticePopup', true);
        }
      } else {
        // 不在一番赏房间中
        // 弹出确认是否上场弹窗
        store.commit('setPlayNoticeInfo', {
          actId,
          suiteId,
          countdown,
        });
        store.commit('setShowPlayNoticePopup', true);
      }
    }
  }

  // 监听 WebSocket 错误事件
  socketError() {
    return (res) => {
      this.socketOpen = false;
      this.isconnectSucc = false;
      this.reconnection();
      global._logger.writeLogs(`WebSocket 错误重连`);
      // console.log("WebSocket 错误重连");
    };
  }

  // 监听 WebSocket 连接关闭事件
  socketClose() {
    return (res) => {
      // 状态码 1000 属于H5正常关闭
      this.socketOpen = false;
      this.isconnectSucc = false;
      global._logger.writeLogs(`WebSocket 关闭重连`, JSON.stringify(res));
      if (res.code !== 1000) {
        this.reconnection();
      }
    };
  }

  // 重连
  reconnection() {
    clearTimeout(global.intervalCreateWS);
    global.intervalCreateWS = null;
    // 重连测试叠加，刚开始
    if (!global.intervalCreateWS) {
      this.reconnectionErrFunc();
    } else {
      global._logger.writeLogs(`WebSocket 重连成功`);
    }
  }

  // 游戏中数据更新
  gameSocketCallback(xmlDom, type) {
    // xmlDom 返回带有指定标签名的对象的集合 attributes 返回指定节点属性的集合
    // type 0--游戏取消选中  1--游戏选中 2--游戏购买成功
    let _newGameObj = {
      userId: arrayGetValue(xmlDom, 'name', 'userid', 'value'),
      nick: arrayGetValue(xmlDom, 'name', 'nick', 'value'),
      avatar: formatImg(arrayGetValue(xmlDom, 'name', 'avatar', 'value')),
      cellId: arrayGetValue(xmlDom, 'name', 'boxid', 'value'), // 操作的格子
      boxId: arrayGetValue(xmlDom, 'name', 'actId', 'value'), // 操作的盒子（房间）
      gameType: type,
    };
    let _soldNum =
      arrayGetValue(xmlDom, 'name', 'soldNum', 'value') === undefined
        ? -1
        : arrayGetValue(xmlDom, 'name', 'soldNum', 'value'); // 该房间剩余的格子数
    let _soldNum1 =
      arrayGetValue(xmlDom, 'name', 'soldNum1', 'value') === undefined
        ? -1
        : arrayGetValue(xmlDom, 'name', 'soldNum1', 'value'); // 该系列剩余的格子数
    store.commit('setNewGameData', _newGameObj);
    uni.$emit(
      'GAMEING_REFRESH',
      _soldNum !== -1 || _soldNum1 !== -1
        ? {
            soldNum: _soldNum,
            soldNum1: _soldNum1,
          }
        : null
    );
    global._logger.writeLogs(
      `新版游戏iq格式化_newGameObj:`,
      JSON.stringify(_newGameObj)
    );
    global._logger.writeLogs(
      `新版游戏iq格式化_soldNum&_soldNum1: ${_soldNum}&${_soldNum1}`
    );
  }

  // 开盒处理事件
  openResultFunc(domParser) {
    const attr = domParser.getElementsByTagName('open')[0].attributes;
    const _type = domParser.getElementsByTagName('seriesType')[0].attributes;
    let seriesType = '';
    if (!!_type._ownerElement) {
      if (!!_type._ownerElement.childNodes[0]) {
        if (!!_type._ownerElement.childNodes[0].nodeValue) {
          seriesType = _type._ownerElement.childNodes[0].nodeValue;
        }
      }
    }
    // orderType 0 盲盒 1 扭蛋 2 商城
    // 昵称超过四位加...省略后面文字
    // 微信小程序，百度小程序隐藏扭蛋功能
    if (!attr.length) {
      return;
    }
    let newFlutterObj = {
      seriesId: arrayGetValue(attr, 'name', 'boxid', 'value'),
      userid: arrayGetValue(attr, 'name', 'userid', 'value'),
      nick:
        arrayGetValue(attr, 'name', 'nick', 'value').length > 4
          ? arrayGetValue(attr, 'name', 'nick', 'value').slice(0, 4) + '...'
          : arrayGetValue(attr, 'name', 'nick', 'value'),
      avatar: formatImg(arrayGetValue(attr, 'name', 'avatar', 'value')),
      boxName: arrayGetValue(attr, 'name', 'boxName', 'value'),
      special: arrayGetValue(attr, 'name', 'special', 'value'), // 是否为隐藏款,1/0
      orderType: arrayGetValue(attr, 'name', 'orderType', 'value'),
    };
    if (newFlutterObj.orderType == 3) {
      newFlutterObj.seriesType = !!seriesType ? seriesType : 0; // 是否热款
      newFlutterObj.actId = arrayGetValue(attr, 'name', 'actId', 'value'); // 活动id
    }
    if (newFlutterObj.orderType != 1) {
      store.commit('newFlutter', newFlutterObj);
    }
  }

  // 消息处理事件
  messageFunc(domParser) {
    // 系统消息已移到首页
    if (uni.showTabBarRedDot) {
      uni.showTabBarRedDot({ index: 4 }); // 个人中心添加红点
    }
    // 更改消息红点状态
    uni.setStorageSync('newMesRedPoint', true);
    uni.$emit('PERSONAL_MESREDPOINT');
    let attributesArr = domParser.getElementsByTagName('message')[0].attributes;
    if (!attributesArr.length) {
      return;
    }
    let addMsgObj = {
      time: formatTime((new Date() / 1000) >> 0, 'MM/dd HH:mm'),
      title: domParser.getElementsByTagName('subject')[0].textContent,
      content: domParser.getElementsByTagName('body')[0].textContent,
      buttonText: !!domParser.getElementsByTagName('button')[0]
        ? domParser.getElementsByTagName('button')[0].textContent
        : '',
      picture: !!domParser.getElementsByTagName('picture')[0]
        ? domParser.getElementsByTagName('picture')[0].textContent
        : '',
      url: `${
        !!domParser.getElementsByTagName('url')[0]
          ? domParser.getElementsByTagName('url')[0].textContent
          : ''
      }${
        !!domParser.getElementsByTagName('orderid')[0]
          ? '?submitId=' +
            domParser.getElementsByTagName('orderid')[0].textContent
          : ''
      }`,
      touchId: !!domParser.getElementsByTagName('touchId')[0]
        ? domParser.getElementsByTagName('touchId')[0].textContent
        : '',
    };
    global.messManager.addMess(addMsgObj);
    global.messManager.removeOldMess();
    // 服务器消息回执
    const returnMsg = `<message at="${arrayGetValue(
      attributesArr,
      'name',
      'at',
      'value'
    )}" from="${arrayGetValue(
      attributesArr,
      'name',
      'to',
      'value'
    )}" id="${arrayGetValue(
      attributesArr,
      'name',
      'id',
      'value'
    )}" newstype="sysMsg" to="${arrayGetValue(
      attributesArr,
      'name',
      'from',
      'value'
    )}" type="result"></message>`;
    this.sendSocketMessage(returnMsg);
  }

  // 重连失败处理事件
  reconnectionErrFunc() {
    global.intervalCreateWS = setTimeout(async () => {
      ++this.connectTimes;
      // 重连时判断用户网络情况，如果三次网络异常就直接关闭ws，非网络问题定时器延长时间，20次关闭ws
      let networkType = 1;
      try {
        networkType = await getNetworkType();
      } catch (err) {
        console.log('err', err);
      }
      if (networkType !== 1) {
        uni.showToast({
          title: `断网了,请切换网络`,
          icon: 'none',
          duration: 2000,
        });
        ++this.offLineTimes;
        this.connectTimes = 0;
        if (this.offLineTimes >= 3) {
          this.offLineTimes = 0;
          clearTimeout(global.intervalCreateWS);
          this.closeWS();
          store.commit('setNetWorkErr', true);
          console.log('wsoffLineTimes超出三次');
          return;
        }
      } else {
        // 适当延长定时周期
        if (this.connectTimes >= 20) {
          uni.showToast({
            title: `网络异常,请检查`,
            icon: 'none',
            duration: 2000,
          });
          this.offLineTimes = 0;
          this.connectTimes = 0;
          clearTimeout(global.intervalCreateWS);
          this.closeWS();
          store.commit('setNetWorkErr', true);
          console.log('重连失败处理事件超出20次');
          return;
        }
      }
      this.createWS();
    }, 3000);
  }

  // 抢登事件
  accountConflictFunc() {
    uni.showToast({
      title: '您的账号在其他地方登录',
      icon: 'none',
      duration: 2000,
    });
    uni.clearStorageSync();
    store.dispatch('logout');
    const pagesInfo = getCurrentPages();
    const visitPages = [
      'pages/home/main',
      'pages/funPlay/main',
      'pages/boxArk/main',
      'pages/me/main',
      'pages/buyBlindBox/main',
      'pages/mallDetail/main',
    ];
    // 302页面存在游客模式进入游客，否则302弹窗
    let pagesInfoRoute = '';
    // #ifdef MP-WEIXIN
    pagesInfoRoute = !!pagesInfo[0]
      ? pagesInfo[pagesInfo.length - 1].route
      : '';
    // #endif
    // #ifdef MP-TOUTIAO
    pagesInfoRoute = !!pagesInfo[0]
      ? pagesInfo[pagesInfo.length - 1].is.slice(1)
      : '';
    // #endif
    this.closeWS();
    if (!!pagesInfo[0] && visitPages.indexOf(pagesInfoRoute) == -1) {
      store.commit('setWxLogin302', false);
      setTimeout(() => {
        store.commit('setWxLogin302', true);
      }, 10);
    } else {
      store.commit('setIsSightseer', 1);
      uni.setStorageSync('isSightseerStorage', '1');
      loginInit(0, 1, 1);
      Request.isLogin = 0;
    }
  }
}

const webSocket = new WebSocket(wsUrl);
export default webSocket;
