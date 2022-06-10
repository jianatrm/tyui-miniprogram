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
    clamp(num, min, max) {
      return Math.min(Math.max(num, min), max)
    },
    limit(num) {
      if (num <= 0) {
        return 0
      }
      if (num >= 100) {
        return 100
      }
      return num
    },
    addNumber(num1, num2) {
      const cardinal = 10 ** 10
      return Math.round((num1 + num2) * cardinal) / cardinal
    },
    isRange(val) {
      return this.properties.range && Array.isArray(val)
    },
    format(value) {
      const min = +this.properties.min
      const max = +this.properties.max
      const step = +this.properties.step
      value = this.clamp(value, min, max)
      const diff = Math.round((value - min) / step) * step
      return this.addNumber(min, diff)
    },
    calcMainAxis() {
      const {modelValue, min} = this.properties
      if (this.isRange(modelValue)) {
        return `${this.limit(((modelValue[1] - modelValue[0]) * 100) / this.data.scope)}%`
      }
      return `${((modelValue - Number(min)) * 100) / this.data.scope}%`
    },
    // 计算选中条的开始位置的偏移量
    calcOffset() {
      const {modelValue, min} = this.properties
      if (this.isRange(modelValue)) {
        return `${(this.limit((modelValue[0] - Number(min))) * 100) / this.data.scope}%`
      }
      return '0%'
    },

    getDirection(x, y) {
      if (x > y) {
        return 'horizontal'
      }
      if (y > x) {
        return 'vertical'
      }
      return ''
    },
    isSameValue(newValue, oldValue) {
      return JSON.stringify(newValue) === JSON.stringify(oldValue)
    },
    handleRangeValue(value) {
      // 设置默认值
      const left = value[0] || Number(this.properties.min)
      const right = value[1] || Number(this.properties.max)
      // 处理两个滑块重叠之后的情况
      return left > right ? [right, left] : [left, right]
    },
    updateValue(value, end) {
      if (this.isRange(value)) {
        value = this.handleRangeValue(value).map((item) => this.format(item))
      } else {
        value = this.format(value)
      }
      if (!this.isSameValue(value, this.properties.modelValue)) {
        // emit('update:modelValue', value)
        // this.properties.modelValue = value
      }
      if (end && !this.isSameValue(value, this.data._startValue)) {
        // emit('change', value)
      }
      this.barStyle()
    },

    barStyle() {
      const mainAxis = this.data.vertical ? 'height' : 'width'
      const style = {
        [mainAxis]: this.calcMainAxis(),
        // background: props.activeColor,
      }

      if (this.data.dragStatus) {
        style.transition = 'none'
      }

      const getPositionKey = () => {
        if (this.data.vertical) {
          return this.data.reverse ? 'bottom' : 'top'
        }
        return this.data.reverse ? 'right' : 'left'
      }

      style[getPositionKey()] = this.calcOffset()
      this.setData({
        _style: style
      })
      return style
    },
    onClick(event) {
      const {
        min, reverse, vertical, modelValue
      } = this.properties
      const rect = this.data.rect

      const getDelta = () => {
        if (vertical) {
          if (reverse) {
            return rect.bottom - event.clientY
          }
          return event.clientY - rect.top
        }
        if (reverse) {
          return rect.right - event.clientX
        }
        return event.clientX - rect.left
      }

      const total = vertical ? rect.height : rect.width
      const value = Number(min) + (getDelta() / total) * this.data.scope

      if (this.isRange(modelValue)) {
        const [left, right] = modelValue
        const middle = (left + right) / 2

        if (value <= middle) {
          this.updateValue([value, right], true)
        } else {
          this.updateValue([left, value], true)
        }
      } else {
        this.updateValue(value, true)
      }
    },

    onTouchStart(e) {
      this.data.buttonIndex = e.currentTarget.dataset.tabindex
      this.data._startX = e.touches[0].clientX
      this.data._startY = e.touches[0].clientY
      this.data._current = this.properties.modelValue
      if (this.isRange(this.data._current)) {
        this.data._startValue = this.data._current.map((item) => this.format(item))
      } else {
        this.data._startValue = this.format(this.data._current)
      }
      this.data._dragStatus = 'start'
    },
    onTouchmove(e) {
      this.data._dragStatus = 'dragging'
      const touch = e.touches[0]
      const deltaX = (touch.clientX < 0 ? 0 : touch.clientX) - this.data._startX
      const deltaY = touch.clientY - this.data._startY
      const offsetX = Math.abs(deltaX)
      const offsetY = Math.abs(deltaY)
      const LOCK_DIRECTION_DISTANCE = 10
      if (!this.properties.direction || (offsetX < LOCK_DIRECTION_DISTANCE &&
              offsetY < LOCK_DIRECTION_DISTANCE)) {
        this.properties.direction = this.getDirection(offsetX, offsetY)
      }
      const delta = this.data.vertical ? deltaY : deltaX
      const total = this.data.vertical ? this.data.rect.height : this.data.rect.width
      let diff = (delta / total) * this.data.scope
      if (this.data.reverse) {
        diff = -diff
      }
      if (this.isRange(this.data._startValue)) {
        const index = this.data.reverse ? 1 - this.data.buttonIndex : this.data.buttonIndex
        this.data._current[index] = this.limit(this.data._startValue[index] + diff)
      } else {
        this.data._current = this.limit(this.data._startValue + diff)
      }
      this.updateValue(this.data._current)
    },
    onTouchend() {
      if (this.data._dragStatus === 'dragging') {
        this.updateValue(this.data.current, true)
      }
      this.data._dragStatus = ''
    },
    onTouchcancel() {
    },
  }
})
