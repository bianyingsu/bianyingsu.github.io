# Sort
---
aliases:
  - Sort
标题: Sort
---
**算法复杂度**


**笔记本：** 排序


**创建时…** 2021/10/7 17:04 **更新时…** 2021/10/8 2:12


**作者：** 彼岸樱速

**算法复杂度**

<img src="/img/Sort.pdf-0-0.png">


相关概念


稳定：如果一个原本在b前面，而A = B，排序


之后一个仍然在b的前面。


不稳定：如果a原本在b的前面，而a = b，排序


之后a可能会出现在b的后面。


时间复杂度：对排序数据的总的操作次数反映


当Ñ变化时，操作次数呈现什么规律。


空间复杂度：是指算法在计算机内执行时所需


存储空间的度量，它也是数据规模Ñ的函数。



**1、冒泡排序**


**笔记本：** 排序


**创建时…** 2021/10/7 15:05 **更新时…** 2021/10/8 2:12

**作者：** 彼岸樱速

<img src="/img/Sort.pdf-2-0.gif">


**冒泡排序**
冒泡排序（默认升序）就是通过 **双重循环** ，相邻的两个
数字相互比较，
如果前面的数字比较大，就交换两个数字，每一轮都会
将较大的数字放到后面，直至最后完成排序，
冒泡排序是十大排序中最基础的排序算法。


