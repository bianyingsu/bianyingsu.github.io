---
aliases:
  - Java工具
标题: Java工具
---
**【JProfile】JProfile工具**


**笔记本：** 工具


**创建时间：** 2024/10/21 4:28 **更新时间：** 2024/10/21 4:29

### **【JProfile】JProfile工具**

**一.背景**


本篇文章主要介绍JProfile工具的使用


这里有几个问题先抛出来


1.JProfile是什么？


--是一个商业授权的Java剖析工具，由EJ技术有限公司，针对的Java EE和Java SE应用程序开发的


2.JProfile具备哪些功能


--2.1本地会话的实时分析(重要)


--2.2远程会话的实时分析(重要)


--2.3离线分析和触发器


--2.4快照比较


--2.5查看 HPROF 快照(重要)


--2.6请求跟踪


**二. 功能：**


这里根据用途描述以上重要的功能


**1. 查询HPROF快照**


这个功能作为Java开发应该是使用到的最多的功能之一，同类型的功能的产品如Eclipse MAT，都是作为


分析线上OOM，内存泄漏等性能问题的重要能力之一


首先打开heapdump文件


可以看到当前内存快照中的对象占用分布



<img src="/img/Java工具.pdf-0-0.png">
常用的功能可以选定某个对象，查询传出引用(outgoing reference) 的对象和传入引用(incoming


reference)对象


也可以通过最大对象Tab查询到当前快照内大对象的情况



<img src="/img/Java工具.pdf-1-0.png">

<img src="/img/Java工具.pdf-1-1.png">

<img src="/img/Java工具.pdf-1-2.png">

<img src="/img/Java工具.pdf-1-3.png">
**2. 本地会话实时分析**


本地实时会话分析，这里以Attach模式功能为例


JProfiler启动中心的快速Attach选项卡列出了所有可以被分析的JVM。 列表项的背景颜色指示了是否已


经加载了分析代理，当前是否连接了JProfiler GUI，或者是否已经配置了离线分析。


当你启动分析会话时，可以在会话设置对话框中配置分析设置。 当重复分析同一进程时，你不会希望重


复输入相同的配置，所以当关闭用快速Attach功能创建的会话时，可以保存一个持久会话。


你下次要分析该进程时，从打开会话选项卡启动保存的会话而不是快速Attach选项卡。你仍然必须选择


一个正在运行的JVM，但分析设置与你之前已经配置的相同。


这里可以看到主要有几个调用树记录的方式


**1. instrumentation** ：修改字节码的方式记录方法的调用，类似arthas?


**2. 全采样** ：在JVM工具接口的帮助下，在安全点暂停时定期检查调用堆栈


**3. 异步采样** ：异步检查调用堆栈，仅在linux 和 macos系统上使用



<img src="/img/Java工具.pdf-2-0.png">
<img src="/img/Java工具.pdf-3-0.png">

这里以第2种全采样的方式记录,主要有这样几个菜单需要关注


**遥测部分** ：这里可以记录当前Attach的JVM相关的概览信息，CPU，内存，GC等等


**堆遍历器** ：分析当前的堆内容内存占用


**实时内存** ：所有对象，记录的对象，分配调用树，分配热点，类跟踪器


**CPU视图** ：调用树，热点，调用图，异常值检测，复杂度分析，调用跟踪器等。这里主要关注调用树这


个功能


下面以CPU视图-调用树为例，分析方法调用耗时比较高的部分



<img src="/img/Java工具.pdf-3-1.png">
<img src="/img/Java工具.pdf-4-0.png">

可以看到 /phoneRegisterLogin方法耗时390ms，一步一步打开调用路径，可以看到最终各个方法的调


用耗时，也就是根据这些耗时点去针对应的做优化


**3. 远程会话实时分析**


//TODO


**三. 参考：**


1. JProfile官网：https://www.ej-technologies.com/products/jprofiler/features.html


2. https://www.yisu.com/zixun/595083.html


3. https://blog.51cto.com/u_15009384/2562935


4. https://blog.csdn.net/fei33423/article/details/131089156


5.https://www.ej-technologies.com/resources/jprofiler/help_zh_CN/doc/main/profiling.html



<img src="/img/Java工具.pdf-4-1.png">
**java获取当前时间戳的方法**


**笔记本：** 工具


**创建时间：** 2023/12/11 22:25 **更新时间：** 2023/12/11 22:26


**java获取当前时间戳的方法**


**获取当前时间戳**



<img src="/img/Java工具.pdf-5-0.png">



**获取当前时间**





**获取时间戳三种方法执行效率比较：**

```
 import java.util.Calendar;

 import java.util.Date;

 public class TimeTest {

 private static long _TEN_THOUSAND=10000;

 public static void main(String[] args) {

 long times=1000*_TEN_THOUSAND;

 long t1=System.currentTimeMillis();

 testSystem(times);

 long t2=System.currentTimeMillis();

 System.out.println(t2-t1);

 testCalander(times);

 long t3=System.currentTimeMillis();

 System.out.println(t3-t2);

 testDate(times);

 long t4=System.currentTimeMillis();

 System.out.println(t4-t3);

 }

 public static void testSystem(long times){//use 188

 for(int i=0;i<times;i++){

 long currentTime=System.currentTimeMillis();

 }

 }

 public static void testCalander(long times){//use 6299

 for(int i=0;i<times;i++){

 long currentTime=Calendar.getInstance().getTimeInMillis();

 }

 }

 public static void testDate(long times){

 for(int i=0;i<times;i++){

 long currentTime=new Date().getTime();

 }

 }

 }

```

执行结果：

```
 133

```

Calendar.getInstance().getTimeInMillis() 这种方式速度最慢，这是因为Canlendar要处理时区问题会耗


费较多的时间。


**java 把字符串数组转List**


**笔记本：** 工具


**创建时间：** 2023/12/11 22:24 **更新时间：** 2023/12/11 22:24


**作者：** 彼岸樱速


java 把字符串数组转List



<img src="/img/Java工具.pdf-7-0.png">


**java接收时间注解（格式化时间处理）**


**笔记本：** 工具


**创建时间：** 2023/12/11 22:21 **更新时间：** 2023/12/11 22:24

### **java接收时间注解（格式化时间处理）**

```
   （在实体类时间字段上加上以下 2 句话 格式自选）

```

@DateTimeFormat(pattern=“yyyy-MM-dd HH:mm:ss”)


