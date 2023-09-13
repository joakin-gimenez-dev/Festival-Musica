const {src, dest, watch, parallel} = require("gulp");

//CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");

//IMAGENES
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");
const sourcemaps = require("gulp-sourcemaps");

//JAVASCRIPS
const terser = require("gulp-terser-js");

function css(done) {
    src("src/scss/**/*.scss")//IDENTIFICADOR DE SASS
    .pipe(sourcemaps.init())
    .pipe(plumber())//GULP PLUMBER
    .pipe(sass())//COMPILADOR
    .pipe(postcss([autoprefixer(),cssnano()])) //COMPRIMIDOR DE CODIGO CSS
    .pipe(sourcemaps.write('.'))
    .pipe(dest("build/css"));//ALMACENADOR EN EL DISCO DURO
    
    done();//CALLBACK QUE AVISA A GULP CUANDO LLEGAMOS AL FINAL
}

function imagenes( done ){
    const opciones = {
        optimizationLevel: 3
    }
    src("src/img/**/*.{png,jpg}")//IDENTIFICADOR DE IMAGENES
        .pipe( cache(imagemin(opciones) ) )//OPTIMIZADOR
        .pipe( dest("build/img"));//ALMACENADOR EN EL DISCO DURO
    done();
}

function versionWebp( done ){
    const opciones = {
        quality: 50
    };

    src("src/img/**/*.{png,jpg}")//IDENTIFICADOR DE IMAGENES
        .pipe(webp(opciones))//CONVERTIDOR
        .pipe(dest("build/img"));//ALMACENADOR EN EL DISCO DURO
    done();
}

function versionAvif( done ){
    const opciones = {
        quality: 50
    };

    src("src/img/**/*.{png,jpg}")//IDENTIFICADOR DE IMAGENES
        .pipe(avif(opciones))//CONVERTIDOR
        .pipe(dest("build/img"));//ALMACENADOR EN EL DISCO DURO
    done();
}

function javascript( done ){
    src("src/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/js"));

    done();
}


function dev(done){
    watch("src/scss/**/*.scss", css)
    watch("src/js/**/*.js", javascript)
    done();
}

exports.css=css;
exports.js=javascript;
exports.imagenes = imagenes;
exports.versionWebp=versionWebp;
exports.versionAvif=versionAvif;
exports.dev= parallel( imagenes, versionWebp, versionAvif, javascript, dev);