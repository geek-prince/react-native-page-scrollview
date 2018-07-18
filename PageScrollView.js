import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Platform,
    Dimensions,
    InteractionManager,
    Image,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

const {width:w,height:h}=Dimensions.get('window');

class PageScrollView extends Component{
    constructor(props){
        super(props);
        this.initState();
    }

    //初始化state的值
    initState=()=>{
        this.state={
            //当前滚动到哪一页
            currentPage:0,
            //整数形式的currentPage
            intCP:-1,
            //总共有几页
            pageNum:this.props.imageArr.length||this.props.datas.length,

            //记录当前是否为手指拖拽
            ifTouch:false,
            // 当onScroll水平滚动时的滚动大小(x值)的数组
            scrollXArr:[],
            // 当onScroll垂直滚动时的滚动大小(x值)的数组
            scrollYArr:[],

            //scrollView是否可以滚动
            scrollEnabled:true,

            //ScrollView自身View的宽高
            viewHeight:0,
            viewWidth:0,

            //记录是否是首次
            ifFirst:true,

        };
    };

    static defaultProps={
        //使用官方提供的哪一个内置样式
        builtinStyle:null,
        //使用内置样式时用户自定义的图片宽高
        builtinWH:{},

        //设置整个组件View的style样式
        style:{},

        //轮播图片的数组(该数组存在时使用该数组,datas数组失效)
        imageArr:[],
        //如果是传入图片数组时,自定义的图片样式(该属性在自定义View时无用)
        imageStyle:null,

        // ccStyle:null,

        //自定义view中对应的数据数组
        datas:[],
        //每一个自定义View的具体渲染
        view:()=>{},

        //每一个View的宽高(当滚动到当前这个View时的宽高,用于View的宽高会随滚动改变时才用){width:宽度,height:高度}
        // contentWH:null,

        //速度大于多少时为有向左(右,上,下)翻一页的意图(数值越大,要滑动速度越快(越难)才能到下一页,数值越小,滑动越慢(越容易)可以到下一页,)
        goToNextPageSpeed:3,

        //水平还是竖直方向的ScrollView
        HorV:'h',

        //是否无限轮播(无限滚动)
        ifInfinite:true,
        //是否自动轮播
        ifAutoScroll:true,
        //自动轮播每张切换的时长(毫秒)
        infiniteInterval:2000,
        //图片的显示形式
        resizeMode:'cover',
        //点击图片时执行的操作(不是自定义View的时候)
        dealWithClickImage:null,

        //在当前滚动到的页面改变时调用的方法
        currentPageChangeFunc:null,

        //是否允许用户手动滚动ScrollView
        scrollEnabled:true,
        //组件加载好后,并且布局好得到相应宽高后的执行的操作
        didMount:null,

        //当滚动到当前页的大小为正常大小的多大
        // sizeLarge:1,
        //自定义View时滚动到旁边时的大小为正常大小的多大
        sizeSmall:null,
        //自定义View时滚动到旁边时的透明度
        opacitySmall:null,
        //自定义View时滚动到旁边时旋转的角度
        rotateDeg:null,
        //自定义View时滚动到旁边时的图片的倾斜角度
        skewDeg:null,

        //是否显示当前图片指示器View(下面的点)
        ifShowPointerView:true,
        //指示器的的相关颜色.分别为:当前页的颜色,其他页的颜色,边框的颜色
        pointerColor:['#fff','#0000','#fff'],
        //自定义指示器View的样式(绝对定位的top,bottom...)
        pointerViewStyle:null,
        //自定义指示器圆点的样式(圆点大小)
        pointerStyle:null,
        //自定义指示器View
        renderPointerView:null,
    };