@JsonFormat(pattern = “yyyy-MM-dd HH:mm:ss”,timezone=“GMT+8”)


**java生成私钥、公钥和密钥**


**笔记本：** 工具


**创建时间：** 2023/12/11 22:18 **更新时间：** 2023/12/11 22:20
## java 生成私钥、公钥和密钥

通过 jmeter 客户端去访问服务端程序，需要用到私钥、公钥和密钥，还有服务端公钥

定义 ApiEncryptUtil.java 文件为 OpenApi 通信协议加解密工具类，以下代码：

```
 package com.niiwoo.sdk.test;

 import java.security.KeyFactory;

 import java.security.KeyPair;

 import java.security.KeyPairGenerator;

 import java.security.NoSuchAlgorithmException;

 import java.security.PrivateKey;

 import java.security.PublicKey;

 import java.security.Signature;

 import java.security.spec.InvalidKeySpecException;

 import java.security.spec.PKCS8EncodedKeySpec;

 import java.util.HashMap;

 import java.util.HashSet;

 import java.util.Map;

 import java.util.Random;

 import java.util.Set;

 import org.apache.commons.codec.binary.Base64;

 /**

 * OpenApi 通信协议加解密工具类

 *

 *

 */

 public class ApiEncryptUtil {

 private final static Random random = new Random();

 public static void main(String[] args) throws Exception {

 Map<String, Object> map = generateRSAKeyPairs();

 System.out.println("publicKey:===>"+map.get("publicKey"));

 System.out.println("privateKey:===>"+map.get("privateKey"));

 System.out.println(KeyCreate(24));

```


<img src="/img/Java工具.pdf-9-2.png">9-2
```
}

/**

* 生成 RSA 公、私钥对

*

* @return

* @throws NoSuchAlgorithmException

*/

public static Map<String, Object> generateRSAKeyPairs() throws NoSuchAlgorithmException {

Map<String, Object> keyPairMap = new HashMap<String, Object>();

KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");

KeyPair keyPair = generator.genKeyPair();

PublicKey publicKey = keyPair.getPublic();

PrivateKey privateKey = keyPair.getPrivate();

keyPairMap.put("publicKey", Base64.encodeBase64String(publicKey.getEncoded()));

keyPairMap.put("privateKey", Base64.encodeBase64String(privateKey.getEncoded()));

return keyPairMap;

}

public static byte[] signByPrivateKey(byte[] data, PrivateKey privateKey)

throws Exception {

Signature sig = Signature.getInstance("SHA256withRSA");

sig.initSign(privateKey);

sig.update(data);

byte[] ret = sig.sign();

return ret;

}

public static PrivateKey getPrivateKeyFromString(String base64String)

throws InvalidKeySpecException, NoSuchAlgorithmException {

byte[] bt = Base64.decodeBase64(base64String.getBytes());

PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(bt);

KeyFactory keyFactory = KeyFactory.getInstance("RSA");

PrivateKey privateKey = keyFactory.generatePrivate(privateKeySpec);

return privateKey;

}

/**

* 生成 16 位 AES 随机密钥

* @return

*/

public static String getAESRandomKey(){

long longValue = random.nextLong();

return String.format("%016x", longValue);

}

public static String KeyCreate(int KeyLength) {

String base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*:_+<>?~#$@";

Random random = new Random();

StringBuffer Keysb = new StringBuffer();

// 生成指定位数的随机秘钥字符串

for (int i = 0; i < KeyLength; i++) {

int number = random.nextInt(base.length());

Keysb.append(base.charAt(number));

}

return Keysb.toString();

}

}

```

```
2

3

4

```

```
 5

 6

 7

 8

 9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

```

```
 65

 66

 67

 68

 69

 70

 71

 72

 73

 74

 75

 76

 77

 78

 79

 80

 81

 82

 83

 84

 85

 86

 87

 88

 89

 90

 91

 92

 93

 94

 95

 96

 97

 98

 99

100

```


Eclipse 客户端执行代码生成私钥、公钥和密钥


服务端公钥是在配置文件已经配置好了



<img src="/img/Java工具.pdf-12-1.png">

<img src="/img/Java工具.pdf-12-3.png">
使用生成的私钥、公钥和密钥替换在 jmeter 上的配置，修改验签 TianChengSampler.java 文件

```
 /**

 *TianCheng Sampler,for tiancheng uap2.0

 */

 package org.apache.niiwoo;

 //import java.io.ByteArrayOutputStream;

 //import java.io.IOException;

 //import java.io.InputStream;

 //import java.io.PrintStream;

 //import java.io.UnsupportedEncodingException;

 //import java.net.MalformedURLException;

 //import java.net.URISyntaxException;

 //import java.net.URL;

 //import java.security.MessageDigest;

 //import java.security.NoSuchAlgorithmException;

 //import java.util.ArrayList;

 //import java.util.Arrays;

 //import java.util.Collections;

 import java.util.HashMap;

 //import java.util.HashSet;

 //import java.util.Iterator;

 //import java.util.List;

 import java.util.Map;

 //import java.util.Set;

 //import java.util.concurrent.Callable;

 //import java.util.concurrent.ExecutionException;

 //import java.util.concurrent.Future;

 import java.util.concurrent.atomic.AtomicInteger;

 import java.util.Date;

 import java.util.UUID;

 //import org.apache.commons.io.IOUtils;

 //import org.apache.commons.lang3.StringUtils;

 //import org.apache.jmeter.config.Argument;

 //import org.apache.jmeter.config.Arguments;

 //import org.apache.jmeter.config.ConfigTestElement;

 //import org.apache.jmeter.engine.event.LoopIterationEvent;

 //import org.apache.jmeter.protocol.http.control.AuthManager;

 //import org.apache.jmeter.protocol.http.control.CacheManager;

 //import org.apache.jmeter.protocol.http.control.Cookie;

 //import org.apache.jmeter.protocol.http.control.CookieManager;

 //import org.apache.jmeter.protocol.http.control.DNSCacheManager;

 //import org.apache.jmeter.protocol.http.control.HeaderManager;

 //import org.apache.jmeter.protocol.http.parser.BaseParser;

 //import org.apache.jmeter.protocol.http.parser.LinkExtractorParseException;

 //import org.apache.jmeter.protocol.http.parser.LinkExtractorParser;

 //import org.apache.jmeter.protocol.http.sampler.ResourcesDownloader.AsynSamplerResultHolder;

 //import org.apache.jmeter.protocol.http.util.ConversionUtils;

 //import org.apache.jmeter.protocol.http.util.EncoderCache;

 //import org.apache.jmeter.protocol.http.util.HTTPArgument;

 //import org.apache.jmeter.protocol.http.util.HTTPConstants;

 //import org.apache.jmeter.protocol.http.util.HTTPConstantsInterface;

 //import org.apache.jmeter.protocol.http.util.HTTPFileArg;

 //import org.apache.jmeter.protocol.http.util.HTTPFileArgs;

 import org.apache.jmeter.samplers.AbstractSampler;

 import org.apache.jmeter.samplers.Entry;

 import org.apache.jmeter.samplers.SampleResult;

```

