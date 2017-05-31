const fs = require('fs');
const Path = require('path');

function getTemplate() {
    return `
<html>
<head>
    __MATERIAL_CSS_PLACEHOLDER__
    __MATERIAL_ICON_PLACEHOLDER__
    __CUSTOM_CSS_PLACEHOLDER__
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="UTF-8">
    <style>.pointer,footer>a{cursor:pointer}[v-cloak]{display:none}body{background:#fdfdfd}.indent{padding-left:1em}.r-margin{margin-right:2em}.r-indent{padding-right:1em}.padding-all{padding:1em}.b-margin{margin-bottom:1em}no-overflow{overflow:auto}.bold{font-weight:700}.api-block{border:1px solid;margin:.5rem 0 1.5rem}.api-header{font-size:13pt}.api-header>.api-title{font-size:13pt;padding:.5em;display:inline-block}.tag-container{padding:1em .3em 0 .3em;height:2.2em}.tag-container>.tag{display:inline-block;margin-right:10px;padding:0 .5rem;white-space:nowrap;position:relative;min-width:3rem;text-align:center;background:linear-gradient(to bottom,#fed970 0,#febc4a 100%);background-color:#FEC95B;color:#963;font-weight:700;text-decoration:none;text-shadow:0 1px rgba(255,255,255,.4);border-top:1px solid #EDB14A;border-bottom:1px solid #CE922E;border-right:1px solid #DCA03B;border-left:1px solid #EDB14A;border-radius:3px;box-shadow:inset 0 1px #FEE395,0 1px 2px rgba(0,0,0,.21)}.round-border{border-radius:3px}.showReqBtn{padding-bottom:1.5rem}.fade-enter-active,.fade-leave-active{transition:opacity .5s}.fade-leave-active{transition:opacity .05s}.fade-enter,.fade-leave-to{opacity:0}.tool-panel{border:1px solid #9e9e9e;padding:1em 1em 0 1em;margin:1rem 0 1rem 0}[type=radio].with-gap:checked+label:before{border-radius:50%;border:2px solid #555555}[type=radio].with-gap:checked+label:after{border-radius:50%;border:1px solid __RADIO_BUTTON_COLOR__;background-color:__RADIO_BUTTON_COLOR__;z-index:0;-webkit-transform:scale(.5);-moz-transform:scale(.5);-ms-transform:scale(.5);-o-transform:scale(.5);transform:scale(.5)}input[type=text]:focus:not([readonly])+label{color:#666}input[type=text]:focus:not([readonly]){border-bottom:1px solid __TEXT_INPUT_COLOR__;box-shadow:0 1px 0 0 __TEXT_INPUT_SHADOW_COLOR__}textarea{white-space:pre;overflow:scroll;overflow-x:scroll;overflow-y:scroll;height:10em}.console{font-family:monospace;font-weight:400;font-style:normal}.warning-yellow-border{border-color:#ffc400}blockquote{padding:.5em 0 .5em 1em}#toast-container{min-width:100%;bottom:0;top:95%;right:0;left:0}::-webkit-input-placeholder{color:#DDD}::-moz-placeholder{color:#DDD}:-ms-input-placeholder{color:#DDD}:-moz-placeholder{color:#DDD}body{display:flex;min-height:100vh;flex-direction:column}main{flex:1 0 auto}.navButtonContainer{position:absolute;top:0;right:1rem}.navButton{padding:0 1rem}footer>a{color:#f5f5f5}td{vertical-align:top}h1{font-size:2.75rem}h2{font-size:2.2rem}h3{font-size:2rem}h4{font-size:1.75rem}h5{font-size:1.5rem}h6{font-size:1.28rem}table.fixed{table-layout:fixed}table.fixed td{overflow-x:auto}.lpad5px{padding-left:5px}th.status{width:64px}th.desc{width:256px}th.location,th.name{width:128px}th.required{width:90px}no-padding-bot{padding-bottom:0}.red-border{border-color:#ff8a80}.pink-border{border-color:#ff80ab}.purple-border{border-color:#ea80fc}.deep-purple-border{border-color:#b388ff}.indigo-border{border-color:#8c9eff}.blue-border{border-color:#82b1ff}.light-blue-border{border-color:#80d8ff}.cyan-border{border-color:#4dd0e1}.teal-border{border-color:#80cbc4}.green-border{border-color:#4caf50}.light-green-border{border-color:#aed581}.lime-border{border-color:#c0ca33}.yellow-border{border-color:#fdd835}.amber-border{border-color:#ffb300}.orange-border{border-color:#ffd180}.deep-orange-border{border-color:#ff9e80}.brown-border{border-color:#bcaaa4}.grey-border{border-color:#bdbdbd}.blue-grey-border{border-color:#90a4ae}.white-border{border-color:#fdfdfd}.slide-vert-enter-active{transition:all .4s ease}.slide-vert-leave-active{transition:all .2s ease}.slide-vert-enter,.slide-vert-leave-to{transform:translateY(100%)}table.compact input{margin:0;border-bottom:0;height:1rem}strong{font-weight:900}.b-margin-one-half{margin-bottom:1.5rem}__CODESTYLE_PLACEHOLDER__</style>
    <title></title>
</head>
<body>
    <div id="app" v-cloak>
        <div :class="{ 'navbar-fixed': appConfig.fixedNav, 'hide': !appConfig.showNav }">
            <nav :class="getThemeColor('default')" role="navigation">
                <div class="nav-wrapper container">
                    <div class="input-field">
                        <input id="search" type="search" placeholder="search by tag" title="Use - prefix to exclude unwanted tags. Ex: -POST" required v-model="filterByTag" @keyup.enter="$event.target.blur()">
                        <label class="label-icon" for="search"><i class="material-icons">search by tags</i></label>
                        <i class="material-icons">close</i>
                    </div>
                </div>
                <div class="navButtonContainer">
                    <a class="navButton pointer waves-effect waves-light" @click="collapseAllApi(false)">Collapse</a>
                    <a class="navButton pointer waves-effect waves-light" @click="collapseAllApi(true)">Expand</a>
                </div>
            </nav>
        </div>

        <transition name="slide-vert">
          <div v-show="appData.showConsole" id="consolePanel" class="input-field" style="background-color: rgba(0,0,0,.67);color: whitesmoke; position: absolute; left:0;right:-1; z-index: 2; padding: 1.5rem;">
            <div v-for="log in appData.consoleLogs">{{log}}</div>
            <input type="text" spellcheck="false" v-model="appData.console" @keyup.enter="parseCmd" @keydown.tab.prevent @keyup.tab="autoComplete" ref="txtConsole">
          </div>
        </transition>

        <div class="container">
            <div class="section">
                <h1 class="grey-text text-darken-3">{{name}}</h1>
                <div class="indent">
                    __CONTAINER_SUMMARY_PLACEHOLDER__
                    <div><span class="bold">Version</span> <span class="grey-text text-darken-1">{{version}}</span></div>
                    <div v-if="getAllTags.length > 0">
                        <span class="bold">Available Tags: </span>{{getAllTags}}
                    </div>
                </div>
            </div>

            <div class="section">
                <h5>Paths</h5>
                <div class="indent" v-for="(api,api_idx) in apis" v-if="api.visible">
                    <div class="indent">
                        <div class="row pointer blue-text text-lighten-1"><span @click="api.showMe=!api.showMe">{{api.path}}</span></div>
                        <transition name="fade">
                            <div v-if="api.showMe">
                                <div class="api-block round-border" :class="[getThemeColor(method.name)+'-border']" v-for="(method,method_idx) in api.methods" v-if="method.visible">
                                    <div class="api-header lighten-5 round-border pointer" :class="[getThemeColor(method.name)]" @click="method.showMe = !method.showMe">
                                        <div class="api-title light" :class="[getThemeColor(method.name,true)]">{{method.name}} {{api.path}}</div>
                                    </div>
                                    <transition name="fade">
                                        <div v-if="method.showMe">
                                            <div class="tag-container">
                                                <div class="tag right no-overflow" :class="[appConfig.showNav ? 'pointer':'']" v-for="tag in method.tags" @click="addToSearch(tag)">{{tag}}</div>
                                            </div>
                                            <div class="indent r-indent">
                                                <h5 :class="[getThemeColor('default')+'-text']" v-if="method.summary">Summary</h5>
                                                __METHOD_SUMMARY_PLACEHOLDER__
                                                <h5 :class="[getThemeColor('default')+'-text']" v-if="method.desc">Description</h5>
                                                __METHOD_DESC_PLACEHOLDER__
                                                <h5 :class="[getThemeColor('default')+'-text']" v-if="method.params.length > 0">Parameters</h5>
                                                <table class="bordered fixed b-margin-one-half" v-if="method.params.length > 0">
                                                    <thead>
                                                        <tr>
                                                            <th class="name">Name</th>
                                                            <th class="location">Located In</th>
                                                            <th class="desc">Description</th>
                                                            <th class="required">Required</th>
                                                            <th>Schema</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="param in method.params">
                                                            <td><div class="lpad5px">{{param.name}}</div></td>
                                                            <td><div class="lpad5px">{{param.location}}</div></td>
                                                            __PARAM_DESC_PLACEHOLDER__
                                                            <td><div class="lpad5px">{{param.required ? 'Yes':'No'}}</div></td>
                                                            <td><div class="lpad5px"><pre><span v-for="token in getSchema(param.schema,param.schemaState)" v-bind:class="{pointer: isFoldable(token)}" @click="schemaClicked(token,param.schemaState)">{{token.val}}</span></pre></div></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <h5 :class="[getThemeColor('default')+'-text']" v-if="method.responses.length > 0">Responses</h5>
                                                <table class="bordered fixed b-margin-one-half" v-if="method.responses.length > 0">
                                                    <thead>
                                                        <tr>
                                                            <th class="status">Code</th>
                                                            <th class="desc">Description</th>
                                                            <th>Schema</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="res in method.responses">
                                                            <td><div class="lpad5px" v-bind:class="[res.code === '200' ? 'green-text darken-2' : '']" >{{res.code}}</div></td>
                                                            __RES_DESC_PLACEHOLDER__
                                                            <td><div class="lpad5px"><pre><span v-for="token in getSchema(res.schema,res.schemaState)" v-bind:class="{pointer: isFoldable(token)}" @click="schemaClicked(token,res.schemaState)">{{token.val}}</span></pre></div></td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <div class="showReqBtn" v-if="host && appConfig.showDevPlayground">
                                                    <a class="btn waves-effect" :class="[getThemeColor(method.name,true)]" @click="method.showTool = true" v-if="!method.showTool"><i class="material-icons left">mode_edit</i>Try this operation</a>
                                                    <a class="right pointer" @click="method.showTool = false" v-else>Hide</a>
                                                </div>

                                                <transition name="fade">
                                                    <div class="request-panel" v-if="method.showTool">
                                                        <h5>Request</h5>
                                                        <div class="tool-panel round-border">
                                                            <p class="bold">Scheme</p>
                                                            <p>
                                                                <form>
                                                                    <span v-for="(scheme,idx) in method.request.schemes">
                                                                        <input class="with-gap" v-bind:name="scheme" type="radio" v-bind:value="scheme" v-bind:id="api_idx+'_'+method_idx+'_'+scheme" v-model="method.request.choosen.scheme"/>
                                                                        <label class="r-margin" v-bind:for="api_idx+'_'+method_idx+'_'+scheme" v-bind:class="method.request.choosen.scheme === scheme ? 'black-text' : ''">{{scheme}}</label>
                                                                    </span>
                                                                </form>
                                                            </p>
                                                            <p class="bold">HTTP Headers</p>
                                                            <table class="highlight compact" v-if="Object.keys(method.request.choosen.headers).length !== 0">
                                                                <colgroup>
                                                                    <col span="1" style="width: 42%;">
                                                                    <col span="1" style="width: 48%;">
                                                                    <col span="1" style="width: 10%;">
                                                                </colgroup>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Name</th>
                                                                        <th>Value</th>
                                                                        <th>Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="(value, key) in method.request.choosen.headers">
                                                                        <td>{{key}}</td>
                                                                        <td><input type="text" v-model="method.request.choosen.headers[key]"></td>
                                                                        <td><a class="pointer" @click="removeFromHeaderList(key,method.request.choosen)">Remove</a></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <div class="row">
                                                                <div class="input-field col s5">
                                                                    <input v-bind:id="api_idx+'_'+method_idx+'_headerName'" type="text" @keyup.enter="addToHeaderList(method.request.choosen,api_idx+'_'+method_idx+'_headerName')" v-model="method.request.choosen.headerName">
                                                                    <label v-bind:for="api_idx+'_'+method_idx+'_headerName'">name</label>
                                                                </div>
                                                                <div class="input-field col s6">
                                                                    <input v-bind:id="api_idx+'_'+method_idx+'_headerValue'" type="text" @keyup.enter="addToHeaderList(method.request.choosen,api_idx+'_'+method_idx+'_headerName')" v-model="method.request.choosen.headerValue">
                                                                    <label v-bind:for="api_idx+'_'+method_idx+'_headerValue'">value</label>
                                                                </div>
                                                                <div class="input-field col s1">
                                                                    <a class="btn-floating btn-large waves-effect waves-light" :class="[getThemeColor(method.name,true)]" @click="addToHeaderList(method.request.choosen,api_idx+'_'+method_idx+'_headerName')"><i class="material-icons">add</i></a>
                                                                </div>
                                                            </div>
                                                            <h5>Parameters</h5>
                                                            <div class="tool-panel round-border">
                                                                <div v-for="(param,param_idx) in method.params">
                                                                    <div class="input-field" v-if="param.location !== 'body' && param.location !== 'header'">
                                                                        <label v-bind:for="api_idx+'_'+method_idx+'_'+param.name" :class="[method.params[param_idx].value ? 'active' : '']">{{param.name}}</label>
                                                                        <input v-bind:id="api_idx+'_'+method_idx+'_'+param.name" type="text" v-model="method.params[param_idx].value">
                                                                    </div>
                                                                </div>
                                                                <div v-if="hasBodyParam(method.params)">
                                                                    <label  v-bind:for="api_idx+'_'+method_idx+'_requestBody'">Raw Body</label>
                                                                    <textarea v-bind:id="api_idx+'_'+method_idx+'_requestBody'" v-model="method.request.choosen.body"></textarea>
                                                                </div>
                                                                <h6 class="grey-text">Request</h6>
                                                                <div class="grey lighten-3 console padding-all">
                                                                    <span class="bold red-text">{{method.name.toUpperCase()}}</span> <a v-bind:href="getURL(method,api.path)">{{getURL(method,api.path)}}</a> HTTP/1.1
                                                                    <div><span class="bold">Host:</span> {{host}}</div>
                                                                    <div v-for="(value,key) in method.request.choosen.headers"><span class="bold">{{key}}:</span> {{value}}</div>
                                                                    <div v-if="computeBody(method)"><pre>{{computeBody(method)}}</pre></div>
                                                                </div>

                                                                <h6 class="grey-text">Response</h6>
                                                                <div class="grey lighten-3 console padding-all">
                                                                    <textarea wrap='off' readonly>{{method.request.choosen.result}}</textarea>
                                                                </div>

                                                                <div v-if="mixContent(method.request.choosen)">
                                                                    <blockquote class="warning-yellow-border yellow lighten-5"> <i class="material-icons left">warning</i> This is a Mixed Content call. Many browsers will block this by default. <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content" target="_blank">Learn more</a></blockquote>
                                                                </div>
                                                                <div v-else-if="crossDomain(method.request.choosen)">
                                                                    <blockquote class="warning-yellow-border yellow lighten-5"> <i class="material-icons left">warning</i> This is a cross-origin call. Make sure the server at <span class="blue-text">{{getDestHost(method.request.choosen.scheme)}}</span> accepts POST requests from <span class="blue-text">{{currentHost}}</span>. <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS" target="_blank">Learn more</a></blockquote>
                                                                </div>
                                                                <a class="waves-effect waves-light btn b-margin" :class="[getThemeColor(method.name,true)]" @click="sendRequest(method.name,getURL(method,api.path),method.request.choosen.body,method.request.choosen.headers,api_idx,method_idx)">Send Request</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </transition>
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <footer class="container grey-text text-lighten-4 thin">__FOOTER_PLACEHOLDER__</footer>

    __JQUERY_PLACEHOLDER__
    __MATERIAL_JS_PLACEHOLDER__
    __VUE_PLACEHOLDER__
    __COLRESIZE_PLACEHOLDER__

    <script>
        var context = {
            el: "#app"
            , computed: {
                filterByTag: {

                    get: function () {
                        return this.appData.search;
                    }
                    ,set: function (newValue) {

                        this.appData.search = newValue;
                        if(newValue == ""){
                            this.setAllVisible(true);
                            return;
                        }
                        newValue = newValue || "";
                        var search_tags = newValue.toLowerCase().split(/[\\s,]+/);
                        var includeTags = [];
                        var excludeTags = [];

                        for(var i = 0;i<search_tags.length;i++){

                            if(search_tags[i] === ""){
                                continue;
                            }
                            else if(search_tags[i][0] === "-"){
                                excludeTags.push(search_tags[i].substr(1));
                            }
                            else{
                                includeTags.push(search_tags[i]);
                            }
                        }

                        for(var i=0;i<this.apis.length;i++){

                            var api_visible = false;
                            var api = this.apis[i];
                            for(var j=0;j<api.methods.length;j++){

                                var method = api.methods[j];
                                var visible = includeTags.length == 0;

                                for(var k=0;k<method.tags.length;k++){
                                    var tag = method.tags[k].toLowerCase();
                                    if(excludeTags.indexOf(tag) > -1){
                                        visible = false;
                                        break;
                                    }
                                    for(var l=0;l<includeTags.length;l++){
                                        if(tag.startsWith(includeTags[l])){
                                            visible = true;
                                            break;
                                        }
                                    }
                                }
                                method.visible = visible;
                                if(visible){
                                    api_visible = true;
                                }
                            }

                            this.apis[i].visible = api_visible;
                        }
                    }
                }
                , getAllTags: function(){

                    var result = {};
                    for(var i=0;i<this.apis.length;i++){
                        if(!this.apis[i].visible){
                            continue;
                        }
                        var api = this.apis[i];
                        for(var j=0;j<api.methods.length;j++){
                            if(!api.methods[j].visible){
                                continue;
                            }
                            var method = api.methods[j];
                            if(!method.tags){
                                break;
                            }
                            for(var k=0;k<method.tags.length;k++){
                                result[method.tags[k]] = null;
                            }
                        }
                    }

                    return Object.keys(result).sort().join(", ");
                }
            }
            , methods:{
                addToHeaderList: function(container,to_be_focused_id){
                    var name = container.headerName.trim();
                    if(!name){
                        return;
                    }
                    var val = container.headerValue.trim();
                    Vue.set(container.headers,name,val);
                    container.headerName = "";
                    container.headerValue = "";
                    Vue.nextTick(function() {
                        document.getElementById(to_be_focused_id).focus();
                    });
                }
                ,addToSearch: function(keyword){

                    if(!this.appConfig.showNav){
                        return;
                    }
                    var tags = this.appData.search.split(" ");
                    tags = new Set(tags);
                    if(tags.has(keyword)){
                        return;
                    }

                    this.filterByTag = this.appData.search+" "+keyword;
                }
                ,getDestHost: function(scheme){
                    var dest_port = ":"+this.port[scheme];
                    if((dest_port === ":80" && scheme == "http") || (dest_port == ":443" && scheme === "https")){
                        dest_port = "";
                    }
                    return this.host+dest_port;
                }
                ,crossDomain: function(choosen){

                    var abs_target_host = this.host+':'+this.port[choosen.scheme];
                    var curr_port = location.port;
                    var abs_curr_host = this.currentHost;
                    if(!curr_port){
                        if(this.currentScheme === 'https'){
                            abs_curr_host += ":443";
                        }
                        else if(this.currentScheme === 'http'){
                            abs_curr_host += ":80";
                        }
                    }
                    return abs_curr_host !== abs_target_host;
                }
                ,mixContent: function(choosen){
                    return (this.currentScheme === "https" && choosen.scheme === "http");
                }
                ,removeFromHeaderList: function(key, container){
                    Vue.delete(container.headers, key);
                }
                ,collapseAllApi: function(bool){
                    for(var i=0;i<this.apis.length;i++){
                        this.apis[i].showMe = bool;
                    }
                }
                ,setAllVisible: function(bool){

                    for(var i=0;i<this.apis.length;i++){

                        for(var j=0;j<this.apis[i].methods.length;j++){
                            this.apis[i].methods[j].visible = bool;
                        }
                        this.apis[i].visible = bool;
                    }
                }
                ,hasBodyParam: function(params){
                    var location;
                    for(var i = 0;i<params.length;i++){
                        if(!params[i].location){
                            continue;
                        }
                        location = params[i].location.toLowerCase();
                        if(location === 'body'){
                            return true;
                        }
                    }
                    return false;
                }
                ,getSchema: function(schema,state){
                    var tmp = schema.split("\\n");
                    var tokens = [];
                    var fold = false;
                    var fold_lv = 0;
                    var current_lv;
                    var close_token ="";
                    var open_token ="";
                    var comment = "";
                    var comment_idx;
                    for(var i = 0; i < tmp.length;i++){

                        if(fold){
                            current_lv = tmp[i].length - tmp[i].replace(/^\\s+/,"").length;
                            var closeBraceRegex = new RegExp("^\\s*"+close_token+"\\s*,?$");
                            if(fold_lv == current_lv && closeBraceRegex.exec(tmp[i].trim())){
                                fold = false;
                                close_token = "";
                                continue;
                            }
                        }
                        else{
                            if(state.indexOf(i) !== -1){
                                fold = true;
                                open_token = tmp[i].trim();
                                if(this.is_an_object_value_open_w_optional_comment(open_token)){
                                    var match = /([[{])/.exec(tmp[i]);
                                    open_token = match[1];
                                    var brace_loc = match.index;
                                    fold_lv = tmp[i].length - tmp[i].replace(/^\\s+/,"").length;
                                    close_token = open_token === "{" ? "}" : "]";
                                    comment_idx = tmp[i].indexOf("/");
                                    if(comment_idx > -1){
                                        comment = tmp[i].substr(comment_idx).trim();
                                        if(!comment.endsWith("*/")){
                                            comment += " ... */";
                                        }
                                    }
                                    else {
                                        comment = '';
                                    }
                                    tokens.push({"val":tmp[i].substr(0,brace_loc)+open_token+"..."+close_token+" "+comment+"\\n","line":i});
                                }
                                else{
                                    fold_lv = tmp[i].length - tmp[i].replace(/^\\s+/,"").length;
                                    open_token = open_token[0];
                                    close_token = open_token === "{" ? "}" : "]";
                                    comment_idx = tmp[i].indexOf("/");
                                    if(comment_idx > -1){
                                        comment = tmp[i].substr(comment_idx).trim();
                                        if(!comment.endsWith("*/")){
                                            comment += " ... */";
                                        }
                                    }
                                    else {
                                        comment = '';
                                    }
                                    tokens.push({"val":tmp[i].substr(0,fold_lv)+open_token+"..."+close_token+" "+comment+"\\n","line":i});
                                }
                            }
                            else{
                                tokens.push({"val":tmp[i]+"\\n","line":i});
                            }
                        }
                    }
                    return tokens;
                }
                ,schemaClicked: function(token,state){
                    if(!this.isFoldable(token)){
                        return;
                    }

                    var idx = state.indexOf(token.line);
                    if(idx == -1){
                        state.push(token.line);
                    }
                    else{
                        state.splice(idx, 1);
                    }
                }
                ,isFoldable: function(token){
                    var txt = token.val.trim();
                    return txt==='{' || txt==='[' || txt==='{...}' || txt==='[...]'
                        || this.is_an_open_brace_with_comment(txt)
                        || this.is_an_object_value_open_w_optional_comment(txt)
                        || this.is_an_array_folded_with_comment(txt)
                        || this.is_an_object_folded_with_comment(txt)
                        || this.is_an_object_value_folded_w_optional_comment(txt);
                }
                , is_an_open_brace_with_comment: function(line){ return /[[{]\\s*\\/\\*\\s*[^\\r\\n]*\\s*\\*\\//.exec(line);}
                , is_an_object_value_open_w_optional_comment: function(line){ return /^"[\\s\\S]+"\\s*:\\s*[[{](\\s*\\/\\*[^\\r\\n]*\\s*\\*\\/)?/.exec(line);}
                , is_an_array_folded_with_comment:  function(line){ return /\\[\\.\\.\\.\\]\\s*\\/\\*[^\\r\\n]*\\s*\\*\\//.exec(line);}
                , is_an_object_folded_with_comment: function(line){ return /\\{\\.\\.\\.\\}\\s*\\/\\*[^\\r\\n]*\\s*\\*\\//.exec(line);}
                , is_an_object_value_folded_w_optional_comment: function(line){ return /^"[\\s\\S]+"\\s*:\\s*(\\[\\.\\.\\.\\])|(\\{\\.\\.\\.\\})(\\s*\\/\\*[^\\r\\n]*\\s*\\*\\/)?/.exec(line);}

                ,getFormParam: function(method){

                    var result = [];
                    var len = method.params.length;
                    for(var i=0;i<len;i++){
                        if(method.params[i].location === "__FORM_PLACEHOLDER__"){
                            result.push(encodeURIComponent(method.params[i].name)+"="+encodeURIComponent(method.params[i].value));
                        }
                    }
                    if(result.length == 0){
                        return "";
                    }
                    return result.join("&");
                }
                ,getURL: function(method,path){
                    if((method.request.choosen.scheme === "http" && this.port['http'] == 80) || (method.request.choosen.scheme === "https" && this.port['https'] == 443)){
                        return method.request.choosen.scheme+'://'+ this.host + this.basePath + this.computePath(method,path) + this.getUrlParamString(method);
                    }
                    var port = this.port[method.request.choosen.scheme] ? ":" + this.port[method.request.choosen.scheme]  : "";
                    return method.request.choosen.scheme+'://'+ this.host + port + this.basePath + this.computePath(method,path) + this.getUrlParamString(method);
                }
                ,getUrlParamString: function(method){

                    var params = [];
                    for(var i=0;i<method.params.length;i++){
                        if(method.params[i].location.trim().toLowerCase() === "query"){
                            params.push(method.params[i].name+'='+encodeURIComponent(method.params[i].value));
                        }
                    }

                    if(params.length === 0){
                        return "";
                    }

                    params = "?"+params.join("&");
                    return params;
                }
                ,sendRequest: function(method,url,data,headers,api_idx,method_idx){

                    var config = {
                        type: method
                        ,url: url
                        ,processData: false
                        ,context: this.apis
                    };

                    if(Object.keys(headers).length > 0){
                        config.headers = headers;
                    }

                    if(data.length > 0){
                        config.data = data;
                    }

                    $.ajax(config)
                    .done(function(dat, textStatus, jqXHR) {
                        var result = "HTTP/1.1 "+jqXHR.status+" "+textStatus+"\\r\\n";
                        result += jqXHR.getAllResponseHeaders() + "\\r\\n";
                        if (typeof(dat) === 'object')
                            dat = JSON.stringify(dat,null,3);
                        result += dat;
                        this[api_idx].methods[method_idx].request.choosen.result = result;
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        var result = "HTTP/1.1 "+jqXHR.status+" "+textStatus+"\\r\\n";
                        result += jqXHR.getAllResponseHeaders();
                        result += "\\r\\n"+errorThrown;
                        this[api_idx].methods[method_idx].request.choosen.result = result;
                    });
                    Materialize.toast('Request Sent', 1853);
                }
                , computePath: function(method,path){

                    var params = method.params;
                    var len = params.length;
                    var new_path = path;
                    for(var i=0;i<len;i++){
                        if(!params[i].location){
                            continue;
                        }
                        if(params[i].location.toLowerCase() === 'path' && params[i].value){
                            new_path = new_path.split("__PATH_PARAM_LEFT_TOKEN__"+params[i].name+"__PATH_PARAM_RIGHT_TOKEN__").join(params[i].value);
                        }
                    }
                    return new_path;
                }
                , computeBody: function(method){

                    var body = method.request.choosen.body;
                    var formData = this.getFormParam(method);

                    if(!body && !formData){
                        return "";
                    }
                    else if(!body){
                        return formData;
                    }
                    else{
                        return formData+"\\r\\n"+body;
                    }
                }
                , getThemeColor: function(method_name,withFontsColor){

                    if(!withFontsColor){
                        return this.appConfig.bgColor[method_name.toUpperCase()] || this.appConfig.bgColor["default"] || "blue" ;
                    }

                    var tmp = this.appConfig.bgColor[method_name.toUpperCase()] || this.appConfig.bgColor["default"] || "blue" ;
                    switch(tmp){
                        case "yellow":
                        case "lime":
                        case "white":
                            return "black-text " + tmp;
                        default:
                            return "white-text " + tmp;
                    }
                }
                , toggleConsole: function(event){

                    if(event){
                      var keycode = event.keyCode;
                      if(keycode !== 192 || !event.ctrlKey){
                          return;
                      }
                    }

                    this.appData.showConsole = !this.appData.showConsole;
                    if(this.appData.showConsole){
                      var self = this;
                      Vue.nextTick(function () {
                        self.$refs.txtConsole.focus();
                      });
                    }
                }

                , autoComplete: function(){
                    if(!this.appData.console){
                        return;
                    }

                    if("add header -g".startsWith(this.appData.console)){
                        this.appData.console = "add header -g ";
                    }

                    if("remove header -g".startsWith(this.appData.console)){
                        this.appData.console = "remove header -g ";
                    }

                    if("clear".startsWith(this.appData.console)){
                        this.appData.console = "clear";
                    }
                }
                , parseCmd: function(){
                    var tokens = this.appData.console.split(" ");
                    if(tokens[0] === "add"){
                        if(tokens[1] === "header"){
                            if(tokens[2] === "-g"){
                                var header = tokens[3];
                                var val = tokens.length > 5 ? tokens.slice(4).join(" ") : tokens[4];
                                for(var i = 0;i<this.apis.length;i++){
                                    var api = this.apis[i];
                                    for(var j=0;j<api.methods.length;j++){
                                        var method = api.methods[j];
                                        Vue.set(method.request.choosen.headers,header,val);
                                    }
                                }
                            }
                        }
                    }
                    if(tokens[0] === "remove"){
                        if(tokens[1] === "header"){
                            if(tokens[2] === "-g"){
                                var header = tokens[3];
                                var val = tokens.length > 5 ? tokens.slice(4).join(" ") : tokens[4];
                                for(var i = 0;i<this.apis.length;i++){
                                    var api = this.apis[i];
                                    for(var j=0;j<api.methods.length;j++){
                                        var method = api.methods[j];
                                        delete method.request.choosen.headers[header];
                                    }
                                }
                            }
                        }
                    }

                    if(tokens[0] === "clear"){
                        this.appData.console = "";
                        this.appData.consoleLogs = [];
                    }
                    else{
                        this.appData.consoleLogs.push("> "+this.appData.console);
                    }
                    this.appData.console = "";
                }
            }
            , data: __DATAPLACEHOLDER__
            , mounted: function(){
                document.body.addEventListener('keyup', this.toggleConsole);
            }
        };
        var vm = new Vue(context);
        document.title = context.data.name;

        $(function(){
            function fixDiv() {
                var consolePanel = $('#consolePanel');
                consolePanel.css({
                    'position': 'fixed',
                    'bottom': '0px'
                });
          }
          $(window).scroll(fixDiv);
          fixDiv();
          $("table").colResizable({
              liveDrag:true
              ,gripInnerHtml:"<div class='grip'></div>"
              ,draggingClass:"dragging"
          });
        });
    </script>
</body>
</html>
`;
}

