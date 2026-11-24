import { LoaderCircle } from "lucide-react";
import "./spinner.css";

export const Spinner = ({ size = 15 }: { size?: number }) => (
  <LoaderCircle size={size} className="spinner" />
);
