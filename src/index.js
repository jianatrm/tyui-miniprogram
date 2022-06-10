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
    modelValue: {
      type: Array,
      value: [50, 70]
    },
    step: {
      type: Number,
      value: 1
    },
    range: {
      type: Boolean,
      value: true
    },
    vertical: {
      type: Boolean,
      value: false
    },
    reverse: {
      type: Boolean,
      value: false
    },
    direction: {
      type: String,
      value: 'horizontal'
    }
  },
  data: {
    initData: {}
  },
  lifetimes: {
    attached() {
      const query = wx.createSelectorQuery().in(this)
      query.select('.ty-slider').boundingClientRect((res) => {
        console.log('res', res)
        this.setData({
          initData: {
            min: this.properties.min,
            max: this.properties.max,
            modelValue: this.properties.modelValue,
            step: this.properties.step,
            range: this.properties.range,
            direction: this.properties.direction,
            scope: this.properties.max - this.properties.min,
            rect: res,
            vertical: this.properties.vertical,
            reverse: this.properties.reverse,
            buttonIndex: 0,
          }
        })
      }).exec()
    }
  },
  methods: {

  }
})