function initContainer() {
    return {
        name: ""
        , summary: ""
        , version: ""
        , host: ""
        , port: { http: 80, https: 443 }
        , basePath: ""
        , currentHost: "__CURRENTHOST__"
        , currentScheme: "__PROTO__"
        , appConfig: {
            bgColor: {}
            , showDevPlayground: true
            , showNav: true
            , fixedNav: false
        }
        , appData: {
            search: ""
            , console: ""
            , consoleLogs: []
            , showConsole: false
        }
        , apis: []
    };
}

function initApi() {
    return {
        path: ""
        , visible: true
        , showMe: true
        , methods: []
    };
}

function initMethod() {
    return {
        name: ""
        , visible: true
        , tags: []
        , summary: ""
        , desc: ""
        , params: []
        , responses: []
        , request: initRequest()
        , showTool: false
        , showMe: true
    };
}

function initParam() {
    return {
        name: ""
        , location: ""
        , desc: ""
        , required: false
        , schema: ""
        , schemaState: []
        , value: ""
    };
}

function initResponse() {
    return {
        code: ""
        , desc: ""
        , schema: ""
        , schemaState: []
    };
}

function initRequest() {
    return {
        schemes: ["http","https"]
        , headers: []
        , choosen: {
            scheme: "http"
            , headers: {}
            , body: ""
            , headerName: ""
            , headerValue: ""
            , result: ""
        }
    };
}

