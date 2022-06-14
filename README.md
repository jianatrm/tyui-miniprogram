# ty-miniprogram

小程序组件：slider  单滑块，双滑块， 垂直，以及反向操作


## 使用

1. 安装依赖：

```
npm install tyui-miniprogram
```

2. json文件中引入

```
"ty-slider": "tyui-miniprogram/slider/index",
```

3. wxml文件中引入
```
 <ty-slider range="{{false}}"  min="{{0}}" max="{{100}}" value="{{50}}" step="{{1}}" vertical="{{true}}" reverse activeColor="red" inactiveColor="green"></ty-slider>
```
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前进度值，在双滑块模式下为数组格式 | number | number/ [number, number] | `0` |
| max | 最大值 | number  | 100 |
| min | 最小值 | number | 0 |
| step | 步长 | number  | 1 |
| active-color | 进度条激活态颜色 | string | #1989fa |
| inactive-color | 进度条非激活态颜色 | string | #e5e5e5 |
| range | 是否开启双滑块模式 | boolean |false |
| reverse  | 是否将进度条反转| boolean  | false |
| disabled | 是否禁用滑块 | boolean | false |
| readonly | 是否为只读状态，只读状态下无法修改滑块的值 | _boolean_ | false |
| vertical | 是否垂直展示 | boolean | false |

### Events

| 事件名             | 说明                     | 回调参数            |
| ------------------ | ------------------------ | ------------------- |
| change             | 进度变化且结束拖动后触发 | _value: number_     |
