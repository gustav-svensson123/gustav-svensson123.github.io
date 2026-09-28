/* ==========================================================================
   INSTÄLLNINGAR
   ========================================================================== */
const WEDDING_DATE = new Date("2027-09-11T14:00:00+02:00"); // vigseln, svensk sommartid
const THEMES = ["vastkust", "skog", "sand", "skymning", "solnedgang", "sandhav"];     // ska matcha css/themes.css

// OSA skickas via FormSubmit (formsubmit.co) till dessa adresser
const RSVP_TO = "gustavsp91@gmail.com";
const RSVP_CC = "malinjonson96@gmail.com";


/* ==========================================================================
   NEDRÄKNING
   ========================================================================== */
function updateCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    el.innerHTML = '<p class="date">Nu är vi gifta!</p>';
    return;
  }

  const minutes = Math.floor(diff / 60000);
  const values = {
    days:    Math.floor(minutes / 1440),
    hours:   Math.floor((minutes % 1440) / 60),
    minutes: minutes % 60,
  };
  for (const [unit, value] of Object.entries(values)) {
    el.querySelector(`[data-unit="${unit}"]`).textContent = value;
  }
}
updateCountdown();
setInterval(updateCountdown, 30 * 1000);


/* ==========================================================================
   MJUK INTONING AV SEKTIONER
   ========================================================================== */
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));


/* ==========================================================================
   TEMAVÄLJARE – bara för förhandsgranskning.
   Öppna sidan med ?teman (t.ex. index.html?teman) för att visa den.
   Det valda temat sparas inte; ändra data-theme i index.html för att byta på riktigt.
   ========================================================================== */
if (new URLSearchParams(location.search).has("teman")) {
  const root = document.documentElement;
  const picker = document.createElement("div");
  picker.className = "theme-picker";

  for (const name of THEMES) {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.setAttribute("aria-pressed", root.dataset.theme === name);
    btn.addEventListener("click", () => {
      root.dataset.theme = name;
      picker.querySelectorAll("button").forEach((b) =>
        b.setAttribute("aria-pressed", b === btn));
    });
    picker.appendChild(btn);
  }
  document.body.appendChild(picker);
}


/* ==========================================================================
   OSA-FORMULÄR
   Skickar svaret som mail via FormSubmit. Om det misslyckas erbjuds
   gästen att skicka ett vanligt mail istället.
   ========================================================================== */
const rsvpForm = document.getElementById("rsvp-form");
if (rsvpForm) {
  const status = document.getElementById("rsvp-status");
  const button = rsvpForm.querySelector("button[type=submit]");

  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.classList.remove("is-error");

    if (!rsvpForm.checkValidity()) {
      status.textContent = "Fyll i namn, e-post och om du kommer.";
      status.classList.add("is-error");
      rsvpForm.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(rsvpForm));
    const payload = {
      ...data,
      _subject: `OSA: ${data.Namn} (${data.Kommer})`,
      _cc: RSVP_CC,
      _replyto: data.email,
      _template: "table",
    };

    button.disabled = true;
    status.textContent = "Skickar…";

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${RSVP_TO}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) !== "true") throw new Error(json.message || res.status);

      rsvpForm.innerHTML = data.Kommer === "Ja"
        ? '<p class="rsvp-thanks"><strong>Tack!</strong> Vad roligt att du kommer – vi ses i Grebbestad!</p>'
        : '<p class="rsvp-thanks"><strong>Tack för ditt svar!</strong> Vi kommer att sakna dig.</p>';
    } catch (err) {
      const body = Object.entries(data)
        .filter(([k]) => !k.startsWith("_"))
        .map(([k, v]) => `${k}: ${v}`).join("\n");
      const mailto = `mailto:${RSVP_TO},${RSVP_CC}?subject=${encodeURIComponent("OSA: " + data.Namn)}&body=${encodeURIComponent(body)}`;
      status.innerHTML = `Något gick fel. <a href="${mailto}">Skicka ditt svar som mail istället</a>.`;
      status.classList.add("is-error");
      button.disabled = false;
    }
  });
}
