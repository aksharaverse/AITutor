// Shared LaTeX segmenter used by both math renderers (web + native).

export type Segment =
  | { type: "text"; content: string }
  | { type: "inline"; content: string }
  | { type: "block"; content: string };

// Split on $$...$$ first (display), then $...$ (inline) within the remainder.
export function segmentLatex(input: string): Segment[] {
  const out: Segment[] = [];
  const blockRe = /\$\$([\s\S]+?)\$\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(input))) {
    if (m.index > last) pushInline(out, input.slice(last, m.index));
    out.push({ type: "block", content: m[1].trim() });
    last = m.index + m[0].length;
  }
  if (last < input.length) pushInline(out, input.slice(last));
  return out;
}

function pushInline(out: Segment[], text: string) {
  const inlineRe = /\$([^$\n]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = inlineRe.exec(text))) {
    if (m.index > last) out.push({ type: "text", content: text.slice(last, m.index) });
    out.push({ type: "inline", content: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", content: text.slice(last) });
}