function initHeader() {
    return {
        name: ""
        , value: ""
    };
}

function useLocalFont(css){
    return css.trim()+'html{font-family:"Helvetica Neue","Segoe UI",GillSans,Calibri,Trebuchet,Helvetica,sans-serif}';
}

function useEmbeddedFont(css){
    var embeddedFont = fs.readFileSync(Path.join(__dirname, 'template',"embedded.min.css"), 'utf8');
    return embeddedFont.trim()+css.trim();
}

function getFilenameWithoutExtension(filename){
    var filename = Path.basename(filename);
    return filename.substr(0, filename.lastIndexOf('.')) || filename;
}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    }
    catch(e) {
        if ( e.code != 'EEXIST' ){
            throw e;
        }
    }
}

var mkdirpSync = function (dirpath) {
    var parts = dirpath.split(Path.sep);
    for( var i = 1; i <= parts.length; i++ ) {
        mkdirSync(Path.join.apply(null, parts.slice(0, i)));
    }
}

function copyFile(source, target, cb) {
    var cbCalled = false;
    function done(err) {
        if (cb && !cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });

    var wr = fs.createWriteStream(target);
        wr.on("error", function(err) {
        done(err);
    });

    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);
}

function makeNoIcon(html,callback){
    var content = fs.readFileSync(Path.join(__dirname, 'template',"materialize.min.css"), 'utf8');
    content = useLocalFont(content);
    html = html.replace('<i class="material-icons">close</i>','<span class="material-icons lighten-4">X</span>');
    html = html.replace('<i class="material-icons left">mode_edit</i>','');
    html = html.replace('<label class="label-icon" for="search"><i class="material-icons">search by tags</i></label>','');
    html = html.replace('<i class="material-icons">add</i>','<span style="font-size:2rem">+</span>');
    html = replace(html, '__MATERIAL_CSS_PLACEHOLDER__', '<style>'+content+'</style>');
    html = replace(html,'__MATERIAL_ICON_PLACEHOLDER__', '');
    content = fs.readFileSync(Path.join(__dirname,'template',"jquery-2.2.4.min.js"), 'utf8');
    html = replace(html,'__JQUERY_PLACEHOLDER__', '<script>'+content+'</script>');
    content = fs.readFileSync(Path.join(__dirname,'template',"materialize.min.js"), 'utf8');
    html = replace(html,'__MATERIAL_JS_PLACEHOLDER__', '<script>'+content+'</script>');
    content = fs.readFileSync(Path.join(__dirname,'template',"vue.min.js"), 'utf8');
    html = replace(html,'__VUE_PLACEHOLDER__', '<script>'+content+'</script>');
    content = fs.readFileSync(Path.join(__dirname,'template',"colResizable-1.6.min.js"), 'utf8');
    html = replace(html,'__COLRESIZE_PLACEHOLDER__', '<script>'+content+'</script>')
    callback(null,html);
}

