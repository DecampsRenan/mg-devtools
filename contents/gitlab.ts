function createBtn(label, onClick = () => {}) {
  const btn = document.createElement("button")
  btn.textContent = label
  btn.classList.add("btn", "btn-confirm")
  resolveAllBtn.addEventListener("click", onClick)
  return btn
}

const mainButtonsBar = document.querySelector(".detail-page-header-actions")

const resolveAllBtn = createBtn("Resolve all threads", () => {
  const resolveBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      "[data-testid=resolve-discussion-button]"
    )
  )
  resolveBtns.forEach((btn) => btn.click())
})

if (mainButtonsBar) {
  mainButtonsBar.appendChild(resolveAllBtn)
}

export {}
