import { useEffect, useRef } from "react";

type Modifiers = ("ctrl" | "alt" | "shift")[];
type EventType = "keyup" | "keydown";

export interface KeybindArgs {
  key: string;
  modifiers: Modifiers;
  on: (type: EventType, e: KeyboardEvent) => void;
  eventType?: EventType;
  followLayout?: boolean;
}

export default ({
  key,
  modifiers,
  on,
  eventType = "keyup",
  followLayout = false,
}: KeybindArgs) => {
  const handler = (e: KeyboardEvent) => {
    // 229 is an IME keycode, see:
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
    if (e.isComposing || e.keyCode === 229) return;

    // only listen for relevant events
    if ((followLayout ? e.key : e.code) !== key) return;

    // modifiers
    // meta for macos
    if (modifiers.includes("ctrl") !== (e.ctrlKey || e.metaKey)) return;
    if (modifiers.includes("alt") !== e.altKey) return;
    if (modifiers.includes("shift") !== e.shiftKey) return;

    on(eventType, e);
  };

  const isActive = useRef(true);
  const deactivate = () => document.removeEventListener(eventType, handler);

  // reset event handlers on every rerender, and don't freeze args
  // this shouldnt be a problem unlike onMount/onUnmount
  useEffect(() => {
    if (!isActive.current) return;
    document.addEventListener(eventType, handler);
    return deactivate;
  });

  return () => {
    isActive.current = false;
    deactivate();
  };
};