//use this to avoid str.replace do the trick on $&, $`
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
function replace(src,token,value){
    var idx = src.indexOf(token);
    if(idx == -1){
        return;
    }
    return src.substr(0,idx) + value + src.substr(idx+token.length);
}

function makeOffline(html,outputFilename,callback){
    var outputFilename = Path.resolve(outputFilename);
    var dst = Path.dirname(outputFilename);
    var resource_folder = getFilenameWithoutExtension(outputFilename)+"_files";
    var dst_resource_dir = Path.join(dst, resource_folder);
    mkdirpSync(dst_resource_dir);
    mkdirpSync(dst_resource_dir+Path.sep+"js");
    mkdirpSync(dst_resource_dir+Path.sep+"css");
    mkdirpSync(Path.join(dst_resource_dir,"fonts","roboto"));
    mkdirpSync(Path.join(dst_resource_dir,"fonts","material"));

    template_files = ["jquery-2.2.4.min.js","materialize.min.css","materialize.min.js","vue.min.js","colResizable-1.6.min.js"
    ,"fonts"+Path.sep+"material"+Path.sep+"material_icon.woff2"
    ,"fonts"+Path.sep+"roboto"+Path.sep+"Roboto-Bold.woff2"
    ,"fonts"+Path.sep+"roboto"+Path.sep+"Roboto-Light.woff2"
    ,"fonts"+Path.sep+"roboto"+Path.sep+"Roboto-Regular.woff2"
    ,"fonts"+Path.sep+"roboto"+Path.sep+"Roboto-Thin.woff2"
    ];

    //icon.css' content needs dynamic path
    var data = fs.readFileSync(Path.join(__dirname, 'template',"icon.css"), 'utf8');
    data = data.replace("url('fonts/material/material_icon.woff2')","url('../fonts/material/material_icon.woff2')");
    fs.writeFileSync(Path.join(dst_resource_dir,"css","icon.css"),data);
    var templateDir = Path.join(__dirname,"template");
    var target_dir = "";
    var fileExt = "";

    var count = 0;
    for(var i = 0;i<template_files.length;i++){
        if(template_files[i].toLowerCase().endsWith(".css")){
            target_dir = "css";
        }
        else if(template_files[i].toLowerCase().endsWith(".js")){
            target_dir = "js";
        }
        else{
            target_dir = "";
        }
        copyFile(Path.join(templateDir,template_files[i]),Path.join(dst_resource_dir,target_dir,template_files[i]),function(err){
            if(err){
                console.log(err);
            }
            count++;
        });
    }

    var html = html.replace('__MATERIAL_CSS_PLACEHOLDER__', '<link rel="stylesheet" href="'+resource_folder+'/css/materialize.min.css">')
    .replace('__MATERIAL_ICON_PLACEHOLDER__', '<link href="'+resource_folder+'/css/icon.css" rel="stylesheet">')
    .replace('__JQUERY_PLACEHOLDER__', '<script src="'+resource_folder+'/js/jquery-2.2.4.min.js"></script>')
    .replace('__MATERIAL_JS_PLACEHOLDER__', '<script src="'+resource_folder+'/js/materialize.min.js"></script>')
    .replace('__VUE_PLACEHOLDER__', '<script src="'+resource_folder+'/js/vue.min.js"></script>')
    .replace('__COLRESIZE_PLACEHOLDER__', '<script src="'+resource_folder+'/js/colResizable-1.6.min.js"></script>');
    fs.writeFileSync(outputFilename,html,'utf8');

}

