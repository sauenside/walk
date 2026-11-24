import "./dot.css";

export type DotTone = "success" | "warning" | "muted";

// Цветная точка состояния: ● зелёная, ● оранжевая, ○ серая
export const Dot = ({ tone }: { tone: DotTone }) => <div className={`dot dot-${tone}`} />;
