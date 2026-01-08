# Excel
---
aliases:
  - excel
标题: excel
---
**opencsv解析文件**


**笔记本：** excel


**创建时间：** 2021/11/16 11:43 **更新时间：** 2023/6/5 11:13


**作者：** 彼岸樱速


**opencsv解析文件**


文件导入数据库，excel可以用easyexcel实现，csv则可以用opencsv。（本来excel的写好了，又突然说换csv
格式）

研究了下，比较简单，优点是csv文件体积小，占用内存小（需求改就是因为这个），里面是用多线程读取和
转换为bean的。

```xml
<dependency>
                <groupId>com.opencsv</groupId>
                <artifactId>opencsv</artifactId>
                <version>5.1</version>
 </dependency>
```


```java
public class CsvTest {
    @Test
    public void simpleRead() throws IOException, CsvValidationException {
        InputStream ins = this.getClass().getClassLoader().getResourceAsStream("test1.csv");
        CSVReader reader = new CSVReader(new InputStreamReader(ins));
        String[] record;
        while ((record = reader.readNext()) != null){
            System.out.println(record);
        }
    }


    @Test
    public void testcsv1(){
        InputStream ins = this.getClass().getClassLoader().getResourceAsStream("test1.csv");
        List<CvsBean> list = CsvUtils.parseCsvToList(ins, CvsBean.class);
        System.out.println(list);
    }
}




public class CsvUtils {
    public static <T> List<T> parseCsvToList(InputStream ins, Class<T> clazz) {
        InputStreamReader reader = new InputStreamReader(ins, StandardCharsets.UTF_8);


　　　　　List<T> list = new CsvToBeanBuilder<T>(reader)
            .withType(clazz)
            .build()
            .parse();




        /*BeanVerifier beanVerifier = new BeanVerifier<CvsBean>() {
            @Override
            public boolean verifyBean(CvsBean bean) throws CsvConstraintViolationException {
                //name张三的记录过滤
                return !bean.getName().equals("张三");
            }
        };


        HeaderColumnNameMappingStrategy<T> mappingStrategy = new HeaderColumnNameMappingStrategy<>();
        mappingStrategy.setType(clazz);
        List<T> list = new CsvToBeanBuilder<T>(reader)
            .withMappingStrategy(mappingStrategy)
            .withSeparator(',')
            .withVerifier(beanVerifier)
            .build()
            .parse();*/
        return list;
    }
}

@ToString
@Data
public class CvsBean {
    //column 文件流的column值，required :true 文件流必须包含此属性的列，否则报错
    @CsvBindByName(column = "test", required = true)
    String testaaaa;
    @CsvBindByName(column = "name", required = true)
    String name;
    @CsvBindByName(column = "age", required = true)
    Integer age;
    @CsvBindByName(column = "address", required = true)
    String address;
    @CsvBindByName(column = "sex", required = true)
    String sex;
    // @CsvBindByName(column = "sadfsex", required = false)
    //文件流无，值为null
    String sadfsex;
}
```

```
test.csv　　//测试文件
test,name,age,address,sex
12,张三,23,asdf,难
as,李四,23,a是否,难
asd,王五,144,阿道夫,女
```

注意文件格式，csv文件格式为utf8编码格式，不注意会出问题！！！


数据全部解析到list中，如果数据量太大也得注意下！里面应该有解析多少行数据的选项。

![excel.pdf-1-1.png](/img/excel.pdf-1-1.png)



-------------------------------分割线--------------------------------------------------

再贴两个工具类，用于解析大文件，防止oom等，操作数据库时间超时




```java
public class CsvUtils {
    static private int BATCH_COUNT = 3000;
     
    public static <T> void parseCsvToList(InputStream ins, Class<T> clazz, Consumer<List<T>> consumer) {
        List list = new ArrayList<>(BATCH_COUNT);
        InputStreamReader reader = new InputStreamReader(ins, StandardCharsets.UTF_8);
        Iterator<T> iterator = new CsvToBeanBuilder<T>(reader)
                .withType(clazz)
                .build()
                .iterator();
         
        while (iterator.hasNext()){
            if (list.size() >= BATCH_COUNT){
                consumer.accept(list);
                list.clear();
            }
            T next = iterator.next();
            list.add(next);
        }
         
        if (list.size() != 0){
            consumer.accept(list);
        }
    }
}
```


`//` 测试方法

```
 CsvUtils.parseCsvToList(ins,CvsBean.class,s -> testDao.Insert(s));

```

另外再贴个easyexcel的工具包，一样的操作，其他细节忽略了

```java
public class EasyExcelUtil {
    public static <T> AnalysisEventListener<T> getListener(Consumer<List<T>> consumer,final int batchCount){
        AnalysisEventListener<T> analysisEventListener = new AnalysisEventListener<T>() {
            List list = new ArrayList(batchCount);
 
            @Override
            public void invoke(T data, AnalysisContext analysisContext) {
                list.add(data);
                if (list.size() >= batchCount) {
                    consumer.accept(list);
                    list.clear();
                }
            }
 
            @Override
            public void doAfterAllAnalysed(AnalysisContext analysisContext) {
                if (list.size() != 0) {
                    consumer.accept(list);
                }
            }
        };
        return analysisEventListener;
    }
}
```

```
//测试方法
EasyExcel.read(fileName, Dtodata.class, EasyExcelUtil.getListener(list -> demoDAO.save(list),3000))
.sheet()
.doRead();
```