function makeLite(html,callback){
    callback(null,html.replace('__MATERIAL_CSS_PLACEHOLDER__', '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/css/materialize.min.css">')
    .replace('__MATERIAL_ICON_PLACEHOLDER__', '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">')
    .replace('__JQUERY_PLACEHOLDER__', '<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>')
    .replace('__MATERIAL_JS_PLACEHOLDER__', '<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.8/js/materialize.min.js"></script>')
    .replace('__VUE_PLACEHOLDER__', '<script src="https://unpkg.com/vue@2.1.10/dist/vue.min.js"></script>')
    .replace('__COLRESIZE_PLACEHOLDER__', '<script src="https://cdn.jsdelivr.net/gh/alvaro-prieto/colResizable@1.6.0/colResizable-1.6.min.js"></script>'));
}

function makeSingleFile(html,callback){

    var content = fs.readFileSync(Path.join(__dirname, 'template',"materialize.noRoboto.min.css"), 'utf8');
    content = useEmbeddedFont(content);
    html = replace(html, '__MATERIAL_CSS_PLACEHOLDER__', '<style>'+content+'</style>');
    html = replace(html,'__MATERIAL_ICON_PLACEHOLDER__', '');
    content = fs.readFileSync(Path.join(__dirname,'template',"jquery-2.2.4.min.js"), 'utf8');
    html = replace(html,'__JQUERY_PLACEHOLDER__', '<script>'+content+'</script>');
    content = fs.readFileSync(Path.join(__dirname,'template',"materialize.min.js"), 'utf8');
    html = replace(html,'__MATERIAL_JS_PLACEHOLDER__', '<script>'+content+'</script>');
    content = fs.readFileSync(Path.join(__dirname,'template',"vue.min.js"), 'utf8');
    html = replace(html,'__VUE_PLACEHOLDER__', '<script>'+content+'</script>');
    content = fs.readFileSync(Path.join(__dirname,'template',"colResizable-1.6.min.js"), 'utf8');
    html = replace(html,'__COLRESIZE_PLACEHOLDER__', '<script>'+content+'</script>')
    callback(null,html);
}

