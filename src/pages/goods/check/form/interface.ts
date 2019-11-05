export interface ConfigItem {
  label: string,
  name: string,
  type: "" | "input" | "select" | "textarea" | "text" | "rangepicker" | "radio" | "checkbox" | "date" | undefined
}