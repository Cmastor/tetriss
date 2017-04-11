/**
 * Created by Administrator on 2017/4/10.
 */
(function () {
    var frontColor = orange ,backColor = black;// 默认的方块的颜色为桔黄色，背景颜色为黑色
    var score = 0, scoreForLevelUpdata = 0;// score：得分，scoreForLevelUpdata：上一次升级后的积分
    var canvas_rows = 22, canvas_cols = 13;//
    var ErsBox = new Array();//先声明一维数组
    for (var k = 0; k < canvas_cols - 1; k++) {//一维长度为canvas_cols - 1,为变量，可以根据实际情况改变
        ErsBox[k]=new Array();//声明二维数组，每一个一维数组里面的一个元素都是一个数组
    }
    var boxes = new ErsBox[][];
    var boxWidth, boxHeight;
    var canvasData = new Array();
    for (var i = 0; i < boxes.length; i++) {
        for (var j = 0; j < boxes[i].length; j++) {
            boxes[i][j] = new ErsBox(false);
        }
    }
    /**
     * 画布类的第一个版本的构造函数
     *
     * @param rows
     *            int, 画布的行数
     * @param cols
     *            int, 画布的列数
     * 行数和列数以方格为单位，决定着画布拥有方格的数目
     */
    var GameCanvas = function () {
        this.rows = canvas_rows;
        this.cols = canvas_cols;
        boxes = new ErsBox[rows][cols];// 初始化rows*cols个ErsBox对象
        canvasData = new int[rows][cols];
        for (var i = 0; i < boxes.length; i++) {
            for (var j = 0; j < boxes[i].length; j++) {
                boxes[i][j] = new ErsBox(false);
            }
        }
        setBorder(new EtchedBorder(EtchedBorder.RAISED, Color.white, new Color(148, 145, 140)));// 设置画布的边界
    };//后面开始修改




    /**
     * 画布类的第二个版本的构造函数
     *
     * @param rows
     *            与public GameCanvas(int rows, int cols)的rows相同
     * @param cols
     *            与public GameCanvas(int rows, int cols)的cols相同
     * @param backColor
     *            Color, 背景色
     * @param frontColor
     *            Color, 前景色
     */
        public GameCanvas(int rows, int cols, Color backColor, Color frontColor) {
        this(); // 调用第一个版本的构造函数
        this.backColor = backColor;    // 通过参数设置背景色
        this.frontColor = frontColor;  // 通过参数设置前景色
    }

    /**
     * @param i
     * @param j
     */

    /**
     * 设置游戏背景色彩
     *
     * @param backColor
     *            Color, 背景色彩
     */
    public void setBackgroundColor(Color backColor){
        this.backColor = backColor;
    }

    /**
     * 取得游戏背景色彩
     *
     * @return Color, 背景色彩
     */
    public Color getBackgroundColor() {
        return backColor;
    }

    /**
     * 设置游戏方块色彩
     *
     * @param frontColor
     *            Color, 方块色彩
     */
    public void setBlockColor(Color frontColor) {
        this.frontColor = frontColor;
    }

    /**
     * 取得游戏方块色彩
     *
     * @return Color, 方块色彩
     */
    public Color getBlockColor() {
        return frontColor;
    }

    /**
     * 取得画布中方格的行数
     *
     * @return int, 方格的行数
     */
    public int getRows() {
        return rows;
    }

    /**
     * 取得画布中方格的列数
     *
     * @return int, 方格的列数
     */
    public int getCols() {
        return cols;
    }

    /**
     * 取得游戏成绩
     *
     * @return int, 分数
     */
    public int getScore() {
        return score;
    }

    /**
     * 取得自上一次升级后的积分
     *
     * @return int, 上一次升级后的积分
     */
    public int getScoreForLevelUpdata() {
        return scoreForLevelUpdata;
    }

    /**
     * 升级后，将上一次升级以来的积分清0
     */
    public void resetScoreForLevelUpdata() {
        scoreForLevelUpdata -= ErsBlocksGame.PER_LEVEL_SCORE;
    }

    /**
     * 得到某一行某一列的方格引用。
     *
     * @param row
     *            int, 要引用的方格所在的行
     * @param col
     *            int, 要引用的方格所在的列
     * @return ErsBox, 在row行col列的方格的引用
     */
    public ErsBox getBox(int row, int col) {
        if (row < 0 || row > boxes.length - 1 || col < 0
            || col > boxes[0].length - 1)
            return null;
        return (boxes[row][col]);
    }

    public int[][] getCanvasData() {
        try {
            for (int i = 0; i < boxes.length; i++) {
                for (int j = 0; j < boxes[i].length; j++) {

                    if (boxes[i][j].isColorBox()) {
                        canvasData[i][j] = 1;
                    } else {
                        canvasData[i][j] = 0;
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(e.toString());

        }
        return canvasData;

    }

    public int currentRow() {

        int currentRow = 0;
        boolean sign = false;
        for (int i = GameCanvas.CANVAS_ROWS - 1; i >= 0; i--) {
            sign = true;
            for (int j = 0; j < GameCanvas.CANVAS_COLS; j++) {

                if (boxes[i][j].isColorBox()) {
                    sign = false;
                    break;
                }
            }
            if (sign) {
                currentRow = i + 1;
                break;
            }
        }
        return currentRow;
    }

    public ErsBox setAutoBox() {

        ErsBox box = null;
        if (Math.random() * 10 >= 5.0)
            box = new ErsBox(false);
        else
            box = new ErsBox(true);

        return box;
    }

    public boolean addNewRow(int num) {

        int currentRow = currentRow();
        if (currentRow <= num)
            return false;
        else {
            for (int i = currentRow; i < GameCanvas.CANVAS_ROWS; i++) {
                for (int j = 0; j < GameCanvas.CANVAS_COLS; j++) {
                    boxes[i - num][j] = (ErsBox)boxes[i][j].clone();
                }
            }

            for (int i = GameCanvas.CANVAS_ROWS - 1; i > GameCanvas.CANVAS_ROWS - num -1; i--) {
                for (int j = 0; j < GameCanvas.CANVAS_COLS; j++) {
                    boxes[i][j] = setAutoBox();
                }
            }
            repaint();
            return true;
        }
    }

    /**
     * 覆盖JComponent类的函数，画组件。
     *
     * @param g
     *            图形设备环境 paint方法实际上把绘图的主要工作委派给paintComponent方法等方法
     */
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.setColor(frontColor);

        for (int i = 0; i < boxes.length; i++) {
            for (int j = 0; j < boxes[i].length; j++) {

                // 用前景颜色或背景颜色绘制每个方块
                if (boxes[i][j].isColorBox()) {
                    g.setColor(frontColor);
                } else {
                    g.setColor(backColor);
                }
                g.fill3DRect(j * boxWidth, i * boxHeight, boxWidth, boxHeight,
                    true);
            }
        }
    }

    /**
     * 根据窗口的大小，自动调整方格的尺寸
     */
    function fanning() {
        boxWidth = getSize().width / cols;
        boxHeight = getSize().height / rows;
    }

    /**
     * 当一行被游戏者叠满后，将此行清除，并为游戏者加分
     *
     * @param row
     *            int, 要清除的行，是由ErsBoxesGame类计算的
     */
    public synchronized void removeLine(int row) {
        for (int i = row; i > 0; i--) {
            for (int j = 0; j < cols; j++)
            boxes[i][j] = (ErsBox) boxes[i - 1][j].clone();
        }

        score += ErsBlocksGame.PER_LINE_SCORE;
        scoreForLevelUpdata += ErsBlocksGame.PER_LINE_SCORE;
        repaint();
    }

    /** 重置画布，置积分为0 */
    function reset() {
        score = 0;
        scoreForLevelUpdata = 0;
        for (int i = 0; i < boxes.length; i++) {
            for (int j = 0; j < boxes[i].length; j++)
            boxes[i][j].setColor(false);
        }
        repaint();
    }
})();