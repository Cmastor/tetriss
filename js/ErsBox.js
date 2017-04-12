/**
 * Created by Administrator on 2017/4/10.
 */
//Java代码，仅做参考
/**
 * 方格类，是组成俄罗斯方块的基本元素，用自己的颜色来表示块的外观
 * 一个类实现Cloneable接口，就意味着可以合法地使用Object.clone()方法
 * 域到域地拷贝类对象，否则这种拷贝将会导致异常
 */
class ErsBox implements Cloneable {
    private boolean isColor;
    private Dimension size = new Dimension();

    /**
     * 方格类的构造函数
     * @param isColor 是不是用前景色来为此方格着色，
     *      true前景色，false用背景色
     */
    public ErsBox(boolean isColor) {
        this.isColor = isColor;
    }

    /**
     * 此方格是不是用前景色表现
     * @return boolean,true用前景色表现，false用背景色表现
     */
    public boolean isColorBox() {
        return isColor;
    }

    /**
     * 设置方格的颜色，
     * @param isColor boolean,true用前景色表现，false用背景色表现
     */
    public void setColor(boolean isColor) {
        this.isColor = isColor;
    }

    /**
     * 得到此方格的尺寸
     * @return Dimension,方格的尺寸
     */
    public Dimension getSize() {
        return size;
    }

    /**
     * 设置方格的尺寸
     * @param size Dimension,方格的尺寸
     */
    public void setSize(Dimension size) {
        this.size = size;
    }

    /**
     * 覆盖Object的Object clone()，实现克隆
     * @return Object,克隆的结果
     */
    public Object clone() {
        Object cloned = null;
        try {
            cloned = super.clone();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return cloned;
    }
}