```
//import org.apache.jmeter.testelement.TestElement;

//import org.apache.jmeter.testelement.TestIterationListener;

//import org.apache.jmeter.testelement.TestStateListener;

//import org.apache.jmeter.testelement.ThreadListener;

//import org.apache.jmeter.testelement.property.BooleanProperty;

//import org.apache.jmeter.testelement.property.CollectionProperty;

//import org.apache.jmeter.testelement.property.IntegerProperty;

//import org.apache.jmeter.testelement.property.JMeterProperty;

//import org.apache.jmeter.testelement.property.PropertyIterator;

//import org.apache.jmeter.testelement.property.StringProperty;

//import org.apache.jmeter.testelement.property.TestElementProperty;

//import org.apache.jmeter.threads.JMeterContext;

//import org.apache.jmeter.threads.JMeterContextService;

//import org.apache.jmeter.util.JMeterUtils;

import org.apache.jorphan.logging.LoggingManager;

//import org.apache.jorphan.util.JOrphanUtils;

import org.apache.log.Logger;

//import org.apache.oro.text.MalformedCachePatternException;

//import org.apache.oro.text.regex.Pattern;

//import org.apache.oro.text.regex.Perl5Matcher;

import org.apache.niiwoo.commons.Base64;

import org.apache.niiwoo.commons.ThreeDes;

import org.apache.niiwoo.commons.EncryptUtil;

import org.apache.niiwoo.commons.RSA;

import org.apache.niiwoo.commons.HttpRequestUtil;

import com.alibaba.fastjson.JSONObject;

/**

*TianCheng Sampler class

*/

public class TianChengSampler extends AbstractSampler {

private static final long serialVersionUID = 240L;

private static final Logger log = LoggingManager.getLoggerForClass();

// The name of the property used to hold our data

public static final String DATA = "TianChengSampler.data"; //$NON-NLS-1$

public static final String serverURL = "TianChengSampler.serverURL"; //$NON-NLS-1$

public static final String orgCode = "TianChengSampler.orgCode"; //$NON-NLS-1$

public static final String userName = "TianChengSampler.userName"; //$NON-NLS-1$

public static final String userPassword = "TianChengSampler.userPassword"; //$NON-NLS-1$

public static final String functionCode = "TianChengSampler.functionCode"; //$NON-NLS-1$

public static final String clientPrivateKey = "TianChengSampler.clientPrivateKey"; //$NON-NLS-1$

public static final String clientPublicKey = "TianChengSampler.clientPublicKey"; //$NON-NLS-1$

public static final String serverPublicKey = "TianChengSampler.serverPublicKey"; //$NON-NLS-1$

public static final String threeDesKey = "TianChengSampler.threeDesKey"; //$NON-NLS-1$

private static AtomicInteger classCount = new AtomicInteger(0); // keep track of classes created

// (for instructional purposes only!)

public TianChengSampler() {

classCount.incrementAndGet();

trace("TianChengSampler()");

}

/**

* 发送 HTTP 请求

*

* @throws Exception

```

```
*/

public String postHttpRequest() throws Exception

{

String data = getData(); // Sampler data

String server_url = getServerURL();

String org_code = getOrgCode();

String username = getUserName();

String password = getUserPassword();

String function_code = getFunctionCode();

String client_private_key = getClientPrivateKey();

//String client_public_key = getClientPublicKey();

String server_public_key = getServerPublicKey();

String three_des_key = getThreeDesKey();

UUID uuid = UUID.randomUUID();

String transNo = uuid.toString();

Map<String, Object> root = new HashMap<String, Object>();

Map<String, Object> header = new HashMap<String, Object>();

Map<String, Object> securityInfo = new HashMap<String, Object>();

header.put("orgCode", org_code.toString());

header.put("transNo", transNo);

header.put("transDate", new Date().toString());

header.put("userName", username.toString());

header.put("userPassword", EncryptUtil.md5(password.toString()));

header.put("functionCode", function_code.toString());

String headerStr = JSONObject.toJSONString(header);

// 使用 pcks8 编码格式的私钥

String sigValue = RSA.sign(headerStr, client_private_key);

securityInfo.put("signatureValue", sigValue);

byte[] encBusiData = ThreeDes.encryptMode(three_des_key.getBytes(), data.getBytes("UTF-8"));

root.put("header", headerStr);

root.put("busiData", Base64.getBase64ByByteArray(encBusiData));

root.put("securityInfo", securityInfo);

String message = JSONObject.toJSONString(root);

log.debug(" 向 BOSS 发送请求： " + message);

String res = HttpRequestUtil.sendJsonWithHttp(server_url, message);

//System.out.println(" 响应 Message ： " + res);

JSONObject msgJSON = JSONObject.parseObject(res);

String head = msgJSON.getString("header");

if(!JSONObject.parseObject(head).getString("rtCode").equals("E0000000"))

{

log.debug(" 消息返回失败 ");

String retMessage = " 返回失败, 错误码 rtCode:";

switch(JSONObject.parseObject(head).getString("rtCode")) {

case "E0000001":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 请求消息为空 !";

break;

case "E0000002":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 验签失败 !";

break;

case "E0000003":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 请求数据解析失败 !";

break;

case "E0000004":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 请求的用户不存在 !";

break;

case "E0000005":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 用户名密码错误 !";

break;

```

