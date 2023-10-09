// =================================== GITLAB
const mainButtonsBar = document.querySelector(".detail-page-header-actions")

const resolveAllBtn = document.createElement("button")
resolveAllBtn.textContent = "Resolve all threads"
resolveAllBtn.classList.add("btn", "btn-confirm")
resolveAllBtn.addEventListener("click", () => {
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

setTimeout(() => {
  // =================================== JIRA
  const dayReportTitles = Array.from(
    document.querySelectorAll("[name=calendarCanvasDayHeader]")
  )

  dayReportTitles.forEach((elt, i) => {
    const copyReportBtn = document.createElement("button")
    copyReportBtn.textContent = "Copy"
    copyReportBtn.style.display = "inline-block"
    copyReportBtn.style.left = "3px"
    copyReportBtn.style.right = "3px"
    copyReportBtn.classList.add("tuiButton", "tuiButton--primary")
    copyReportBtn.addEventListener("click", async () => {
      const currentDay = Array.from(
        document.querySelectorAll(
          `[name=calendarListViewDay]:nth-child(${
            i + 1
          }) [name=tempoWorklogCard]`
        )
      )

      let txt = currentDay.reduce((acc, item) => {
        const title = item.querySelector("div[title]").textContent
        const desc = item.querySelector("[name=tempoCardComment]").textContent
        const time = item.querySelector("[name=tempoCardDuration]").textContent
        const ticketNum = item.querySelector("span[title]").textContent

        const formattedText = `## ${title} - ${ticketNum} (${time})
${desc}

`

        return acc + formattedText
      }, "")

      console.log(txt)

      const textContentElt = document.createElement("textarea")
      textContentElt.value = txt
      textContentElt.style.position = "fixed"
      textContentElt.style.left = "-9999px"
      document.body.appendChild(textContentElt)
      textContentElt.focus()
      textContentElt.select()
      textContentElt.setSelectionRange(0, 99999)
      document.execCommand("copy")
      textContentElt.remove()

      copyReportBtn.textContent = "✅ Copied"
      setTimeout(() => {
        copyReportBtn.textContent = "Copy"
      }, 2000)
    })

    elt.appendChild(copyReportBtn)
  })
}, 3000)

export {}