function generateHTML(data, config, callback) {

    if(!config){
        config = {};
    }

    var radioColorMap = {
        red: "#f44336"
        ,pink: "#e91e63"
        ,purple: "#9c27b0"
        ,"deep-purple": "#673ab7"
        ,indigo: "#3f51b5"
        ,blue: "#2196f3"
        ,"light-blue": "#03a9f4"
        ,cyan: "#00bcd4"
        ,teal: "#009688"
        ,green: "#4caf50"
        ,"light-green": "#8bc34a"
        ,lime: "#cddc39"
        ,yellow: "#ffeb3b"
        ,amber: "#ffc107"
        ,orange: "#ff9800"
        ,"deep-orange": "#ff5722"
        ,brown: "#795548"
        ,grey: "#9e9e9e"
        ,"blue-grey": "#607d8b"
        ,black: "#000000"
        ,white: "#000000"
    };
    var textInputColorMap = {
        red: ["#e57373","#ef5350"]
        ,pink: ["#f06292","#ec407a"]
        ,purple: ["#ba68c8","#ab47bc"]
        ,"deep-purple": ["#9575cd","#7e57c2"]
        ,indigo: ["#7986cb","#5c6bc0"]
        ,blue: ["#64b5f6","#42a5f5"]
        ,"light-blue": ["#4fc3f7","#29b6f6"]
        ,cyan: ["#4dd0e1","#26c6da"]
        ,teal: ["#4db6ac","#26a69a"]
        ,green: ["#81c784","#66bb6a"]
        ,"light-green": ["#aed581","#9ccc65"]
        ,lime: ["#dce775","#d4e157"]
        ,yellow: ["#fff176","#ffee58"]
        ,amber: ["#ffd54f","#ffca28"]
        ,orange: ["#ffb74d","#ffa726"]
        ,"deep-orange": ["#ff8a65","#ff7043"]
        ,brown: ["#a1887f","#8d6e63"]
        ,grey: ["#e0e0e0","#bdbdbd"]
        ,"blue-grey": ["#90a4ae","#78909c"]
        ,black: ["#000000","#000000"]
        ,white: ["#000000","#000000"]
    }

    var radioColor = radioColorMap[config.mainColor] || radioColorMap["blue"];
    var textInputColor = textInputColorMap[config.mainColor] || textInputColorMap["blue"];

    config.pathParamLeftToken = config.pathParamLeftToken || ":";
    config.pathParamRightToken = config.pathParamRightToken || "";
    config.formDataToken = config.formDataToken || "form";
    config.allowHtml = config.allowHtml || false;
    if(!config.customCSS){
        config.customCSS = "";
    }
    else{
        config.customCSS = "<style>"+config.customCSS+"</style>";
    }

    if(typeof data === "object"){
        data = JSON.stringify(data,null,config.indent || 0);
    }

    var html = getTemplate().replace("__DATAPLACEHOLDER__", data);
    var date = new Date();
    var dateFormat = {
        weekday: "long", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    var codeStyleCSS = config.syntaxHighlight ? ".hljs{display:block;overflow-x:auto;padding:1.5em 1em;color:#333;background:#F5F5F5;border: 1px solid #CCC}.hljs-comment,.hljs-quote{color:#998;font-style:italic}.hljs-keyword,.hljs-selector-tag,.hljs-subst{color:#333;font-weight:700}.hljs-literal,.hljs-number,.hljs-tag .hljs-attr,.hljs-template-variable,.hljs-variable{color:teal}.hljs-doctag,.hljs-string{color:#d14}.hljs-section,.hljs-selector-id,.hljs-title{color:#900;font-weight:700}.hljs-subst{font-weight:400}.hljs-class .hljs-title,.hljs-type{color:#458;font-weight:700}.hljs-attribute,.hljs-name,.hljs-tag{color:navy;font-weight:400}.hljs-meta,.hljs-strong{font-weight:700}.hljs-link,.hljs-regexp{color:#009926}.hljs-bullet,.hljs-symbol{color:#990073}.hljs-built_in,.hljs-builtin-name{color:#0086b3}.hljs-meta{color:#999}.hljs-deletion{background:#fdd}.hljs-addition{background:#dfd}.hljs-emphasis{font-style:italic}" : "";
    html = html.replace("__CODESTYLE_PLACEHOLDER__", codeStyleCSS);
    html = html.replace("__CUSTOM_CSS_PLACEHOLDER__", config.customCSS);
    html = html.replace("__FORM_PLACEHOLDER__", config.formDataToken);
    html = html.replace(/__RADIO_BUTTON_COLOR__/g, radioColor);
    html = html.replace(/__TEXT_INPUT_COLOR__/g, textInputColor[0]);
    html = html.replace(/__TEXT_INPUT_SHADOW_COLOR__/g, textInputColor[1]);
    html = html.replace('"__PROTO__"', 'location.protocol.replace(":","")');
    html = html.replace('"__CURRENTHOST__"', 'location.host || "null"');
    html = replace(html,"__CONTAINER_SUMMARY_PLACEHOLDER__", config.allowHtml ? '<p class="grey-text text-darken-1" v-html="summary"></p>':'<p class="grey-text text-darken-1">{{summary}}</p>');
    html = replace(html,"__PARAM_DESC_PLACEHOLDER__", config.allowHtml ? '<td><div class="lpad5px" v-html="param.desc"></div></td>':'<td><div class="lpad5px">{{param.desc}}</div></td>');
    html = replace(html,"__RES_DESC_PLACEHOLDER__", config.allowHtml ? '<td><div class="lpad5px" v-html="res.desc"></div></td>':'<td><div class="lpad5px">{{res.desc}}</div></td>');
    html = replace(html,"__METHOD_SUMMARY_PLACEHOLDER__", config.allowHtml ? '<p class="indent" v-if="method.summary" v-html="method.summary"></p>':'<p class="indent" v-if="method.summary">{{method.summary}}</p>');
    html = replace(html,"__METHOD_DESC_PLACEHOLDER__", config.allowHtml ? '<p class="indent" v-if="method.desc" v-html="method.desc"></p>':'<p class="indent" v-if="method.desc">{{method.desc}}</p>');
    html = replace(html,"__PATH_PARAM_LEFT_TOKEN__", config.pathParamLeftToken);
    html = replace (html,"__PATH_PARAM_RIGHT_TOKEN__", config.pathParamRightToken);
    html = html.replace("__FOOTER_PLACEHOLDER__", config.noFooter ? '' : config.footer ||  "Generated "+ date.toLocaleTimeString("en-us", dateFormat) +' by <a href="https://github.com/twskj/livedoc/">livedoc</a>');
    html = html.replace("__GENERATED_DATE__", date.toLocaleTimeString(config.timeLocale || "en-us", dateFormat));

    config.mode = config.mode || "singlefile";

    if(config.mode.toLowerCase() === "offline"){
        var outputFilename = config.outputFilename || "doc.html";
        makeOffline(html,outputFilename,callback);
    }
    else if(config.mode.toLowerCase() === "noicon"){
        makeNoIcon(html,callback);
    }
    else if(config.mode.toLowerCase() === "lite"){
        makeLite(html,callback);
    }
    else {
        return makeSingleFile(html,callback);
    }
}

map = {
    "generateHTML": generateHTML
    ,"initContainer": initContainer
    ,"initApi": initApi
    ,"initMethod": initMethod
    ,"initParam": initParam
    ,"initResponse": initResponse
    ,"initRequest": initRequest
    ,"initHeader": initHeader
};

module.exports = map;