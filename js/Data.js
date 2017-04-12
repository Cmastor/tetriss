/**
 * Created by Administrator on 2017/4/10.
 */
//Java代码，仅做参考
public class Data implements Serializable{

    /**
     *
     */
    private int[][] a;
    private int fail;
    private int numLose = 0;
    public Data (int[][] b ,int fail,int numLose) {
        a = new int[b.length][b[0].length];
        for(int i = 0;i<b.length;i++) {
            for(int j = 0;j<b[i].length;j++){
                a[i][j] = b[i][j];
            }
        }
        this.fail = fail;
        this.numLose = numLose;
    }

    /**
     * @return Returns the a.
     */
    public int[][] getA () {
        return a;
    }
    /**
     * @param a The a to set.
     */
    public void setA (int[][] a) {
        this.a = a;
    }

    public int getFail() {
        return fail;
    }

    public void setFail(int fail) {
        this.fail = fail;
    }

    public int getNumLose() {
        return numLose;
    }

    public void setNumLose(int numLose) {
        this.numLose = numLose;
    }
}