    //官方设置的内置样式的各个参数
    builtinStyleArgs={
        'sizeChangeMode':{sS:0.7,oS:0.7,bg:'#999'},
        'rotateChangeMode':{rS:45,skewS:45,oS:0.5,sS:0.5,bg:'#999'},
    };
    //官方设置的内置样式
    builtinStyles={
        'sizeChangeMode':(index,data,{size,opacity})=>{
            let {viewWidth,viewHeight}=this.state;
            let {HorV,builtinWH}=this.props;
            let isH=HorV==='h';
            let customW=null,customH=null;
            if(builtinWH){customW=builtinWH.width;customH=builtinWH.height}
            let widimage=customW||(w*0.6),wid=isH?widimage:viewWidth,hei=isH?viewHeight:customH||(widimage/16*9),heimage=customH||(widimage/16*9);
            return (
                <View style={[{width:wid,height:hei,alignItems:'center',justifyContent:'center',backgroundColor:'#999',opacity:opacity}]} onLayout={this.contentLayout}>
                    <Image source={data} style={{width:widimage*size,height:heimage*size}}/>
                </View>
            );
        },
        'rotateChangeMode':(index,data,{rotate,opacity,size})=>{
            let isios=Platform.OS==='ios';
            let {rS,sS}=this.builtinStyleArgs['rotateChangeMode'];
            let {viewWidth,viewHeight}=this.state;
            let {HorV,builtinWH}=this.props;
            let Image=ImageBackground||Image;
            let isH=HorV==='h';
            let customW=null,customH=null;
            if(builtinWH){customW=builtinWH.width;customH=builtinWH.height}
            let widimage=customW||(isH?w*0.5:w*0.7),wid1=isH?widimage:viewWidth,hei1=isH?viewHeight:customH||(widimage/16*9),heimage=customH||(widimage/16*9),hei=hei1,wid=wid1;

            let LH=hei,LW=wid;
            if(isH){
                rotate?(wid=Math.cos(Math.PI*(rotate/180))*wid1*size):(wid=wid1);
            }else {
                rotate?(hei=Math.cos(Math.PI*(rotate/180))*hei1*size):(hei=hei1);
            }
            let SH=Math.cos(Math.PI*(rS/180))*hei1*sS,SW=Math.cos(Math.PI*(rS/180))*wid1*sS;
            return (
                <View style={[{width:wid,height:hei,alignItems:'center',justifyContent:'center',backgroundColor:'#999',opacity:opacity,
                    transform:[
                        isH?{rotateY:rotate+'deg'}:{rotateX:rotate+'deg'},
                        isH?{skewY:rotate+'deg'}:(isios?{skewX:rotate+'deg'}:{skewY:-rotate+'deg'})
                        ]
                }]}
                      onLayout={(e)=>{!this.distance&&this.setDistance1(e,LW,LH,SW,SH);}}
                >
                    <Image source={data} style={{width:widimage*size,height:heimage*size}}>
                        <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'#000',opacity:1-opacity}}/>
                    </Image>
                </View>
            );
        },
    };

    render() {
        let {style,builtinStyle}=this.props;
        let {builtinStyles,builtinStyleArgs}=this;
        return (
            <View style={[style||{flex:1},builtinStyle&&{backgroundColor:builtinStyleArgs[builtinStyle].bg}]} onLayout={this.viewOnLayout}>
                <ScrollView
                    // 设置引用名称,让下面可以引用到
                    ref={(ps)=>{this.scrollView=ps;}}
                    style={{flex:1}}
                    scrollEnabled={this.props.scrollEnabled&&this.state.scrollEnabled}
                    // 是否是水平的scrollView(默认为水平方向的)
                    horizontal={this.props.HorV==='h'}
                    // 是否显示水平方向的滚动条
                    showsHorizontalScrollIndicator={false}
                    // 是否显示竖方向的滚动条
                    showsVerticalScrollIndicator={false}
                    // 开始拖拽
                    onScrollBeginDrag={this.onScrollBeginDrag}
                    // 停止拖拽
                    onScrollEndDrag={this.onScrollEndDrag}
                    onScroll={(e)=>this.onScroll(e)}
                    //多少毫秒触发一次上面的onScroll方法
                    scrollEventThrottle={20}
                    onLayout={this.scrollViewOnLayout}
                >
                    {/*渲染scrollView*/}
                    {this.renderScrollView()}
                </ScrollView>
                {/*渲染下面的指示器*/}
                {this.props.ifShowPointerView&&this.renderPointer()}
            </View>
        );
    }

    //view加载好之后
    viewOnLayout=()=>{
        this.state.ifFirst&&this.props.didMount&&this.props.didMount();
        this.state.ifFirst&&(this.state.ifFirst=false);
    };

    //scrollView加载好后,自身的尺寸
    scrollViewOnLayout=(event)=>{
        let {width,height} = event.nativeEvent.layout;
        this.setState({viewHeight:height,viewWidth:width},()=>{});
    };

    //图片加载好后的尺寸
    imageLayout=(event)=>{
        this.getContentStyle(event);
    };

    //每个分页view加载好后的尺寸
    contentLayout=(event)=>{
        this.getContentStyle(event);
    };

    //获得每一页内容的样式(宽高)
    getContentStyle=(event)=>{
        if(this.distance){return}
        let {width,height} = event.nativeEvent.layout;
        this.setDistance(width,height);
    };
    //设置this.state的宽高和distance
    setDistance=(width,height)=>{
        if(this.distance){return}
        let isH=this.props.HorV==='h';
        this.setState({width:width,height:height},()=>{
            this.distance=isH?this.state.width:this.state.height;
        });
    };
    //设置this.state的宽高和distance(有旋转,缩放时,即当前滚动到的图片与旁边的图片大小不一样时)
    setDistance1=(event,LargeWidth,LargeHeight,SmallWidth,SmallHeight)=>{
        if(this.distance){return}
        let isH=this.props.HorV==='h';
        this.setState({width:LargeWidth,height:LargeHeight},()=>{
            this.distance=isH?SmallWidth:SmallHeight;
        });
    };

    //渲染下面的指示器
    renderPointer=()=>{
        let {pointerColor:pc,renderPointView}=this.props;
        let viewArr=[];
        let currentPage=this.getintCP();

        let datas=this.props.imageArr.length?this.props.imageArr:this.props.datas;
        for (let i=0;i<datas.length;i++){
            let selected=i===currentPage;
            viewArr.push(
                renderPointView?<View key={i}>{renderPointView(selected)}</View>:<View key={i} style={[{width:8,height:8,borderRadius:4,borderColor:pc[2],borderWidth:1},i&&{marginLeft:10},selected?{backgroundColor:pc[0]}:{backgroundColor:pc[1]},this.props.pointerStyle]}/>
            );
        }
        return <View style={[{position:'absolute',bottom:this.state.viewHeight/10,flexDirection:'row',width:this.state.viewWidth,justifyContent:'center'},this.props.pointerViewStyle]}>
            {viewArr}
        </View>
    };

    //获得整数型的当前滚动页面
    getintCP(){
        let currentPage=Math.round(this.state.currentPage);
        let ifInfinite=this.props.ifInfinite;
        ifInfinite&&(currentPage%=this.state.pageNum);
        return currentPage;
    }
    //获得整数型滚动页面后的操作
    dealWithIntCP(){
        let currentPage=this.getintCP();
        if(currentPage!==this.state.intCP){
            this.props.currentPageChangeFunc&&this.props.currentPageChangeFunc(currentPage);
            this.state.intCP=currentPage;
        }
    }

    // 渲染scrollView
    renderScrollView=()=>{
        let {imageArr,datas,ifInfinite,dealWithClickImage:dealClick,sizeSmall,opacitySmall,rotateDeg,skewDeg,imageStyle,resizeMode,HorV,builtinStyle}=this.props;
        let {viewWidth,width,viewHeight,height,pageNum,currentPage}=this.state;
        let {builtinStyles,builtinStyleArgs}=this;
        this.dealWithIntCP();
        //datas数据
        datas=imageArr.length?imageArr:datas;
        ifInfinite&&(datas=[...datas,...datas,...datas]);
        //当滚动到当前页的大小为正常大小的多大
        let sL=1;
        //当滚动到旁边时的大小为正常大小的多大
        let sS=sizeSmall;
        // let sS=0.5;
        let oL=1;
        //滚到旁边时的透明度
        let oS=opacitySmall;
        //滚动到旁边时的旋转角度
        let rS=rotateDeg;
        //滚动到旁边时的倾斜角度
        let skewS=skewDeg;
        if(builtinStyle){
            let args=builtinStyleArgs[builtinStyle];
            ({sS,oS,rS,skewS}=args);
        }
        let arr=[];
        if(HorV==='h'){
            //当滚动到第一张时的左边空白部分
            arr.push(<View key={-2} style={{width:(viewWidth-width)/2,height:viewHeight,backgroundColor:'#0000'}}/>);
        }else {
            //竖直ScrollView时
            arr.push(<View key={-2} style={{width:viewWidth,height:(viewHeight-height)/2,backgroundColor:'#0000'}}/>);
        }

        for(let i=0;i<datas.length;i++){
            let size=1;
            let opacity=1;
            let rotate=0;
            let skew=0;
            let distance;
            if(sS||oS||rS||skewS){
                distance=Math.abs(currentPage-i);
                if(distance>=1){
                    size=sS;
                    opacity=oS;
                    rotate=rS;
                    skew=skewS;
                }else {
                    size=sL-distance*(sL-sS);
                    opacity=oL-distance*(oL-oS);
                    rotate=distance*rS;
                    skew=distance*skewS;
                }
            }
            if(this.props.imageArr.length){
                let style=imageStyle|| {width:viewWidth,height:viewHeight};
                if(builtinStyle){
                    arr.push(
                        <TouchableOpacity activeOpacity={dealClick?0.5:1} onPress={()=>{dealClick&&dealClick(i%this.pNum)}} key={i} style={[]}>
                        {/*<TouchableOpacity activeOpacity={dealClick?0.5:1} onPress={()=>{dealClick&&dealClick(i%this.pNum)}} key={i} style={[]} onLayout={this.contentLayout}>*/}
                            {builtinStyles[builtinStyle](i%pageNum,datas[i%pageNum],{size,opacity,rotate,skew})}
                        </TouchableOpacity>
                    );
                }else {
                    arr.push(
                        <TouchableOpacity activeOpacity={dealClick?0.5:1} onPress={()=>{dealClick&&dealClick(i%this.pNum)}} key={i} style={style} onLayout={this.imageLayout}>
                            <Image source={datas[i]} style={[style,{resizeMode:resizeMode}]}/>
                        </TouchableOpacity>
                    );
                }
            }else {
                arr.push(
                    <View key={i} style={[]} onLayout={(event)=>{(sS||oS||rS||skewS)?this.setDistance1(event):this.contentLayout(event)}}>
                        {(sS||oS||rS||skewS)?this.props.view(i%pageNum,datas[i%pageNum],{size,opacity,rotate,skew}):this.props.view(i%pageNum,datas[i%pageNum])}
                    </View>
                );
            }
        }
        if(HorV==='h'){
            //当滚动到最后一张时的右边的空白部分
            arr.push(<View key={-3} style={{width:(viewWidth-width)/2,height:viewHeight,backgroundColor:'#0000'}}/>);
        }else {
            //竖直方向
            arr.push(<View key={-3} style={{width:viewWidth,height:(viewHeight-height)/2,backgroundColor:'#0000'}}/>);
        }
        return arr;
    };

    //开始拖拽
    onScrollBeginDrag=(e)=>{
        this.state.ifTouch=true;
        this.state.scrollXArr=[];
        this.state.scrollYArr=[];
        this.stopInfiniteInterval();
    };
    // 停止拖拽(升级后2)
    onScrollEndDrag=(e)=>{
        this.state.ifTouch=false;

        this.props.ifInfinite&&this.setState({scrollEnabled:false});
        let speed=this.props.goToNextPageSpeed;
        let contentOffset=this.isH?e.nativeEvent.contentOffset.x:e.nativeEvent.contentOffset.y;
        let scrollArr=this.isH?this.state.scrollXArr:this.state.scrollYArr;
        let speed1=scrollArr[scrollArr.length-1]-scrollArr[scrollArr.length-2];
        let speed2=scrollArr[scrollArr.length-2]-scrollArr[scrollArr.length-3];
        let speed3=scrollArr[scrollArr.length-3]-scrollArr[scrollArr.length-4];
        let speed4=scrollArr[scrollArr.length-1]-scrollArr[0];
        let currentPage;
        if(Math.abs(speed1)>speed||Math.abs(speed2)>speed||Math.abs(speed3)>speed){
            // 速度(speed1,2,3)绝对值大于设定值时为有向左(右,上,下)翻一页的意图
            //speed4>0向右(上)翻(想去(下)(右)一页的意图)
            //speed4<0向左(下)翻(想去(上)(左)一页的意图)
            currentPage=speed4>0?Math.ceil(contentOffset/this.distance):Math.floor(contentOffset/this.distance);
        }else {
            currentPage=Math.round(contentOffset/this.distance);
        }
        //滚动到相应的界面
        this.scrollToPage(currentPage);
        //如果设置了自动轮播,则重新开启定时器
        this.props.ifAutoScroll&&this.setInfiniteInterval();
    };

    // 当滚动scrollView的时候(升级后)
    onScroll=(e)=>{
        let scrollPage;
        if(this.isH){
            // scrollView当前滚动的数值
            this.state.scrollXArr.push(e.nativeEvent.contentOffset.x);
            scrollPage=e.nativeEvent.contentOffset.x/this.distance;
        }else {
            // scrollView当前滚动的数值
            this.state.scrollYArr.push(e.nativeEvent.contentOffset.y);
            scrollPage=e.nativeEvent.contentOffset.y/this.distance;
        }
        if(this.props.ifInfinite&&Math.abs(scrollPage-Math.ceil(scrollPage))<0.1&&!this.state.ifTouch){//处理无限轮播,自动轮播滚动时的情况
            setTimeout(()=>{this.infiniteScroll(Math.ceil(scrollPage))},200)
        }else {
            this.setState({currentPage:scrollPage,});
        }
    };

    //无限轮播时对滚动的处理
    infiniteScroll=(currentPage)=>{
        if(currentPage<this.pNum||currentPage>=this.pNum*2){
            currentPage=currentPage%this.pNum+this.pNum;
            this.scrollToPage(currentPage,false);
        }
        //更新状态机
        this.setState({
            //当前页码
            currentPage:currentPage,
            scrollEnabled:true,
        });
    };

    //根据传入的要滚动到的页面数,滚动到相应的页面
    scrollToPage=(currentPage,animated=true)=>{
        let pageNum=this.props.ifInfinite?this.pNum*3:this.pNum;
        if(currentPage>pageNum-1){currentPage=pageNum-1}
        if(currentPage<0){currentPage=0}
        try{
            this.isH?this.scrollView.scrollTo({x:currentPage*this.distance, animated: animated}):this.scrollView.scrollTo({y:currentPage*this.distance, animated: animated});
        }catch (e){}
    };

    //父组件中使用ref手动滚动的方法
    manualScrollToPage=(currentPage,animated=true)=>{
        if(this.props.ifInfinite&&animated){
            currentPage<this.pNum&&(currentPage+=this.pNum);
            currentPage>=this.pNum*2&&(currentPage-=this.pNum);
        }else {
            if(currentPage>this.pNum-1){currentPage=this.pNum-1}
            if(currentPage<0){currentPage=0}
        }
        this.isH?this.scrollView.scrollTo({x:currentPage*this.distance, animated: animated}):this.scrollView.scrollTo({y:currentPage*this.distance, animated: animated});
    };

    //设置轮播的定时器
    setInfiniteInterval=()=>{
        let interval=this.props.infiniteInterval<1000?1000:this.props.infiniteInterval;
        this.timer=setInterval(()=>{
            let currentPage=Math.round(this.state.currentPage+1);
            !this.props.ifInfinite&&currentPage>=this.pNum&&(currentPage=0);
            this.scrollToPage(currentPage);
        },interval)
    };
    //清除轮播定时器
    stopInfiniteInterval=()=>{
        this.timer&&clearInterval(this.timer);
    };

    componentDidMount(){
        this.isH=this.props.HorV==='h';
        this.pNum=this.state.pageNum;
        this.props.ifAutoScroll&&this.setInfiniteInterval();
    }

    didMount=()=>{
        if(this.props.ifInfinite){
            let isH=this.props.HorV==='h';
            if(Platform.OS!=='ios'){
                InteractionManager.runAfterInteractions(() => {
                    this.scrollView.scrollTo(isH?{x:this.state.pageNum*this.distance,animated:false}:{y:this.state.pageNum*this.distance,animated:false});
                })
            }else {
                this.scrollView.scrollTo(isH?{x:this.state.pageNum*this.distance,animated:false}:{y:this.state.pageNum*this.distance,animated:false});
            }
        }
    };

    componentWillUpdate() {
    }

    componentWillUnmount(){
        this.stopInfiniteInterval();
    }

}

//输出组件类
export default PageScrollView;

