function createBtn(
  label: string,
  onClick: (this: Window, ev: WindowEventMap["click"]) => void
) {
  const btn = document.createElement("button")
  btn.textContent = "Copy"
  btn.style.display = "inline-block"
  btn.classList.add("tuiButton", "tuiButton--primary", "tuiButton--small")
  btn.addEventListener("click", onClick)
  return btn
}

function copyToClipboard(textToCopy: string) {
  const textContentElt = document.createElement("textarea")
  textContentElt.value = textToCopy
  textContentElt.style.position = "fixed"
  textContentElt.style.left = "-9999px"
  document.body.appendChild(textContentElt)
  textContentElt.focus()
  textContentElt.select()
  textContentElt.setSelectionRange(0, 99999)
  document.execCommand("copy")
  textContentElt.remove()
}

const useToggleElt = (elt: HTMLElement) => {
  const defaultWidth = elt.style.width

  function hide() {
    elt.style.width = "0px"
    elt.style.visibility = "hidden"
  }

  function show() {
    elt.style.width = defaultWidth
    elt.style.visibility = "visible"
  }

  return {
    show,
    hide
  }
}

setTimeout(() => {
  const dayReportTitles = Array.from(
    document.querySelectorAll("[name=calendarCanvasDayHeader]")
  )

  dayReportTitles.forEach((dayHeader, i) => {
    const spentDayHours = dayHeader.querySelector<HTMLSpanElement>(
      "h3 > span:nth-child(2)"
    )

    const buttonCopyLogic = (e) => {
      const elt = e.target as HTMLButtonElement
      const currentDay = Array.from(
        document.querySelectorAll(
          `[name=calendarListViewDay]:nth-child(${
            i + 1
          }) [name=tempoWorklogCard]`
        )
      )

      const txt = currentDay
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

      copyToClipboard(txt)
      elt.textContent = "✅ Copied"
      setTimeout(() => {
        elt.textContent = "Copy"
      }, 2000)
    }

    const copyReportBtn = createBtn("R", buttonCopyLogic)
    copyReportBtn.style.fontSize = ".8em"
    copyReportBtn.style.margin = "0px"
    const { show: showCopyReportBtn, hide: hideCopyReportBtn } =
      useToggleElt(copyReportBtn)
    hideCopyReportBtn()

    const { show: showSpentDayHours, hide: hideSpentDayHours } =
      useToggleElt(spentDayHours)
    dayHeader.addEventListener("mouseenter", () => {
      hideSpentDayHours()
      showCopyReportBtn()
    })

    dayHeader.addEventListener("mouseleave", () => {
      hideCopyReportBtn()
      showSpentDayHours()
    })

    dayHeader.querySelector<HTMLSpanElement>("h3").append(copyReportBtn)
  })
}, 3000)

export {}