```
case "E0000006":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 交易流水重复 !";

break;

case "E0000007":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", base64 解码失败 !";

break;

case "E0000008":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 3des 解码失败 !";

break;

case "E0000009":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 错误的请求方式 !";

break;

case "E0000010":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 用户余额不足 !";

break;

case "E0000011":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 内部响应超时 !";

break;

case "E0000012":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 功能号格式错误 !";

break;

case "E0000013":

retMessage += JSONObject.parseObject(head).getString("rtCode") + ", 系统正在升级中, 请稍后再试 !";

break;

default : retMessage += ", 未定义的错误码 !";

}

return retMessage;

}

// 验证签名

String securityInfo1 = msgJSON.getString("securityInfo");

String signatureValue = JSONObject.parseObject(securityInfo1).getString("signatureValue");

boolean verifyFlag = RSA.verify(msgJSON.getString("header"), signatureValue, server_public_key);

if(verifyFlag == true){

log.debug(" 验签成功 ");

byte[] b64 = Base64.getFormBase64ByString(msgJSON.getString("busiData"));

byte[] busiData = ThreeDes.decryptMode(three_des_key.getBytes(), b64);

String rspData = new String(busiData, 0, busiData.length, "UTF-8");

log.debug(" 响应 BusiData 明文： " + rspData);

return rspData;

}else{

log.debug(" 验签失败 ");

return " 响应数据验签失败 !";

}

}

/**

* {@inheritDoc}

*/

@Override

public SampleResult sample(Entry e) {

log.debug("into SampleResult.sample");

trace("sample()");

SampleResult res = new SampleResult();

boolean isOK = false; // Did sample succeed?

String data = getData(); // Sampler data

String response = null;

res.setSampleLabel(getTitle());

/*

```

```
* Perform the sampling

*/

res.sampleStart(); // Start timing

try {

// Do something here ...

response = postHttpRequest(); //Thread.currentThread().getName();

/*

* Set up the sample result details

*/

res.setSamplerData(data);

res.setResponseData(response, null);

res.setDataType(SampleResult.TEXT);

res.setResponseCodeOK();

res.setResponseMessage("OK");// $NON-NLS-1$

isOK = true;

} catch (Exception ex) {

log.debug("", ex);

res.setResponseCode("500");// $NON-NLS-1$

res.setResponseMessage(ex.toString());

}

res.sampleEnd(); // End timimg

res.setSuccessful(isOK);

return res;

}

/**

* @return a string for the sampleResult Title

*/

private String getTitle() {

log.debug("into getTitle");

return this.getName();

}

/**

* @return the data for the sample

*/

public String getData() {

return getPropertyAsString(DATA);

}

/**

* @return the serverURL for the sample

*/

public String getServerURL() {

return getPropertyAsString(serverURL);

}

/**

* @return the orgCode for the sample

*/

public String getOrgCode() {

return getPropertyAsString(orgCode);

}

public String getUserName() {

return getPropertyAsString(userName);

}

public String getUserPassword() {

return getPropertyAsString(userPassword);

```

```
}

public String getFunctionCode() {

return getPropertyAsString(functionCode);

}

public String getClientPrivateKey() {

return getPropertyAsString(clientPrivateKey);

}

public String getClientPublicKey() {

return getPropertyAsString(clientPublicKey);

}

public String getServerPublicKey() {

return getPropertyAsString(serverPublicKey);

}

public String getThreeDesKey() {

return getPropertyAsString(threeDesKey);

}

/*

* Helper method

*/

private void trace(String s) {

String tl = getTitle();

String tn = Thread.currentThread().getName();

String th = this.toString();

log.debug(tn + " (" + classCount.get() + ") " + tl + " " + s + " " + th);

}

}

```

```
 2

 3

 4

 5

 6

 7

 8

 9

10

11

12

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

```

```
35

36

37

38

39

40

41

42

43

44

45

46

47

48

49

50

51

52

53

54

55

56

57

58

59

60

61

62

63

64

65

66

67

68

69

70

71

72

73

74

75

76

77

78

79

80

81

82

83

84

85

86

87

88

89

90

91

92

93

94

```

```
 95

 96

 97

 98

 99

100

101

102

103

104

105

106

107

108

109

110

111

112

113

114

115

116

117

118

119

120

121

122

123

124

125

126

127

128

129

130

131

132

133

134

135

136

137

138

139

140

141

142

143

144

145

146

147

148

149

150

151

152

153

154

```

```
155

156

157

158

159

160

161

162

163

164

165

166

167

168

169

170

171

172

173

174

175

176

177

178

179

180

181

182

183

184

185

186

187

188

189

190

191

192

193

194

195

196

197

198

199

200

201

202

203

204

205

206

207

208

209

210

211

212

213

214

```

```
215

216

217

218

219

220

221

222

223

224

225

226

227

228

229

230

231

232

233

234

235

236

237

238

239

240

241

242

243

244

245

246

247

248

249

250

251

252

253

254

255

256

257

258

259

260

261

262

263

264

265

266

267

268

269

270

271

272

273

274

```

```
275

276

277

278

279

280

281

282

283

284

285

286

287

288

289

290

291

292

293

294

295

296

297

298

299

300

301

302

303

304

305

306

307

308

309

310

311

312

313

314

315

316

317

318

319

320

321

322

323

324

325

326

327

328

329

330

331

332

333

334

```

```
335

336

337

338

339

340

341

342

343

344

345

346

347

```


修改前


修改后



<img src="/img/Java工具.pdf-24-0.png">



<img src="/img/Java工具.pdf-24-2.png">
**Java replaceAll不区分大小写**


**笔记本：** 工具


**创建时间：** 2023/12/11 22:15 **更新时间：** 2023/12/11 22:15

### **Java replaceAll不区分大小写**


Java 中replaceAll如何忽略大小写呢?


**方式一:在正则表达式前面添加(?i)**

|Col1|Java代码|
|---|---|
|1.<br>`@Test`<br>2.<br>**`publicvoid`**`test_replaceAll33(){`<br>3.<br>`Stringinput="IlikeJava,jAvaisveryeasyandjaVaissopopular.";`<br>4.<br>`Stringreplacement="cccc";`<br>5.<br>6.<br>`System.out.println(input);`<br>7.<br>`System.out.println(input.replaceAll("(?i)java",replacement));`<br>8.<br>`}`|1.<br>`@Test`<br>2.<br>**`publicvoid`**`test_replaceAll33(){`<br>3.<br>`Stringinput="IlikeJava,jAvaisveryeasyandjaVaissopopular.";`<br>4.<br>`Stringreplacement="cccc";`<br>5.<br>6.<br>`System.out.println(input);`<br>7.<br>`System.out.println(input.replaceAll("(?i)java",replacement));`<br>8.<br>`}`|



测试结果:


**方式二:使用Matcher 的appendReplacement 方法**


Java代码


1. `@Test`


2. **`public`** **`void`** `test_replaceAll(){`


