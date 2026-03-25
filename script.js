const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const copyEinButton = document.getElementById("copyEinButton");
const copyFeedback = document.getElementById("copyFeedback");
const einText = document.getElementById("einText");
const eventList = document.getElementById("eventList");
const tabs = document.querySelectorAll(".tab");
const statNumbers = document.querySelectorAll(".stat-number");
const reveals = document.querySelectorAll(".reveal");

const events = [
  {
    title: "Spring Community Cleanup",
    date: "April 13, 2026",
    location: "Echols County Ball Field",
    type: "community",
    description: "Volunteers help prepare fields, dugouts, and fan areas for the season.",
  },
  {
    title: "Youth Skills Clinic",
    date: "May 10, 2026",
    location: "Lake Park, GA",
    type: "upcoming",
    description: "A free clinic focused on batting, fielding, and sportsmanship for local students.",
  },
  {
    title: "Family Dugout Day",
    date: "June 7, 2026",
    location: "Echols County Recreation Area",
    type: "community",
    description: "Food, games, and team recognition to celebrate student-athlete achievements.",
  },
  {
    title: "Summer Fundraiser Classic",
    date: "July 19, 2026",
    location: "Echols County Main Field",
    type: "upcoming",
    description: "Annual fundraiser supporting equipment purchases and program expansion.",
  },
];

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

copyEinButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(einText.textContent.trim());
    copyFeedback.textContent = "EIN copied to clipboard.";
  } catch (error) {
    copyFeedback.textContent = "Copy not available on this browser. EIN: 99-3856023";
  }

  setTimeout(() => {
    copyFeedback.textContent = "";
  }, 2200);
});

function renderEvents(filter = "all") {
  if (!eventList) return;

  const filtered =
    filter === "all" ? events : events.filter((eventItem) => eventItem.type === filter);

  eventList.innerHTML = "";

  filtered.forEach((eventItem) => {
    const node = document.createElement("article");
    node.className = "event-item";
    node.innerHTML = `
      <h3>${eventItem.title}</h3>
      <p class="event-meta">${eventItem.date} | ${eventItem.location}</p>
      <p>${eventItem.description}</p>
    `;
    eventList.appendChild(node);
  });
}

renderEvents();

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderEvents(tab.dataset.filter);
  });
});

const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const stat = entry.target;
      const target = Number(stat.dataset.target);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 45));

      const counter = setInterval(() => {
        current += step;

        if (current >= target) {
          stat.textContent = `${target}${target === 100 ? "%" : "+"}`;
          clearInterval(counter);
          observer.unobserve(stat);
          return;
        }

        stat.textContent = `${current}`;
      }, 26);
    });
  },
  { threshold: 0.45 }
);

statNumbers.forEach((stat) => statObserver.observe(stat));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((item) => revealObserver.observe(item));

const triggers = document.querySelectorAll(".accordion-trigger");

triggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = trigger.nextElementSibling;
    const expanded = trigger.getAttribute("aria-expanded") === "true";

    trigger.setAttribute("aria-expanded", String(!expanded));

    if (!expanded) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      return;
    }

    panel.style.maxHeight = "0";
  });
});

const form = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !subject || !message) {
    formFeedback.textContent = "Please complete all required fields.";
    formFeedback.style.color = "#b53a00";
    return;
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValid) {
    formFeedback.textContent = "Please enter a valid email address.";
    formFeedback.style.color = "#b53a00";
    return;
  }

  const mailSubject = encodeURIComponent(`${subject} - ${name}`);
  const mailBody = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:info@echolsdugout.com?subject=${mailSubject}&body=${mailBody}`;

  formFeedback.textContent = "Opening your email app...";
  formFeedback.style.color = "#0e4b38";
  form.reset();
});
