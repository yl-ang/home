// Copy text: async Clipboard API first, then a hidden textarea + execCommand. Resolves false if both fail.
export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Insecure context, denied permission or lost user activation: try the legacy path.
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.setAttribute("aria-hidden", "true");
  area.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
  const previous = document.activeElement;
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch (e) {
    ok = false;
  }
  area.remove();
  if (previous && previous.focus) previous.focus();
  return ok;
};
