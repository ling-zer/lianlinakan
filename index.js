

window.onload = function () {
    init();
}
// 初始化
var rows = 7,
    cols = 12,
    wrap,
    types = 20,
    squareSet,
    chooseOne = null,
    chooseTwo = null,
    toWard = {NODE:null, UP: {row: -1, col: 0},RIGHT: {row: 0, col: 1}, DOWN: {row: 1, col: 0},LEFT: {row: 0, col: -1}};
function init () {
    wrap = document.getElementById('wrapper');
    if( (rows * cols) % 2 != 0 ) {
        alert('展示数量不能为奇数');
    }
    initSquareSet();
}
// 初始化小格子
function initSquareSet () {
    //per-square width:86px  height: 76px
    wrap.style.width = 86 * cols + 'px';
    wrap.style.height = 76 * rows + 'px';
    var tempArr = createRandomNumber();
    // createSquare();
    squareSet = new Array(rows + 2);
    for(var i = 0; i < squareSet.length; i ++) {
        squareSet[i] = new Array(cols + 2);
    }
    for(var i = 1; i <= rows; i ++){
        for(var j = 1; j <= cols; j ++){
            var temp = createSquare(tempArr.pop(), i, j);
            squareSet[i][j] = temp;
            wrap.append(temp);
            temp.onclick = function () {
                if(chooseOne == null || chooseOne.num != this.num) {
                    chooseOne = this;
                    console.log(this);
                }else {
                    chooseTwo = this;
                    if(chooseOne != chooseTwo && checkLink(chooseOne.row, chooseOne.col, 0, toWard.NODE, [] )) {
                        clearSquare(chooseOne);
                        clearSquare(chooseTwo);
                    }
                    chooseOne = null;
                    chooseTwo = null;
                }
                render();
                if(checkFinish()) {
                    alert('游戏结束');
                }

            }

        }
    }
}

// 生成小方块数字
function createRandomNumber () {
    var temp = [];
    for(var i = 0; i < rows * cols / 2; i ++ ){
        var num = Math.floor( Math.random() * 20 );
        temp.push(num);
        temp.push(num);
    }
    temp.sort(function (a, b) {
        return Math.random() - 0.5;
    });
    return temp;
}
function createSquare (num, i, j) {
    var temp = document.createElement('div');
    temp.classList.add('square');
    temp.style.backgroundImage = `url("./img/${num}.png")`;
    temp.style.left = j * 86 + 'px';
    temp.style.top =  i * 76 + 'px';
    temp.num = num;
    temp.row = i;
    temp.col = j;
    return temp;
}
function render () {
    for(var i = 0; i < squareSet.length; i ++) {
        for(var j = 0; j < squareSet[i].length; j ++) {
            if(squareSet[i][j] && squareSet[i][j] == chooseOne){
                squareSet[i][j].style.opacity = '0.5';
            }else if(squareSet[i][j]){
                squareSet[i][j].style.opacity = '1';
            }
        }
    }
}
function clearSquare(chooseItem) {
    var row = chooseItem.row;
    var col = chooseItem.col;
    wrap.removeChild(squareSet[row][col]);
    squareSet[row][col] = null;
}
function checkLink (row, col, changeTimes, nowToward, path) {

    if(isExist(row, col) && squareSet[row][col] == chooseTwo && changeTimes <= 3) {
        return true;
    }
    if(isExist(row, col) && squareSet[row][col] != chooseOne || changeTimes > 3 || row < 0 || col < 0 || row >= squareSet.length || col >= squareSet[0].length || path.indexOf(getLocation(row, col)) > -1) {
        path.pop();
        return false;
    }
    path.push(getLocation(row, col));

    // 上右下左
    return checkLink(row - 1, col, nowToward == toWard.UP ? changeTimes : changeTimes + 1, toWard.UP, path)
        || checkLink(row , col + 1, nowToward == toWard.RIGHT ? changeTimes : changeTimes + 1, toWard.RIGHT, path)
        || checkLink(row + 1 , col, nowToward == toWard.DOWN ? changeTimes : changeTimes + 1, toWard.DOWN, path)
        || checkLink(row , col - 1, nowToward == toWard.LEFT ? changeTimes : changeTimes + 1, toWard.LEFT, path);
}
function isExist(x, y) {
    if(x > 0 && x < squareSet.length && y > 0 && y < squareSet[0].length && squareSet[x] && squareSet[x][y]) {
        return true;
    }
    return false;
}
function getLocation (x, y) {
    return '' + x + ',' + y ;
}
// 判断是否结束
function checkFinish() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j]) {
                return false;
            }
        }
    }
    // 所有的都被清除了 返回true
    return true;
}