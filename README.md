# 问答网站

这是我学习JS过程中造的又一个轮子......

---

技术栈：Node.js/Express.js - jQuery.js/Pug(Jade) - MongoDB 

---

* 为什么Node.js ? 
    *   作为前端萌新，这不是很自然的选择吗？或许这个答案你不满意？（但不想扯那些有的没的，而且入坑时间短，实力太低，没法从底层，从性能...来和其他的后端语言做比较。有自知之明！）
* 为什么Express.js ?
    *   很火，社区大，所以不怕学习期间遇到实在解决不了的问题。
* 为什么jQuery.js ? 
    *   考虑直接上Vue.js 但是毕竟Express.js才开始学，Vue.js也刚过了一边文档，跟着敲了敲例子，没什么实战经验。不想两面受敌。完工的差不多的时候，考虑用Vue.js重构一遍。
* 为什么Pug(Jade) ? 
    *   官方推荐的不说，之前为Hexo写主题的时候用的就是它：简洁，缩进党（Pythoner表示很亲切）。只是模板而已......不值得纠结太多。
* 为什么MongoDB ?
    *   已经了解了MySQL这种“关系型数据库管理系统”，再加上MongoDB在前端圈子里很火，所以就趁这次机会学习一门NoSQL，感受一下两种截然不同的的数据库管理系统的区别233333

---

###网站功能：

（首先，我承认网站没什么新意。毕竟2017年。放到17年前的话，应该还不错吧2333333）

* 注册登录
* 提问/回答
* 浏览其他人的提问或回答

---

**在本地运行:**

*前提条件：*
*安装好node.js（npm 会同时被安装好）、安装好mongoDB并且在local数据库里创建好content 文档(collection)*

`git clone https://github.com/shuirong/Ask-Answer.git`

`cd Ask-Answer`

`npm install`

`node ./bin/www`

---

**更新日志(update log):**


    
* 2017-2-24:    完善问题提交的Ajax,后端写了个接口来处理提交的问题.并且定义了question和answer的Model
* 2017-2-23:    加上登录注册模块.完成登录/注册页的结构(样式未完成).引入数据库MongoDB,定义了connect.js和user的Model.
* 2017-2-13:    项目初始化.路由了几个页面,基本完成首页的结构和样式,更新README.md

