<template>
  <div class="ma-3 my-wrapper">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <pre class="json-formatted" v-html="formatted"></pre>
  </div>
</template>
  
<script>
module.exports = {
  name: "JsonDisplay",
  props: {
    obj: {
      required: true,
      validator: e => typeof e === "object" || e === null
    },
    indent: { type: Number, default: () => 1 }
  },

  data() {
    return {};
  },
  computed: {
    formatted() {
      let content = JSON.stringify(this.obj, null, this.indent);
      content = this.syntaxHighlightJson(content);
      return content;
    }
  },
  created() {},
  methods: {
    syntaxHighlightJson(json) {
      json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        function(match) {
          let cls = "number";
          if (match.startsWith('"')) {
            if (match.endsWith(":")) {
              cls = "key";
            } else {
              cls = "string";
            }
          } else if (/true|false/.test(match)) {
            cls = "boolean";
          } else if (/null/.test(match)) {
            cls = "null";
          }
          return '<span class="' + cls + '">' + match + "</span>";
        }
      );
    }
  }
};
</script>
  
<style scoped>
.my-wrapper {
  border: 1px solid #eee;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 500px;
}

pre.json-formatted {
  padding: 5px;
  margin: 5px;
}
.string {
  color: green;
}
.number {
  color: darkorange;
}
.boolean {
  color: blue;
}
.null {
  color: magenta;
}
.key {
  color: red;
}
</style>



