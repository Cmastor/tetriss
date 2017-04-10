/**
 * Created by Administrator on 2017/4/10.
 */

/**
 * 块类，继承自线程类（Thread） 由 4 * 4 个方格（ErsBox）构成一个块， 控制块的移动、下落、变形等
 */
class ErsBlock extends Thread {
    /**
     * 一个块占的行数是4行
     */
    public final static int BOXES_ROWS = 4;

    /**
     * 一个块占的列数是4列
     */
    public final static int BOXES_COLS = 4;

    /**
     * 让升级变化平滑的因子，避免最后几级之间的速度相差近一倍
     */
    public final static int LEVEL_FLATNESS_GENE = 3;

    /**
     * 相近的两级之间，块每下落一行的时间差别为多少(毫秒)
     */
    public final static int BETWEEN_LEVELS_DEGRESS_TIME = 50;

    /**
     * 方块的样式数目为7
     */
    private final static int BLOCK_KIND_NUMBER = 7;

    /**
     * 每一个样式的方块的反转状态种类为4
     */
    private final static int BLOCK_STATUS_NUMBER = 4;

    /**
     * 分别对应对7种模型的反转得到的28种状态
     */
    public final static int[][] STYLES = {// 共28种状态
        { 0x0f00, 0x4444, 0x0f00, 0x4444 }, // 长条型的四种状态
        { 0x04e0, 0x0464, 0x00e4, 0x04c4 }, // 'T'型的四种状态
        { 0x4620, 0x6c00, 0x4620, 0x6c00 }, // 反'Z'型的四种状态
        { 0x2640, 0xc600, 0x2640, 0xc600 }, // 'Z'型的四种状态
        { 0x6220, 0x1700, 0x2230, 0x0740 }, // '7'型的四种状态
        { 0x6440, 0x0e20, 0x44c0, 0x8e00 }, // 反'7'型的四种状态
        { 0x0660, 0x0660, 0x0660, 0x0660 }, // 方块的四种状态
    };

    private GameCanvas canvas;

    private ControlPanel panel;

    private ErsBox[][] boxes = new ErsBox[BOXES_ROWS][BOXES_COLS];

    private int style, y, x, level;

    private boolean moving = true;

    private int[][] canvasData;

    private int[][] recData;

    private ObjectInputStream in;

    private ObjectOutputStream out;

    private int numLose;

