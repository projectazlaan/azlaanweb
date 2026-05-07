// ─────────────────────────────────────────────────────────────────
// usePostMessage — backward-compatible re-export
// Components import from here; internally delegates to
// useMessageSender (no listener). The single listener lives
// in page.tsx via useMessageListener.
// ─────────────────────────────────────────────────────────────────
export { useMessageSender as usePostMessage } from './useMessageSender'
export { useMessageListener } from './useMessageListener'
