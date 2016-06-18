
**  First init
**  初始化环境
**  fis3 init laravel
**  qmjy-fe 大体目录结构
**** debgu  调试和开发命令行工具
**** release 线上发布工具
**** fis-conf.js  fis的配置文件
****  page   网站页面
*****       desktop   网站桌面版
*****		mobile    网站手机版
****  static   公用静态资源
****  test-data  测试服务器测试数据
****  widget    公用组件
*****     common    第三方组件
*****	  layout    网站共用布局模块
*****	  m			内部自己的共用模块

qmjy-fe/widget/layout 目录结构说明
desktop                                 #针对桌面版环境的通用布局模块
│   ├── frame.blade.php                     #整体布局框架
│   ├── footer                              #脚部模块
│   ├── header                              #头部模块
│   ├── pagination                          #分页模块
│   ├── register-form                       #注册表单
│   ├── search-box                          #搜索框
│   ├── simple-frame.blade.php              #简单版 整体布局框架
│   └── teacher-profile-card                #老师信息卡片, 用于老师列表
├── frame.blade.php                         #母版
└── mobile                                  #针对mobile版环境的通用布局模块

qmjy-fe/page/desktop 目录结构说明
├── 404                                     #404页面部分
├── 505                                     #505页面部分
├── account                                 #
│   ├── forget-password                     #忘记密码页面部分
│   ├── login                               #登录页面部分
│   ├── register                            #注册页面部分
│   ├── teacher-fillaccount                 #老师信息完善页面部分
│   └── teacher-register                    #老师入注页面部分
├── company                                 
│   ├── frame.blade.php                     #框架模板
│   ├── aboutus                             #关于我们页面部分
│   ├── contactus                           #联系我们页面部分
│   ├── flow                                #平台流程页面部分
│   ├── pay-modes                           #支付方式页面部分
│   └── teacher-join-guide                  #老师入驻向导页面部分
├── index                                   #首页部分
├── search                                  #搜索结果页部分
├── teacher                                 #老师详细页部分
├── test
└── user
    ├── frame.blade.php                     #框架模板
    ├── account                             #账号设置页面部分
    ├── bind-email                          #邮箱绑定页面部分
    ├── favorites                           #收藏夹页面部分
    ├── history                             #浏览器页面部分
    ├── modify-password                     #修改密码页面部分
    ├── profile                             #资料页面部分
    └── recently                            #最近查看老师页面部分

