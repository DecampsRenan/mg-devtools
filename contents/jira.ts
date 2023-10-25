function createBtn(label, onClick = () => {}) {
  const btn = document.createElement("button")
  btn.textContent = "Copy"
  btn.style.display = "inline-block"
  btn.style.left = "3px"
  btn.style.right = "3px"
  btn.classList.add("tuiButton", "tuiButton--primary")
  btn.addEventListener("click", onClick)
  return btn
}

setTimeout(() => {
  // =================================== JIRA
  const dayReportTitles = Array.from(
    document.querySelectorAll("[name=calendarCanvasDayHeader]")
  )

  dayReportTitles.forEach((elt, i) => {
    const copyReportBtn = createBtn("Copy", async () => {
      const currentDay = Array.from(
        document.querySelectorAll(
          `[name=calendarListViewDay]:nth-child(${
            i + 1
          }) [name=tempoWorklogCard]`
        )
      )

      let txt = currentDay
        .reduce((acc, item) => {
          const title = item.querySelector("div[title]").textContent
          const desc = item.querySelector("[name=tempoCardComment]").textContent
          const time = item.querySelector(
            "[name=tempoCardDuration]"
          ).textContent
          const ticketNum = item.querySelector("span[title]").textContent

          const formattedText = `## ${title} - ${ticketNum} (${time})
${desc}

`

          return acc + formattedText
        }, "")
        .trim()

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