3. `String input = "I like Java,jAva is very easy and jaVa is so popular.";`


4. `String regex = "java";`


5. `String replacement="cccc";`


6.


7. `StringBuffer sb =replaceAll2(input, regex, replacement);`


8. `System.out.println(input);`


9. `System.out.println(sb);`


10.


11. `}`


12. `/***`


13. `* replaceAll,忽略大小写`


14. `* @param input`


15. `* @param regex`



<img src="/img/Java工具.pdf-25-0.png">
16. `* @param replacement`


17. `* @return`


18. `*/`


19. **`public`** `StringBuffer replaceAll2(String input,String regex,String replacement){`


20. `Pattern p = Pattern.compile(regex,Pattern.CASE_INSENSITIVE);`


21. `Matcher m = p.matcher(input);`


22. `StringBuffer sb =` **`new`** `StringBuffer();`


23. **`boolean`** `result = m.find();`


24. **`while`** `(result)`


25. `{`


26. `m.appendReplacement(sb, replacement);`


27. `result = m.find();`


28. `}`


29. `m.appendTail(sb);`


30. **`return`** `sb;`


31. `}`


测试结果:


**方式三:使用Matcher 的replaceAll**


|Col1|Java代码|
|---|---|
|1.<br>`/***`<br>2.<br>`*replaceAll,忽略大小写`<br>3.<br>`*`<br>4.<br>`*@paraminput`<br>5.<br>`*@paramregex`<br>6.<br>`*@paramreplacement`<br>7.<br>`*@return`<br>8.<br>`*/`<br>9.<br>**`public`**`StringreplaceAll3(Stringinput,Stringregex,Stringreplacement){`<br>10.<br>`Patternp=Pattern.compile(regex,Pattern.CASE_INSENSITIVE);`<br>11.<br>`Matcherm=p.matcher(input);`<br>12.<br>`Stringresult=m.replaceAll(replacement);`<br>13.<br>**`return`**`result;`<br>14.<br>`}`<br>15.<br>16.<br>`@Test`<br>17.<br>**`publicvoid`**`test_replaceAll3(){`<br>18.<br>`Stringinput="IlikeJava,jAvaisveryeasyandjaVaissopopular.";`<br>19.<br>`Stringregex="java";`<br>20.<br>`Stringreplacement="cccc";`<br>21.<br>22.<br>`Stringsb=replaceAll3(input,regex,replacement);`<br>23.<br>`System.out.println(input);`<br>24.<br>`System.out.println(sb);`<br>25.<br>26.<br>`}`|1.<br>`/***`<br>2.<br>`*replaceAll,忽略大小写`<br>3.<br>`*`<br>4.<br>`*@paraminput`<br>5.<br>`*@paramregex`<br>6.<br>`*@paramreplacement`<br>7.<br>`*@return`<br>8.<br>`*/`<br>9.<br>**`public`**`StringreplaceAll3(Stringinput,Stringregex,Stringreplacement){`<br>10.<br>`Patternp=Pattern.compile(regex,Pattern.CASE_INSENSITIVE);`<br>11.<br>`Matcherm=p.matcher(input);`<br>12.<br>`Stringresult=m.replaceAll(replacement);`<br>13.<br>**`return`**`result;`<br>14.<br>`}`<br>15.<br>16.<br>`@Test`<br>17.<br>**`publicvoid`**`test_replaceAll3(){`<br>18.<br>`Stringinput="IlikeJava,jAvaisveryeasyandjaVaissopopular.";`<br>19.<br>`Stringregex="java";`<br>20.<br>`Stringreplacement="cccc";`<br>21.<br>22.<br>`Stringsb=replaceAll3(input,regex,replacement);`<br>23.<br>`System.out.println(input);`<br>24.<br>`System.out.println(sb);`<br>25.<br>26.<br>`}`|


测试结果:


**java-String数组的初始化以及二维数组的访问**


**笔记本：** 工具


**创建时间：** 2023/12/11 22:11 **更新时间：** 2023/12/11 22:13

### **java-String数组的初始化以及二维数组的访问**


java学习之路记录


本篇基础关于数组进行基础总结三个内容：


String类型的一维数组，二维数组的定义与初始化。


二维数组如何遍历访问。拿 String 当作例子，其他类型的数组定义，初始化，访问都类似。


**一维数组的定义与初始化**



<img src="/img/Java工具.pdf-28-0.png">



**二维数组的定义与初始化以及三种遍历方法**


在java中 ，二维数组相当于一维数组的数组。


直接见代码



<img src="/img/Java工具.pdf-28-1.png">




<img src="/img/Java工具.pdf-29-0.png">





输入结果如下

```
 arr[0][0]=0

 arr[0][1]=1

 arr[0][2]=2

 arr[0][3]=0

 arr[1][0]=0

 arr[1][1]=4

 arr[1][2]=3

 arr[1][3]=0

 arr[2][0]=0

 arr[2][1]=0

 arr[2][2]=0

 arr[2][3]=8

 ========================================

 str[0][0]=a

 str[0][1]=b

 str[0][2]=c

 str[1][0]=d

 str[1][1]=e

 str[1][2]=f

 str[2][0]=g

 str[2][1]=h

 str[2][2]=i

 a

 b

 c

 d

 e

 f

 g

 h

 i

 [[a, b, c], [d, e, f], [g, h, i]]

```

**java中String数组和List的互相转化**


**笔记本：** 工具


**创建时间：** 2023/12/11 22:04 **更新时间：** 2023/12/11 22:05


**java中String数组和List的互相转化**


1.List转String数组


方法一:



<img src="/img/Java工具.pdf-30-0.png">



方法二：



<img src="/img/Java工具.pdf-30-1.png">









二：String数据转List


方法一：


`//` 准备一个 `String` 数组

```
 String[] strs = {"aa","bb","cc"};

```

`//String` 数组转 `List`

```
 List<String> strsToList1= Arrays.asList(strs);

 for(String s:strsToList1){

 System.out.println(s);

 }

```

方法二：



<img src="/img/Java工具.pdf-30-2.png">





方法三：



<img src="/img/Java工具.pdf-30-3.png">




<img src="/img/Java工具.pdf-31-0.png">


**Java读取本地json文件**


**笔记本：** 工具


**创建时间：** 2023/12/11 22:00 **更新时间：** 2023/12/11 22:03

## **Java读取本地json文件**


**背景**


