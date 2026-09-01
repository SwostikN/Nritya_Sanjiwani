export function setErr(input: HTMLElement, msg: string) {
  const field = input.closest(".field");
  if (!field) return;
  field.classList.toggle("has-err", !!msg);
  const e = field.querySelector(".err");
  if (e) e.textContent = msg || "";
}
export const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
