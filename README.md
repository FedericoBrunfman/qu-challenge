# qu-challenge

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Questions:

1. What's a closure? Where in the code is there a closure?
2. Which are the potential side-effects in any function? Could you point out any of these cases in your code? Are they expected? Can they be avoided?

### Answers:
1. A closure is a function that has access to the parent scope. You can find a closure within the .then() callback function of the axios request inside the mounted lifecycle method. The callback function response => { ... } is a closure because it's a function that's defined inside another function and has access to variables from its containing function and scope (this.planets, this.planetsMapped, this.sortByName, and this.direction).
2. Side-effects are actions that change things outside of their immediate function or go beyond simply returning a value. This can include updating variables elsewhere in the code, interacting with outside systems. A common side effect would be the state properties (`this.planets`, `this.loading`...). Changing it's values is consider a side effect. These effects are expected but could be improved using Typescript (defining types would be a good option). Other side effect would be the use of `axios` since it's an external interaction. We can reduce it's side effects using try/catch statement. We can also include a timeout if we think the response could take extra time.
