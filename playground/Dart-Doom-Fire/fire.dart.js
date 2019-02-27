(function(){var supportsDirectProtoAccess=function(){var z=function(){}
z.prototype={p:{}}
var y=new z()
if(!(y.__proto__&&y.__proto__.p===z.prototype.p))return false
try{if(typeof navigator!="undefined"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome/")>=0)return true
if(typeof version=="function"&&version.length==0){var x=version()
if(/^\d+\.\d+\.\d+\.\d+$/.test(x))return true}}catch(w){}return false}()
function map(a){a=Object.create(null)
a.x=0
delete a.x
return a}var A=map()
var B=map()
var C=map()
var D=map()
var E=map()
var F=map()
var G=map()
var H=map()
var J=map()
var K=map()
var L=map()
var M=map()
var N=map()
var O=map()
var P=map()
var Q=map()
var R=map()
var S=map()
var T=map()
var U=map()
var V=map()
var W=map()
var X=map()
var Y=map()
var Z=map()
function I(){}init()
function setupProgram(a,b,c){"use strict"
function generateAccessor(b0,b1,b2){var g=b0.split("-")
var f=g[0]
var e=f.length
var d=f.charCodeAt(e-1)
var a0
if(g.length>1)a0=true
else a0=false
d=d>=60&&d<=64?d-59:d>=123&&d<=126?d-117:d>=37&&d<=43?d-27:0
if(d){var a1=d&3
var a2=d>>2
var a3=f=f.substring(0,e-1)
var a4=f.indexOf(":")
if(a4>0){a3=f.substring(0,a4)
f=f.substring(a4+1)}if(a1){var a5=a1&2?"r":""
var a6=a1&1?"this":"r"
var a7="return "+a6+"."+f
var a8=b2+".prototype.g"+a3+"="
var a9="function("+a5+"){"+a7+"}"
if(a0)b1.push(a8+"$reflectable("+a9+");\n")
else b1.push(a8+a9+";\n")}if(a2){var a5=a2&2?"r,v":"v"
var a6=a2&1?"this":"r"
var a7=a6+"."+f+"=v"
var a8=b2+".prototype.s"+a3+"="
var a9="function("+a5+"){"+a7+"}"
if(a0)b1.push(a8+"$reflectable("+a9+");\n")
else b1.push(a8+a9+";\n")}}return f}function defineClass(a4,a5){var g=[]
var f="function "+a4+"("
var e="",d=""
for(var a0=0;a0<a5.length;a0++){var a1=a5[a0]
if(a1.charCodeAt(0)==48){a1=a1.substring(1)
var a2=generateAccessor(a1,g,a4)
d+="this."+a2+" = null;\n"}else{var a2=generateAccessor(a1,g,a4)
var a3="p_"+a2
f+=e
e=", "
f+=a3
d+="this."+a2+" = "+a3+";\n"}}if(supportsDirectProtoAccess)d+="this."+"$deferredAction"+"();"
f+=") {\n"+d+"}\n"
f+=a4+".builtin$cls=\""+a4+"\";\n"
f+="$desc=$collectedClasses."+a4+"[1];\n"
f+=a4+".prototype = $desc;\n"
if(typeof defineClass.name!="string")f+=a4+".name=\""+a4+"\";\n"
f+=g.join("")
return f}var z=supportsDirectProtoAccess?function(d,e){var g=d.prototype
g.__proto__=e.prototype
g.constructor=d
g["$is"+d.name]=d
return convertToFastObject(g)}:function(){function tmp(){}return function(a1,a2){tmp.prototype=a2.prototype
var g=new tmp()
convertToSlowObject(g)
var f=a1.prototype
var e=Object.keys(f)
for(var d=0;d<e.length;d++){var a0=e[d]
g[a0]=f[a0]}g["$is"+a1.name]=a1
g.constructor=a1
a1.prototype=g
return g}}()
function finishClasses(a5){var g=init.allClasses
a5.combinedConstructorFunction+="return [\n"+a5.constructorsList.join(",\n  ")+"\n]"
var f=new Function("$collectedClasses",a5.combinedConstructorFunction)(a5.collected)
a5.combinedConstructorFunction=null
for(var e=0;e<f.length;e++){var d=f[e]
var a0=d.name
var a1=a5.collected[a0]
var a2=a1[0]
a1=a1[1]
g[a0]=d
a2[a0]=d}f=null
var a3=init.finishedClasses
function finishClass(c2){if(a3[c2])return
a3[c2]=true
var a6=a5.pending[c2]
if(a6&&a6.indexOf("+")>0){var a7=a6.split("+")
a6=a7[0]
var a8=a7[1]
finishClass(a8)
var a9=g[a8]
var b0=a9.prototype
var b1=g[c2].prototype
var b2=Object.keys(b0)
for(var b3=0;b3<b2.length;b3++){var b4=b2[b3]
if(!u.call(b1,b4))b1[b4]=b0[b4]}}if(!a6||typeof a6!="string"){var b5=g[c2]
var b6=b5.prototype
b6.constructor=b5
b6.$isc=b5
b6.$deferredAction=function(){}
return}finishClass(a6)
var b7=g[a6]
if(!b7)b7=existingIsolateProperties[a6]
var b5=g[c2]
var b6=z(b5,b7)
if(b0)b6.$deferredAction=mixinDeferredActionHelper(b0,b6)
if(Object.prototype.hasOwnProperty.call(b6,"%")){var b8=b6["%"].split(";")
if(b8[0]){var b9=b8[0].split("|")
for(var b3=0;b3<b9.length;b3++){init.interceptorsByTag[b9[b3]]=b5
init.leafTags[b9[b3]]=true}}if(b8[1]){b9=b8[1].split("|")
if(b8[2]){var c0=b8[2].split("|")
for(var b3=0;b3<c0.length;b3++){var c1=g[c0[b3]]
c1.$nativeSuperclassTag=b9[0]}}for(b3=0;b3<b9.length;b3++){init.interceptorsByTag[b9[b3]]=b5
init.leafTags[b9[b3]]=false}}b6.$deferredAction()}if(b6.$isf)b6.$deferredAction()}var a4=Object.keys(a5.pending)
for(var e=0;e<a4.length;e++)finishClass(a4[e])}function finishAddStubsHelper(){var g=this
while(!g.hasOwnProperty("$deferredAction"))g=g.__proto__
delete g.$deferredAction
var f=Object.keys(g)
for(var e=0;e<f.length;e++){var d=f[e]
var a0=d.charCodeAt(0)
var a1
if(d!=="^"&&d!=="$reflectable"&&a0!==43&&a0!==42&&(a1=g[d])!=null&&a1.constructor===Array&&d!=="<>")addStubs(g,a1,d,false,[])}convertToFastObject(g)
g=g.__proto__
g.$deferredAction()}function mixinDeferredActionHelper(d,e){var g
if(e.hasOwnProperty("$deferredAction"))g=e.$deferredAction
return function foo(){if(!supportsDirectProtoAccess)return
var f=this
while(!f.hasOwnProperty("$deferredAction"))f=f.__proto__
if(g)f.$deferredAction=g
else{delete f.$deferredAction
convertToFastObject(f)}d.$deferredAction()
f.$deferredAction()}}function processClassData(b2,b3,b4){b3=convertToSlowObject(b3)
var g
var f=Object.keys(b3)
var e=false
var d=supportsDirectProtoAccess&&b2!="c"
for(var a0=0;a0<f.length;a0++){var a1=f[a0]
var a2=a1.charCodeAt(0)
if(a1==="i"){processStatics(init.statics[b2]=b3.i,b4)
delete b3.i}else if(a2===43){w[g]=a1.substring(1)
var a3=b3[a1]
if(a3>0)b3[g].$reflectable=a3}else if(a2===42){b3[g].$D=b3[a1]
var a4=b3.$methodsWithOptionalArguments
if(!a4)b3.$methodsWithOptionalArguments=a4={}
a4[a1]=g}else{var a5=b3[a1]
if(a1!=="^"&&a5!=null&&a5.constructor===Array&&a1!=="<>")if(d)e=true
else addStubs(b3,a5,a1,false,[])
else g=a1}}if(e)b3.$deferredAction=finishAddStubsHelper
var a6=b3["^"],a7,a8,a9=a6
var b0=a9.split(";")
a9=b0[1]?b0[1].split(","):[]
a8=b0[0]
a7=a8.split(":")
if(a7.length==2){a8=a7[0]
var b1=a7[1]
if(b1)b3.$S=function(b5){return function(){return init.types[b5]}}(b1)}if(a8)b4.pending[b2]=a8
b4.combinedConstructorFunction+=defineClass(b2,a9)
b4.constructorsList.push(b2)
b4.collected[b2]=[m,b3]
i.push(b2)}function processStatics(a4,a5){var g=Object.keys(a4)
for(var f=0;f<g.length;f++){var e=g[f]
if(e==="^")continue
var d=a4[e]
var a0=e.charCodeAt(0)
var a1
if(a0===43){v[a1]=e.substring(1)
var a2=a4[e]
if(a2>0)a4[a1].$reflectable=a2
if(d&&d.length)init.typeInformation[a1]=d}else if(a0===42){m[a1].$D=d
var a3=a4.$methodsWithOptionalArguments
if(!a3)a4.$methodsWithOptionalArguments=a3={}
a3[e]=a1}else if(typeof d==="function"){m[a1=e]=d
h.push(e)}else if(d.constructor===Array)addStubs(m,d,e,true,h)
else{a1=e
processClassData(e,d,a5)}}}function addStubs(b6,b7,b8,b9,c0){var g=0,f=g,e=b7[g],d
if(typeof e=="string")d=b7[++g]
else{d=e
e=b8}if(typeof d=="number"){f=d
d=b7[++g]}b6[b8]=b6[e]=d
var a0=[d]
d.$stubName=b8
c0.push(b8)
for(g++;g<b7.length;g++){d=b7[g]
if(typeof d!="function")break
if(!b9)d.$stubName=b7[++g]
a0.push(d)
if(d.$stubName){b6[d.$stubName]=d
c0.push(d.$stubName)}}for(var a1=0;a1<a0.length;g++,a1++)a0[a1].$callName=b7[g]
var a2=b7[g]
b7=b7.slice(++g)
var a3=b7[0]
var a4=(a3&1)===1
a3=a3>>1
var a5=a3>>1
var a6=(a3&1)===1
var a7=a3===3
var a8=a3===1
var a9=b7[1]
var b0=a9>>1
var b1=(a9&1)===1
var b2=a5+b0
var b3=b7[2]
if(typeof b3=="number")b7[2]=b3+c
if(b>0){var b4=3
for(var a1=0;a1<b0;a1++){if(typeof b7[b4]=="number")b7[b4]=b7[b4]+b
b4++}for(var a1=0;a1<b2;a1++){b7[b4]=b7[b4]+b
b4++}}var b5=2*b0+a5+3
if(a2){d=tearOff(a0,f,b7,b9,b8,a4)
b6[b8].$getter=d
d.$getterStub=true
if(b9)c0.push(a2)
b6[a2]=d
a0.push(d)
d.$stubName=a2
d.$callName=null}}function tearOffGetter(d,e,f,g,a0){return a0?new Function("funcs","applyTrampolineIndex","reflectionInfo","name","H","c","return function tearOff_"+g+y+++"(receiver) {"+"if (c === null) c = "+"H.aa"+"("+"this, funcs, applyTrampolineIndex, reflectionInfo, false, true, name);"+"return new c(this, funcs[0], receiver, name);"+"}")(d,e,f,g,H,null):new Function("funcs","applyTrampolineIndex","reflectionInfo","name","H","c","return function tearOff_"+g+y+++"() {"+"if (c === null) c = "+"H.aa"+"("+"this, funcs, applyTrampolineIndex, reflectionInfo, false, false, name);"+"return new c(this, funcs[0], null, name);"+"}")(d,e,f,g,H,null)}function tearOff(d,e,f,a0,a1,a2){var g=null
return a0?function(){if(g===null)g=H.aa(this,d,e,f,true,false,a1).prototype
return g}:tearOffGetter(d,e,f,a1,a2)}var y=0
if(!init.libraries)init.libraries=[]
if(!init.mangledNames)init.mangledNames=map()
if(!init.mangledGlobalNames)init.mangledGlobalNames=map()
if(!init.statics)init.statics=map()
if(!init.typeInformation)init.typeInformation=map()
var x=init.libraries
var w=init.mangledNames
var v=init.mangledGlobalNames
var u=Object.prototype.hasOwnProperty
var t=a.length
var s=map()
s.collected=map()
s.pending=map()
s.constructorsList=[]
s.combinedConstructorFunction="function $reflectable(fn){fn.$reflectable=1;return fn};\n"+"var $desc;\n"
for(var r=0;r<t;r++){var q=a[r]
var p=q[0]
var o=q[1]
var n=q[2]
var m=q[3]
var l=q[4]
var k=!!q[5]
var j=l&&l["^"]
if(j instanceof Array)j=j[0]
var i=[]
var h=[]
processStatics(l,s)
x.push([p,o,i,h,n,j,k,m])}finishClasses(s)}I.aQ=function(){}
var dart=[["","",,H,{"^":"",cH:{"^":"c;a"}}],["","",,J,{"^":"",
ae:function(a,b,c,d){return{i:a,p:b,e:c,x:d}},
N:function(a){var z,y,x,w,v
z=a[init.dispatchPropertyName]
if(z==null)if($.ac==null){H.cn()
z=a[init.dispatchPropertyName]}if(z!=null){y=z.p
if(!1===y)return z.i
if(!0===y)return a
x=Object.getPrototypeOf(a)
if(y===x)return z.i
if(z.e===x)throw H.d(P.aH("Return interceptor for "+H.b(y(a,z))))}w=a.constructor
v=w==null?null:w[$.$get$a0()]
if(v!=null)return v
v=H.cs(a)
if(v!=null)return v
if(typeof a=="function")return C.u
y=Object.getPrototypeOf(a)
if(y==null)return C.h
if(y===Object.prototype)return C.h
if(typeof w=="function"){Object.defineProperty(w,$.$get$a0(),{value:C.d,enumerable:false,writable:true,configurable:true})
return C.d}return C.d},
f:{"^":"c;",
m:function(a,b){return a===b},
h:["I",function(a){return"Instance of '"+H.D(a)+"'"}],
"%":"ApplicationCacheErrorEvent|DOMError|DOMImplementation|ErrorEvent|Event|InputEvent|MediaError|NavigatorUserMediaError|OverconstrainedError|PositionError|Range|SQLError|SensorErrorEvent|SpeechRecognitionError"},
bj:{"^":"f;",
h:function(a){return String(a)},
$isc6:1},
bl:{"^":"f;",
m:function(a,b){return null==b},
h:function(a){return"null"},
$isbo:1},
a1:{"^":"f;",
h:["J",function(a){return String(a)}]},
br:{"^":"a1;"},
a4:{"^":"a1;"},
B:{"^":"a1;",
h:function(a){var z=a[$.$get$al()]
if(z==null)return this.J(a)
return"JavaScript function for "+H.b(J.H(z))},
$S:function(){return{func:1,opt:[,,,,,,,,,,,,,,,,]}}},
A:{"^":"f;$ti",
T:function(a,b){var z
for(z=0;z<a.length;++z)if(J.aY(a[z],b))return!0
return!1},
h:function(a){return P.X(a,"[","]")},
gC:function(a){return new J.b3(a,a.length,0)},
gj:function(a){return a.length},
$isn:1,
i:{
bi:function(a,b){return J.Y(H.a(a,[b]))},
Y:function(a){a.fixed$length=Array
return a}}},
cG:{"^":"A;$ti"},
b3:{"^":"c;a,b,c,0d",
gn:function(){return this.d},
p:function(){var z,y,x
z=this.a
y=z.length
if(this.b!==y)throw H.d(H.cw(z))
x=this.c
if(x>=y){this.d=null
return!1}this.d=z[x]
this.c=x+1
return!0}},
Z:{"^":"f;",
h:function(a){if(a===0&&1/a<0)return"-0.0"
else return""+a},
K:function(a,b){if((a|0)===a)if(b>=1||b<-1)return a/b|0
return this.E(a,b)},
q:function(a,b){return(a|0)===a?a/b|0:this.E(a,b)},
E:function(a,b){var z=a/b
if(z>=-2147483648&&z<=2147483647)return z|0
if(z>0){if(z!==1/0)return Math.floor(z)}else if(z>-1/0)return Math.ceil(z)
throw H.d(P.a5("Result of truncating division is "+H.b(z)+": "+H.b(a)+" ~/ "+b))},
P:function(a,b){var z
if(a>0)z=this.O(a,b)
else{z=b>31?31:b
z=a>>z>>>0}return z},
O:function(a,b){return b>31?0:a>>>b},
u:function(a,b){if(typeof b!=="number")throw H.d(H.a9(b))
return a<b},
$isaf:1},
ao:{"^":"Z;",$iscp:1},
bk:{"^":"Z;"},
a_:{"^":"f;",
N:function(a,b){if(b>=a.length)throw H.d(H.aO(a,b))
return a.charCodeAt(b)},
l:function(a,b){if(typeof b!=="string")throw H.d(P.b2(b,null,null))
return a+b},
D:function(a,b,c){if(c==null)c=a.length
if(b>c)throw H.d(P.a3(b,null,null))
if(c>a.length)throw H.d(P.a3(c,null,null))
return a.substring(b,c)},
H:function(a,b){return this.D(a,b,null)},
h:function(a){return a},
gj:function(a){return a.length},
$isu:1}}],["","",,H,{"^":"",bn:{"^":"c;a,b,c,0d",
gn:function(){return this.d},
p:function(){var z,y,x,w
z=this.a
y=J.ab(z)
x=y.gj(z)
if(this.b!==x)throw H.d(P.ak(z))
w=this.c
if(w>=x){this.d=null
return!1}this.d=y.B(z,w);++this.c
return!0}}}],["","",,H,{"^":"",
Q:function(a){var z=init.mangledGlobalNames[a]
if(typeof z==="string")return z
z="minified:"+a
return z},
ch:function(a){return init.types[a]},
cr:function(a,b){var z
if(b!=null){z=b.x
if(z!=null)return z}return!!J.z(a).$isC},
b:function(a){var z
if(typeof a==="string")return a
if(typeof a==="number"){if(a!==0)return""+a}else if(!0===a)return"true"
else if(!1===a)return"false"
else if(a==null)return"null"
z=J.H(a)
if(typeof z!=="string")throw H.d(H.a9(a))
return z},
D:function(a){return H.bs(a)+H.aL(H.cf(a),0,null)},
bs:function(a){var z,y,x,w,v,u,t,s,r
z=J.z(a)
y=z.constructor
if(typeof y=="function"){x=y.name
w=typeof x==="string"?x:null}else w=null
v=w==null
if(v||z===C.l||!!z.$isa4){u=C.f(a)
if(v)w=u
if(u==="Object"){t=a.constructor
if(typeof t=="function"){s=String(t).match(/^\s*function\s*([\w$]*)\s*\(/)
r=s==null?null:s[1]
if(typeof r==="string"&&/^\w+$/.test(r))w=r}}return w}w=w
return H.Q(w.length>1&&C.b.N(w,0)===36?C.b.H(w,1):w)},
ci:function(a){throw H.d(H.a9(a))},
k:function(a,b){if(a==null)J.R(a)
throw H.d(H.aO(a,b))},
aO:function(a,b){var z,y
if(typeof b!=="number"||Math.floor(b)!==b)return new P.q(!0,b,"index",null)
z=J.R(a)
if(!(b<0)){if(typeof z!=="number")return H.ci(z)
y=b>=z}else y=!0
if(y)return P.W(b,a,"index",null,z)
return P.a3(b,"index",null)},
a9:function(a){return new P.q(!0,a,null,null)},
d:function(a){var z
if(a==null)a=new P.aq()
z=new Error()
z.dartException=a
if("defineProperty" in Object){Object.defineProperty(z,"message",{get:H.aX})
z.name=""}else z.toString=H.aX
return z},
aX:function(){return J.H(this.dartException)},
cw:function(a){throw H.d(P.ak(a))},
cy:function(a){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l
z=new H.cz(a)
if(a==null)return
if(typeof a!=="object")return a
if("dartException" in a)return z.$1(a.dartException)
else if(!("message" in a))return a
y=a.message
if("number" in a&&typeof a.number=="number"){x=a.number
w=x&65535
if((C.a.P(x,16)&8191)===10)switch(w){case 438:return z.$1(H.a2(H.b(y)+" (Error "+w+")",null))
case 445:case 5007:return z.$1(H.ap(H.b(y)+" (Error "+w+")",null))}}if(a instanceof TypeError){v=$.$get$aw()
u=$.$get$ax()
t=$.$get$ay()
s=$.$get$az()
r=$.$get$aD()
q=$.$get$aE()
p=$.$get$aB()
$.$get$aA()
o=$.$get$aG()
n=$.$get$aF()
m=v.k(y)
if(m!=null)return z.$1(H.a2(y,m))
else{m=u.k(y)
if(m!=null){m.method="call"
return z.$1(H.a2(y,m))}else{m=t.k(y)
if(m==null){m=s.k(y)
if(m==null){m=r.k(y)
if(m==null){m=q.k(y)
if(m==null){m=p.k(y)
if(m==null){m=s.k(y)
if(m==null){m=o.k(y)
if(m==null){m=n.k(y)
l=m!=null}else l=!0}else l=!0}else l=!0}else l=!0}else l=!0}else l=!0}else l=!0
if(l)return z.$1(H.ap(y,m))}}return z.$1(new H.bD(typeof y==="string"?y:""))}if(a instanceof RangeError){if(typeof y==="string"&&y.indexOf("call stack")!==-1)return new P.as()
y=function(b){try{return String(b)}catch(k){}return null}(a)
return z.$1(new P.q(!1,null,null,typeof y==="string"?y.replace(/^RangeError:\s*/,""):y))}if(typeof InternalError=="function"&&a instanceof InternalError)if(typeof y==="string"&&y==="too much recursion")return new P.as()
return a},
cg:function(a){var z
if(a==null)return new H.aJ(a)
z=a.$cachedTrace
if(z!=null)return z
return a.$cachedTrace=new H.aJ(a)},
cq:function(a,b,c,d,e,f){switch(b){case 0:return a.$0()
case 1:return a.$1(c)
case 2:return a.$2(c,d)
case 3:return a.$3(c,d,e)
case 4:return a.$4(c,d,e,f)}throw H.d(new P.bK("Unsupported number of arguments for wrapped closure"))},
E:function(a,b){var z=a.$identity
if(!!z)return z
z=function(c,d,e){return function(f,g,h,i){return e(c,d,f,g,h,i)}}(a,b,H.cq)
a.$identity=z
return z},
b7:function(a,b,c,d,e,f,g){var z,y,x,w,v,u,t,s,r,q,p,o,n
z=b[0]
y=z.$callName
if(!!J.z(d).$isn){z.$reflectionInfo=d
x=H.bv(z).r}else x=d
w=e?Object.create(new H.bx().constructor.prototype):Object.create(new H.S(null,null,null,null).constructor.prototype)
w.$initialize=w.constructor
if(e)v=function static_tear_off(){this.$initialize()}
else{u=$.i
if(typeof u!=="number")return u.l()
$.i=u+1
u=new Function("a,b,c,d"+u,"this.$initialize(a,b,c,d"+u+")")
v=u}w.constructor=v
v.prototype=w
if(!e){t=H.aj(a,z,f)
t.$reflectionInfo=d}else{w.$static_name=g
t=z}if(typeof x=="number")s=function(h,i){return function(){return h(i)}}(H.ch,x)
else if(typeof x=="function")if(e)s=x
else{r=f?H.ai:H.T
s=function(h,i){return function(){return h.apply({$receiver:i(this)},arguments)}}(x,r)}else throw H.d("Error in reflectionInfo.")
w.$S=s
w[y]=t
for(q=t,p=1;p<b.length;++p){o=b[p]
n=o.$callName
if(n!=null){o=e?o:H.aj(a,o,f)
w[n]=o}if(p===c){o.$reflectionInfo=d
q=o}}w["call*"]=q
w.$R=z.$R
w.$D=z.$D
return v},
b4:function(a,b,c,d){var z=H.T
switch(b?-1:a){case 0:return function(e,f){return function(){return f(this)[e]()}}(c,z)
case 1:return function(e,f){return function(g){return f(this)[e](g)}}(c,z)
case 2:return function(e,f){return function(g,h){return f(this)[e](g,h)}}(c,z)
case 3:return function(e,f){return function(g,h,i){return f(this)[e](g,h,i)}}(c,z)
case 4:return function(e,f){return function(g,h,i,j){return f(this)[e](g,h,i,j)}}(c,z)
case 5:return function(e,f){return function(g,h,i,j,k){return f(this)[e](g,h,i,j,k)}}(c,z)
default:return function(e,f){return function(){return e.apply(f(this),arguments)}}(d,z)}},
aj:function(a,b,c){var z,y,x,w,v,u,t
if(c)return H.b6(a,b)
z=b.$stubName
y=b.length
x=a[z]
w=b==null?x==null:b===x
v=!w||y>=27
if(v)return H.b4(y,!w,z,b)
if(y===0){w=$.i
if(typeof w!=="number")return w.l()
$.i=w+1
u="self"+w
w="return function(){var "+u+" = this."
v=$.r
if(v==null){v=H.I("self")
$.r=v}return new Function(w+H.b(v)+";return "+u+"."+H.b(z)+"();}")()}t="abcdefghijklmnopqrstuvwxyz".split("").splice(0,y).join(",")
w=$.i
if(typeof w!=="number")return w.l()
$.i=w+1
t+=w
w="return function("+t+"){return this."
v=$.r
if(v==null){v=H.I("self")
$.r=v}return new Function(w+H.b(v)+"."+H.b(z)+"("+t+");}")()},
b5:function(a,b,c,d){var z,y
z=H.T
y=H.ai
switch(b?-1:a){case 0:throw H.d(new H.bw("Intercepted function with no arguments."))
case 1:return function(e,f,g){return function(){return f(this)[e](g(this))}}(c,z,y)
case 2:return function(e,f,g){return function(h){return f(this)[e](g(this),h)}}(c,z,y)
case 3:return function(e,f,g){return function(h,i){return f(this)[e](g(this),h,i)}}(c,z,y)
case 4:return function(e,f,g){return function(h,i,j){return f(this)[e](g(this),h,i,j)}}(c,z,y)
case 5:return function(e,f,g){return function(h,i,j,k){return f(this)[e](g(this),h,i,j,k)}}(c,z,y)
case 6:return function(e,f,g){return function(h,i,j,k,l){return f(this)[e](g(this),h,i,j,k,l)}}(c,z,y)
default:return function(e,f,g,h){return function(){h=[g(this)]
Array.prototype.push.apply(h,arguments)
return e.apply(f(this),h)}}(d,z,y)}},
b6:function(a,b){var z,y,x,w,v,u,t,s
z=$.r
if(z==null){z=H.I("self")
$.r=z}y=$.ah
if(y==null){y=H.I("receiver")
$.ah=y}x=b.$stubName
w=b.length
v=a[x]
u=b==null?v==null:b===v
t=!u||w>=28
if(t)return H.b5(w,!u,x,b)
if(w===1){z="return function(){return this."+H.b(z)+"."+H.b(x)+"(this."+H.b(y)+");"
y=$.i
if(typeof y!=="number")return y.l()
$.i=y+1
return new Function(z+y+"}")()}s="abcdefghijklmnopqrstuvwxyz".split("").splice(0,w-1).join(",")
z="return function("+s+"){return this."+H.b(z)+"."+H.b(x)+"(this."+H.b(y)+", "+s+");"
y=$.i
if(typeof y!=="number")return y.l()
$.i=y+1
return new Function(z+y+"}")()},
aa:function(a,b,c,d,e,f,g){return H.b7(a,b,c,d,!!e,!!f,g)},
cx:function(a){throw H.d(new P.b9(a))},
aR:function(a){return init.getIsolateTag(a)},
a:function(a,b){a.$ti=b
return a},
cf:function(a){if(a==null)return
return a.$ti},
o:function(a,b){var z,y
if(a==null)return"dynamic"
if(a===-1)return"void"
if(typeof a==="object"&&a!==null&&a.constructor===Array)return H.Q(a[0].builtin$cls)+H.aL(a,1,b)
if(typeof a=="function")return H.Q(a.builtin$cls)
if(a===-2)return"dynamic"
if(typeof a==="number"){if(b==null||a<0||a>=b.length)return"unexpected-generic-index:"+H.b(a)
z=b.length
y=z-a-1
if(y<0||y>=z)return H.k(b,y)
return H.b(b[y])}if('func' in a)return H.bX(a,b)
if('futureOr' in a)return"FutureOr<"+H.o("type" in a?a.type:null,b)+">"
return"unknown-reified-type"},
bX:function(a,b){var z,y,x,w,v,u,t,s,r,q,p,o,n,m,l,k,j,i,h
if("bounds" in a){z=a.bounds
if(b==null){b=H.a([],[P.u])
y=null}else y=b.length
x=b.length
for(w=z.length,v=w;v>0;--v)b.push("T"+(x+v))
for(u="<",t="",v=0;v<w;++v,t=", "){u+=t
s=b.length
r=s-v-1
if(r<0)return H.k(b,r)
u=C.b.l(u,b[r])
q=z[v]
if(q!=null&&q!==P.c)u+=" extends "+H.o(q,b)}u+=">"}else{u=""
y=null}p=!!a.v?"void":H.o(a.ret,b)
if("args" in a){o=a.args
for(s=o.length,n="",m="",l=0;l<s;++l,m=", "){k=o[l]
n=n+m+H.o(k,b)}}else{n=""
m=""}if("opt" in a){j=a.opt
n+=m+"["
for(s=j.length,m="",l=0;l<s;++l,m=", "){k=j[l]
n=n+m+H.o(k,b)}n+="]"}if("named" in a){i=a.named
n+=m+"{"
for(s=H.cb(i),r=s.length,m="",l=0;l<r;++l,m=", "){h=s[l]
n=n+m+H.o(i[h],b)+(" "+H.b(h))}n+="}"}if(y!=null)b.length=y
return u+"("+n+") => "+p},
aL:function(a,b,c){var z,y,x,w,v,u
if(a==null)return""
z=new P.at("")
for(y=b,x="",w=!0,v="";y<a.length;++y,x=", "){z.a=v+x
u=a[y]
if(u!=null)w=!1
v=z.a+=H.o(u,c)}return"<"+z.h(0)+">"},
cR:function(a,b,c){Object.defineProperty(a,b,{value:c,enumerable:false,writable:true,configurable:true})},
cs:function(a){var z,y,x,w,v,u
z=$.aS.$1(a)
y=$.M[z]
if(y!=null){Object.defineProperty(a,init.dispatchPropertyName,{value:y,enumerable:false,writable:true,configurable:true})
return y.i}x=$.O[z]
if(x!=null)return x
w=init.interceptorsByTag[z]
if(w==null){z=$.aM.$2(a,z)
if(z!=null){y=$.M[z]
if(y!=null){Object.defineProperty(a,init.dispatchPropertyName,{value:y,enumerable:false,writable:true,configurable:true})
return y.i}x=$.O[z]
if(x!=null)return x
w=init.interceptorsByTag[z]}}if(w==null)return
x=w.prototype
v=z[0]
if(v==="!"){y=H.P(x)
$.M[z]=y
Object.defineProperty(a,init.dispatchPropertyName,{value:y,enumerable:false,writable:true,configurable:true})
return y.i}if(v==="~"){$.O[z]=x
return x}if(v==="-"){u=H.P(x)
Object.defineProperty(Object.getPrototypeOf(a),init.dispatchPropertyName,{value:u,enumerable:false,writable:true,configurable:true})
return u.i}if(v==="+")return H.aU(a,x)
if(v==="*")throw H.d(P.aH(z))
if(init.leafTags[z]===true){u=H.P(x)
Object.defineProperty(Object.getPrototypeOf(a),init.dispatchPropertyName,{value:u,enumerable:false,writable:true,configurable:true})
return u.i}else return H.aU(a,x)},
aU:function(a,b){var z=Object.getPrototypeOf(a)
Object.defineProperty(z,init.dispatchPropertyName,{value:J.ae(b,z,null,null),enumerable:false,writable:true,configurable:true})
return b},
P:function(a){return J.ae(a,!1,null,!!a.$isC)},
ct:function(a,b,c){var z=b.prototype
if(init.leafTags[a]===true)return H.P(z)
else return J.ae(z,c,null,null)},
cn:function(){if(!0===$.ac)return
$.ac=!0
H.co()},
co:function(){var z,y,x,w,v,u,t,s
$.M=Object.create(null)
$.O=Object.create(null)
H.cj()
z=init.interceptorsByTag
y=Object.getOwnPropertyNames(z)
if(typeof window!="undefined"){window
x=function(){}
for(w=0;w<y.length;++w){v=y[w]
u=$.aV.$1(v)
if(u!=null){t=H.ct(v,z[v],u)
if(t!=null){Object.defineProperty(u,init.dispatchPropertyName,{value:t,enumerable:false,writable:true,configurable:true})
x.prototype=u}}}}for(w=0;w<y.length;++w){v=y[w]
if(/^[A-Za-z_]/.test(v)){s=z[v]
z["!"+v]=s
z["~"+v]=s
z["-"+v]=s
z["+"+v]=s
z["*"+v]=s}}},
cj:function(){var z,y,x,w,v,u,t
z=C.q()
z=H.p(C.n,H.p(C.t,H.p(C.e,H.p(C.e,H.p(C.r,H.p(C.o,H.p(C.p(C.f),z)))))))
if(typeof dartNativeDispatchHooksTransformer!="undefined"){y=dartNativeDispatchHooksTransformer
if(typeof y=="function")y=[y]
if(y.constructor==Array)for(x=0;x<y.length;++x){w=y[x]
if(typeof w=="function")z=w(z)||z}}v=z.getTag
u=z.getUnknownTag
t=z.prototypeForTag
$.aS=new H.ck(v)
$.aM=new H.cl(u)
$.aV=new H.cm(t)},
p:function(a,b){return a(b)||b},
bu:{"^":"c;a,b,c,d,e,f,r,0x",i:{
bv:function(a){var z,y,x
z=a.$reflectionInfo
if(z==null)return
z=J.Y(z)
y=z[0]
x=z[1]
return new H.bu(a,z,(y&2)===2,y>>2,x>>1,(x&1)===1,z[2])}}},
bB:{"^":"c;a,b,c,d,e,f",
k:function(a){var z,y,x
z=new RegExp(this.a).exec(a)
if(z==null)return
y=Object.create(null)
x=this.b
if(x!==-1)y.arguments=z[x+1]
x=this.c
if(x!==-1)y.argumentsExpr=z[x+1]
x=this.d
if(x!==-1)y.expr=z[x+1]
x=this.e
if(x!==-1)y.method=z[x+1]
x=this.f
if(x!==-1)y.receiver=z[x+1]
return y},
i:{
j:function(a){var z,y,x,w,v,u
a=a.replace(String({}),'$receiver$').replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")
z=a.match(/\\\$[a-zA-Z]+\\\$/g)
if(z==null)z=H.a([],[P.u])
y=z.indexOf("\\$arguments\\$")
x=z.indexOf("\\$argumentsExpr\\$")
w=z.indexOf("\\$expr\\$")
v=z.indexOf("\\$method\\$")
u=z.indexOf("\\$receiver\\$")
return new H.bB(a.replace(new RegExp('\\\\\\$arguments\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$argumentsExpr\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$expr\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$method\\\\\\$','g'),'((?:x|[^x])*)').replace(new RegExp('\\\\\\$receiver\\\\\\$','g'),'((?:x|[^x])*)'),y,x,w,v,u)},
K:function(a){return function($expr$){var $argumentsExpr$='$arguments$'
try{$expr$.$method$($argumentsExpr$)}catch(z){return z.message}}(a)},
aC:function(a){return function($expr$){try{$expr$.$method$}catch(z){return z.message}}(a)}}},
bp:{"^":"h;a,b",
h:function(a){var z=this.b
if(z==null)return"NoSuchMethodError: "+H.b(this.a)
return"NoSuchMethodError: method not found: '"+z+"' on null"},
i:{
ap:function(a,b){return new H.bp(a,b==null?null:b.method)}}},
bm:{"^":"h;a,b,c",
h:function(a){var z,y
z=this.b
if(z==null)return"NoSuchMethodError: "+H.b(this.a)
y=this.c
if(y==null)return"NoSuchMethodError: method not found: '"+z+"' ("+H.b(this.a)+")"
return"NoSuchMethodError: method not found: '"+z+"' on '"+y+"' ("+H.b(this.a)+")"},
i:{
a2:function(a,b){var z,y
z=b==null
y=z?null:b.method
return new H.bm(a,y,z?null:b.receiver)}}},
bD:{"^":"h;a",
h:function(a){var z=this.a
return z.length===0?"Error":"Error: "+z}},
cz:{"^":"e;a",
$1:function(a){if(!!J.z(a).$ish)if(a.$thrownJsError==null)a.$thrownJsError=this.a
return a}},
aJ:{"^":"c;a,0b",
h:function(a){var z,y
z=this.b
if(z!=null)return z
z=this.a
y=z!==null&&typeof z==="object"?z.stack:null
z=y==null?"":y
this.b=z
return z}},
e:{"^":"c;",
h:function(a){return"Closure '"+H.D(this).trim()+"'"},
gF:function(){return this},
gF:function(){return this}},
au:{"^":"e;"},
bx:{"^":"au;",
h:function(a){var z=this.$static_name
if(z==null)return"Closure of unknown static method"
return"Closure '"+H.Q(z)+"'"}},
S:{"^":"au;a,b,c,d",
m:function(a,b){if(b==null)return!1
if(this===b)return!0
if(!(b instanceof H.S))return!1
return this.a===b.a&&this.b===b.b&&this.c===b.c},
h:function(a){var z=this.c
if(z==null)z=this.a
return"Closure '"+H.b(this.d)+"' of "+("Instance of '"+H.D(z)+"'")},
i:{
T:function(a){return a.a},
ai:function(a){return a.c},
I:function(a){var z,y,x,w,v
z=new H.S("self","target","receiver","name")
y=J.Y(Object.getOwnPropertyNames(z))
for(x=y.length,w=0;w<x;++w){v=y[w]
if(z[v]===a)return v}}}},
bw:{"^":"h;a",
h:function(a){return"RuntimeError: "+this.a}},
ck:{"^":"e;a",
$1:function(a){return this.a(a)}},
cl:{"^":"e;a",
$2:function(a,b){return this.a(a,b)}},
cm:{"^":"e;a",
$1:function(a){return this.a(a)}}}],["","",,H,{"^":"",
cb:function(a){return J.bi(a?Object.keys(a):[],null)}}],["","",,P,{"^":"",
bF:function(){var z,y,x
z={}
if(self.scheduleImmediate!=null)return P.c3()
if(self.MutationObserver!=null&&self.document!=null){y=self.document.createElement("div")
x=self.document.createElement("span")
z.a=null
new self.MutationObserver(H.E(new P.bH(z),1)).observe(y,{childList:true})
return new P.bG(z,y,x)}else if(self.setImmediate!=null)return P.c4()
return P.c5()},
cM:[function(a){self.scheduleImmediate(H.E(new P.bI(a),0))},"$1","c3",4,0,0],
cN:[function(a){self.setImmediate(H.E(new P.bJ(a),0))},"$1","c4",4,0,0],
cO:[function(a){P.bQ(0,a)},"$1","c5",4,0,0],
av:function(a,b){var z=C.a.q(a.a,1000)
return P.bR(z<0?0:z,b)},
bZ:function(){var z,y
for(;z=$.x,z!=null;){$.w=null
y=z.b
$.x=y
if(y==null)$.L=null
z.a.$0()}},
cQ:[function(){$.a7=!0
try{P.bZ()}finally{$.w=null
$.a7=!1
if($.x!=null)$.$get$a6().$1(P.aN())}},"$0","aN",0,0,1],
c2:function(a){var z,y,x,w
z=$.x
if(z==null){y=new P.aI(a)
$.L=y
$.x=y
if(!$.a7)$.$get$a6().$1(P.aN())
$.w=$.L
return}x=new P.aI(a)
w=$.w
if(w==null){x.b=z
$.w=x
$.x=x}else{x.b=w.b
w.b=x
$.w=x
if(x.b==null)$.L=x}},
bA:function(a,b){var z,y
z=$.v
if(z===C.c){z.toString
return P.av(a,b)}y=z.R(b)
$.v.toString
return P.av(a,y)},
c_:function(a,b,c,d,e){var z={}
z.a=d
P.c2(new P.c0(z,e))},
c1:function(a,b,c,d,e){var z,y
y=$.v
if(y===c)return d.$1(e)
$.v=c
z=y
try{y=d.$1(e)
return y}finally{$.v=z}},
bH:{"^":"e;a",
$1:function(a){var z,y
z=this.a
y=z.a
z.a=null
y.$0()}},
bG:{"^":"e;a,b,c",
$1:function(a){var z,y
this.a.a=a
z=this.b
y=this.c
z.firstChild?z.removeChild(y):z.appendChild(y)}},
bI:{"^":"e;a",
$0:function(){this.a.$0()}},
bJ:{"^":"e;a",
$0:function(){this.a.$0()}},
aK:{"^":"c;a,0b,c",
L:function(a,b){if(self.setTimeout!=null)this.b=self.setTimeout(H.E(new P.bT(this,b),0),a)
else throw H.d(P.a5("`setTimeout()` not found."))},
M:function(a,b){if(self.setTimeout!=null)this.b=self.setInterval(H.E(new P.bS(this,a,Date.now(),b),0),a)
else throw H.d(P.a5("Periodic timer."))},
$isbz:1,
i:{
bQ:function(a,b){var z=new P.aK(!0,0)
z.L(a,b)
return z},
bR:function(a,b){var z=new P.aK(!1,0)
z.M(a,b)
return z}}},
bT:{"^":"e;a,b",
$0:function(){var z=this.a
z.b=null
z.c=1
this.b.$0()}},
bS:{"^":"e;a,b,c,d",
$0:function(){var z,y,x,w
z=this.a
y=z.c+1
x=this.b
if(x>0){w=Date.now()-this.c
if(w>(y+1)*x)y=C.a.K(w,x)}z.c=y
this.d.$1(z)}},
aI:{"^":"c;a,0b"},
bz:{"^":"c;"},
bU:{"^":"c;"},
c0:{"^":"e;a,b",
$0:function(){var z,y,x
z=this.a
y=z.a
if(y==null){x=new P.aq()
z.a=x
z=x}else z=y
y=this.b
if(y==null)throw H.d(z)
x=H.d(z)
x.stack=y.h(0)
throw x}},
bO:{"^":"bU;",
X:function(a,b){var z,y,x
try{if(C.c===$.v){a.$1(b)
return}P.c1(null,null,this,a,b)}catch(x){z=H.cy(x)
y=H.cg(x)
P.c_(null,null,this,z,y)}},
Y:function(a,b){return this.X(a,b,null)},
S:function(a){return new P.bP(this,a)},
R:function(a){return this.S(a,null)}},
bP:{"^":"e;a,b",
$1:function(a){return this.a.Y(this.b,a)}}}],["","",,P,{"^":"",
X:function(a,b,c){var z,y,x
if(P.bY(a))return b+"..."+c
z=new P.at(b)
y=$.$get$a8()
y.push(a)
try{x=z
x.a=P.by(x.gv(),a,", ")}finally{if(0>=y.length)return H.k(y,-1)
y.pop()}y=z
y.a=y.gv()+c
y=z.gv()
return y.charCodeAt(0)==0?y:y},
bY:function(a){var z,y
for(z=0;y=$.$get$a8(),z<y.length;++z)if(a===y[z])return!0
return!1},
J:{"^":"c;$ti",
gC:function(a){return new H.bn(a,this.gj(a),0)},
B:function(a,b){return this.t(a,b)},
h:function(a){return P.X(a,"[","]")}}}],["","",,P,{"^":"",
be:function(a){if(a instanceof H.e)return a.h(0)
return"Instance of '"+H.D(a)+"'"},
am:function(a){if(typeof a==="number"||typeof a==="boolean"||null==a)return J.H(a)
if(typeof a==="string")return JSON.stringify(a)
return P.be(a)},
c6:{"^":"c;",
h:function(a){return this?"true":"false"}},
"+bool":0,
cS:{"^":"af;"},
"+double":0,
U:{"^":"c;a",
u:function(a,b){return C.a.u(this.a,b.gZ())},
m:function(a,b){if(b==null)return!1
if(!(b instanceof P.U))return!1
return this.a===b.a},
h:function(a){var z,y,x,w,v
z=new P.bc()
y=this.a
if(y<0)return"-"+new P.U(0-y).h(0)
x=z.$1(C.a.q(y,6e7)%60)
w=z.$1(C.a.q(y,1e6)%60)
v=new P.bb().$1(y%1e6)
return""+C.a.q(y,36e8)+":"+H.b(x)+":"+H.b(w)+"."+H.b(v)}},
bb:{"^":"e;",
$1:function(a){if(a>=1e5)return""+a
if(a>=1e4)return"0"+a
if(a>=1000)return"00"+a
if(a>=100)return"000"+a
if(a>=10)return"0000"+a
return"00000"+a}},
bc:{"^":"e;",
$1:function(a){if(a>=10)return""+a
return"0"+a}},
h:{"^":"c;"},
aq:{"^":"h;",
h:function(a){return"Throw of null."}},
q:{"^":"h;a,b,c,d",
gA:function(){return"Invalid argument"+(!this.a?"(s)":"")},
gw:function(){return""},
h:function(a){var z,y,x,w,v,u
z=this.c
y=z!=null?" ("+z+")":""
z=this.d
x=z==null?"":": "+z
w=this.gA()+y+x
if(!this.a)return w
v=this.gw()
u=P.am(this.b)
return w+v+": "+H.b(u)},
i:{
b2:function(a,b,c){return new P.q(!0,a,b,c)}}},
ar:{"^":"q;e,f,a,b,c,d",
gA:function(){return"RangeError"},
gw:function(){var z,y,x
z=this.e
if(z==null){z=this.f
y=z!=null?": Not less than or equal to "+H.b(z):""}else{x=this.f
if(x==null)y=": Not greater than or equal to "+H.b(z)
else if(x>z)y=": Not in range "+H.b(z)+".."+H.b(x)+", inclusive"
else y=x<z?": Valid value range is empty":": Only valid value is "+H.b(z)}return y},
i:{
bt:function(a){return new P.ar(null,null,!1,null,null,a)},
a3:function(a,b,c){return new P.ar(null,null,!0,a,b,"Value not in range")}}},
bh:{"^":"q;e,j:f>,a,b,c,d",
gA:function(){return"RangeError"},
gw:function(){if(J.aZ(this.b,0))return": index must not be negative"
var z=this.f
if(z===0)return": no indices are valid"
return": index should be less than "+H.b(z)},
i:{
W:function(a,b,c,d,e){var z=e!=null?e:J.R(b)
return new P.bh(b,z,!0,a,c,"Index out of range")}}},
bE:{"^":"h;a",
h:function(a){return"Unsupported operation: "+this.a},
i:{
a5:function(a){return new P.bE(a)}}},
bC:{"^":"h;a",
h:function(a){var z=this.a
return z!=null?"UnimplementedError: "+z:"UnimplementedError"},
i:{
aH:function(a){return new P.bC(a)}}},
b8:{"^":"h;a",
h:function(a){var z=this.a
if(z==null)return"Concurrent modification during iteration."
return"Concurrent modification during iteration: "+H.b(P.am(z))+"."},
i:{
ak:function(a){return new P.b8(a)}}},
as:{"^":"c;",
h:function(a){return"Stack Overflow"},
$ish:1},
b9:{"^":"h;a",
h:function(a){var z=this.a
return z==null?"Reading static variable during its initialization":"Reading static variable '"+z+"' during its initialization"}},
bK:{"^":"c;a",
h:function(a){return"Exception: "+this.a}},
cp:{"^":"af;"},
"+int":0,
n:{"^":"c;$ti"},
"+List":0,
bo:{"^":"c;",
h:function(a){return"null"}},
"+Null":0,
af:{"^":"c;"},
"+num":0,
c:{"^":";",
m:function(a,b){return this===b},
h:function(a){return"Instance of '"+H.D(this)+"'"},
toString:function(){return this.h(this)}},
u:{"^":"c;"},
"+String":0,
at:{"^":"c;v:a<",
gj:function(a){return this.a.length},
h:function(a){var z=this.a
return z.charCodeAt(0)==0?z:z},
i:{
by:function(a,b,c){var z=J.b0(b)
if(!z.p())return a
if(c.length===0){do a+=H.b(z.gn())
while(z.p())}else{a+=H.b(z.gn())
for(;z.p();)a=a+c+H.b(z.gn())}return a}}}}],["","",,W,{"^":"",t:{"^":"bd;","%":"HTMLAudioElement|HTMLBRElement|HTMLBaseElement|HTMLButtonElement|HTMLCanvasElement|HTMLContentElement|HTMLDListElement|HTMLDataElement|HTMLDataListElement|HTMLDetailsElement|HTMLDialogElement|HTMLDirectoryElement|HTMLEmbedElement|HTMLFieldSetElement|HTMLFontElement|HTMLFrameElement|HTMLFrameSetElement|HTMLHRElement|HTMLHeadElement|HTMLHeadingElement|HTMLHtmlElement|HTMLIFrameElement|HTMLImageElement|HTMLInputElement|HTMLLIElement|HTMLLabelElement|HTMLLegendElement|HTMLLinkElement|HTMLMapElement|HTMLMarqueeElement|HTMLMediaElement|HTMLMenuElement|HTMLMetaElement|HTMLMeterElement|HTMLModElement|HTMLOListElement|HTMLObjectElement|HTMLOptGroupElement|HTMLOptionElement|HTMLOutputElement|HTMLParagraphElement|HTMLParamElement|HTMLPictureElement|HTMLPreElement|HTMLProgressElement|HTMLQuoteElement|HTMLScriptElement|HTMLShadowElement|HTMLSlotElement|HTMLSourceElement|HTMLSpanElement|HTMLStyleElement|HTMLTableCaptionElement|HTMLTableCellElement|HTMLTableColElement|HTMLTableDataCellElement|HTMLTableElement|HTMLTableHeaderCellElement|HTMLTableRowElement|HTMLTableSectionElement|HTMLTemplateElement|HTMLTextAreaElement|HTMLTimeElement|HTMLTitleElement|HTMLTrackElement|HTMLUListElement|HTMLUnknownElement|HTMLVideoElement;HTMLElement"},cB:{"^":"t;",
h:function(a){return String(a)},
"%":"HTMLAnchorElement"},cC:{"^":"t;",
h:function(a){return String(a)},
"%":"HTMLAreaElement"},ag:{"^":"t;",$isag:1,"%":"HTMLBodyElement"},cD:{"^":"m;0j:length=","%":"CDATASection|CharacterData|Comment|ProcessingInstruction|Text"},ba:{"^":"t;","%":"HTMLDivElement"},cE:{"^":"f;",
h:function(a){return String(a)},
"%":"DOMException"},bd:{"^":"m;",
h:function(a){return a.localName},
U:function(a,b,c,d){var z,y,x,w,v
if($.l==null){z=document
y=z.implementation.createHTMLDocument("")
$.l=y
$.V=y.createRange()
y=$.l
y.toString
x=y.createElement("base")
x.href=z.baseURI
$.l.head.appendChild(x)}z=$.l
if(z.body==null){z.toString
y=z.createElement("body")
z.body=y}z=$.l
if(!!this.$isag)w=z.body
else{y=a.tagName
z.toString
w=z.createElement(y)
$.l.body.appendChild(w)}if("createContextualFragment" in window.Range.prototype&&!C.m.T(C.v,a.tagName)){$.V.selectNodeContents(w)
v=$.V.createContextualFragment(b)}else{w.innerHTML=b
v=$.l.createDocumentFragment()
for(;z=w.firstChild,z!=null;)v.appendChild(z)}z=$.l.body
if(w==null?z!=null:w!==z)J.b1(w)
c.G(v)
document.adoptNode(v)
return v},
"%":"SVGAElement|SVGAnimateElement|SVGAnimateMotionElement|SVGAnimateTransformElement|SVGAnimationElement|SVGCircleElement|SVGClipPathElement|SVGComponentTransferFunctionElement|SVGDefsElement|SVGDescElement|SVGDiscardElement|SVGElement|SVGEllipseElement|SVGFEBlendElement|SVGFEColorMatrixElement|SVGFEComponentTransferElement|SVGFECompositeElement|SVGFEConvolveMatrixElement|SVGFEDiffuseLightingElement|SVGFEDisplacementMapElement|SVGFEDistantLightElement|SVGFEDropShadowElement|SVGFEFloodElement|SVGFEFuncAElement|SVGFEFuncBElement|SVGFEFuncGElement|SVGFEFuncRElement|SVGFEGaussianBlurElement|SVGFEImageElement|SVGFEMergeElement|SVGFEMergeNodeElement|SVGFEMorphologyElement|SVGFEOffsetElement|SVGFEPointLightElement|SVGFESpecularLightingElement|SVGFESpotLightElement|SVGFETileElement|SVGFETurbulenceElement|SVGFilterElement|SVGForeignObjectElement|SVGGElement|SVGGeometryElement|SVGGradientElement|SVGGraphicsElement|SVGImageElement|SVGLineElement|SVGLinearGradientElement|SVGMPathElement|SVGMarkerElement|SVGMaskElement|SVGMetadataElement|SVGPathElement|SVGPatternElement|SVGPolygonElement|SVGPolylineElement|SVGRadialGradientElement|SVGRectElement|SVGSVGElement|SVGScriptElement|SVGSetElement|SVGStopElement|SVGStyleElement|SVGSwitchElement|SVGSymbolElement|SVGTSpanElement|SVGTextContentElement|SVGTextElement|SVGTextPathElement|SVGTextPositioningElement|SVGTitleElement|SVGUseElement|SVGViewElement;Element"},bf:{"^":"f;","%":"DOMWindow|Window;EventTarget"},cF:{"^":"t;0j:length=","%":"HTMLFormElement"},cI:{"^":"f;",
h:function(a){return String(a)},
"%":"Location"},m:{"^":"bf;",
W:function(a){var z=a.parentNode
if(z!=null)z.removeChild(a)},
h:function(a){var z=a.nodeValue
return z==null?this.I(a):z},
"%":"Attr|Document|DocumentFragment|DocumentType|HTMLDocument|ShadowRoot|XMLDocument;Node"},cJ:{"^":"bN;",
gj:function(a){return a.length},
t:function(a,b){if(b>>>0!==b||b>=a.length)throw H.d(P.W(b,a,null,null,null))
return a[b]},
B:function(a,b){if(b<0||b>=a.length)return H.k(a,b)
return a[b]},
$isC:1,
$asC:function(){return[W.m]},
$asJ:function(){return[W.m]},
$isn:1,
$asn:function(){return[W.m]},
"%":"NodeList|RadioNodeList"},cL:{"^":"t;0j:length=","%":"HTMLSelectElement"},cP:{"^":"bW;",
gj:function(a){return a.length},
t:function(a,b){if(b>>>0!==b||b>=a.length)throw H.d(P.W(b,a,null,null,null))
return a[b]},
B:function(a,b){if(b<0||b>=a.length)return H.k(a,b)
return a[b]},
$isC:1,
$asC:function(){return[W.m]},
$asJ:function(){return[W.m]},
$isn:1,
$asn:function(){return[W.m]},
"%":"MozNamedAttrMap|NamedNodeMap"},an:{"^":"c;",
gC:function(a){return new W.bg(a,this.gj(a),-1)}},bg:{"^":"c;a,b,c,0d",
p:function(){var z,y
z=this.c+1
y=this.b
if(z<y){this.d=J.b_(this.a,z)
this.c=z
return!0}this.d=null
this.c=y
return!1},
gn:function(){return this.d}},cK:{"^":"c;"},bM:{"^":"f+J;"},bN:{"^":"bM+an;"},bV:{"^":"f+J;"},bW:{"^":"bV+an;"}}],["","",,P,{"^":"",bL:{"^":"c;",
V:function(a){if(a<=0||a>4294967296)throw H.d(P.bt("max must be in range 0 < max \u2264 2^32, was "+a))
return Math.random()*a>>>0}}}],["","",,P,{"^":""}],["","",,P,{"^":""}],["","",,X,{"^":"",
aT:function(){X.c8()
X.c9()
X.aW()
X.cu()},
c8:function(){var z,y
z=$.F*$.y
for(y=0;y<z;++y)$.$get$G().push(0)},
c9:function(){var z,y,x
for(z=0;y=$.y,z<y;++z){x=y*$.F-y+z
y=$.$get$G()
if(x<0||x>=y.length)return H.k(y,x)
y[x]=36}},
aW:function(){var z,y,x,w,v,u,t,s
for(z="<table cellpadding=0 cellspacing=0>",y=0;y<$.F;++y){z+="<tr>"
for(x=0;w=$.y,x<w;++x){v=x+w*y
w=$.$get$G()
if(v>=w.length)return H.k(w,v)
u=w[v]
w=$.$get$aP()
if(u<0||u>=37)return H.k(w,u)
t=P.X(w[u],"[","]")
t=C.b.D(t,1,t.length-1)
z=$.ca?z+"<td>"+('<div class="pixel-index">'+v+" </div>")+('<div style="color: rgb('+t+')">'+u+"</div>")+"</td>":z+('<td class="pixel" style="background-color: rgb('+t+')"> </td>')}z+="</tr>"}z+="</table>"
s=document.querySelector("#fireCanvas")
s.textContent=null
s.appendChild((s&&C.j).U(s,z,new X.bq(),null))},
c7:function(){var z,y
for(z=0;z<$.y;++z)for(y=0;y<$.F;++y)X.cA(z+$.y*y)
X.aW()},
cA:function(a){var z,y,x,w,v,u
z=$.y
y=a+z
if(y>=z*$.F)return
x=C.i.V(3)
z=$.$get$G()
w=z.length
if(y>=w)return H.k(z,y)
v=z[y]-x
v=v>=0?v:0
u=a-x
if(u<0||u>=w)return H.k(z,u)
z[u]=v},
cu:function(){P.bA(C.k,new X.cv())},
cv:{"^":"e;",
$1:function(a){return X.c7()}},
bq:{"^":"c;",
G:function(a){}}},1]]
setupProgram(dart,0,0)
J.z=function(a){if(typeof a=="number"){if(Math.floor(a)==a)return J.ao.prototype
return J.bk.prototype}if(typeof a=="string")return J.a_.prototype
if(a==null)return J.bl.prototype
if(typeof a=="boolean")return J.bj.prototype
if(a.constructor==Array)return J.A.prototype
if(typeof a!="object"){if(typeof a=="function")return J.B.prototype
return a}if(a instanceof P.c)return a
return J.N(a)}
J.ab=function(a){if(typeof a=="string")return J.a_.prototype
if(a==null)return a
if(a.constructor==Array)return J.A.prototype
if(typeof a!="object"){if(typeof a=="function")return J.B.prototype
return a}if(a instanceof P.c)return a
return J.N(a)}
J.cc=function(a){if(a==null)return a
if(a.constructor==Array)return J.A.prototype
if(typeof a!="object"){if(typeof a=="function")return J.B.prototype
return a}if(a instanceof P.c)return a
return J.N(a)}
J.cd=function(a){if(typeof a=="number")return J.Z.prototype
if(a==null)return a
if(!(a instanceof P.c))return J.a4.prototype
return a}
J.ce=function(a){if(a==null)return a
if(typeof a!="object"){if(typeof a=="function")return J.B.prototype
return a}if(a instanceof P.c)return a
return J.N(a)}
J.aY=function(a,b){if(a==null)return b==null
if(typeof a!="object")return b!=null&&a===b
return J.z(a).m(a,b)}
J.aZ=function(a,b){if(typeof a=="number"&&typeof b=="number")return a<b
return J.cd(a).u(a,b)}
J.b_=function(a,b){if(typeof b==="number")if(a.constructor==Array||typeof a=="string"||H.cr(a,a[init.dispatchPropertyName]))if(b>>>0===b&&b<a.length)return a[b]
return J.ab(a).t(a,b)}
J.b0=function(a){return J.cc(a).gC(a)}
J.R=function(a){return J.ab(a).gj(a)}
J.b1=function(a){return J.ce(a).W(a)}
J.H=function(a){return J.z(a).h(a)}
I.ad=function(a){a.immutable$list=Array
a.fixed$length=Array
return a}
var $=I.p
C.j=W.ba.prototype
C.l=J.f.prototype
C.m=J.A.prototype
C.a=J.ao.prototype
C.b=J.a_.prototype
C.u=J.B.prototype
C.h=J.br.prototype
C.d=J.a4.prototype
C.i=new P.bL()
C.c=new P.bO()
C.k=new P.U(1000)
C.n=function(hooks) {
  if (typeof dartExperimentalFixupGetTag != "function") return hooks;
  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);
}
C.o=function(hooks) {
  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";
  if (userAgent.indexOf("Firefox") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "GeoGeolocation": "Geolocation",
    "Location": "!Location",
    "WorkerMessageEvent": "MessageEvent",
    "XMLDocument": "!Document"};
  function getTagFirefox(o) {
    var tag = getTag(o);
    return quickMap[tag] || tag;
  }
  hooks.getTag = getTagFirefox;
}
C.e=function(hooks) { return hooks; }

C.p=function(getTagFallback) {
  return function(hooks) {
    if (typeof navigator != "object") return hooks;
    var ua = navigator.userAgent;
    if (ua.indexOf("DumpRenderTree") >= 0) return hooks;
    if (ua.indexOf("Chrome") >= 0) {
      function confirm(p) {
        return typeof window == "object" && window[p] && window[p].name == p;
      }
      if (confirm("Window") && confirm("HTMLElement")) return hooks;
    }
    hooks.getTag = getTagFallback;
  };
}
C.q=function() {
  var toStringFunction = Object.prototype.toString;
  function getTag(o) {
    var s = toStringFunction.call(o);
    return s.substring(8, s.length - 1);
  }
  function getUnknownTag(object, tag) {
    if (/^HTML[A-Z].*Element$/.test(tag)) {
      var name = toStringFunction.call(object);
      if (name == "[object Object]") return null;
      return "HTMLElement";
    }
  }
  function getUnknownTagGenericBrowser(object, tag) {
    if (self.HTMLElement && object instanceof HTMLElement) return "HTMLElement";
    return getUnknownTag(object, tag);
  }
  function prototypeForTag(tag) {
    if (typeof window == "undefined") return null;
    if (typeof window[tag] == "undefined") return null;
    var constructor = window[tag];
    if (typeof constructor != "function") return null;
    return constructor.prototype;
  }
  function discriminator(tag) { return null; }
  var isBrowser = typeof navigator == "object";
  return {
    getTag: getTag,
    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,
    prototypeForTag: prototypeForTag,
    discriminator: discriminator };
}
C.r=function(hooks) {
  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";
  if (userAgent.indexOf("Trident/") == -1) return hooks;
  var getTag = hooks.getTag;
  var quickMap = {
    "BeforeUnloadEvent": "Event",
    "DataTransfer": "Clipboard",
    "HTMLDDElement": "HTMLElement",
    "HTMLDTElement": "HTMLElement",
    "HTMLPhraseElement": "HTMLElement",
    "Position": "Geoposition"
  };
  function getTagIE(o) {
    var tag = getTag(o);
    var newTag = quickMap[tag];
    if (newTag) return newTag;
    if (tag == "Object") {
      if (window.DataView && (o instanceof window.DataView)) return "DataView";
    }
    return tag;
  }
  function prototypeForTagIE(tag) {
    var constructor = window[tag];
    if (constructor == null) return null;
    return constructor.prototype;
  }
  hooks.getTag = getTagIE;
  hooks.prototypeForTag = prototypeForTagIE;
}
C.t=function(hooks) {
  var getTag = hooks.getTag;
  var prototypeForTag = hooks.prototypeForTag;
  function getTagFixed(o) {
    var tag = getTag(o);
    if (tag == "Document") {
      if (!!o.xmlVersion) return "!Document";
      return "!HTMLDocument";
    }
    return tag;
  }
  function prototypeForTagFixed(tag) {
    if (tag == "Document") return null;
    return prototypeForTag(tag);
  }
  hooks.getTag = getTagFixed;
  hooks.prototypeForTag = prototypeForTagFixed;
}
C.f=function getTagFallback(o) {
  var s = Object.prototype.toString.call(o);
  return s.substring(8, s.length - 1);
}
C.v=H.a(I.ad(["HEAD","AREA","BASE","BASEFONT","BR","COL","COLGROUP","EMBED","FRAME","FRAMESET","HR","IMAGE","IMG","INPUT","ISINDEX","LINK","META","PARAM","SOURCE","STYLE","TITLE","WBR"]),[P.u])
$.i=0
$.r=null
$.ah=null
$.aS=null
$.aM=null
$.aV=null
$.M=null
$.O=null
$.ac=null
$.x=null
$.L=null
$.w=null
$.a7=!1
$.v=C.c
$.l=null
$.V=null
$.y=50
$.F=50
$.ca=!1
$=null
init.isHunkLoaded=function(a){return!!$dart_deferred_initializers$[a]}
init.deferredInitialized=new Object(null)
init.isHunkInitialized=function(a){return init.deferredInitialized[a]}
init.initializeLoadedHunk=function(a){var z=$dart_deferred_initializers$[a]
if(z==null)throw"DeferredLoading state error: code with hash '"+a+"' was not loaded"
z($globals$,$)
init.deferredInitialized[a]=true}
init.deferredLibraryParts={}
init.deferredPartUris=[]
init.deferredPartHashes=[];(function(a){for(var z=0;z<a.length;){var y=a[z++]
var x=a[z++]
var w=a[z++]
I.$lazy(y,x,w)}})(["al","$get$al",function(){return H.aR("_$dart_dartClosure")},"a0","$get$a0",function(){return H.aR("_$dart_js")},"aw","$get$aw",function(){return H.j(H.K({
toString:function(){return"$receiver$"}}))},"ax","$get$ax",function(){return H.j(H.K({$method$:null,
toString:function(){return"$receiver$"}}))},"ay","$get$ay",function(){return H.j(H.K(null))},"az","$get$az",function(){return H.j(function(){var $argumentsExpr$='$arguments$'
try{null.$method$($argumentsExpr$)}catch(z){return z.message}}())},"aD","$get$aD",function(){return H.j(H.K(void 0))},"aE","$get$aE",function(){return H.j(function(){var $argumentsExpr$='$arguments$'
try{(void 0).$method$($argumentsExpr$)}catch(z){return z.message}}())},"aB","$get$aB",function(){return H.j(H.aC(null))},"aA","$get$aA",function(){return H.j(function(){try{null.$method$}catch(z){return z.message}}())},"aG","$get$aG",function(){return H.j(H.aC(void 0))},"aF","$get$aF",function(){return H.j(function(){try{(void 0).$method$}catch(z){return z.message}}())},"a6","$get$a6",function(){return P.bF()},"a8","$get$a8",function(){return[]},"G","$get$G",function(){return[]},"aP","$get$aP",function(){var z=[P.u]
return H.a([H.a(["7,7,7"],z),H.a(["31,7,7"],z),H.a(["47,15,7"],z),H.a(["71,15,7"],z),H.a(["87,23,7"],z),H.a(["103,31,7"],z),H.a(["119,31,7"],z),H.a(["143,39,7"],z),H.a(["159,47,7"],z),H.a(["175,63,7"],z),H.a(["191,71,7"],z),H.a(["199,71,7"],z),H.a(["223,79,7"],z),H.a(["223,87,7"],z),H.a(["223,87,7"],z),H.a(["215,95,7"],z),H.a(["215,95,7"],z),H.a(["215,103,15"],z),H.a(["207,111,15"],z),H.a(["207,119,15"],z),H.a(["207,127,15"],z),H.a(["207,135,23"],z),H.a(["199,135,23"],z),H.a(["199,143,23"],z),H.a(["199,151,31"],z),H.a(["191,159,31"],z),H.a(["191,159,31"],z),H.a(["191,167,39"],z),H.a(["191,167,39"],z),H.a(["191,175,47"],z),H.a(["183,175,47"],z),H.a(["183,183,47"],z),H.a(["183,183,55"],z),H.a(["207,207,111"],z),H.a(["223,223,159"],z),H.a(["239,239,199"],z),H.a(["255,255,255"],z)],[[P.n,P.u]])}])
I=I.$finishIsolateConstructor(I)
$=new I()
init.metadata=[]
init.types=[{func:1,ret:-1,args:[{func:1,ret:-1}]},{func:1,ret:-1}]
function convertToFastObject(a){function MyClass(){}MyClass.prototype=a
new MyClass()
return a}function convertToSlowObject(a){a.__MAGIC_SLOW_PROPERTY=1
delete a.__MAGIC_SLOW_PROPERTY
return a}A=convertToFastObject(A)
B=convertToFastObject(B)
C=convertToFastObject(C)
D=convertToFastObject(D)
E=convertToFastObject(E)
F=convertToFastObject(F)
G=convertToFastObject(G)
H=convertToFastObject(H)
J=convertToFastObject(J)
K=convertToFastObject(K)
L=convertToFastObject(L)
M=convertToFastObject(M)
N=convertToFastObject(N)
O=convertToFastObject(O)
P=convertToFastObject(P)
Q=convertToFastObject(Q)
R=convertToFastObject(R)
S=convertToFastObject(S)
T=convertToFastObject(T)
U=convertToFastObject(U)
V=convertToFastObject(V)
W=convertToFastObject(W)
X=convertToFastObject(X)
Y=convertToFastObject(Y)
Z=convertToFastObject(Z)
function init(){I.p=Object.create(null)
init.allClasses=map()
init.getTypeFromName=function(a){return init.allClasses[a]}
init.interceptorsByTag=map()
init.leafTags=map()
init.finishedClasses=map()
I.$lazy=function(a,b,c,d,e){if(!init.lazies)init.lazies=Object.create(null)
init.lazies[a]=b
e=e||I.p
var z={}
var y={}
e[a]=z
e[b]=function(){var x=this[a]
if(x==y)H.cx(d||a)
try{if(x===z){this[a]=y
try{x=this[a]=c()}finally{if(x===z)this[a]=null}}return x}finally{this[b]=function(){return this[a]}}}}
I.$finishIsolateConstructor=function(a){var z=a.p
function Isolate(){var y=Object.keys(z)
for(var x=0;x<y.length;x++){var w=y[x]
this[w]=z[w]}var v=init.lazies
var u=v?Object.keys(v):[]
for(var x=0;x<u.length;x++)this[v[u[x]]]=null
function ForceEfficientMap(){}ForceEfficientMap.prototype=this
new ForceEfficientMap()
for(var x=0;x<u.length;x++){var t=v[u[x]]
this[t]=z[t]}}Isolate.prototype=a.prototype
Isolate.prototype.constructor=Isolate
Isolate.p=z
Isolate.ad=a.ad
Isolate.aQ=a.aQ
return Isolate}}!function(){var z=function(a){var t={}
t[a]=1
return Object.keys(convertToFastObject(t))[0]}
init.getIsolateTag=function(a){return z("___dart_"+a+init.isolateTag)}
var y="___dart_isolate_tags_"
var x=Object[y]||(Object[y]=Object.create(null))
var w="_ZxYxX"
for(var v=0;;v++){var u=z(w+"_"+v+"_")
if(!(u in x)){x[u]=1
init.isolateTag=u
break}}init.dispatchPropertyName=init.getIsolateTag("dispatch_record")}();(function(a){if(typeof document==="undefined"){a(null)
return}if(typeof document.currentScript!='undefined'){a(document.currentScript)
return}var z=document.scripts
function onLoad(b){for(var x=0;x<z.length;++x)z[x].removeEventListener("load",onLoad,false)
a(b.target)}for(var y=0;y<z.length;++y)z[y].addEventListener("load",onLoad,false)})(function(a){init.currentScript=a
if(typeof dartMainRunner==="function")dartMainRunner(X.aT,[])
else X.aT([])})})()
//# sourceMappingURL=fire.dart.js.map
