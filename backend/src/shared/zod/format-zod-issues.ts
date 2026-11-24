import { z } from "zod";

const defaultMessage = (issue: z.core.$ZodRawIssue): string | undefined => {
  switch (issue.code) {
    case "invalid_type":
      return issue.input === undefined ? "required" : `expected: ${issue.expected}`;
    case "too_small":
      if (issue.origin === "string") return `must be at least: ${issue.minimum} characters`;
      if (issue.origin === "array" || issue.origin === "set") return `must contain at least: ${issue.minimum} items`;
      return `must be at least: ${issue.minimum}`;
    case "too_big":
      if (issue.origin === "string") return `must be at most: ${issue.maximum} characters`;
      if (issue.origin === "array" || issue.origin === "set") return `must contain at most: ${issue.maximum} items`;
      return `must be at most: ${issue.maximum}`;
    case "invalid_format":
      return issue.format === "regex" ? "invalid format" : `invalid format: ${issue.format}`;
    case "invalid_value":
      return `expected one of: ${issue.values.map((value) => `"${String(value)}"`).join(", ")}`;
    case "unrecognized_keys":
      return `unknown fields: ${issue.keys.join(", ")}`;
    default:
      return "invalid value";
  }
};

z.config({ customError: defaultMessage });

export const formatZodIssues = (issues: readonly z.core.$ZodIssue[], rootKey: string) => {
  const fields: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : rootKey;
    fields[key] ??= issue.message;
  }
  return fields;
};
