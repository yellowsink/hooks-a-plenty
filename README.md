# Hooks-a-plenty

A big lib full of React hooks.

## useMount
Like an effect but it unambiguously runs only on mount. This is equivalent to `useEffect(callback, [])` but has some benefits:
 - It is easier when reading code: It takes extra time and knowledge to comprehend that:
   * You are passing an empty array to the effect
   * That will only run it on mount
 - Cleanups are not ran. This is, again, simply a predictability argument:
   * You won't be defining mount and unmount callbacks in the same place, increasing clarity
   * You can use expression arrow functions without fear that they may return a function

```js
// some imaginary lib that needs to access the dom node once.
import { setupNode } from "a-cool-dom-lib";

const Example = () => {
    const elemRef = React.useRef();

    useMount(() => setupNode(elemRef.current));

    return <div ref={elemRef}>my cool div</div>;
}
```

## useUnmount
An easy way to cleanup. Possible but not very clean with just effects.

```js
// some imaginary lib that needs to access the dom node.
import { setupNode, cleanupNode } from "a-cool-dom-lib";

const Example = () => {
    const elemRef = React.useRef();

    useMount(  () => setupNode(  elemRef.current));
    useUnmount(() => cleanupNode(elemRef.current));

    return <div ref={elemRef}>my cool div</div>;
}
```

### When you might not want to use separate hooks 
Some apis may return an undo function from their init function. 
One example of this is patching a function with spitroast. 
In this case, useEffect is often cleaner 
```js
import { init } from "a-cool-lib";

const Example = () => {
    useEffect(() => init(), []);
    return <div />;
}
```

## useRerender
A cancerous hook for when you just give up on your life and need React to please for the love of god just rerender.

```js
const Example = () => {
    const counter = React.useRef(0);
    useEffect(() => counter.current++);
    const rerender = useRerender();

    return <button onClick={rerender}>{counter.current}</button>
}
```

For the record, this hook can almost always be replaced with something better.

There are
[some](https://github.com/yellowsink/cc-plugins/blob/8180b952d3d6c607e73be686845151f22eb2d26b/cumstain/components/tabs/TabInstalled.jsx#L28)
[exceptions](https://github.com/yellowsink/cc-plugins/blob/8180b952d3d6c607e73be686845151f22eb2d26b/cumstain/components/tabs/TabStore.jsx#L42),
but for example, the above snippet could become:

```js
const Example = () => {
    const [counter, increment] = React.useReducer(x => x + 1, 0);

    return <button onClick={increment}>{counter}</button>
}
```

## TODO: document resource
