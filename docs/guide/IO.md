# IO
---
aliases:
  - IO
标题: IO
---
**前端js以application/octet-stream方式上传文件**


**笔记本：** IO


**创建时间：** 2024/3/1 18:30 **更新时间：** 2024/3/1 18:32

## **前端js以application/octet-stream方式上传文件**


今天又学会了一种上传文件的文件流方法。
本人后端采用了CXF框架实现的


**api层**

```
 package com inspur gs tax tbs utils. . . . . ;

 import org glassfish jersey media multipart. . . . .FormDataParam;
 import javax activation. .DataHandler;
 import javax jws. .WebParam;
 import javax ws rs. . .*;
 import javax ws rs core. . . .MediaType;
 import javax xml bind annotation. . . .XmlMimeType;
 import java awt. .*;
 import java io. .InputStream;
 /**
 * @author Guangpei Xia
 * @create 2021-08-29-10:51
 */
 @Consumes(MediaType. APPLICATION_OCTET_STREAM )
 @Produces(MediaType. APPLICATION_JSON )
 public interface ITaxImport {
 @Path("/importexcel")
 @POST
 String importexcel(@XmlMimeType("application/octet-stream") DataHandler dataHandler,
 @QueryParam("endpoint")String endpoint,
 @QueryParam("method")String method );
 }

```

**前端js**

```
 function confirmUpload() {
   var theFile = $("#uploadFile");

   var file = theFile [0]. files [0];
   var reader = new FileReader();

```

`reader` `.readAsArrayBuffer(` `file` `);` _`//`_ 这个读法是异步的
```
 reader .onloadend = function(){

```

_`//`_ 这个事件在读取结束后，无论成功或者失败都会触发
```
    if ( reader . error ) {

            " "
 idp .error( 文件读取失败 );
    } else {

      upload( url, reader . result, sucess, error );
    }

   }
 }
```

_`//`_ 文件上传
```
    function upload(url,binary,successCallback, errorCallback){
      var xhr = new XMLHttpRequest();
 xhr .open("POST", url );
 xhr .overrideMimeType("application/octet-stream");
```

_`//`_ 直接发送二进制数据

```
      if( xhr . sendAsBinary ){

```

```
 xhr .sendAsBinary( binary );
      }else{
 xhr .send( binary );

      }

```

_`//`_ 监听变化

```
 xhr .onreadystatechange = function(event){
        if( xhr . readyState ===4){

          if( xhr . status ===200){

            var jqXHR = event . target ;

```

_`//`_ 响应成功

```
            if ( successCallback ) {

              successCallback( jqXHR . responseText );
            }

          }else{
            if ( errorCallback ) {

              errorCallback( jqXHR . responseText );
            }

          }
        }

      }
    }

   }

 function sucess(data) {
```

_`//`_ 成功之后执行的方法

```
 var res = JSON.parse( data );
 }

 function error(data) {
```

_`//`_ 异常执行的方法
```
 var res = JSON.parse( data );

 onError && onError( res );
 }

```

**附上以form方式上传文件的方式**


_`// Form`_ 请求上传文件
```
    function importFileWithAjax(serverUrl, formData, successCallback, errorCallback) {
 $ .ajax({
 url : serverUrl, //Server script to process data

 type : 'POST',
        success: function completeHandler(data, textStatus, jqXHR) {
          if ( successCallback ) {
            successCallback( jqXHR . responseText );

          }
        },

        error: function errorHandler(jqXHR, textStatus, errorThrown) {
          if ( errorCallback ) {

            errorCallback( errorThrown );
          }

        },
 data : formData, // Form data

 cache : false,
 contentType : false,

 processData : false,
 headers : { //Options to tell server return data with specified type
          "Accept": "application/json"
        }

      });
    }

```

**Java Blob 转为 MultipartFile 发送请求**


**笔记本：** IO


**创建时间：** 2024/3/1 18:24 **更新时间：** 2024/3/1 18:28

# **Java Blob 转为 MultipartFile 发送请求**


