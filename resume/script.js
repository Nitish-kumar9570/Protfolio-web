/**
 * Nitish Kumar — Professional Jake's LaTeX Resume Script (Prism Minimal Edition)
 * Focuses on client-side contact copying and lightweight overlay toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. SYSTEM INITIALIZATION CONSOLE GREETING ---
  console.log(
    "%cNitish Kumar — Professional Resume Console\n%cJake's LaTeX Tech Resume active. Google XYZ metrics enabled. 🚀",
    "color: #2563eb; font-size: 14px; font-weight: bold;",
    "color: #64748b; font-size: 11px;"
  );
});

/**
 * Copies a given text value to the system clipboard and triggers a visual toast confirmation.
 * @param {string} text - RAW data to copy.
 * @param {string} label - Toast item label.
 */
function copyValue(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('clipboard-toast');
    const toastText = document.getElementById('clipboard-toast-text');
    
    if (toast && toastText) {
      toastText.textContent = `${label} copied successfully!`;
      toast.classList.add('show');
      
      // Auto-dismiss after 2.4 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2400);
    }
  }).catch(err => {
    console.error('Clipboard copy subsystem failed: ', err);
  });
}
