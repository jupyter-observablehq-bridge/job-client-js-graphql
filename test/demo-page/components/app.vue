<template>
  <div>
    <v-app-bar app color="blue accent-3" dark>
      <v-spacer></v-spacer>
      <v-toolbar-title>Test JupyterBridge JS Client</v-toolbar-title>
      <v-spacer></v-spacer>
      <a href="https://github.com/oscar6echo/TBD" target="_blank">
        <v-icon>mdi-github-circle</v-icon>
      </a>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row class="d-flex justify-center">
          <v-col cols="2">
            <v-text-field v-model="host" label="Host" required dense></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field v-model="port" label="Port" required dense></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field v-model="path" label="Path" required dense></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-btn outlined text class="pa-2" @click="runTest">Run Tests in Console</v-btn>
          </v-col>
        </v-row>
        <!-- <div class="d-flex flex-row justify-center mb-3">
          <v-btn outlined text class="pa-2" @click="runTest">Run Tests in Console</v-btn>
        </div>-->
        <div>
          <v-row no-gutters>
            <v-col cols="3">
              <query :server="server" />
            </v-col>
            <v-col cols="3">
              <query-histo :server="server" />>
            </v-col>
            <v-col cols="3">
              <mutation :server="server" />>
            </v-col>
            <v-col cols="3">
              <subscription />>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-content>

    <functions ref="func" />
  </div>
</template>

<script>
const Functions = httpVueLoader("./functions.vue");
const Query = httpVueLoader("./query.vue");
const QueryHisto = httpVueLoader("./query-histo.vue");
const Mutation = httpVueLoader("./mutation.vue");
const Subscription = httpVueLoader("./subscription.vue");

module.exports = {
  name: "App",
  components: {
    Functions,
    Query,
    QueryHisto,
    Mutation,
    Subscription
  },
  data() {
    return {
      host: "localhost",
      port: "4000",
      path: "/graphql"
    };
  },
  computed: {
    server() {
      const { host, port, path } = this;
      return { host, port, path };
    }
  },
  mounted() {
    // const that = this;
    // window.setTimeout(() => that.$refs.func.runTestsInConsole(), 1000);
  },
  methods: {
    runTest() {
      if (this.$refs.func) {
        this.$refs.func.runTestsInConsole({ server: this.server, debug: true });
      }
    }
  }
};
</script>

<style scoped>
</style>