在开发Web应用程序时，我们经常需要上传文件到服务器。而在Java中，常用的文件上传方式
是使用 `MultipartFile` 对象。但是有时候我们可能会遇到需要将 `Blob` 对象转换为 `MultipartFile` 对象的
情况，这篇文章将向您介绍如何进行这个转换并发送请求。


**Blob对象和MultipartFile对象**


在开始之前，我们先来了解一下 `Blob` 对象和 `MultipartFile` 对象。


**Blob对象**


`Blob` 对象是二进制大对象（Binary Large Object）的缩写，它表示一个不可变的、原始数据的
有序集合。在Web开发中， `Blob` 对象通常用于表示文件数据。


**MultipartFile对象**


`MultipartFile` 对象是Spring框架中用于处理文件上传的接口，它提供了一系列方法来获取文件的
名称、大小、内容等信息。


**Java中Blob转为MultipartFile的方法**


在Java中，要将 `Blob` 对象转换为 `MultipartFile` 对象，我们需要通过以下步骤来实现：


1. 创建一个临时文件。我们可以使用 `File.createTempFile()` 方法来创建一个临时文件。
2. 将 `Blob` 对象的数据写入临时文件。我们可以通过 `Blob` 对象的 `getBinaryStream()` 方法获取输入

流，然后使用 `FileOutputStream` 将数据写入临时文件。
3. 创建一个 `MultipartFile` 对象。我们可以使用 `MockMultipartFile` 类或者自己实现 `MultipartFile` 接

口的实现类来创建一个 `MultipartFile` 对象。
4. 发送请求。我们可以使用Spring的 `RestTemplate` 类或者其他网络请求库来发送包含

`MultipartFile` 对象的请求。


下面是一个完整的示例代码，演示了如何将Blob转换为MultipartFile并发送请求：

```
 // 引用所需的类
 import org.springframework.mock.web.MockMultipartFile;
 import org.springframework.web.multipart.MultipartFile;

 import java.io.File;
 import java.io.FileOutputStream;
 import java.io.InputStream;
 import java.sql.Blob;

 public class BlobToMultipartFileExample {

 public static MultipartFile convertBlobToMultipartFile(Blob blob) throws Exception {
 // 创建临时文件
 File tempFile = File.createTempFile("temp", null);

 try (InputStream inputStream = blob.getBinaryStream();
 FileOutputStream outputStream = new FileOutputStream(tempFile)) {

 // 将 Blob 对象的数据写入临时文件
 byte[] buffer = new byte[1024];
 int bytesRead;
 while ((bytesRead = inputStream.read(buffer)) != -1) {
 outputStream.write(buffer, 0, bytesRead);
 }
 }

 // 创建 MultipartFile 对象
 return new MockMultipartFile("file", tempFile.getName(), null, new
 FileInputStream(tempFile));
 }

```

```
 public static void main(String[] args) throws Exception {
 // 创建 Blob 对象，这里仅作为示例
 Blob blob = getBlobFromDatabase();

 // 将 Blob 对象转换为 MultipartFile 对象
 MultipartFile multipartFile = convertBlobToMultipartFile(blob);

 // 发送请求
 sendRequest(multipartFile);
 }

 private static Blob getBlobFromDatabase() {
 // 从数据库中获取 Blob 对象，这里仅作为示例
 return null;
 }

 private static void sendRequest(MultipartFile multipartFile) {
 // 发送包含 MultipartFile 对象的请求，这里仅作为示例
 }
 }

```

在上面的代码中，我们首先创建了一个临时文件 `tempFile` ，然后使用 `getBinaryStream()` 方法获取 `Blob`
对象的输入流，并使用 `FileOutputStream` 将输入流的数据写入临时文件。接下来，我们使用

`MockMultipartFile` 类创建了一个 `MultipartFile` 对象，并将临时文件作为文件内容传入。最后，我们
可以通过 `sendRequest()` 方法发送请求，传递 `MultipartFile` 对象。


**总结**


本文介绍了如何将Java中的Blob对象转换为MultipartFile对象，并发送包含MultipartFile对象
的请求。通过以上步骤，我们可以轻松地处理Blob对象，并使用Spring框架提供的功能来处理
文件上传。