**复杂度**
最差时间复杂度： O(n^2）
最好时间复杂度： O(n)
平均时间复杂度： O(n^2)

Java代码实现

```java
/**
* 冒泡排序
*/
public class BubbleSort {

    public static void main(String[] args) {
        int[] ints = ArrayGenerateUtil.getRandomArray(1000);
        //int[] ints = new int[]{23,24,54,-324,2,1,1,1,98};
        bubbleSort(ints);
        for (int anInt : ints) {
            System.out.print(anInt + " ");
        }
        System.out.println();
    }


    public static void bubbleSort(int[] arr) {
        long beginTime = System.currentTimeMillis();
        System.out.println("冒泡排序开始... " + beginTime);
        for (int i = 0; i < arr.length; i++) {
            // 优化：如果在某一次冒泡排序中没有交换元素，则说明当前比较的数组已经有序
            boolean flag = true;
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    flag = false;
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
            if (flag) {
                break;
            }
        }
        long endTime = System.currentTimeMillis();
        System.out.println("冒泡排序结束... " + endTime);
        System.out.println("本次排序耗时" + (endTime - beginTime));
    }
}


public class ArrayGenerateUtil {

    /**
    * 随机生成num个数的数组
    * @param num 传进来的数组个数
    * @return 数组
    */
    public static int[] getRandomArray(int num) {
        Random random = new Random();
        //动态初始化一个长度为num的数组
        int [] ints = new int[num];
        for (int i = 0; i <ints.length ; i++) {
            // 调用Random 通过遍历的形式为数组赋初值。
            ints[i] = random.nextInt(num);
        }


        for (int value : ints) {
            System.out.print(value + " ");
        }
        System.out.println();
        return ints;
    }


}
```


**2、选择排序**


**笔记本：** 排序


**创建时…** 2021/10/7 15:12 **更新时…** 2021/10/8 2:06


**作者：** 彼岸樱速

# **动图** 

<img src="/img/Sort.pdf-5-0.gif">

# **思路分析**


**1.** **第一个跟后面的所有数相比，** 如果小于（或小于）第一个
数的时候，暂存较小数的下标，第一趟结束后，将第一个数，
与暂存的那个最小数进行交换，第一个数就是最小（或最大的
数）


**2.** 下标移到第二位，第二个数跟后面的所有数相比，一趟下
来，确定第二小（或第二大）的数


重复以上步骤


直到指针移到倒数第二位，确定倒数第二小（或倒数第二大）
的数，那么最后一位也就确定了，排序完成。

# **复杂度分析**


**1.** 不管原始数组是否有序， **时间复杂度都是O（n** **[2]** **）** ，


因为每一个数都要与其他数比较一次，（n-1） [2] 次，分解：

n [2] -2n+1, 去掉低次幂和常数，剩下n [2],所以最后的时间复杂度

是n [2]


**2. 空间复杂度是O（1）**,因为只定义了两个辅助变量，与n的
大小无关，所以空间复杂度为O（1）

**Java代码实现**

```java
/**
* 选择排序
*/
public class SelectSort {

    public static void main(String[] args) {
        int[] ints = ArrayGenerateUtil.getRandomArray(1000);
        //int[] ints = new int[]{23,24,54,-324,2,1,1,1,98};
        selectSort(ints);
        for (int anInt : ints) {
            System.out.print(anInt + " ");
        }
        System.out.println();
    }

    public static void selectSort(int[] arr) {
        long beginTime = System.currentTimeMillis();
        System.out.println("选择排序开始... " + beginTime);
        for (int i = 0; i < arr.length; i++) {
            int min = arr[i];
            int minIndex = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (min > arr[j]) {
                    min = arr[j];
                    minIndex = j;
                }
            }
            if (i != minIndex) {
                arr[minIndex] = arr[i];
                arr[i] = min;
            }
        }
        long endTime = System.currentTimeMillis();
        System.out.println("选择排序结束... " + endTime);
        System.out.println("本次排序耗时" + (endTime - beginTime));
    }
}

public class ArrayGenerateUtil {

    /**
    * 随机生成num个数的数组
    * @param num 传进来的数组个数
    * @return 数组
    */
    public static int[] getRandomArray(int num) {
        Random random = new Random();
        //动态初始化一个长度为num的数组
        int [] ints = new int[num];
        for (int i = 0; i <ints.length ; i++) {
            // 调用Random 通过遍历的形式为数组赋初值。
            ints[i] = random.nextInt(num);
        }

        for (int value : ints) {
            System.out.print(value + " ");
        }
        System.out.println();
        return ints;
    }

}
```


**3、插入排序**


**笔记本：** 排序


**创建时…** 2021/10/7 15:19 **更新时…** 2021/10/8 2:06


**作者：** 彼岸樱速

# **一、动图** 

<img src="/img/Sort.pdf-8-0.gif">

# **二、思路分析**

## 例如从 小到大 排序: 

## 1.  从第二位开始遍历， 

## 2.  当前数（第一趟是第二位数） 与前面的数依 **次比较，如果前面的数大于当前数，则将这个** 数放在当前数的位置上，当前数的下标-1 ， 

## **3. 重复以上步骤，直到当前数不大于前面的某** **一个数为止，这时，将当前数，放到这个位** **置，** 1-3步就是保证当前数的前面的数都是有 序的，内层循环的目的就是将当前数插入到前 面的有序序列里 

## 4.  重复以上3步，直到遍历到最后一位数，并 将最后一位数插入到合适的位置，插入排序结束。

## 根据思路分析，每一趟的执行流程如下图所示：

<img src="/img/Sort.pdf-9-0.png">

# **三、复杂度分析**

## 1. 时间复杂度： 插入算法，就是保证前面的序 列是有序的，只需要把当前数插入前面的某一 个位置即可。 所以如果数组本来就是有序的，则数组的 最 **好情况下时间复杂度为O（n）** 如果数组恰好是倒=倒序，比如原始数组是 5 4 3 2 1，想要排成从小到大，则每一趟前面 的数都要往后移，一共要执行n-1 + n-2 + … + 2 + 1 = n * (n-1) / 2 = 0.5 * n [2] - 0.5 * n 次，去掉低次幂及系数，所以 最坏情况下时间 **复杂度为O（n [2] ）**

## 平均时间复杂度(n+n [2] )/2，所以 平均时间复 **杂度为O（n [2] ）** 

## 2. 空间复杂度： 插入排序算法，只需要两个变 量暂存当前数，以及下标，与n的大小无关， 所以 空间复杂度为：O（1）

# **四、Java代码实现**

```java
public class InsertSort {
    public static void main(String[] args) {
        int[] ints = ArrayGenerateUtil.getRandomArray(1000);
        //int[] ints = new int[]{23,24,54,-324,2,1,1,1,98};
        insertSort(ints);
        for (int anInt : ints) {
            System.out.print(anInt + " ");
        }
        System.out.println();
    }


    public static void insertSort(int[] arr) {
        long beginTime = System.currentTimeMillis();
        System.out.println("插入排序开始... " + beginTime);
        for (int i = 1; i < arr.length; i++) {
            int insertIndex = i;
            int insertValue = arr[i];
            while (insertIndex > 0 && insertValue < arr[insertIndex - 1]) {
                arr[insertIndex] = arr[insertIndex - 1];
                insertIndex--;
            }
            arr[insertIndex] = insertValue;
        }
        long endTime = System.currentTimeMillis();
        System.out.println("插入排序结束... " + endTime);
        System.out.println("本次排序耗时" + (endTime - beginTime));
    }
}


public class ArrayGenerateUtil {


    /**
    * 随机生成num个数的数组
    * @param num 传进来的数组个数
    * @return 数组
    */
    public static int[] getRandomArray(int num) {
        Random random = new Random();
        //动态初始化一个长度为num的数组
        int [] ints = new int[num];
        for (int i = 0; i <ints.length ; i++) {
            // 调用Random 通过遍历的形式为数组赋初值。
            ints[i] = random.nextInt(num);
        }


        for (int value : ints) {
            System.out.print(value + " ");
        }
        System.out.println();
        return ints;
    }


}
```


**4、希尔排序**


**笔记本：** 排序


**创建时…** 2021/10/7 16:08 **更新时…** 2021/10/8 2:06

**作者：** 彼岸樱速

# **一、动图演示** 

<img src="/img/Sort.pdf-12-0.gif">

<img src="/img/Sort.pdf-12-1.gif">

# **二、思路分析**

## **希尔排序是把记录按下标的一定增量分组，** **对每组使用直接插入排序算法排序；随着增** **量逐渐减少，每组包含的关键词越来越多，** **当增量减至1时，整个文件恰被分成一组，** **算法便终止。** 



　　简单插入排序很循规蹈矩，不管数组分布是怎么样的，依然一步一步的对元素进行比较，移动，插入，比如[5,4,3,2,1,0]这种倒序序列，数组末端的0要回到首位置很是费劲，比较和移动元素均需n-1次。　　

​        而希尔排序在数组中采用跳跃式分组的策略，通过某个增量将数组元素划分为若干组，然后分组进行插入排序，随后逐步缩小增量，继续按组进行插入排序操作，直至增量为1。希尔排序通过这种策略使得整个数组在初始阶段达到从宏观上看基本有序，小的基本在前，大的基本在后。然后缩小增量，到增量为1时，其实多数情况下只需微调即可，不会涉及过多的数据移动。　　

​        来看下希尔排序的基本步骤，在此选择增量gap=length/2，缩小增量继续以gap = gap/2的方式，这种增量选择可以用一个序列来表示，{n/2,(n/2)/2...1}，称为**增量序列**。希尔排序的增量序列的选择与证明是个数学难题，选择的这个增量序列是比较常用的，也是希尔建议的增量，称为希尔增量，但其实这个增量序列不是最优的。此处做示例使用希尔增量。

<img src="/img/Sort.pdf-14-0.png">

# **三、复杂度分析**

## 1. 时间复杂度： 最坏情况下，每两个数都要比 较并交换一次，则 最坏情况下的时间复杂度为 O（n [2] ）, 最好情况下，数组是有序的，不需要 交换，只需要比较，则 最好情况下的时间复杂 **度为O（n）。**

##  经大量人研究，希尔排序的 平均时间复杂度为 O（n [1.3] ） （这个我也不知道咋来的，书上和博 客上都这样说，也没找到个具体的依 据，，，）。 

## 2. 空间复杂度： 希尔排序，只需要一个变量用 于两数交换，与n的大小无关，所以 空间复杂 **度为：O（1）。**


# **四、Java 代码如下**

```java
/**
* 希尔排序
*/
public class ShellSort {
    public static void main(String[] args) {
        int[] ints = ArrayGenerateUtil.getRandomArray(1000);
        //int[] ints = new int[]{23,24,54,-324,2,1,1,1,98};
        shellSort(ints);
        for (int anInt : ints) {
            System.out.print(anInt + " ");
        }
    }


    public static void shellSort(int[] arr) {
        long beginTime = System.currentTimeMillis();
        System.out.println("希尔排序开始... " + beginTime);
        //gap步长
        for (int gap = arr.length / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < arr.length; i++) {
                //插入式 间隔为gap的插入排序
                int insertIndex = i;
                int insertValue = arr[i];
                while (insertIndex - gap >= 0 && insertValue < arr[insertIndex - gap]) {
                    arr[insertIndex] = arr[insertIndex - gap];
                    insertIndex -= gap;
                }
                arr[insertIndex] = insertValue;
            }
        }
        long endTime = System.currentTimeMillis();
        System.out.println("希尔排序结束... " + endTime);
        System.out.println("本次排序耗时" + (endTime - beginTime));
    }
}


public class ArrayGenerateUtil {


    /**
    * 随机生成num个数的数组
    * @param num 传进来的数组个数
    * @return 数组
    */
    public static int[] getRandomArray(int num) {
        Random random = new Random();
        //动态初始化一个长度为num的数组
        int [] ints = new int[num];
        for (int i = 0; i <ints.length ; i++) {
            // 调用Random 通过遍历的形式为数组赋初值。
            ints[i] = random.nextInt(num);
        }


        for (int value : ints) {
            System.out.print(value + " ");
        }
        System.out.println();
        return ints;
    }


}
```

**5、快速排序**


**笔记本：** 排序


**创建时…** 2021/10/8 0:58 **更新时…** 2021/10/8 2:06


**作者：** 彼岸樱速

## **动图** 

<img src="/img/Sort.pdf-17-0.gif">

## **由来**

```
快速排序（Quicksort）是对冒泡排序的一种改进。 快速排序由C. A. R.Hoare在1960年提出。它的基本思想是：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。
```


## **简介**

```
快速排序算法首先会在序列中随机选择一个基准值（pivot），然后将除了基准值以外的数分
为“比基准值小的数”和“比基准值大的数”这两个类别，再将其排列成以下形式。
[ 比基准值小的数] 基准值 [ 比基准值大的数]
接着，对两个“[ ]”中的数据进行排序之后，整体的排序便完成了。
对“[ ]”里面的数据 进行排序时同样也会使用快速排序。
```


## **图解**

一、场景：对 6 1 2 7 9 3 4 5 10 8 这 10 个数进行排
序
二、思路：
先找一个基准数（一个用来参照的数），为了方便，我
们选最左边的 6，希望将 >6 的放到 6 的右边，<6 的
放到 6 左边。
如：3 1 2 5 4 6 9 7 10 8

先假设需要将 6 挪到的位置为 k，k 左边的数 <6，右
边的数 >6
（1）我们先从初始数列“6 1 2 7 9 3 4 5 10 8 ”的两
端开始“探测 ”，先从右边往左找一个 <6 的数，再
从左往右找一个 >6 的数，然后交换。我们用变量 i 和
变量 j 指向序列的最左边和最右边。刚开始时最左边

i=0 指向 6，最右边 j=9 指向 8 ；

<img src="/img/Sort.pdf-18-0.png">

（2）现在设置的基准数是最左边的数，所以序列先右
往左移动（j–），当找到一个 <6 的数（5）就停下
来。
接着序列从左往右移动（i++），直到找到一个 >6 的
数又停下来（7）；
（3）两者交换，结果：6 1 2 5 9 3 4 7 10 8；

<img src="/img/Sort.pdf-18-1.png">

（4）j 的位置继续向左移动（友情提示：每次都必须
先从 j 的位置出发），发现 4 满足要求，接着 i++ 发
现 9 满足要求，交换后的结果：6 1 2 5 4 3 9 7 10
8；

<img src="/img/Sort.pdf-19-0.png">

（5）目前 j 指向的值为 9，i 指向的值为 4，j-- 发现
3 符合要求，接着 i++ 发现 i=j，说明这一轮移动结束
啦。现在将基准数 6 和 3 进行交换，结果：3 1 2 5 4
6 9 7 10 8；现在 6 左边的数都是 <6 的，而右边的数
都是 >6 的，但游戏还没结束

<img src="/img/Sort.pdf-19-1.png">

（6）我们将 6 左边的数拿出来先：3 1 2 5 4，这次以 3 为基准数进行调整，使得 3 左边的数 ❤️，右边的数 >3，根据之前的模拟，这次的结果：2 1 3 5 4

（7）再将 2 1 抠出来重新整理，得到的结果： 1 2

（8）剩下右边的序列：9 7 10 8 也是这样来搞，最终的结果： 1 2 3 4 5 6 7 8 9 10 （具体看下图）

<img src="/img/Sort.pdf-20-0.png">

快速排序的每一轮处理其实就是将这一轮的基准数归
位，当所有的基准数归位，排序就结束啦


Java代码实现
```java
/**
* 快速排序
*/
public class QuickSort {
    public static void main(String[] args) {
        int[] ints = ArrayGenerateUtil.getRandomArray(1000);
        //int[] ints = new int[]{23, -9, 78, 3, 34,3, 0, 34,23};
        long beginTime = System.currentTimeMillis();
        System.out.println("快速排序开始... " + beginTime);
        quickSort(ints, 0, ints.length - 1);
        long endTime = System.currentTimeMillis();
        System.out.println("快速排序结束... " + endTime);
        System.out.println("本次排序耗时" + (endTime - beginTime));
        System.out.println(Arrays.toString(ints));
    }


    public static void quickSort(int[] arr, int left, int right) {


        if (left >= right) {
            //递归调用函数结束
            return;
        }
        int l = left;
        int r = right;
        while (l < r) {
            //每次都以arr[left]为标准进行对比
            while (l < r && arr[r] >= arr[left]) r--;
            while (l < r && arr[l] <= arr[left]) l++;
            //两次循环后，最终是l==r 此时arr[r]一定小于等于arr[left]
            if (r == l) {
                //此时该循环就结束了
                int temp = arr[r];
                arr[r] = arr[left];
                arr[left] = temp;
            } else {
                int temp = arr[r];
                arr[r] = arr[l];
                arr[l] = temp;
            }
        }
        //此时r == l 索引r左边的元素小于arr[r] 索引r右边的元素大于arr[r];
        //在分别对左右部分进行快排
        quickSort(arr, left, l - 1);
        quickSort(arr, r + 1, right);
    }


}
public class ArrayGenerateUtil {


    /**
    * 随机生成num个数的数组
    * @param num 传进来的数组个数
    * @return 数组
    */
    public static int[] getRandomArray(int num) {
        Random random = new Random();
        //动态初始化一个长度为num的数组
        int [] ints = new int[num];
        for (int i = 0; i <ints.length ; i++) {
            // 调用Random 通过遍历的形式为数组赋初值。
            ints[i] = random.nextInt(num);
        }


        for (int value : ints) {
            System.out.print(value + " ");
        }
        System.out.println();
        return ints;
    }


}
```


**6、归并排序**


**笔记本：** 排序


**创建时…** 2021/10/8 1:15 **更新时…** 2021/10/8 2:05

**作者：** 彼岸樱速

# **一、动图演示** 

<img src="/img/Sort.pdf-23-0.gif">

<img src="/img/Sort.pdf-23-1.gif">

# **二、思路分析**



## 归并排序就是递归得将原始数组递归对半分 隔，直到不能再分（只剩下一个元素）后，开 始从最小的数组向上归并排序 

## 1. 向上归并排序的时候，需要一个暂存数组用 来排序， 

## 2. 将待合并的两个数组，从第一位开始比较， 小的放到暂存数组，指针向后移， 

## 3. 直到一个数组空，这时，不用判断哪个数组 空了，直接将两个数组剩下的元素追加到暂存 数组里， 

## 4. 再将暂存数组排序后的元素放到原数组里， 两个数组合成一个，这一趟结束。 

## **根据思路分析，每一趟的执行流程如下图所** **示：**

<img src="/img/Sort.pdf-24-0.png">

# **三、负杂度分析**

## 1. 时间复杂度： 递归算法的时间复杂度公式： **T[n] = aT[n/b] + f(n)**



<img src="/img/Sort.pdf-25-0.png">

## 无论原始数组是否是有序的，都要递归分隔并 向上归并排序，所以 时间复杂度始终是O **（nlog 2 n）** 

## **2. 空间复杂度：** 每次两个数组进行归并排序的时候，都会 利用一个长度为n的数组作为辅助数组用于保 存合并序列，所以 空间复杂度为O（n）

# **四、Java 代码**

```java
/**
* 归并排序
*/
public class MergeSort {
    public static void main(String[] args) {
        int[] ints = ArrayGenerateUtil.getRandomArray(1000);
        //int[] ints = new int[]{23, -9, 78, 3, 34,3, 0, 34,23};
        //临时存储合并之后的数组
        int[] temp = new int[ints.length];


        long beginTime = System.currentTimeMillis();
        System.out.println("归并排序开始... " + beginTime);
        mergeSort(ints,temp,0,ints.length-1);
        long endTime = System.currentTimeMillis();
        System.out.println("归并排序结束... " + endTime);
        System.out.println("本次排序耗时" + (endTime - beginTime));
        System.out.println(Arrays.toString(ints));
    }


    /**
    * @param sourceArray 要排序的源数据
    * @param temp 临时数据，因为归并时需要借用一个临时的数据
    * @param first 要排序的数组起始索引
    * @param end 要排序的数组结束索引
    */
    public static void mergeSort(int[] sourceArray, int[] temp, int first, int end) {
        //首先判断一下当前数组要排序是否只有一个元素，这个是返回条件
        if (first == end) {
            return;
        }


        int mid = (first + end) / 2;
        //前一段
        mergeSort(sourceArray, temp, first, mid);
        //后一段
        mergeSort(sourceArray, temp, mid + 1, end);
        //两段都返回时进行归并排序
        merge(sourceArray,temp,first,mid,end);
    }


    //mid 是包含在前段 升序
    public static void merge(int[] sourceArray, int[] temp, int first, int mid, int end) {
        //首先记住起始位置
        int firstIndex = first;
        //长度
        int n = end - first + 1;
        int secondFirst = mid+1;
        int j=0; //临时索引
        while (first<=mid && secondFirst<=end){
            if(sourceArray[first]<=sourceArray[secondFirst]){
                temp[j++]=sourceArray[first++]; //后移一个
            } else{
                temp[j++] = sourceArray[secondFirst++];
            }
        }


        //考虑没有移动完的数据
        //前一段
        while (first<=mid){
            temp[j++] = sourceArray[first++];
        }


        //后一段
        while (secondFirst<=end){
            temp[j++] = sourceArray[secondFirst++];
        }


        //最后将临时数据拷贝到源数组，这区间数据代表排序完成
        for(int i=0;i<n;i++){
            sourceArray[firstIndex++]=temp[i];
        }
    }
}


public class ArrayGenerateUtil {


    /**
    * 随机生成num个数的数组
    * @param num 传进来的数组个数
    * @return 数组
    */
    public static int[] getRandomArray(int num) {
        Random random = new Random();
        //动态初始化一个长度为num的数组
        int [] ints = new int[num];
        for (int i = 0; i <ints.length ; i++) {
            // 调用Random 通过遍历的形式为数组赋初值。
            ints[i] = random.nextInt(num);
        }


        for (int value : ints) {
            System.out.print(value + " ");
        }
        System.out.println();
        return ints;
    }


}
```


**7、基数排序**


**笔记本：** 排序


**创建时…** 2021/10/8 1:46 **更新时…** 2021/10/8 2:05


**作者：** 彼岸樱速

# **一、动图** 

<img src="/img/Sort.pdf-28-0.gif">

# **二、思路分析**

## 基数排序第i趟将待排数组里的每个数的i位 数放到tempj（j=1-10）队列中，然后再 从这十个队列中取出数据，重新放到原数 组里，直到i大于待排数的最大位数。 

## 1.数组里的数最大位数是n位，就需要排n 趟，例如数组里最大的数是3位数，则需要 排3趟。 

## 2.若数组里共有m个数，则需要十个长度为 m的数组tempj（j=0-9）用来暂存i位上数 为j的数，例如，第1趟，各位数为0的会被 分配到temp0数组里，各位数为1的会被分 配到temp1数组里...... 

## 3.分配结束后，再依次从tempj数组中取出 数据，遵循先进先进原则，例如对数组{1， 11，2，44，4}，进行第1趟分配后，

## temp1={1,11}，temp2={2}，temp4= {44，4}，依次取出元素后{1，11，2， 44，4}，第一趟结束 

## 4.循环到n趟后结束，排序完成 

## **根据思路分析，每一趟的执行流程如下图所** **示：** 通过基数排序对数组{53, 3, 542, 748, 14, 214, 154, 63, 616}：

<img src="/img/Sort.pdf-29-0.png">

# **三、负杂度分析**

## **1. 时间复杂度：** 每一次关键字的桶分配都需要O(n)的时间 复杂度，而且分配之后得到新的关键字序 列又需要O(n)的时间复杂度。 

## 假如待排数据可以分为d个关键字，则基数 排序的时间复杂度将是O(d*2n) ，当然d要 远远小于n，因此基本上还是线性级别的。 *

## *系数2可以省略，且无论数组是否有序，都 需要从个位排到最大位数，所以 时间复杂度始终为O(d*n) 。其中，n是数组长度，d 是最大位数。

## **2. 空间复杂度：** 基数排序的 空间复杂度为O(n+k) ，其中k 为桶的数量，需要分配n个数。

# **四、Java 代码如下**

```java
/**
* 基数排序
*/
public class RadixSort {
    public static void main(String[] args) {
        int[] ints = ArrayGenerateUtil.getRandomArray(1000);
        //int[] ints = new int[]{24,74, 3, 34,14, 4, 34,3434,24,3435,324,544,234,124};
        //临时存储合并之后的数组
        long beginTime = System.currentTimeMillis();
        System.out.println("基数排序开始... " + beginTime);
        radixSort(ints);
        long endTime = System.currentTimeMillis();
        System.out.println("基数排序结束... " + endTime);
        System.out.println("本次排序耗时" + (endTime - beginTime));
        System.out.println(Arrays.toString(ints));
    }


    public static void radixSort(int[] arr) {
        int[][] bucket = new int[10][arr.length];
        int[] bucketElementCounts = new int[10];
        //求出数组中高度最大值的位数（最大值拥有最大位数）
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (max < arr[i]) max = arr[i];
        }
        int maxCount = (max + "").length(); //小技巧：将数转换成字符串，其长度即是其位数
        for (int i = 0; i < maxCount; i++) {
            //将arr数组中的每个数存在bucket二维数组中 一维数组bucketElementCount用于记录每个桶所存的数的个数
            for (int k = 0; k < arr.length; k++) {
                int value = arr[k] / (int)Math.pow(10, i) % 10;
                bucket[value][bucketElementCounts[value]] = arr[k];
                bucketElementCounts[value]++;
            }
            int index = 0;
            //多次循环后，最终将bucket中最后存的所有数按顺序赋值给arr
            for (int k = 0; k < bucketElementCounts.length; k++) {
                if (bucketElementCounts[k] != 0) {
                    for (int x = 0; x < bucketElementCounts[k]; x++) {
                        arr[index] = bucket[k][x];
                        index++;
                    }
                }
                //对k进行清0，用于下一循环
                bucketElementCounts[k] = 0;
            }
        }
    }
}


public class ArrayGenerateUtil {


    /**
    * 随机生成num个数的数组
    * @param num 传进来的数组个数
    * @return 数组
    */
    public static int[] getRandomArray(int num) {
        Random random = new Random();
        //动态初始化一个长度为num的数组
        int [] ints = new int[num];
        for (int i = 0; i <ints.length ; i++) {
            // 调用Random 通过遍历的形式为数组赋初值。
            ints[i] = random.nextInt(num);
        }


        for (int value : ints) {
            System.out.print(value + " ");
        }
        System.out.println();
        return ints;
    }


}
```


**8、堆排序**


**笔记本：** 排序


**创建时…** 2021/10/8 1:58 **更新时…** 2021/10/8 2:05


**作者：** 彼岸樱速

# **一、动图演示** 

<img src="/img/Sort.pdf-32-0.gif">

# **二、思路分析**

## 先来了解下堆的相关概念：堆是具有以下性 质的完全二叉树：每个结点的值都大于或等于其 左右孩子结点的值，称为大顶堆；或者每个结点 的值都小于或等于其左右孩子结点的值，称为小 顶堆。如下图： 

<img src="/img/Sort.pdf-32-1.png">

## 同时，我们对堆中的结点按层进行编号，将这种 逻辑结构映射到数组中就是下面这个样子

<img src="/img/Sort.pdf-33-0.png">

## 该数组从逻辑上讲就是一个堆结构，我们用简单 的公式来描述一下堆的定义就是： 

## **大顶堆：arr[i] >= arr[2i+1] && arr[i]** **>= arr[2i+2]** 

## **小顶堆：arr[i] <= arr[2i+1] && arr[i]** **<= arr[2i+2]** 

## 了解了这些定义。接下来看看堆排序的基本思想 及基本步骤：

###  **堆排序基本思想及步骤** 

## 堆排序的基本思想是：将待排序序列构造 成一个大顶堆，此时，整个序列的最大值就是 堆顶的根节点。将其与末尾元素进行交换，此 时末尾就为最大值。然后将剩余n-1个元素重 新构造成一个堆，这样会得到n个元素的次小 值。如此反复执行，便能得到一个有序序列了 

## **步骤一 构造初始堆。将给定无序序列构造成一个** **大顶堆（一般升序采用大顶堆，降序采用小顶** **堆)。** a.假设给定无序序列结构如下

<img src="/img/Sort.pdf-34-0.png">

## 2.此时我们从最后一个非叶子结点开始（叶结点 自然不用调整，第一个非叶子结点 arr.length/2- 1=5/2-1=1，也就是下面的6结点），从左至 右，从下至上进行调整。 

<img src="/img/Sort.pdf-34-1.png">

## 3.找到第二个非叶节点4，由于[4,9,8]中9元素最 大，4和9交换。

<img src="/img/Sort.pdf-34-2.png">

## 这时，交换导致了子根[4,5,6]结构混乱，继续调 整，[4,5,6]中6最大，交换4和6。 

<img src="/img/Sort.pdf-35-0.png">

## 此时，我们就将一个无需序列构造成了一个大顶堆。 

## **步骤二 将堆顶元素与末尾元素进行交换，使末尾** **元素最大。然后继续调整堆，再将堆顶元素与末** **尾元素交换，得到第二大元素。如此反复进行交** **换、重建、交换。** 

## a.将堆顶元素9和末尾元素4进行交换 

<img src="/img/Sort.pdf-35-1.png">

## b.重新调整结构，使其继续满足堆定义 

<img src="/img/Sort.pdf-35-2.png">

## c.再将堆顶元素8与末尾元素5进行交换，得到第 二大元素8.

<img src="/img/Sort.pdf-36-0.png">

## 后续过程，继续进行调整，交换，如此反复进 行，最终使得整个序列有序 

<img src="/img/Sort.pdf-36-1.png">

## 再简单总结下堆排序的基本思路： 

## **a.将无序序列构建成一个堆，根据升序降序** **需求选择大顶堆或小顶堆;** 

## **b.将堆顶元素与末尾元素交换，将最大元** **素"沉"到数组末端;** 

## **c.重新调整结构，使其满足堆定义，然后继** **续交换堆顶元素与当前末尾元素，反复执行调整** **+交换步骤，直到整个序列有序。**

# **三、复杂度分析**



## 1. 时间复杂度： 堆排序是一种选择排序，整体 主要由构建初始堆+交换堆顶元素和末尾元素并 重建堆两部分组成。其中构建初始堆经推导复杂 度为O(n)，在交换并重建堆的过程中，需交换n- 1次，而重建堆的过程中，根据完全二叉树的性 质，[log2(n-1),log2(n-2)...1]逐步递减，近似为 nlogn。所以堆排序时间复杂度最好和最坏情况 下都是 O(nlogn) 级。 

## 2. 空间复杂度： 堆排序不要任何辅助数组，只 需要一个辅助变量，所占空间是常数与n无关， 所以 空间复杂度为O(1) 。

# **四、Java 代码如下**

```java
/**
* 堆排序
*/
public class HeapSort {
    public static void main(String[] args) {
        int[] ints = ArrayGenerateUtil.getRandomArray(1000);
        //int[] ints = new int[]{4,6,8,5,9};
        int length = ints.length;


        long beginTime = System.currentTimeMillis();
        System.out.println("堆排序开始... " + beginTime);
        //从最后一个非叶节点开始构建大顶堆
        for (int i = ints.length/2-1; i >=0; i--) {
            maximumHeap(i,ints,length);
        }
        //从最小的叶子节点开始与根节点进行交换并重新构建大顶堆
        for (int i = ints.length-1; i >=0; i--) {
            //System.out.println(Arrays.toString(arr));
            swap(ints,0,i);
            length--;
            maximumHeap(0,ints,length);
        }
        long endTime = System.currentTimeMillis();
        System.out.println("堆排序结束... " + endTime);
        System.out.println("本次排序耗时" + (endTime - beginTime));
        System.out.println(Arrays.toString(ints));
    }


    //构建大顶堆
    public static void maximumHeap(int i,int[] arr,int length) {
        int temp = arr[i];
        for (int j = i*2+1; j < length; j=j*2+1) {
            //如果右孩子大于做孩子，则指向右孩子
            if(j+1 < length && arr[j+1] > arr[j]) {
                j++;
            }
            //如果最大的孩子大于当前节点，则将大孩子赋给当前节点，修改当前节点为其大孩子节点，再向下走。
            if(arr[j]>temp) {
                arr[i] = arr[j];
                i = j;
            } else {
                break;
            }
        }
        //将temp放到最终位置
        arr[i] = temp;
    }


    //交换
    public static void swap(int[] arr,int i,int j){
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}


public class ArrayGenerateUtil {


    /**
    * 随机生成num个数的数组
    * @param num 传进来的数组个数
    * @return 数组
    */
    public static int[] getRandomArray(int num) {
        Random random = new Random();
        //动态初始化一个长度为num的数组
        int [] ints = new int[num];
        for (int i = 0; i <ints.length ; i++) {
            // 调用Random 通过遍历的形式为数组赋初值。
            ints[i] = random.nextInt(num);
        }


        for (int value : ints) {
            System.out.print(value + " ");
        }
        System.out.println();
        return ints;
    }


}
```
