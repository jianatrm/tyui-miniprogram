Component({
  properties: {
    min: {
      type: Number,
      value: 0
    },
    max: {
      type: Number,
      value: 100
    },
    value: {
      // eslint-disable-next-line no-bitwise
      type: Array | Number,
      value: 70
    },
    step: {
      type: Number,
      value: 1
    },
    range: {
      type: Boolean,
      value: false
    },
    vertical: {
      type: Boolean,
      value: false
    },
    reverse: {
      type: Boolean,
      value: false
    }
  },
  data: {
    initData: {}
  },
  lifetimes: {
    attached() {
      const query = wx.createSelectorQuery().in(this)
      query.select('.ty-slider').boundingClientRect((res) => {
        this.setData({
          initData: {
            min: this.properties.min,
            max: this.properties.max,
            value: this.properties.value,
            step: this.properties.step,
            range: this.properties.range,
            scope: this.properties.max - this.properties.min,
            rect: res,
            vertical: this.properties.vertical,
            reverse: this.properties.reverse,
          }
        }, () => {
          console.log('initData', this.data.initData)
        })
      }).exec()
    }
  },
  methods: {
    callback(e) {
      console.log('callback', e)
      const initData = this.data.initData
      initData.value = e.value
      this.setData({
        initData
      })
    }
  }
})
