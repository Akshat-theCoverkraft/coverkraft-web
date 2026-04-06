import { T } from "./tokens";

export default function Toast({ msg, type, show }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: show
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(80px)",
        background: T.bgCard,
        color: type === "err" ? T.danger : T.text,
        border: `1px solid ${type === "err" ? T.danger : T.border}`,
        padding: "12px 24px",
        borderRadius: 30,
        fontSize: 14,
        transition: ".35s",
        opacity: show ? 1 : 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      {msg}
    </div>
  );
}