当然，除了上述示例中使用的 `MockMultipartFile` 类外，您也可以自己实现MultipartFile接口的实
现类来创建 `MultipartFile` 对象。


**大文件分片上传前后端实现**


**笔记本：** IO


**创建时间：** 2024/3/1 15:34 **更新时间：** 2024/3/1 18:08


**URL：** https://blog.csdn.net/qq_32099833/article/details/109630499

## **大文件分片上传前后端实现** **最近在做公司的视频业务，涉及到大视频的上传。**


之前的图片、Excel等上传做的很简单，直接表单提交后端用MultipartFile接收保存到磁盘就行了。
但是针对大文件的上传，需要做额外的处理，否则可能会遇到如下问题：


1. 文件过大，超出服务端的请求大小限制(如SpringMVC，默认文件上传最大1MB)。


2. 请求的时间过长，请求超时。


3. 客户端网络不好的话，容易传输中断，必须整个文件重传。


为了解决这些问题，笔者研究了一下，发现可以用分片上传的方式来解决。


**前端处理**


大文件分片上传，是需要前端和后端配合操作的。


整体流程是：前端将大文件进行分片，例如一个50MB的文件，分成10片，每个片5MB。


然后发10个HTTP请求，将这10个分片数据发送给后端，后端根据分片的下标和Size来往磁盘文件的不同位置写


10个分片全部写完后即得到一个完整的文件。


**前端的处理流程如下：**


**前端实战代码如下：**



<img src="/img/IO.pdf-4-0.png">
```
 <!DOCTYPE html>
 <html lang="en">
 <head>
 <meta charset="UTF-8">
 <title> Title </title>

 <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
 <script src="https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.js"></script>
 </head>
 <body>
 <input type="file" name="file" id="file">
 <button id="upload" onClick="upload()"> upload </button>
 </body>
 </html>

 <script>
const sliceSize = 5 * 1024 * 1024; // 每个文件切片大小定为5MB
// 发送请求
 function upload() {
 const blob = document.getElementById("file").files[0];

const fileSize = blob.size; //文件大小
const fileName = blob.name; //文件名


//_ 计算文件切片总数
 const totalSlice = Math.ceil(fileSize / sliceSize);

// 循环上传
 for (let i = 1; i <= totalSlice; i++) {
 let chunk;
 if (i == totalSlice) {

// 最后一片
chunk = blob.slice((i - 1) * sliceSize, fileSize - 1);//切割文件

 } else {
 chunk = blob.slice((i - 1) * sliceSize, i * sliceSize);
 }
 const formData = new FormData();
 formData.append("file", chunk);
 formData.append("md5", md5(blob));
 formData.append("name", fileName);
 formData.append("size", fileSize);
 formData.append("chunks", totalSlice);
 formData.append("chunk", i);
 $.ajax({
 url: 'http://localhost:8080/chunk/upload',
 type: 'POST',
 cache: false,
 data: formData,
 processData: false,
 contentType: false,
 async: false
 });
 }
 }
 </script>

```

