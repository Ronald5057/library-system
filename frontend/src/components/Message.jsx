export default function Message({ text, type = 'error' }) {
  if (!text) return null;
  return <p className={`message ${type}`} role="alert">{text}</p>;
}
