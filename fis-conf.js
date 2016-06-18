// 按需编译，只编译用到的资源
fis.set('project.files', ['*.blade.php', '*.php', 'map.json', '*.mp4', '*.swf', '*.json', '*.xml', '*.woff', '*.ttf', '*.eot', '*.svg']);

// 采用 commonjs 规范支持模块化组建开发
fis.hook('commonjs', {
    paths: {
        "m" : "/widget/m/m.js",
        "jquery" : "/widget/common/jquery/jquery.js"
    },
    packages: [
        // 短路径支持
        {
            name: 'common',
            location: './widget/common',
        },
        {
            name: 'm',
            location: './widget/m',
        }
    ]
});

// 默认认为所有的资源都是静态资源，放在 /public 目录下面
fis.match('**', {
  release: '/public/$0',
  url: '$0'
});


// 添加的 for spm_modules 给mod.js使用的部分
fis.match('/spm_modules/(**)', {
    release: '/public/spm_modules/$0',
    url: '/spm_modules/$0'
});

// static 下面本来就是静态资源，去掉多出来的一层目录。
fis.match('/static/(**)', {
  release: '/public/$1',
  url: '$1'
});

// 添加的 /static/data
fis.match('/static/data/(**)', {
    release: '/public/data/$1',
    url: '/data/$1'
});


fis.match('*.blade.php', {
  // 启用 blade 语法识别插件
  //
  // 1. 转换所有的 @require(path) 路径
  // 2. 识别 @script()@endscript 让内容进行 js 标准化。
  // 3. 识别 @style()@endstyle 让内容进行 css 标准化。
  // 4. 添加钩子，方便运行时加载当前模板依赖。
  preprocessor: fis.plugin('extlang', {
    type: 'blade'
  }),

  release: '/resources/views/$&',
  url: '$&',

  // 将资源信息写入 map.json 里面，方便运行时查找依赖。
  useMap: true
});
//添加的 编译less 这个依赖添加后 还要在这里配置一下
fis.match('*.less', {
    // fis-parser-less 插件进行解析
    parser: fis.plugin('less'),
    // .less 文件后缀构建后被改成 .css 文件
    rExt: '.css'
});

// 省掉 page 这个目录。
fis.match('/page/(**.blade.php)', {
  release: '/resources/views/$1',
  url: "$1"
});

// 配置 map.json 产出路径。
fis.match('/map.json', {
  release: '/resources/map/map.json',
});

// 让所有的 js 都用模块化的方式开发。
// 给组件下面的 js 设置同名依赖  同下面的 只是放在一起了
fis.match('*.js', {
  isMod: true,
  useSameNameRequire: true
});

// static/js 下面放非模块化 js 
fis.match('/static/js/*.js', {
  isMod: false,
});

/* 给组件下面的 js 设置同名依赖
fis.match('/components/**.js', {
  useSameNameRequire: true
})
*/

// 支持前端模板，支持 js 内嵌后，直接翻译成可执行的 function
fis.match('*.tmpl', {
  parser: fis.plugin('utc'),
  rExt: '.js',
  release: false
});
/*－－添加的 默认不产出或者产出路径的文件－－*/
fis.match('package.json', {
    release: false
})

fis.match('test-data/**', {
    release: false
});


fis.match('/page/desktop/index/banner/video.{mp4,webm}', {
    url: '$&',
    useMap: true
});

fis.media('debug')
    .match('test-data/(**)', {
        release: '$1'
    });
/*－－添加的 默认不产出或者产出路径的文件－－*/



// 在 prod 环境下，开启各种压缩和打包。
fis
  .media('prod')

  .match('*.js', {
    optimizer: fis.plugin('uglify-js')
  })
/*  '*.css' 改成 '*.{css,less}'  */
  .match('*.{css,less}', {
    optimizer: fis.plugin('clean-css')
  })

  .match('*.png', {
    optimizer: fis.plugin('png-compressor')
  })
/* 添加主页的mp4的url地址 加上domain  */  
  .match('/page/desktop/index/banner/video.mp4', {
        url: 'desktop-index-banner-video.mp4',
        domain: 'http://m4.qmin91.com/',
        useMap: true
    })
/*－－添加的 文件指纹－－*/
    //文件指纹
    .match('*.{js,css,less,png,jpg,gif,ico,woff,ttf,eot,svg}', {
        useHash: true
    })
    .match('/page/desktop/widgets/**.js', {
        packTo: '/pkg/page/desktop/widgets.js'
    })
    .match('/page/desktop/widgets/**.less', {
        packTo: '/pkg/page/desktop/widgets.less'
    })
    .match('/page/desktop/({index,course})/**.js', {
        packTo: '/pkg/page/desktop/$1.js'
    })
    .match('/page/desktop/({index,course})/**.less', {
        packTo: '/pkg/page/desktop/$1.less'
    })
    .match('/widget/common/(*)/**.js', {
        packTo: '/pkg/common/$1.js'
    })
    .match('/widget/common/(*)/**.{less,css}', {
        packTo: '/pkg/common/$1.css'
    })
    .match('/widget/m/(*)/**.js', {
        packTo: '/pkg/m/$1.js'
    })
    .match('/widget/m/(*)/**.{less,css}', {
        packTo: '/pkg/m/$1.css'
    })
    .match(pattern(
        '/widget/layout/desktop/search-box/*.js',
        '/widget/layout/desktop/sidebar/*.js'
    ), {
        packTo: '/pkg/desktop-frame.js'
    })
    .match('/widget/layout/desktop/{simple-frame.less,header/header.less,footer/*.less,search-box/*.less}', {
        packTo: '/pkg/desktop-frame.css'
    })
/*－－添加的 文件指纹－－*/

  // pack 相关  原本的文件
  
  /* libs 目录下面的 js 打成一个
  .match('/static/libs/**.js', {
    packTo: 'pkg/lib.js'
  })

  // components 目录下面的打成一个。
  .match('/components/**.js', {
    packTo: '/pkg/components.js'
  })
*/
 // pack 相关
   .match(pattern(
        '/widget/m/*.js',
        '/widget/common/jquery/jquery.js',
        '/widget/common/underscore/underscore.js',
        '/widget/common/{arale-base,arale-class,arale-events,arale-widget}/**.js',
        '/widget/common/bluebird/bluebird.js',
        '/widget/common/json2/json2.js',
        '/widget/common/store/store.js'
    ), {
        packTo: '/pkg/common.js'
    })
    .match('{/static/css/normalize.css,/widget/m/*.less}', {
        packTo: '/pkg/common.css'
    });
	
    
function pattern(args) {
    return '{' + Array.prototype.slice.call(arguments).join(',') + '}'
}	
 
 
 
 
 
 
 
 
 
 
 
 