[笔者这里写了一个比较粗糙的前端例子，市面上有很多优秀的分片上传插件，例如：webuploader。](http://fex.baidu.com/webuploader/)


**后端处理**


后端接收到分片数据后，要根据分片的下标和分片的大小来往文件的指定位置写入分片数据。


例如：分片大小为1MB，第一个分片就要往文件的第0个字节开始，写入1048576字节的数据。第二个分片就要


据，以此类推。待所有的分片数据全部写入完成后，即得到一个完整的文件。


**后端处理流程如下：**


<img src="/img/IO.pdf-6-0.png">

**RandomAccessFile**


分片数据的写入，需要对文件进行定位，移动访问指针。


JDK提供了 `java.io.RandomAccessFile` 类，支持对文件进行随机的读写操作。


在Linux平台上，所有打开的文件都有一个文件描述符(FD)，文件描述符自身维护了一个文件偏移量(current file


通过 `lseek` 函数可以移动文件的读写指针，RandomAccessFile的 `seek()` 方法就是调用了Linux的 `lseek` 系统函数来实


**通过RandomAccessFile.seek()移动访问指针，然后写入分片数据。**


**后端处理代码如下：**

```
 @RestController
 public class FileController {
```

_`//`_ 存放文件的临时目录

```
   private static final String DATA_DIR = System .getProperty("user.dir") + "/temp/";
```

_`//`_ 文件 _`MD5`_ 的缓存容器

```
   private static final ConcurrentMap <String, File> MD5_CACHE = new ConcurrentHashMap<>();

   /**

```

_`*`_ 大文件分片上传
_`* @param name`_ 文件名
_`* @param md5`_ 文件 _`MD5`_ 值
_`* @param size`_ 文件大小
_`* @param chunks`_ 总的分片数
_`* @param chunk`_ 当前分片数
_`* @param multipartFile`_ 分片流
```
 * @throws IOException
 */
   @PostMapping("/chunk/upload")
   public void chunkUpload( String name,

 String md5,

 Long size,

```

<img src="/img/IO.pdf-7-0.png">








**重复读取inputStream**


**笔记本：** IO


**创建时间：** 2023/12/11 19:25 **更新时间：** 2023/12/11 19:28

## **重复读取inputStream**
```
   inputstream 只能读取一次，再次读取则无法获取到内容。
   这是因为 inputStream 的内部有个 pos 指针，当读取的时候指针会不断的移动, 当移动到末尾的时候, 就无法再次读取了。

```

**问题解决：**


**方法一：**


使用 **ByteArrayOutputStream** 将字节缓存，每次读取都从 **ByteArrayOutputStream** 里面获取。


获取ByteArrayOutputStream：

```
   public static ByteArrayOutputStream readInputStream(InputStream inputStream) throws IOEx

   ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

   byte[] buffer = new byte[1024];

   int len;

   while ((len = inputStream.read(buffer)) > -1) {

   outputStream.write(buffer, 0, len);

   }

   outputStream.flush();

   return outputStream;

   }

```

我们将inputStream中的数据读取到 **outputStream** 之中，然后需要使用Inputstream的时候字节将outputst

```
   InputStream inputStream1 = new ByteArrayInputStream(outputStream.toByteArray());

   InputStream inputStream2 = new ByteArrayInputStream(outputStream.toByteArray());

```

缺点是如果读取的Inputstream内容很大，使用时会造成很大的内存消耗。


**方法二：**


使用 **inputStream** 中操作指针的方法 **mark** 和 **reset** ，两个方法分别为标记和重置，


在使用 **inputstream** 之前我们使用mark标记一下指针的位置，读取完成后使用reset重置指针的位置。

```
   String text = "测试inputStream内容";

   InputStream rawInputStream = new ByteArrayInputStream(text.getBytes());

   byte[] readArray = new byte[1024];

   rawInputStream.mark(0);

   System.out.println(DigestUtils.md5Hex(rawInputStream));

   rawInputStream.reset();

   int readCount2 = rawInputStream.read(readArray);

   System.out.println("读取了" + readCount2 + "个字节");

```

这样就可以重复使用inputStream的内容了


**漫画图解java开发之IO阻塞、非阻塞、同步、异步**


**笔记本：** IO


**创建时间：** 2021/8/10 17:44 **更新时间：** 2021/8/10 18:05


**作者：** 彼岸樱速



<img src="/img/IO.pdf-9-0.png">

<img src="/img/IO.pdf-9-1.png">

<img src="/img/IO.pdf-9-2.png">

<img src="/img/IO.pdf-9-3.png">
<img src="/img/IO.pdf-10-0.png">

<img src="/img/IO.pdf-10-1.png">

<img src="/img/IO.pdf-10-2.png">

**同步、异步、阻塞、非阻塞都是和IO（输入输出）有关的概念。最简单的文件读取就是IO操作。**


**而在文件读取这件事儿上，可以有多种方式。**



<img src="/img/IO.pdf-10-3.png">
<img src="/img/IO.pdf-11-0.png">

**什么是同步和异步**



<img src="/img/IO.pdf-11-1.png">



<img src="/img/IO.pdf-11-2.png">

<img src="/img/IO.pdf-11-3.png">

**什么是阻塞和非阻塞**



<img src="/img/IO.pdf-11-4.png">


<img src="/img/IO.pdf-12-0.png">

**阻塞、非阻塞和同步、异步的区别**



<img src="/img/IO.pdf-12-1.png">



<img src="/img/IO.pdf-12-2.png">

<img src="/img/IO.pdf-12-3.png">
<img src="/img/IO.pdf-13-0.png">

<img src="/img/IO.pdf-13-1.png">

<img src="/img/IO.pdf-13-2.png">

**Java中的三种IO模型**



<img src="/img/IO.pdf-13-3.png">



<img src="/img/IO.pdf-13-4.png">
<img src="/img/IO.pdf-14-0.png">

<img src="/img/IO.pdf-14-1.png">



<img src="/img/IO.pdf-14-2.png">

<img src="/img/IO.pdf-14-3.png">

<img src="/img/IO.pdf-14-4.png">
<img src="/img/IO.pdf-15-0.png">

<img src="/img/IO.pdf-15-1.png">

滴滴滴滴，这时候水壶响了，打断了女朋友的发问。女朋友去拿来烧好的热水，给我泡了一杯咖啡。



<img src="/img/IO.pdf-15-2.png">

<img src="/img/IO.pdf-15-3.png">
**Java BIO&NIO&AIO**


**笔记本：** IO


**创建时间：** 2021/8/10 17:01 **更新时间：** 2021/8/10 17:37


**作者：** 彼岸樱速

# **漫话：什么是BIO、NIO和AIO？**



<img src="/img/IO.pdf-16-0.png">

<img src="/img/IO.pdf-16-1.png">

<img src="/img/IO.pdf-16-2.png">
<img src="/img/IO.pdf-17-0.png">



<img src="/img/IO.pdf-17-2.png">



<img src="/img/IO.pdf-17-3.png">

<img src="/img/IO.pdf-17-4.png">
<img src="/img/IO.pdf-18-0.png">







<img src="/img/IO.pdf-18-4.png">







<img src="/img/IO.pdf-18-7.png">
<img src="/img/IO.pdf-19-0.png">

<img src="/img/IO.pdf-19-1.png">

<img src="/img/IO.pdf-19-2.png">



**首先，我们站在宏观的角度，重新画一下重点：**


**BIO （Blocking I/O）：同步阻塞I/O模式。**


**NIO （New I/O）：同步非阻塞模式。**


**AIO （Asynchronous I/O）：异步非阻塞I/O模型。**


**那么，同步阻塞、同步非阻塞、异步非阻塞都是怎么回事呢？关于这部分内容也可以查看《漫话：如何给女朋友解**
**[释什么是IO中的阻塞、非阻塞、同步、异步？》。](https://link.juejin.im/?target=http://mp.weixin.qq.com/s?__biz=Mzg3MjA4MTExMw==&mid=2247484751&idx=1&sn=e9c24082baeeea4df363af0a788d7fc2&chksm=cef5f6f9f9827fef26458b6ea7d794e4fd10b2596f271e986da708e267e7957440bc56663340&scene=21%23wechat_redirect)**


**同步阻塞模式：这种模式下，我们的工作模式是先来到厨房，开始烧水，并坐在水壶面前一直等着水烧开。**


**同步非阻塞模式：这种模式下，我们的工作模式是先来到厨房，开始烧水，但是我们不一直坐在水壶前面等，而是**
**回到客厅看电视，然后每隔几分钟到厨房看一下水有没有烧开。**


**异步非阻塞I/O模型：这种模式下，我们的工作模式是先来到厨房，开始烧水，我们不一一直坐在水壶前面等，也**
**不隔一段时间去看一下，而是在客厅看电视，水壶上面有个开关，水烧开之后他会通知我。**


**阻塞VS非阻塞：人是否坐在水壶前面一直等。**


**同步VS异步：水壶是不是在水烧开之后主动通知人。**



<img src="/img/IO.pdf-20-0.png">

<img src="/img/IO.pdf-20-1.png">

<img src="/img/IO.pdf-20-2.png">
<img src="/img/IO.pdf-21-0.png">



<img src="/img/IO.pdf-21-2.png">



<img src="/img/IO.pdf-21-3.png">

<img src="/img/IO.pdf-21-4.png">



**使用BIO实现文件的读取和写入。**


**public class** **Test** **{**
**public static voidmain(String[] args) {**
**//Initializes The Object**


**User user =** **new** **User();**
**user.setName("hollis");**
**user.setAge(23);**
**System.out.println(user);**

**//Write Obj to File**
**ObjectOutputStream oos =** **null;**
**try** **{**
**oos =** **new** **ObjectOutputStream(new** **FileOutputStream("tempFile"));**
**oos.writeObject(user);**
**}** **catch(IOException** **e) {**
**e.printStackTrace();**
**}** **finally** **{**
**IOUtils.closeQuietly(oos);**
**}**

**//Read Obj from File**
**File file =** **new** **File("tempFile");**
**ObjectInputStream ois =** **null;**
**try** **{**
**ois =** **new** **ObjectInputStream(new** **FileInputStream(file));**
**User newUser =** **(User) ois.readObject();**
**System.out.println(newUser);**
**}** **catch(IOException** **e) {**
**e.printStackTrace();**
**}** **catch(ClassNotFoundException** **e) {**
**e.printStackTrace();**
**}** **finally** **{**
**IOUtils.closeQuietly(ois);**
**try** **{**
**FileUtils.forceDelete(file);**
**}** **catch(IOException** **e) {**
**e.printStackTrace();**
**}**
**}**
**}**
**}**


**使用NIO实现文件的读取和写入。**



<img src="/img/IO.pdf-22-0.png">


<img src="/img/IO.pdf-23-0.png">

**使用AIO实现文件的读取和写入**


**public class** **ReadFromFile** **{**
**public static voidmain(String[] args)** **throws** **Exception** **{**
**Path file =** **Paths.get("/usr/a.txt");**
**AsynchronousFileChannel channel =** **AsynchronousFileChannel.open(file);**

**ByteBuffer buffer =** **ByteBuffer.allocate(100_000);**
**Future<Integer> result = channel.read(buffer,** **0);**

**while** **(!result.isDone()) {**
**ProfitCalculator.calculateTax();**
**}**
**Integer bytesRead = result.get();**
**System.out.println("Bytes read ["** **+ bytesRead +** **"]");**
**}**
**}**


**class** **ProfitCalculator** **{**
**public** **ProfitCalculator() {**
**}**

**public static voidcalculateTax() {**
**}**
**}**


**public class** **WriteToFile** **{**


**public static voidmain(String[] args)** **throws** **Exception** **{**
**AsynchronousFileChannel fileChannel =** **AsynchronousFileChannel.open(**
**Paths.get("/asynchronous.txt"),** **StandardOpenOption.READ,**
**StandardOpenOption.WRITE,** **StandardOpenOption.CREATE);**
**CompletionHandler<Integer,** **Object> handler =** **new** **CompletionHandler<Integer,** **Object>() {**

**@Override**
**public voidcompleted(Integer** **result,** **Object** **attachment) {**
**System.out.println("Attachment: "** **+** **attachment** **+** **" "** **+** **result**
**+** **" bytes written");**
**System.out.println("CompletionHandler Thread ID: "**
**+** **Thread.currentThread().getId());**
**}**

**@Override**
**public voidfailed(Throwable** **e,** **Object** **attachment) {**
**System.err.println("Attachment: "** **+** **attachment** **+** **" failed with:");**
**e.printStackTrace();**
**}**
**};**


**System.out.println("Main Thread ID: "** **+** **Thread.currentThread().getId());**
**fileChannel.write(ByteBuffer.wrap("Sample".getBytes()),** **0,** **"First Write",**
**handler);**
**fileChannel.write(ByteBuffer.wrap("Box".getBytes()),** **0,** **"Second Write",**
**handler);**

**}**
**}**



<img src="/img/IO.pdf-24-0.png">

<img src="/img/IO.pdf-24-1.png">

<img src="/img/IO.pdf-24-2.png">
<img src="/img/IO.pdf-25-0.png">

滴滴滴，水开了。



<img src="/img/IO.pdf-25-1.png">

<img src="/img/IO.pdf-25-2.png">
