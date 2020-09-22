//gulpの処理

//src : 操作対象のファイル / dest : 出力先
const {src, dest, watch} = require('gulp');
//load-pluginsの読み込み
const loadPlugins = require('gulp-load-plugins');
//loadPlugins()を変数$に格納
const $ = loadPlugins();

//autoprefixerの読み込み
const autoprefixer = require('autoprefixer');
//browser-syncの読み込み
const browserSync = require('browser-sync');
//create()でサーバーを作成
const server = browserSync.create();




//fileをコピーする処理 src内のindex.htmlをdistフォルダにコピーする
function icon() {
    return src('./nike2.jpg')
        //pipe()で処理をつなげる
        //画像のリサイズ
        .pipe($.imageResize({
            width : 100,
            height : 100,
            crop : true,
            upscale : false
          }))
        //画像の圧縮
        .pipe($.imagemin())
        .pipe($.rename({
            //指定したファイルの先頭にprefixで指定した文字列(hello-)を付与する => copy先のファイルにhello-index.htmlが生成される
            prefix: 'hello-'
        }))
        .pipe(dest('./dist/images'));
}

//Sassをコンパイルするための処理
function styles() {
    return src('./src/sass/main.scss')
        //記載完了
        .pipe($.sourcemaps.init())
        //init writeの間に変換処理を挟む
        .pipe($.sass())
        //postcss関数を呼び、行いたい処理を配列で記述
        .pipe($.postcss([
            autoprefixer()
        ]))
        //引数にコロンを渡して、ファイルと同じディレクトリにmain.css.mapを作成
        .pipe($.sourcemaps.write('.'))
        .pipe(dest('./dist/css'))
}

//watchを使ったファイル監視
function startAppServer() {
    //serverを初期化
    server.init({
        server: {
            baseDir: './dist'
        }
    });
    //sassファイルをwatch 第2引数に変更があった場合のタスクを記述
    watch('./src/**/*.scss', styles);
    //watchにbrowserSyncのサーバーをリロードする処理を加える
    watch('./src/**/*.scss').on('change', server.reload);
}


//gulpfile.jsのexportsに追加されたものがコマンドライン上から実行できる
//command : gulp copyFilesで実行
exports.icon = icon;
exports.styles = styles;
exports.serve = startAppServer;