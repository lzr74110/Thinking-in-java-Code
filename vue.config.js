// vue.config.js 配置说明【git】
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
const sourceMap = process.env.NODE_ENV === "development";
const path = require("path");
module.exports = {
	// 部署生产环境和开发环境下的URL。
	// 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
	//例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 baseUrl 为 /my-app/。
	publicPath: sourceMap ? "/" : "/",
	// outputDir: 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）
	outputDir: "ifms",
	//用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
	assetsDir: "assets",
	//指定生成的 index.html 的输出路径  (打包之后，改变系统默认的index.html的文件名)
	indexPath: "index.html",
	//默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
	filenameHashing: false,
	// webpack配置
	// see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	chainWebpack: () => {},
	configureWebpack: config => {
		if (process.env.NODE_ENV === "production") {
			// 为生产环境修改配置...
			config.mode = "production";
		} else {
			// 为开发环境修改配置...
			config.mode = "development";
		}

		Object.assign(config, {
			// 开发生产共同配置
			resolve: {
				extensions: [".js", ".vue", ".json", ".ts", ".tsx"],
				alias: {
					vue$: "vue/dist/vue.js",
					"@": path.resolve(__dirname, "./src"),
					"@c": path.resolve(__dirname, "./src/components"),
					utils: path.resolve(__dirname, "./src/utils"),
					less: path.resolve(__dirname, "./src/less"),
					views: path.resolve(__dirname, "./src/views"),
					assets: path.resolve(__dirname, "./src/assets"),
					com: path.resolve(__dirname, "./src/components"),
					store: path.resolve(__dirname, "./src/store"),
					mixins: path.resolve(__dirname, "./src/mixins")
				}
			}
		});
	},
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {
			// 给 sass-loader 传递选项
			// sass: {
			// 	// @/ 是 src/ 的别名
			// 	// 所以这里假设你有 `src/variables.sass` 这个文件
			// 	// 注意：在 sass-loader v7 中，这个选项名是 "data"
			// 	prependData: `@import "~@/variable.sass"`
			// },
			// 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
			// 因为 `scss` 语法在内部也是由 sass-loader 处理的
			// 但是在配置 `data` 选项的时候
			// `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
			// 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
			scss: {
				prependData: `@import "~@/assets/css/variable.scss";`
			},
		},
		// 启用 CSS modules for all css / pre-processor files.
		modules: false
	},
	// use thread-loader for babel & TS in production build
	// enabled by default if the machine has more than 1 cores
	parallel: require("os").cpus().length > 1,
	// PWA 插件相关配置
	// see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	pwa: {},

	//   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
	lintOnSave: false,
	//如果你想要在生产构建时禁用 eslint-loader，你可以用如下配置
	// lintOnSave: process.env.NODE_ENV !== 'production',

	//是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。(默认false)
	// runtimeCompiler: false,

	/**
	 * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
	 *  打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
	 *  map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
	 *  有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
	 * */
	productionSourceMap: sourceMap,
	// 它支持webPack-dev-server的所有选项
	devServer: {
		host: "0.0.0.0",
		port: 100, // 端口号
		https: false, // https:{type:Boolean}
		open: true, //配置自动启动浏览器
		// 配置多个代理
		proxy: {
			"/api": {
				target: "http://192.168.0.121:80",
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			},
			'/my-websocket': {
				target: "http://192.168.0.121:80",
				ws: true,
				changeOrigin: true,
			},

			// 'sockjs-node': {
			// 	target: "http://192.168.0.188:80",
			// 	ws: false,
			// 	changeOrigin: true,
			// },
		}
	},
	// 	configureWebpack: {
	// 		plugins:
	// 	}
};