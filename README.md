# mutag
一个简单的 mp3 文件标签解析器。你可以用它来获取 mp3 音乐文件中的专辑图片、专辑名称、年代，风格等信息。

## 安装
```
npm install mutag
```

## 用法
在浏览器中，首先引入 `dist/mutag.min.js`，然后使用 `window.mutag` 即可。
```html
<script src="../dist/mutag.min.js"></script>
<script>
    const mutag = window.mutag;
    // the type of input element is 'file'
    const inputDOM = document.querySelector('.file-input');
    inputDOM.addEventListener('change', e => {
        const file = e.target.files[0];
        mutag.fetch(file).then((tags) => {
            //get all tags
            console.log(tags);
        });
    }, false);
```

在 nodejs 中，用 `require` 方法引入。
```javascript
const fs = require('fs');
const mutag = require('mutag');

fs.readFile('path/to/file.mp3', (err, data) => {
  mutag.fetch(data).then((tags) => {
    //get all tags
    console.log(tags);
  });
});
```

## API
### mutag.fetch(blob)
解析 mp3 文件并返回一个 Promise 对象。
参数为 Blob 对象，在浏览器中，Blob 对象可以监听 `input`（属性 `type="file"`）的 `onchange` 事件，或者监听元素的 `ondrop` 事件、或者 Ajax 传递得到。在 nodejs 中，通过 `fs.readFile()` 文件读取得到。
返回值为 Promise 对象，调用其 `then` 方法，如果没有出错，就可以在回调函数 `resolve` 中获取所有存在的 mp3文件的标签。

### mutag.version
返回 mutag 的版本号。

## 示例
[Demo](http://www.chunqiuyiyu.com/mutag/)

## 标签说明
mutag 解析的 ID3 版本是 v2.3，一些常见的标签如下：

|标签|描述|说明|
|:----:|:----|:----|
|APIC|Attached picture|专辑图片，大多为 jpg 格式，少数为 png 格式|
|COMM|Comments|注释，音乐文件的发行说明|
|GEOB|General encapsulated object|通用封装对象|
|PRIV|Private frame|私有帧，Windows Media 定义的一系列私有标签|
|TALB|Album/Movie/Show title|专辑名称|
|TCOM|Composer|作曲家|
|TCON|Content type|音乐风格，不同的数字代表不同的风格，详情见[这里](/src/common/TCON.txt)|
|TIT2|Title/songname/content description|歌曲名称|
|TPE1|Lead performer(s)/Soloist(s)|专辑艺术家（演唱者）|
|TPUB|Publisher|发布者|
|TRCK|Track number/Position in set|音轨数|
|TYER|Year|年份|

想了解更多标签信息，请看[这里](/src/common/tags.txt)。

## 前端兼容性
使用了 `TextDecoder`、`Blob`、`FileReader` 等较新的 API，故只支持新版本的 Chrome 与 Firefox 浏览器。

## 开源协议
MIT
