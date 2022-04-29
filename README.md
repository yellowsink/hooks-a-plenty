# Hooks-a-plenty

A big lib full of React hooks.

## useResource
This allows easy data fetching. The API is heavily inspired by solid.js' createResource.

```ts
function useResource<T>(fetcher: () => Promise<T>): [undefined | T, any, () => void];
```
If you pass only one argument:
 - the fetcher is invoked
 - on resolve, rerenders
 - if it fulfilled, sets the first returned value to the value
 - if it rejected, sets the second returned value to the error

The third returned value causes a re-fetch.

```ts
function useResource<T>(triggerState: unknown, fetcher: () => Promise<T>): [undefined | T, any, () => void];
```
If you pass two arguments:
 - the fetcher is invoked whenever the triggerState value changes
 - the fecher is not invoked on the first call

## useRefState
You may have a case where you always set two states together, but you may be running in React <18.

The problem with this is that the setState calls could not be batched,
reducing performance with unnecessary rerenders.

useRefState solves this by being a hook with the same API as useState, but that doesnt cause rerenders.

No example really needed here, the only detail is hidden under-the-hood in not causing rerenders.

This hook is also quite useful for custom hook authors.

## useFreeze
Useful for libs and custom hooks, where you need the same args across re-renders.
Freezes the argument it is passed on the first render and will return it on every subsequent call.

```js
const FrozenDiv = ({ children, ...props }) => {
    const frozenChildren = useFreeze(children);
    return <div {...props}>{frozenChildren}</div>;
}

const Example = () => {
    const [count, setCount] = React.useState(1);

    return (
        <>
            {/* always shows current count */}
            <button onClick={() => setCount(count + 1)}>{count}</button>
            {/* always shows 1, or whatever the default value of count is */}
            <FrozenDiv>{count}</FrozenDiv>
        </>
    )
}
```

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

## TODO: document resource, keybind
## TODO: add toggle, resize