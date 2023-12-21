import { setPx, validatenull, addParam } from './util';
import config from './config';
import crypto from '@/utils/crypto'
import { funEval, uuid } from '@/utils/utils';
import COMMON from '@/config'
export default (() => {
  return {
    props: {
      stylesFormatter: Function,
      dataFormatter: Function,
      titleFormatter: Function,
      labelFormatter: Function,
      clickFormatter: Function,
      sqlFormatter: Function,
      formatter: Function,
      echartFormatter: Function,
      dataQuery: Function,
      dataHeader: Function,
      width: {
        type: [Number, String],
        default: 600
      },
      height: {
        type: [Number, String],
        default: 600
      },
      theme: {
        type: String
      },
      child: {
        type: Object,
        default: () => {
          return {};
        }
      },
      sql: {
        type: String
      },
      time: {
        type: Number,
        default: 0
      },
      url: {
        type: String
      },
      wsUrl: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: true
      },
      dataType: {
        type: Number,
        default: 0
      },
      dataMethod: {
        type: String,
        default: 'get'
      },
      id: {
        type: String,
        default: 'main_' + uuid()
      },
      data: {
        type: [Object, String, Array]
      },
      component: {
        type: Object,
        default: () => {
          return {};
        }
      },
      option: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data () {
      return {
        headerHeight: '',
        checkChart: '',
        myChart: '',
        dataChart: [],
        dataAxios: {},
        dataParams: {},
        wsClient: {},
        key: false,
        styles: {},
        appendCheck: {},
        appendObj: {},
        appendList: [],
        className: ''
      };
    },
    watch: {
      dataAppend (val) {
        this.appendObj = {};
        this.appendList = []
        if (!val) {
          this.appendCheck = clearInterval(this.appendCheck)
        } else {
          this.dataChart = []
        }
        this.updateData()
      },
      echartFormatter () {
        this.updateChart();
      },
      width () {
        this.$nextTick(() => {
          this.updateChart();
        })
      },
      height () {
        this.$nextTick(() => {
          this.updateChart();
        })
        this.updateChart();
      },
      theme () {
        this.myChart.dispose();
        this.init();
      },
      option: {
        handler () {
          this.updateChart();
        },
        deep: true
      }
    },
    computed: {
      count () {
        return this.option.count;
      },
      dataAppend () {
        return this.option.dataAppend;
      },
      dataChartLen () {
        return (this.dataChart || []).length;
      },
      switchTheme () {
        return this.vaildData(this.option.switchTheme, false);
      },
      name () {
        let className = this.$el.className.split(' ')[0]
        const result = className.replace(config.name, '');
        return result;
      },
      minWidth () {
        const val = this.option.minWidth;
        if (val > this.width) return val;

      },
      isApi () {
        return this.dataType === 1;
      },
      isSql () {
        return this.dataType === 2;
      },
      isWs () {
        return this.dataType === 3;
      },
      styleChartName () {
        const obj = {
          width: setPx(this.minWidth || this.width),
          height: setPx(this.height),
          opacity: this.component.opacity || 1,
          transform: `scale(${this.component.scale || 1}) perspective(${this.component.perspective || 500}px) rotateX(${this.component.rotateX || 0}deg) rotateY(${this.component.rotateY || 0}deg) rotateZ(${this.component.rotateZ || 0}deg)`
        };
        return obj;
      },
      styleSizeName () {
        return Object.assign({
          width: setPx(this.width),
          height: setPx(this.height),
        }, (() => {
          if (this.minWidth) {
            return {
              overflowX: 'auto',
              overflowY: 'hidden'
            };
          }
          return {};
        })(), this.styles);
      }
    },
    mounted () {
      this.init();
    },
    methods: {
      init () {
        this.className = `animated ${this.component.animated || ''}`
        const main = this.$refs[this.id];
        if (main) {
          // 判断是否图表去初始化
          const isChart = config.echart.includes(this.name);
          if (isChart) this.myChart = window.echarts.init(main, this.theme);
        }
        this.updateChart();
        this.updateData()
      },
      getItemRefs () {
        let refList = this.$parent.$parent.$refs;
        let result = {}
        Object.keys(refList).forEach(ele => {
          if (ele.indexOf(COMMON.NAME) !== -1) {
            result[ele.replace(COMMON.NAME, '')] = refList[ele][0]
          }
        })
        return result;
      },
      updateChart () {

      },
      updateClick (params) {
        let refList = this.getItemRefs();
        let indexList = this.child.index;
        let indexName = this.child.paramName;
        let indexValue = this.child.paramValue || 'value';
        if (validatenull(indexName) && validatenull(indexList)) return
        let p = {};
        p[indexName] = params[indexValue]
        Object.keys(refList).forEach(ele => {
          if (indexList.includes(ele)) refList[ele].updateData(p);
        })
      },
      updateAppend (result) {
        if (this.validatenull(this.appendObj)) {
          this.appendList = result
          this.appendObj = result[0]
        } else {
          let appendList = [];
          for (let i = 0; i < result.length; i++) {
            const ele = result[i]
            if (ele.id === this.appendObj.id) break
            else appendList.push(ele)
          }
          this.appendObj = result[0]
          appendList.reverse().forEach(ele => {
            this.appendList.unshift(ele);
          })
        }
        if (this.validatenull(this.appendCheck)) {
          this.appendCheck = setInterval(() => {
            let length = this.appendList.length - 1;
            if (length >= 0) {
              let obj = this.appendList.splice(length, 1)[0]
              this.dataChart.unshift(obj);
              let len = this.dataChart.length;
              if (len > this.count) {
                this.appendList.splice(len - 1, 1)
              }
            }
          }, 2000)
        }
      },
      // 更新数据核心方法
      updateData (p = {}) {
        this.dataParams = Object.assign(this.dataParams, p)
        return new Promise((resolve, reject) => {
          this.resetData && this.resetData();
          if (this.key) return;
          this.key = true;
          const callback = () => {
            this.key = false;
            const bindEvent = () => {
              this.updateChart();
              if (this.myChart) this.bindClick();
              if (typeof this.stylesFormatter === 'function') {
                this.styles = this.stylesFormatter(this.dataChart, this.dataParams, this.getItemRefs()) || {};
              }
              resolve(this.dataChart);
            }
            if (this.isApi) {
              let url = this.url;
              if (this.validatenull(url)) return
              let dataQuery = typeof (this.dataQuery) === 'function' && this.dataQuery(url);
              let dataHeader = typeof (this.dataHeader) === 'function' && this.dataHeader(url);
              let params = Object.assign(dataQuery, this.dataParams);
              let axiosParams = {}
              if (this.dataMethod === 'post') {
                axiosParams.data = params
              } else {
                axiosParams.params = params
              }
              this.$axios({
                ...{
                  method: this.dataMethod,
                  url: url,
                  headers: dataHeader,
                },
                ...axiosParams
              }).then(res => {
                this.dataAxios = res;
                let result;
                if (typeof this.dataFormatter === 'function') {
                  result = this.dataFormatter(res.data, params, this.getItemRefs());
                } else {
                  result = res.data
                }
                if (this.dataAppend) {
                  this.updateAppend(result)
                } else {
                  this.dataChart = result;
                }
                bindEvent();
              });
            } else if (this.isWs) {
              let url = this.wsUrl
              this.wsClient.close && this.wsClient.close()
              if (this.validatenull(url)) return
              let dataQuery = typeof (this.dataQuery) === 'function' && this.dataQuery(url);
              let params = Object.assign(dataQuery, this.dataParams);
              url = url + addParam(params)
              this.wsClient = new WebSocket(url)
              this.wsClient.onmessage = (msgEvent = {}) => {
                let msgData = JSON.parse(msgEvent.data)
                if (typeof this.dataFormatter === 'function') {
                  this.dataChart = this.dataFormatter(msgData, this.dataParams, this.getItemRefs());
                } else {
                  this.dataChart = JSON.parse(msgData)
                }
                bindEvent();
              }
            } else if (this.isSql) {
              let sql = JSON.parse(crypto.decrypt(this.sql));
              let result;
              try {
                sql.sql = funEval(sql.sql)(this.dataParams)
                result = crypto.encrypt(JSON.stringify(sql));
              } catch (error) {
                result = this.sql;
              }
              this.sqlFormatter(result).then(res => {
                if (typeof this.dataFormatter === 'function') {
                  this.dataChart = this.dataFormatter(res.data.data, this.dataParams, this.getItemRefs());
                } else {
                  this.dataChart = res.data.data
                }
                bindEvent();
              })
            } else {
              if (typeof this.dataFormatter === 'function') {
                this.dataChart = this.dataFormatter(this.data, this.dataParams, this.getItemRefs());
              } else {
                this.dataChart = this.data
              }
              bindEvent();
            }
          };
          this.$nextTick(() => {
            callback();
            clearInterval(this.checkChart);
            if (this.time !== 0 && this.disabled) {
              this.checkChart = setInterval(() => {
                callback();
              }, this.time);
            }
          });
        })

      },
      getLabelFormatter (name) {
        if (this.labelFormatter) {
          return this.labelFormatter(name, this.dataChart);
        }
        return name.value;
      },
      // 绑定点击事件
      bindClick () {
        this.myChart.off('click');
        this.myChart.on('click', e => {
          this.updateClick(e);
          this.clickFormatter && this.clickFormatter({
            type: this.name,
            name: e.name,
            value: e.value && (e.value[2] || e.value),
            data: this.dataChart,
            echartEvent: e
          }, this.getItemRefs());
        });
      },
      // 下面俩都是chart的公共的方法,就放这里面共用
      getColor (index, first) {
        const barColor = this.option.barColor || [];
        if (barColor[index]) {
          const color1 = barColor[index].color1;
          const color2 = barColor[index].color2;
          const postion = (barColor[index].postion || 0.9) * 0.01;
          if (first) return color1;
          if (color2) {
            return {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: color1 // 0% 处的颜色
              }, {
                offset: postion,
                color: color2 // 100% 处的颜色
              }],
              global: false // 缺省为 false
            };
          }
          return color1;
        }
      },
      ishasprop (condition, isprop, alwaysObj) {
        return Object.assign((() => {
          return condition ? isprop : {};
        })(), alwaysObj);
      }
    },
    beforeDestroy () {
      clearInterval(this.checkChart);
      this.wsClient.close && this.wsClient.close()
    }
  };
})();
