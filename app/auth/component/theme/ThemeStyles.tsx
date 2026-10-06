// Keyframes for the auth theme. Rendered once by AuthShell.
const css = `
@keyframes ca-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes ca-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(-14px,12px)}}
@keyframes ca-spin{to{transform:rotate(360deg)}}
@keyframes ca-word{0%{opacity:0;transform:translateY(60%)}6%,22%{opacity:1;transform:translateY(0)}28%,100%{opacity:0;transform:translateY(-60%)}}
@keyframes ca-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.ca-float{animation:ca-float 7s ease-in-out infinite}
.ca-drift{animation:ca-drift 9s ease-in-out infinite}
.ca-spin{animation:ca-spin 40s linear infinite}
.ca-word{opacity:0;animation:ca-word 12s ease-in-out infinite both}
.ca-rise{animation:ca-rise .5s ease-out both}
@media (prefers-reduced-motion:reduce){
  .ca-float,.ca-drift,.ca-spin,.ca-rise,.ca-word{animation:none}
  .ca-word:first-child{opacity:1}
}
`;

export function ThemeStyles() {
  return <style>{css}</style>;
}