    private boolean fullLine = false;

/**
 * 构造函数，产生一个特定的块
 *
 * @param style
 *            块的样式，对应STYLES的28个值中的一个
 * @param y
 *            起始位置，左上角在canvas中的行坐标
 * @param x
 *            起始位置，左上角在canvas中的列坐标
 * @param level
 *            游戏等级，控制块的下落速度
 * @param canvas
 *            画板
 */
public ErsBlock(int style, int y, int x, int level, GameCanvas canvas,
    ControlPanel panel, ObjectInputStream in,

    ObjectOutputStream out, int numLose) {
    this.style = style;
    this.y = y;
    this.x = x;
    this.level = level;
    this.canvas = canvas;
    this.panel = panel;
    this.in = in;
    this.out = out;
    this.numLose = numLose;

    int key = 0x8000;
    for (int i = 0; i < boxes.length; i++) {
        for (int j = 0; j < boxes[i].length; j++) {
            boolean isColor = ((style & key) != 0);
            boxes[i][j] = new ErsBox(isColor);
            key >>= 1;
        }
    }

    display();
}

/**
 * 线程类的run()函数覆盖，下落块，直到块不能再下落
 */
public void run() {
    Data data = null;
    while (moving) {
        try {

            sleep(BETWEEN_LEVELS_DEGRESS_TIME
                * (ErsBlocksGame.MAX_LEVEL - level + LEVEL_FLATNESS_GENE));
        } catch (InterruptedException ie) {
            ie.printStackTrace();
        }

        // 后边的moving是表示在等待的100毫秒间，moving没被改变
        try {

            canvasData = canvas.getCanvasData();
            out.writeObject(new Data(canvasData, 0, numLose));
            numLose = 0;

            data = (Data) in.readObject();
            recData = data.getA();
            ErsBlocksGame.otherFail = data.getFail();
            if (data.getNumLose() != 0) {
                fullLine = canvas.addNewRow(data.getNumLose());
                if (!fullLine) {
                    ErsBlocksGame.selfFail = 1;
                    return;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        panel.setUseInfo(recData);
        moving = (moveTo(y + 1, x) && moving);

        if (data.getFail() == 1) {
            return;
        }
    }
}

/**
 * 块向左移动一格
 */
public void moveLeft() {
    moveTo(y, x - 1);
}

/**
 * 块向右移动一格
 */
public void moveRight() {
    moveTo(y, x + 1);
}

/**
 * 块向下落一格
 */
public void moveDown() {
    moveTo(y + 1, x);
}

/**
 * 块变型
 */
public void turnNext() {
    for (int i = 0; i < BLOCK_KIND_NUMBER; i++) {
        for (int j = 0; j < BLOCK_STATUS_NUMBER; j++) {
            if (STYLES[i][j] == style) {
                int newStyle = STYLES[i][(j + 1) % BLOCK_STATUS_NUMBER];
                turnTo(newStyle);
                return;
            }
        }
    }
}


/**
 * 停止块的下落，对应游戏停止
 */
public void stopMove() {
    moving = false;
}

/**
 * 将当前块从画布的对应位置抹去，要等到下次重画画布时才能反映出来
 */
private void earse() {
    for (int i = 0; i < boxes.length; i++) {
        for (int j = 0; j < boxes[i].length; j++) {
            if (boxes[i][j].isColorBox()) {
                ErsBox box = canvas.getBox(i + y, j + x);
                if (box == null)
                    continue;
                box.setColor(false);
            }
        }
    }
}

/**
 * 让当前块在画布的对应位置上显示出来，要等到下次重画画布时才能看见
 */
private void display() {
    for (int i = 0; i < boxes.length; i++) {
        for (int j = 0; j < boxes[i].length; j++) {
            if (boxes[i][j].isColorBox()) {
                ErsBox box = canvas.getBox(y + i, x + j);
                if (box == null)
                    continue;
                box.setColor(true);
            }
        }
    }
}

/**
 * 当前块能否移动到newRow/newCol所指定的位置
 *
 * @param newRow
 *            int, 目的地所在行
 * @param newCol
 *            int, 目的地所在列
 * @return boolean, true-能移动，false-不能
 */
private boolean isMoveAble(int newRow, int newCol) {
    earse();
    for (int i = 0; i < boxes.length; i++) {
        for (int j = 0; j < boxes[i].length; j++) {
            if (boxes[i][j].isColorBox()) {
                ErsBox box = canvas.getBox(newRow + i, newCol + j);
                // 如果当前位置不能是方块或已有填充的方块，则不能移动
                if (box == null || (box.isColorBox())) {
                    display();
                    return false;
                }
            }
        }
    }
    display();
    return true;
}

/**
 * 将当前画移动到newRow/newCol所指定的位置
 *
 * @param newRow
 *            int, 目的地所在行
 * @param newCol
 *            int, 目的地所在列
 * @return boolean, true-移动成功，false-移动失败
 */
private synchronized boolean moveTo(int newRow, int newCol) {
    // 如果在新的行不能移动或停止移动则返回假
    if (!isMoveAble(newRow, newCol) || !moving)
        return false;
    // 抹掉旧的的痕迹
    earse();
    // 在新的位置重画
    y = newRow;
    x = newCol;

    display();
    canvas.repaint();

    return true;
}

/**
 * 当前块能否变成newStyle所指定的块样式，主要是要考虑 边界以及被其它块挡住、不能移动的情况
 *
 * @param newStyle
 *            int,希望改变的块样式，对应STYLES的28个值中的一个
 * @return boolean,true-能改变，false-不能改变
 */
private boolean isTurnAble(int newStyle) {
    int key = 0x8000;
    earse();
    for (int i = 0; i < boxes.length; i++) {
        for (int j = 0; j < boxes[i].length; j++) {
            // 检查4×4的格子内，新模式的格子是否为填充块
            if ((newStyle & key) != 0) {
                // 检查当前格子是否为在面板内并且不是填充块
                // 是则不能转动
                ErsBox box = canvas.getBox(y + i, x + j);
                if (box == null || box.isColorBox()) {
                    display();
                    return false;
                }
            }
            key >>= 1;
        }
    }
    display();
    return true;
}

/**
 * 将当前块变成newStyle所指定的块样式
 *
 * @param newStyle
 *            int,将要改变成的块样式，对应STYLES的28个值中的一个
 * @return boolean,true-改变成功，false-改变失败
 */
private boolean turnTo(int newStyle) {
    if (!isTurnAble(newStyle) || !moving)
        return false;

    earse();
    int key = 0x8000;
    for (int i = 0; i < boxes.length; i++) {
        for (int j = 0; j < boxes[i].length; j++) {
            boolean isColor = ((newStyle & key) != 0);
            boxes[i][j].setColor(isColor);
            key >>= 1;
        }
    }
    style = newStyle;

    display();
    canvas.repaint();

    return true;
}

}