// ─── Design Tokens ────────────────────────────────────────────────────────────
export const T = {
  primary:   "#ffb300",
  accent:    "#c4ed3f",
  bg:        "#0a0a0a",
  bgCard:    "#161616",
  bgInput:   "#1a1a1a",
  text:      "#ffffff",
  muted:     "#a3a3a3",
  border:    "#262626",
  danger:    "#ff4d4d",
  successBg: "rgba(196,237,63,0.08)",
  primaryBg: "rgba(255,179,0,0.08)",
};

// Shared sx passed into every CustomInput so it inherits the dark theme
export const inputSx = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: `1px solid ${T.border}`,
  background: T.bgInput,
  color: T.text,
  outline: "none",
  fontSize: "14px",
  fontFamily: "inherit",
};

export const stepNav = () => ({
  display: "flex",
  justifyContent: "space-between",
  marginTop: 40,
  paddingTop: 24,
  borderTop: `1px solid ${T.border}`,
});

// Minimal global styles
export const GLOBAL_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .ck-label { display:block; font-size:10px; color:#a3a3a3; margin-bottom:8px; letter-spacing:1px; text-transform:uppercase; font-weight:700; }
  .ck-err-msg { color:#ff4d4d; font-size:12px; margin-top:5px; display:block; }
`;