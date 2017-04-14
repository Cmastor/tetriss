/**
 * Created by dell on 2017/4/13.
 */
    //获取到创建画布的元素
    var canvas = document.getElementById("canvas");
    //创建2d绘图环境
    var gc = canvas.getContext("2d");
    //二维背景格
    function map(r,c) {
        var data = [];

        for(var i = 0;i < r;i++){
            data.push([]);
            for(var j = 0; j<c;j++){
                data[i].push(0);
            }
        }
        return data;
    }
    //定义背景
    var data = map(20,12);
    //创建方块
    function render(data,gc) {
        //设置块的宽和高
        var w = (500-60)/12;
        var h = (1000-100)/20;
        var rLen = data.length;
        var cLen =data[0].length;
        for(var i = 0; i< rLen;i++){
            for(var j = 0; j<cLen;j++){
                gc.fillStyle=data[i][j]==0?'#ccc':'#3BCCC9';
                gc.fillRect(j*(w+5),i*(h+5),w,h);
            }
        }
    }
    //画背景方块
    render(data,gc);
    //方块数据
    var arr=[
        [[1,1,1,1]],
        [[1,1],[1,1]],
        [[1,1,0],[0,1,1]],
        [[0,1,1],[1,1,0]],
        [[0,1,0],[1,1,1]],
        [[1,0,0],[1,1,1]],
        [[0,0,1],[1,1,1]]
    ];
    //定义当前的方块数据
    var matrix = mold();
    //随机一个方块数据
    function mold() {
        var num = Math.floor(Math.random()*7);
        return arr[num];
    }
    //方块出现的位置
    var y=0;
    var x=4;
    //创建出来的方块且重画画布
    function create(arr) {
        for(var i = 0;i < arr.length;i++){
            for(var j=0;j<arr[i].length;j++){
                if(!data[i+y][j+x]){
                    data[i+y][j+x]=arr[i][j];
                }
            }
        }
        render(data,gc);
    }
    //matrix 保存随机出来的方块，这样在运动中就可以一直使用同一个方块了。

    //先定义一个变量，使他成为全局的，在之后定义它为一个定时器
    var timer = null;
    var onOff =false;

    //创建一个新的空的二维数组
    var arrl=[];
    for(var i=0;i<12;i++){
        arrl.push(0);
    }
    //定时器
    function auto(time) {
        timer = setInterval(function () {
            fall();
        },time);
    }
    //旋转当前的动画
    function rotate(){
        var arr = [];
        var y = matrix.length;
        var x = matrix[0].length;
        //把arr变成一个二维数组。
        for(var i=0;i<x;i++){
            arr.push([]);
        }

        for(var i=0;i<y;i++){
            for(var j=0;j<x;j++){
                arr[j][y-1-i] = matrix[i][j]
            }
        }
        if(collideTestX(1,arr)||collideTestX(-1,arr)||collideTest(arr)){
            return;
        }
        matrix = arr;

    }
    //鼠标方向键事件
    function play(){
        document.onkeydown = function(ev){

            switch(ev.keyCode){
                case 37://向左移动

                    clearPre(matrix);
                    if(!collideTestX(-1,matrix)){
                        x--;
                    }

                    create(matrix);
                    break;
                case 39://向右移动
                    clearPre(matrix);
                    if(!collideTestX(1,matrix)){
                        x++;
                    }
                    create(matrix);
                    break;
                case 38://方块变形
                    clearPre(matrix);
                    rotate(matrix);
                    create(matrix);
                    break;
                case 40://加速向下移动。
                    if(onOff)return;
                    onOff = true;
                    clearInterval(timer);
                    auto(100);
                    break;
            }
        };
        document.onkeyup = function(ev){
            if(ev.keyCode == 40){
                onOff = false;
                clearInterval(timer);
                auto(400);
            }
        };
    }
    /*左右移动的过程中，如果碰撞了边缘或者碰撞其他方块就返回true，否则false
    监测左右移动事件*/
    function collideTestX(n,matrix1){
        //n是负1就是向左，1是向右；
        var maxX = data[0].length - matrix1[0].length;
        //碰到边界
        if(x+n<0||x+n>maxX){
            return true;
        }
        //检测左右移动时是否碰到方块。
        if(n<0){

            for(var i=0;i<matrix1.length;i++){
                var index = 0;
                while(!matrix1[i][index]){
                    index++;
                }
                if(!data[i+y]||data[i+y][x+index-1]){
                    return true;
                }
            }
        }else{
            for(var i=0;i<matrix1.length;i++){
                var index = matrix1[0].length;
                while(!matrix1[i][index]){
                    index--;
                }
                if(!data[i+y]||data[i+y][x+index+1]){
                    return true;
                }
            }
        }
        return false;
    }
    //监测是否到达底部
    function fall(){
        //判断当方块移动到底部的时候就停下，从新生成一个新的方块从顶部开始下移。
        if(collideTest(matrix)){
            clearLine();
            y = 0;
            x = 4;
            matrix = mold();
        }
        //清除前边
        clearPre(matrix);
        y++;
        create(matrix);
    }
    var dline=0;
    //监测每一行，如果该行填充满则清楚该行
    function clearLine(){
        var y = data.length;
        var x = data[0].length;
        var n;
        for(var i=0;i<y;i++){
            n = true;
            for(var j=0;j<x;j++){
                if(!data[i][j]){
                    n = false;
                }
            }
            if(n){
                dline++;
                data.splice(i,1);
                data.unshift([].concat(arrl));
                dlnumber.innerText = dline;
                score.innerText=dline*10;
            }
        }
    }
    //检测是否到达地图的底部，或者撞上了其他方块。这个函数返回true说明到底部或者撞上其他方块。
    function collideTest(matrix1){
        var len = matrix1.length;
        //判断到底部了。

        if(y+len>=data.length){
            return true;
        }
        var arr = matrix1[len-1];
        var n;
        for(var i=0;i<arr.length;i++){
            n = len-1;
            while(!matrix1[n][i]){
                n--;
            }
            if(data[y+1+n][x+i]){

//    判断游戏停止girl doselfQueen
                if(data[1][4]==1||data[1][5]==1){
                    alert("the game over");
                    return false;
                }

                return true;
            }
        }
        return false;
    }
    //在移动中清除前边的方块
    function clearPre(arr){
        for(var i = 0;i < arr.length;i++){

            for(var j = 0;j < arr[i].length;j++){
                if(arr[i][j]){
                    data[i+y][j+x] = 0;
                }
            }
        }
    }



    //开始和暂停
    var keyss = document.getElementById("keyss");
    // console.log(keyss);
    var lock = true;
    keyss.addEventListener("click",function () {
        if(lock==true){
            lock = false;
            keyss.innerText="暂停";
            create(matrix);
            //        移动
            auto(400);
            play();
        }else{
            lock = true;
            keyss.innerText="开始";
        //   暂停机制
        }

    },false);
    //结束
    var keyend = document.getElementById("keyend");
    keyend.addEventListener("click",function () {

    },false);
    //重置
    var reset = document.getElementById("reset");
    //得分
    var score = document.getElementById("score");
    //消除行数
    var dlnumber = document.getElementById("dlnumber");
    //等级
    var gradenumber = document.getElementById("gradenumber");




    //上旋转
    var up = document.getElementById("up");
    up.addEventListener("click",function () {
        clearPre(matrix);
        rotate(matrix);
        create(matrix);
    },false);
    //下加速
    //加速机制有问题
    var down = document.getElementById("down");
    down.addEventListener("click",function () {
        // if(onOff)return;
        // onOff = true;
        // clearInterval(timer);
        // auto(100);
    },false);
    //左移动
    var left = document.getElementById("left");
    left.addEventListener("click",function () {
        clearPre(matrix);
        if(!collideTestX(-1,matrix)){
            x--;
        }

        create(matrix);
    },false);
    //右移动
    var right = document.getElementById("right");
    right.addEventListener("click",function () {
        clearPre(matrix);
        if(!collideTestX(1,matrix)){
            x++;
        }
        create(matrix);
    },false);