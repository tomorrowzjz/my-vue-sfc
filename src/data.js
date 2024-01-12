export let code = `
<template>
  <h1 @click="test">{{code}}</h1>
  
</template>

<script>
  // import 'some-codemirror-resource'
  export default {
    data() {
      return {
        code: 'const A = 10',
      };
    },
    methods: {
      test() {
        console.log('test');
      },
    },
  }
</script>

<style>
  main {
    position: relative;
  }
  h1 {
    color: red;
  }
</style>`;