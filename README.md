# 请回答
人生啊，就是个谜。  
网页何尝不是。  
你可以用鼠标点，甚至用手指戳。  
它都任劳，  
却不任怨。  
你对它大喊大叫，他都无动于衷。  
这不能忍。  
请回答，哪怕答非所问。  

## 环境需求
- 需翻墙  
- Chrome47以上  

## DEMO
```javascript
var pa = pleaseAnswer([
  {
    text: '你好',
    function(text) {
      console.log(text);
    },
  },
  {
    text: ['他好', '我也好'],
    function(text) {
      console.log(text);
    },
  }
]);

pa.start();
```

## API
稍候描述。  