之前一直在弄一个Java爬虫，将爬取的信息保存到了数据库中。但这毕竟是一个课程设计，在设计前


端GUI，展示数据的时候最开始是直接通过select语句从数据库中查找的，但我担心交给老师后，老师


还要配置JDBC的参数创建数据库插入表等一些繁琐操作，便想要保存到本地。昨晚看到同学从数据库


中导出一个json文件，从json文件中读取信息，看过后觉得这不失为一个好办法，于是学习了一下，


这里整理整理。


当然，后来我学到了一个叫derby的本地数据库使用derby比起这拐弯抹角的方法好点，感兴趣的可以


移步到这篇文章 **[Derby数据库的使用](https://www.cnblogs.com/wkfvawl/p/12091358.html)**


开发环境


1 JDK1.8


2 IntelliJ IDEA


3 IDEA 自带的Maven


**json文件**

```
 {

 "RECORDS": [

 {

 "movieId": "1",

```

`"name": "` 肖申克的救赎 `The Shawshank Redemption",`


`"director": "` 弗兰克 `·` 德拉邦特 `",`


`"scenarist": "` 弗兰克 `·` 德拉邦特 `/` 斯蒂芬 `·` 金 `",`


`"actors": "` 蒂姆 `·` 罗宾斯 `/` 摩根 `·` 弗里曼 `/` 鲍勃 `·` 冈顿 `/` 威廉姆 `·` 赛德勒 `/` 克兰西 `·` 布朗 `/` 吉尔 `·` 贝罗斯 `/` 马克 `·` 罗


斯顿 `/` 詹姆斯 `·` 惠特摩 `/` 杰弗里 `·` 德曼 `/` 拉里 `·` 布兰登伯格 `/` 尼尔 `·` 吉恩托利 `/` 布赖恩 `·` 利比 `/` 大卫 `·` 普罗瓦尔 `/` 约


瑟夫 `·` 劳格诺 `/` 祖德 `·` 塞克利拉 `/` 保罗 `·` 麦克兰尼 `/` 芮妮 `·` 布莱恩 `/` 阿方索 `·` 弗里曼 `/ V·J·` 福斯特 `/` 弗兰克 `·` 梅德拉诺


`/` 马克 `·` 迈尔斯 `/` 尼尔 `·` 萨默斯 `/` 耐德 `·` 巴拉米 `/` 布赖恩 `·` 戴拉特 `/` 唐 `·` 麦克马纳斯 `",`


`"type": "` 剧情 犯罪 `",`

```
 "ratingNum": "9.7",

```

`"tags": "` 经典 励志 信念 自由 人性 人生 美国 剧情 `"`

```
 },

 {

 "movieId": "2",

```

`"name": "` 霸王别姬 `",`


`"director": "` 陈凯歌 `",`


`"scenarist": "` 芦苇 `/` 李碧华 `",`


`"actors": "` 张国荣 `/` 张丰毅 `/` 巩俐 `/` 葛优 `/` 英达 `/` 蒋雯丽 `/` 吴大维 `/` 吕齐 `/` 雷汉 `/` 尹治 `/` 马明威 `/` 费


振翔 `/` 智一桐 `/` 李春 `/` 赵海龙 `/` 李丹 `/` 童弟 `/` 沈慧芬 `/` 黄斐 `",`


`"type": "` 剧情 爱情 同性 `",`

```
 "ratingNum": "9.6",

```

`"tags": "` 经典 人性 文艺 爱情 人生 同志 剧情 文革 `"`

```
 },

 {

 "movieId": "3",

```

`"name": "` 阿甘正传 `Forrest Gump",`


`"director": "` 罗伯特 `·` 泽米吉斯 `",`


`"scenarist": "` 艾瑞克 `·` 罗斯 `/` 温斯顿 `·` 格鲁姆 `",`


`"actors": "` 汤姆 `·` 汉克斯 `/` 罗宾 `·` 怀特 `/` 加里 `·` 西尼斯 `/` 麦凯尔泰 `·` 威廉逊 `/` 莎莉 `·` 菲尔德 `/` 海利 `·` 乔 `·` 奥斯蒙 `/` 迈


克尔 `·` 康纳 `·` 亨弗里斯 `/` 哈罗德 `·G·` 赫瑟姆 `/` 山姆 `·` 安德森 `/` 伊俄涅 `·M·` 特雷奇 `/` 彼得 `·` 道博森 `/` 希芳 `·` 法隆 `/` 伊丽莎


白 `·` 汉克斯 `/` 汉娜 `·` 豪尔 `/` 克里斯托弗 `·` 琼斯 `/` 罗布 `·` 兰德里 `/` 杰森 `·` 麦克奎尔 `/` 桑尼 `·` 施罗耶 `/` 艾德 `·` 戴维斯 `/` 丹尼


尔 `C.` 斯瑞派克 `/` 大卫 `·` 布里斯宾 `/` 德博拉 `·` 麦克蒂尔 `/` 艾尔 `·` 哈林顿 `/` 阿非莫 `·` 奥米拉 `/` 约翰 `·` 沃德斯塔德 `/` 迈克尔 `·`


伯吉斯 `/` 埃里克 `·` 安德伍德 `/` 拜伦 `·` 明斯 `/` 斯蒂芬 `·` 布吉格沃特 `/` 约翰 `·` 威廉 `·` 高尔特 `/` 希拉里 `·` 沙普兰 `/` 伊莎贝尔 `·` 罗


斯 `/` 理查德 `·` 达历山德罗 `/` 迪克 `·` 史迪威 `/` 迈克尔 `-` 杰斯 `/` 杰弗里 `·` 布莱克 `/` 瓦妮莎 `·` 罗斯 `/` 迪克 `·` 卡维特 `/` 马拉 `·` 苏


查雷特扎 `/` 乔 `·` 阿拉斯奇 `/ W·` 本森 `·` 泰瑞 `",`


`"type": "` 剧情 爱情 `",`

```
 "ratingNum": "9.5",

```

`"tags": "` 励志 经典 人生 美国 成长 信念 剧情 人性 `"`

```
 }

 ]

 }

```

**注意这里是将json文件放到resources文件下**


**pom依赖**



<img src="/img/Java工具.pdf-33-0.png">

<img src="/img/Java工具.pdf-33-1.png">



**读取JSON工具类**

```
 import com.alibaba.fastjson.JSON;

 import com.alibaba.fastjson.JSONArray;

 import com.alibaba.fastjson.JSONObject;

 import java.io.*;

 public class JsonTest {

```

`//` 读取 `json` 文件

```
 public static String readJsonFile(String fileName) {

 String jsonStr = "";

 try {

 File jsonFile = new File(fileName);

 FileReader fileReader = new FileReader(jsonFile);

 Reader reader = new InputStreamReader(new FileInputStream(jsonFile),"utf-8");

 int ch = 0;

 StringBuffer sb = new StringBuffer();

 while ((ch = reader.read()) != -1) {

 sb.append((char) ch);

 }

 fileReader.close();

 reader.close();

 jsonStr = sb.toString();

 return jsonStr;

 } catch (IOException e) {

 e.printStackTrace();

 return null;

```

```
 }

 }

 public static void main(String[] args) {

 String path = JsonTest.class.getClassLoader().getResource("Movie.json").getPath();

 String s = readJsonFile(path);

 JSONObject jobj = JSON.parseObject(s);

```

`JSONArray movies` `= jobj.getJSONArray("RECORDS");//` 构建 `JSONArray` 数组

```
 for (int i = 0 ; i < movies.size();i++){

 JSONObject key = (JSONObject)movies.get(i);

 String name = (String)key.get("name");

 String director = (String)key.get("director");

 String scenarist=((String)key.get("scenarist"));

 String actors=((String)key.get("actors"));

 String type=((String)key.get("type"));

 String ratingNum=((String)key.get("ratingNum"));

 String tags=((String)key.get("tags"));

 System.out.println(name);

 System.out.println(director);

 System.out.println(scenarist);

 System.out.println(actors);

 System.out.println(type);

 System.out.println(director);

 System.out.println(ratingNum);

 System.out.println(tags);

 }

}

```


<img src="/img/Java工具.pdf-34-0.png">
**Java如何判断一个整型数字是几位数的方法**


**笔记本：** 工具


**创建时间：** 2023/12/11 21:46 **更新时间：** 2023/12/11 21:46



<img src="/img/Java工具.pdf-35-0.png">
















**Java反射调用setter及getter方法**


**笔记本：** 工具


**创建时间：** 2023/12/11 21:41 **更新时间：** 2023/12/11 21:44



<img src="/img/Java工具.pdf-36-0.png">

<img src="/img/Java工具.pdf-36-1.png">
<img src="/img/Java工具.pdf-37-0.png">

<img src="/img/Java工具.pdf-37-1.png">


**Java比较两个对象的Class实例对象是否相等**


**笔记本：** 工具


**创建时间：** 2023/12/11 21:19 **更新时间：** 2023/12/11 21:22

### **Java比较两个对象的Class实例对象是否相等**


通常我们会比较基本类型、引用类型、数组等是否相等，很少会 比较对象的Class实例对象是否相等，那么cla


可以使用“==”比较是否相等

```
 obj.getClass() == ClassEqualTest.class

```

可以使用equals比较是否相等

```
 obj.getClass().equals(ClassEqualTest.class)

```

同一个classloader加载两个类使用“==”或equals做比较是正确的；


两个不同的classloader分别加载两个类做比较就会有问题，两个实例不会相等；


自定义类加载器

```
 import java.io.ByteArrayOutputStream;

 import java.io.FileInputStream;

 import java.io.InputStream;

 public class MyClassLoader extends ClassLoader{

 private String rootPath;

 public MyClassLoader(String rootPath){

 this.rootPath = rootPath;

 }

 @Override

 protected Class<?> findClass(String name) throws ClassNotFoundException {

 //check if the class have been loaded

 Class<?> c = findLoadedClass(name);

 if(c!=null){

 return c;

 }

 //load the class

 byte[] classData = getClassData(name);

 if(classData==null){

 throw new ClassNotFoundException();

 }

 else{

 c = defineClass(name,classData, 0, classData.length);

 return c;

 }

 }

 private byte[] getClassData(String className){

 String path = rootPath+"/"+className.replace('.', '/')+".class";

 InputStream is = null;

 ByteArrayOutputStream bos = null;

 try {

 is = new FileInputStream(path);

 bos = new ByteArrayOutputStream();

 byte[] buffer = new byte[1024];

 int temp = 0;

```

```
while((temp = is.read(buffer))!=-1){

bos.write(buffer,0,temp);

}

return bos.toByteArray();

} catch (Exception e) {

e.printStackTrace();

}finally{

try {

is.close();

bos.close();

} catch (Exception e) {

e.printStackTrace();

}

}

return null;

}

}

```

在根目录创建一个测试类HelloWorld.java，编译出class文件，并将文件放到D盘根目录下



<img src="/img/Java工具.pdf-39-0.png">


**java进行url编码和解码**


**笔记本：** 工具


**创建时间：** 2023/12/11 21:17 **更新时间：** 2023/12/11 21:18



<img src="/img/Java工具.pdf-40-0.png">


**java 处理json格式数据中的转义斜杠**


**笔记本：** 工具


**创建时间：** 2023/12/11 21:16 **更新时间：** 2023/12/11 21:17



<img src="/img/Java工具.pdf-41-0.png">
**Java给指定URL字符串添加值**


**笔记本：** 工具


**创建时间：** 2023/12/11 21:13 **更新时间：** 2023/12/11 21:14



<img src="/img/Java工具.pdf-42-0.png">

<img src="/img/Java工具.pdf-42-1.png">


`//` 获取参数

```
 String url = "http://www.xxx.com/login?access_token=xxxx&id=yyyyy";

 System.out.println(getParamByUrl(url, "id"));

}

```

**时间戳转java Date（）总是1970年**


**笔记本：** 工具


**创建时间：** 2023/12/11 21:12 **更新时间：** 2023/12/11 21:13

### **时间戳转java Date（）总是1970年**

```
   new Date().getTime() 的值： 1529653514606

   时间戳是： 1529653514

   即可

```

**Java获取当前ip地址**


**笔记本：** 工具


**创建时间：** 2023/12/11 20:53 **更新时间：** 2023/12/11 20:54

### **Java获取当前ip地址**

```
   import java.net.Inet4Address;

   import java.net.InetAddress;

   import java.net.UnknownHostException;

   public class InetAddressInUse {

   public static void main(String[] args){

   try {

   InetAddress ip4 = Inet4Address.getLocalHost();

   System.out.println(ip4.getHostAddress());

   } catch (UnknownHostException e) {

   e.printStackTrace();

   }

   }

   }

```

**JSON 判断是数组还是对象**


**笔记本：** 工具


**创建时间：** 2023/12/11 20:16 **更新时间：** 2023/12/11 20:18

### **JSON 判断是数组还是对象**


参考下面代码：

```
   public static void main(String[] args) {

   String text = "{}";

   Object obj = JSON.parse(text);

   if (obj instanceof JSONObject) {

   System.out.println("JSONObject");

   }

   if (obj instanceof JSONArray) {

   System.out.println("JSONArray");

   }

   }

```

**java反射，获取到方法的参数和返回值的泛型类型**


**笔记本：** 工具


**创建时间：** 2023/12/11 20:02 **更新时间：** 2023/12/11 20:08

### **java反射获取到方法的参数和返回值的泛型类型**

```
 我们都知道了可以定义带有泛型参数的方法，以及泛型返回值的方法了，
 那么泛型在运行的时候已经被擦除了，我们该如何知道这个泛型到底是什么呢？
 有很多情况需要知道实际泛型是什么， Android 数据库框架以及 Http 框架在解析成 json 成实体类的时候，必然要知道是哪个类。

```

获取参数的泛型API方法：

```
 public class GenericParameterizedTypeDemo {
 public static void main(String[] args) throws Exception {
 // 通过反射获取到方法
 Method declaredMethod = GenericParameterizedTypeDemo.class.getDeclaredMethod("findStr", int.class,Map.class
 // 获取到方法的参数列表
 Type[] parameterTypes = declaredMethod.getGenericParameterTypes();
 for (Type type : parameterTypes) {
 System.out.println(type);
 // 只有带泛型的参数才是这种 Type ，所以得判断一下
 if(type instanceof ParameterizedType){
 ParameterizedType parameterizedType = (ParameterizedType) type;
 // 获取参数的类型
 System.out.println(parameterizedType.getRawType());
 // 获取参数的泛型列表
 Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
 for (Type type2 : actualTypeArguments) {
 System.out.println(type2);
 }
 }
 }
 }

 public static List<String> findStr(int id,Map<Integer, String> map){
 return null;
 }

 }

```

一定是getGenericParameterTypes（）方法，getParameterTypes得到的参数列表Type对象时不保存泛型类型


获取返回值泛型的API方法：

```
 public class GenericParameterizedTypeDemo {
 public static void main(String[] args) throws Exception {
 // 通过反射获取到方法
 Method declaredMethod = GenericParameterizedTypeDemo.class.getDeclaredMethod("findStr", int.class,Map.class
 // 获取返回值的类型，此处不是数组，请注意智商，返回值只能是一个
 Type genericReturnType = declaredMethod.getGenericReturnType();
 System.out.println(genericReturnType);
 // 获取返回值的泛型参数
 if(genericReturnType instanceof ParameterizedType){
 Type[] actualTypeArguments = ((ParameterizedType)genericReturnType).getActualTypeArguments();
 for (Type type : actualTypeArguments) {
 System.out.println(type);
 }
 }
 }

 public static List<String> findStr(int id,Map<Integer, String> map){
 return null;
 }

 }

```

**java 反射 ， 判断Class是否是某个类的子类或父类**


**笔记本：** 工具


**创建时间：** 2023/12/11 20:06 **更新时间：** 2023/12/11 20:07

### **java 反射 ， 判断Class是否是某个类的子类或父类**


Class c = [ArrayList](https://so.csdn.net/so/search?q=ArrayList&spm=1001.2101.3001.7020) .class;


c.isPrimitive(); //判断c是否为基本数据类型


c.isAssignableFrom(List.class); //判断c是否是List类的子类或父类


c.getGenericType(); //得到 [泛型类](https://so.csdn.net/so/search?q=%E6%B3%9B%E5%9E%8B%E7%B1%BB&spm=1001.2101.3001.7020) 型


实例：通过反射得到List 集合中的泛型类型

```
 import java . lang . reflect . Field ;
 import java . lang . reflect . ParameterizedType ;
 import java . lang . reflect . Type ;
 import java . util . List ;
 import java . util . Map ;

 class T{
 List <A> a ;

 List <B> b ;
 // List l ;
 Map <Integer, String> map ;

 int c ;
 }

 class A {}

 class B{}

 public class Test9{

   public static void main( String [] args ) {

 Class <T> tc = T .class;

 Field [] fields = tc .getDeclaredFields();
    for ( Field f : fields ) {
 Class fc = f .getType();

```

_`//`_ 判空

```
      if ( fc == null )continue;

      if( fc .isPrimitive()){
 System . out .println("基本数据类型： " + f .getName() + " " + fc .getName());
      }else{
```

`if(` `fc` `.isAssignableFrom(` `List` `.class)){` _`//`_ 判断是否为 _`List`_
```
 System . out .println("List类型：" + f .getName());

```

_`//`_ 如果是 _`List`_ 类型，得到其 _`Generic`_ 的类型

```
 Type gt = f .getGenericType();
```

_`//`_ 判断是否泛型类型 _`,`_ 例 _`:List list = new ArrayList();`_ 这种会为 _`false`_
```
          if( gt instanceof ParameterizedType){
 ParameterizedType pt = ( ParameterizedType ) gt ;
 Class lll = ( Class ) pt .getActualTypeArguments()[0];
 System . out .println("/t/t" + lll .getName());

          }

        }
      }

    }
   }

```

```
}

```

**Java:将文件名拆分为基名和扩展名**


**笔记本：** 工具


**创建时间：** 2023/12/11 19:30 **更新时间：** 2023/12/11 19:31


**作者：** 彼岸樱速


**Java:将文件名拆分为基名和扩展名**


有没有比下面这样更好的获取文件基名和扩展名的方法呢？

```
    File f = ...

    String name = f.getName();

    int dot = name.lastIndexOf('.');

    String base = (dot == -1) ? name : name.substring(0, dot);

    String extension = (dot == -1) ? "" : name.substring(dot+1);

```

**字符串和Date之间互相转换**


**笔记本：** 工具


**创建时间：** 2023/12/11 19:10 **更新时间：** 2023/12/11 19:13



<img src="/img/Java工具.pdf-51-0.png">


**MessageFormat.format()和String.format()**


**笔记本：** 工具


**创建时间：** 2021/9/14 15:11 **更新时间：** 2021/9/14 15:14


**作者：** 彼岸樱速





<img src="/img/Java工具.pdf-52-1.png">









结果



<img src="/img/Java工具.pdf-52-2.png">
