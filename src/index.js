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
    direction: {
      type: String,
      value: 'horizontal'
    }
  },
  data: {
    flag: false,
    scope: 100,
    rect: {},
    vertical: false,
    reverse: false,
    buttonIndex: 0,
    _style: {}
  },
  lifetimes: {
    attached() {
      const query = wx.createSelectorQuery().in(this)
      query.select('.ty-slider').boundingClientRect((res) => {
        this.setData({
          rect: res
        })
      }).exec()
      // const scope = computed(() => Number(props.max) - Number(props.min))
      this.barStyle()
    }
  },
  methods: {

  }
})
