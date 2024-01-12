<template>
  <div class="example">
    <h1>仅支持VUE2单文件组件在线预览</h1>
    <button @click="run">run</button>
    <div class="codemirror">
      <codemirror
        v-model="code"
        :options="cmOption"
        @cursorActivity="onCmCursorActivity"
        @ready="onCmReady"
        @focus="onCmFocus"
        @blur="onCmBlur"
      />
      <div class="preview" ref="preview"></div>
    </div>
    
  </div>
</template>
<script>
/* eslint-disable */
import { codemirror } from "vue-codemirror";

// language
import "codemirror/mode/vue/vue.js";

// base style
import "codemirror/lib/codemirror.css";

// theme css
import "codemirror/theme/base16-dark.css";

// active-line.js
import "codemirror/addon/selection/active-line.js";

// styleSelectedText
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/searchcursor.js";

// highlightSelectionMatches
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";

// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";

// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";
import Vue from "vue/dist/vue.js";
let VueTemplateCompiler = require("vue-template-compiler");
import {code} from './data.js'

export default {
  components: {
    codemirror,
  },
  data() {
    return {
      code:code,
      currentEl: "",
      cmOption: {
        tabSize: 4,
        foldGutter: true,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        keyMap: "sublime",
        // mode: 'text/x-vue',
        mode: { name: "vue" },
        theme: "base16-dark",
        extraKeys: {
          F11(cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
          },
          Esc(cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
          },
        },
      },
    };
  },
  mounted() {
    this.shadowroot = this.$refs.preview.attachShadow({mode: 'open'})
  },
  methods: {
    onCmCursorActivity(codemirror) {
      console.log("onCmCursorActivity", codemirror);
    },
    onCmReady(codemirror) {
      console.log("onCmReady", codemirror);
    },
    onCmFocus(codemirror) {
      console.log("onCmFocus", codemirror);
    },
    onCmBlur(codemirror) {
      console.log("onCmBlur", codemirror);
    },
    run() {
      const compiler = VueTemplateCompiler.parseComponent(this.code);
      const option = new Function(
        compiler.script.content.replace("export default", "return")
      )();

      // // 使用字符串替换将 export 替换为一个返回字符串的函数
      // const modifiedCode = compiler.script.content.replace(/export default\s+/g, 'function getExportedCode() { return ');

      // // 添加函数结束的括号
      // const finalCode = modifiedCode + '}';

      // // 执行生成的代码
      // eval(finalCode);

      // // 调用替代函数并获取替代字符串
      // const option = getExportedCode();

      // 打印替代字符串
      console.log(option);
      console.log(
        option,
        compiler.script.content,
        compiler.script.content.replace("export default", "return")
      );
      option.template = compiler.template.content;
      const component = new Vue(option).$mount();
      const style = document.createElement("style");
      style.innerHTML = compiler.styles[0].content;
      
      if(!this.shadowroot){
        this.shadowroot = this.$refs.preview.attachShadow({mode: 'open'})
      }
      this.shadowroot.innerHTML = ''
      // shadowroot
      this.$nextTick(() => {
        this.shadowroot.appendChild(component.$el);
        this.shadowroot.appendChild(style);
      });
    },
  },
};
</script>

<style scoped>
.example {
}
.preview{
  margin-left: 20px;
  padding: 20px;
  width: calc(100% - 620px);
  border: 1px slategray solid;
}
.codemirror {
  display: flex;
  height: 100%;
  width: 100%;
}
/deep/ .CodeMirror {
  max-height: 100%;
  height: 600px;
  width: 700px;
}
</style>
