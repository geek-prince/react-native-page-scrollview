# react-native-page-scrollview

对ScrollView的封装,可以很方便的实现水平,垂直分页轮播效果.而且可以自定义分页宽高,和侧边View的旋转,透明度,大小等.

对于原生的ScrollView只支持水平的整屏的分页,而且我看github上也没有相应的组件.所以就自己封装了一个.

github地址: https://github.com/geek-prince/react-native-page-scrollview

npm地址: https://www.npmjs.com/package/react-native-page-scrollview

## 安装
`npm install react-native-page-scrollview --save`

## 如何使用

`下面说明中的'组件'指的就是当前这个'react-native-page-scrollview'组件.`

首先导入组件

`import PageScrollView from 'react-native-page-scrollview';`

### 1.简单的轮播(每页图片大小相同时)

这时你只需要给组件传递一个图片的数组和样式即可.

`let {width:w, height:h}=Dimensions.get('window');`

```
let imgArr=[
	require('你图片的路径'),
	...许多的图片
];
```

在render方法中使用该组件.
`style`为整个轮播组件View的样式,可以通过它来设置轮播的宽高

```
<PageListView 
	style={{width:w,height:w/16*9}}
	imageArr={imgArr}
/>
```

这时的效果为:

![(普通无限轮播水平方向)](http://github.jikeclub.com/pageScrollView/1.gif)

github上加载不出来或显示有问题,请点击这里: http://github.jikeclub.com/pageScrollView/1.gif

轮播的方向默认是水平的,如果要竖直方向的话只需要加一个属性`HorV="v"`就可以了.

```
<PageScrollView
    style={{width:w,height:w/9*16}}
    HorV="v"
    imageArr={imgArr}
/>
```

![(普通无限轮播竖直方向)](http://github.jikeclub.com/pageScrollView/2.gif)

github上加载不出来或显示有问题,请点击这里: http://github.jikeclub.com/pageScrollView/2.gif

图片源可以是来自网络的

```
let imgArr=[
	{uri:'http://图片的url'},
	...许多的图片
];
```

`注意:这个时候如果图片数组imgArr是state的值,图片的url也是从网络获取的话,一开始this.state.imgArr可能为空,这时最好这样使用:`

```
{this.state.imgArr.length&&
	<PageScrollView
	    ...其他一些属性
	    imageArr={this.state.imgArr}
	/>}
```

默认是无限轮播,自动轮播的,如果你不需要可以通过`ifInfinite={false}`属性设置为不是无限轮播,通过`ifAutoScroll={false}`属性设置为不是自动轮播.还有下面的那几个点(当前图片指示器)如果不想要的话用过`ifShowPointerView={false}`属性取消.

`style`属性是整个轮播组件View的样式,这种情况下,轮播中的图片大小是和style中的宽高相同的.如果需要单独设置里面每一张图片的大小可以使用`imageStyle`属性设置,`imageStyle={{width:200,height:200/16*9}}`

图片可以支持点击,如果需要图片点击,则加入属性`dealWithClickImage`即可.

```
dealWithClickImage={
	(index)=>{
		点击图片时需要执行的操作,index为当前点击到的图片的索引
	}
}
```
### 2.简单轮播-自定义View

轮播里面除了可以放图片还可以自定义View,这时需要给组件一下几个属性`style`,`datas`和`view`.

`style`:轮播的整体样式

`datas`:轮播中所有自定义view要使用到的数据数组,数组中的每条数据则是对应自定义view中的每一条数据.

`view`:自定义view的具体渲染实现

```
<PageScrollView
	style={[整个轮播的样式]}
	HorV="v"
	ifShowPointerView={false}
	datas={[下面的view中要用到的数据数组]}
	view={(i,data)=>{
	    return(
	        <View style={[轮播中每个View的具体样式]}>
	            轮播中每个View的具体渲染内容,i为当前view的索引,data为当前view 的数据,相当于datas[i].
	        </View>
	    );
	}}
/>
```

这时的话就可以像这样玩:

![(简单轮播-自定义View)](http://github.jikeclub.com/pageScrollView/3.gif)

github上加载不出来或显示有问题,请点击这里: http://github.jikeclub.com/pageScrollView/3.gif

或者这么玩:

![(简单轮播-自定义View)](http://github.jikeclub.com/pageScrollView/4-1.gif)

github上加载不出来或显示有问题,请点击这里: http://github.jikeclub.com/pageScrollView/4-1.gif

上面是在做公司项目时用到的情况,其他的玩法就请大家自己发挥创造力吧.

### 3.高级轮播(当前图片与旁边图片样式不一样时)

我写了几个内置的样式供大家参考使用.这时只需要加入`builtinStyle`属性就可以使用内置的样式,可以使用`builtinWH`属性指定内置样式中图片的宽高

```
<PageScrollView
    style={{width:w,height:w/16*9}}
    builtinStyle="需要的样式"
    builtinWH={{width:300,height:300/16*9}}
    imageArr={imgArr}
/>
```

builtinStyle="sizeChangeMode"时的效果:

![(高级轮播-builtinStyle="sizeChangeMode")](http://github.jikeclub.com/pageScrollView/5-1.gif)

github上加载不出来或显示有问题,请点击这里: http://github.jikeclub.com/pageScrollView/5-1.gif

竖直方向的效果:

![(高级轮播-builtinStyle="sizeChangeMode"竖直方向)](http://github.jikeclub.com/pageScrollView/6.gif)

github上加载不出来或显示有问题,请点击这里: http://github.jikeclub.com/pageScrollView/6.gif

builtinStyle="rotateChangeMode"时的效果:

![(高级轮播-builtinStyle="rotateChangeMode"竖直方向)](http://github.jikeclub.com/pageScrollView/7-1.gif)

github上加载不出来或显示有问题,请点击这里: http://github.jikeclub.com/pageScrollView/7-1.gif

水平方向的效果:

![(高级轮播-builtinStyle="rotateChangeMode"水平方向)](http://github.jikeclub.com/pageScrollView/8-1.gif)

github上加载不出来或显示有问题,请点击这里: http://github.jikeclub.com/pageScrollView/8-1.gif

可以通过`currentPageChangeFunc`属性来设置在当前滚动到的页面改变时执行的操作,需要传入一个函数,函数参数为当前当前滚动到的页面的索引`currentPageChangeFunc={(currentPage)=>{this.setState({currentPage})}}`

### 4.高级轮播-自定义View

如果你想要自定义自己喜欢的样式,可以像下面这样使用组件.其中`sizeSmall`为当滚动到旁边时的大小为正常大小的多大,`opacitySmall`为滚动到旁边时的透明度,`rotateDeg`为滚动到旁边时旋转的角度,`skewDeg`为滚动到旁边时的图片的倾斜角度.这几个属性可以按需给出自己需要的一个或多个.

```
<PageScrollView
    style={{width:w,height:w/16*9}}
    sizeSmall={0.5}
    opacitySmall:{0.6}
    rotateDeg:{30}
    skewDeg:{45}
    datas={[下面的view中要用到的数据数组]}
    view={(i,data,{size,opacity,rotate,skew})=>{
	    return(
		        <View style={[轮播中每个View的具体样式]}>
		            轮播中每个View的具体渲染内容,
		            i为当前view的索引,
		            data为当前view 的数据,相当于datas[i].{size,opacity,rotate,skew}中分别是当前view应该显示的大小,透明度,旋转角度,倾斜角度,和上面的四个属性相对应,可以按需获取其中的一个或多个.
		            根据这四个值来渲染view就能实现当前图片与旁边图片不同样式的高级轮播了.
		        </View>
		    );
    }}
/>
```

##注意事项

`imageArr`和`view`属性不能同时使用,`view`是自定义View时用的属性,`imageArr`为图片轮播时用的属性,都给出的话会使用`imageArr`属性,而`view`则无用,并且使用`view`属性时需要给出`datas`属性作为`view`的数据源.

## 拓展,进阶
`goToNextPageSpeed`可以指定手指滑动时可以滑动到下一页的速度大小.速度大于多少时为有向左(右,上,下)翻一页的意图(数值越大,要滑动速度越快(越难)才能到下一页,数值越小,滑动越慢(越容易)可以到下一页),有点抽象,不知道我有没有解释清楚-_-||.

`manualScrollToPage`为用户在指定的情况下可以手动让组件滚动到相应view或图片的方法.这时需要在组件中`ref={(ps)=>{this.pageScrollView=ps;}}`给出ref让this.pageScrollView指向组件,然后`this.pageScrollView.manualScrollToPage(4);`滚动到索引为4的图片或自定义View.

有的时候我们不想组件一开始显示的是第一张图片或View,这时可以通过`didMount`属性(组件加载好后,并且布局好得到相应宽高后的执行的操作)来让组件加载好后滚动到相应索引的图片或自定义View.`didMount={()=>{this.pageScrollView.manualScrollToPage(4);}}`

如果想要自定义下面的当前图片指示器(下面的小点)也可以通过`renderPointView`属性自定义.`renderPointView={(selected)=>{return <View>你的渲染代码</View>}}`这个渲染的是每一个小点,`selected`为布尔值,表示当前指示器这个小点是否为选中状态.


## 属性一览表:

| props | 作用 | 默认值 |
| :-------------: |:-------------:|:-------------:|
|builtinStyle|使用官方提供的哪一个内置样式|null|
|builtinWH|使用内置样式时用户自定义的图片宽高|{}|
|style|设置整个组件View的style样式|{}|
|imageArr|轮播图片的数组(该数组存在时使用该数组,datas数组失效)|[]|
|imageStyle|如果是传入图片数组时,自定义的图片样式(该属性在自定义View时无用)|null|
|datas|自定义view中对应的数据数组|[]|
|view|每一个自定义View的具体渲染|()=>{}|
|goToNextPageSpeed|速度大于多少时为有向左(右,上,下)翻一页的意图(数值越大,要滑动速度越快(越难)才能到下一页,数值越小,滑动越慢(越容易)可以到下一页,)|3|
|ifInfinite|是否无限轮播(无限滚动)|true|
|ifAutoScroll|是否自动轮播|true|
|infiniteInterval|自动轮播每张切换的时长(毫秒)|2000|
|resizeMode|图片的显示形式|'cover'|
|dealWithClickImage|点击图片时执行的操作(不是自定义View的时候)|null|
|currentPageChangeFunc|在当前滚动到的页面改变时调用的方法|null|
|scrollEnabled|是否允许用户手动滚动ScrollView|true|
|didMount|组件加载好后,并且布局好得到相应宽高后的执行的操作|null|
|ifShowPointerView|是否显示当前图片指示器View(下面的点)|true|
|pointerColor|指示器的的相关颜色.分别为:当前页的颜色,其他页的颜色,边框的颜色|['#fff','#0000','#fff']|
|pointerViewStyle|自定义指示器View的样式(绝对定位的top,bottom...)|null|
|pointerStyle|自定义指示器圆点的样式(圆点大小)|null|
|sizeSmall|自定义View时滚动到旁边时的大小为正常大小的多大|null|
|opacitySmall|自定义View时滚动到旁边时的透明度|null|
|rotateDeg|自定义View时滚动到旁边时旋转的角度|null|
|skewDeg|自定义View时滚动到旁边时的图片的倾斜角度|null|


如果大家觉得我的组件好用的话,帮到你的话,欢迎大家Star,Fork,如果有什么问题的话也可以在github中想我提出,谢谢大家的支持.

