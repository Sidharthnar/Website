// YAMER site — shared header/footer injection + interactive bits
(function () {
  const NAV_ITEMS = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "about.html", label: "About Us", key: "about" },
    {
      href: "work-scope.html", label: "Work Scope", key: "work-scope",
      children: [
        { href: "work-scope.html", label: "Work Scope Overview", key: "work-scope" },
        { href: "committees.html", label: "Committees", key: "committees" },
        { href: "grants.html", label: "Grants", key: "grants" },
      ]
    },
    { href: "clinical-trials.html", label: "Clinical Trials", key: "trials" },
    { href: "research-education.html", label: "Education and Training", key: "education" },
    { href: "events.html", label: "Events", key: "events" },
    { href: "careers.html", label: "Careers", key: "careers" },
    { href: "contact.html", label: "Contact Us", key: "contact" },
  ];

  function buildHeader(activeKey) {
    const links = NAV_ITEMS.map((i) => {
      if (i.children) {
        const childActive = i.children.some((c) => c.key === activeKey);
        const childLinks = i.children
          .map((c) => `<a href="${c.href}" class="${c.key === activeKey ? "active" : ""}">${c.label}</a>`)
          .join("");
        return `
          <div class="nav-item-dropdown ${childActive ? "active-parent" : ""}">
            <button class="nav-dd-trigger ${childActive ? "active" : ""}" aria-expanded="false">
              ${i.label}<span class="caret">▾</span>
            </button>
            <div class="nav-dd-panel">${childLinks}</div>
          </div>`;
      }
      return `<a href="${i.href}" class="${i.key === activeKey ? "active" : ""}">${i.label}</a>`;
    }).join("");
    return `
    <!-- <div class="util-bar">
      <div class="wrap">
        <div class="util-links">
          <a href="contact.html">YAMER Office, Hyderabad</a>
          <a href="contact.html">+91 40 4567 4567</a>
        </div>
        <div class="util-links">
          <a href="committees.html">Committees</a>
          <a href="careers.html">Careers</a>
        </div>
      </div>
    </div> -->
    <header class="site-header">
      <div class="wrap header-inner">
        <a href="index.html" class="brand">
          <span class="brand-text">
            <strong class="brand-word">YAMER</strong>
          </span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span>
        </button>
        <nav class="main-nav" id="mainNav">${links}</nav>
      </div>
    </header>`;
  }

  function buildFooter() {
    return `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-top">
          <div class="footer-brand">
            <strong style="color:#fff;font-family:var(--font-display);font-size:1.1rem;">YAMER</strong>
            <p>Yashoda Academy of Medical Education and Research — advancing healthcare through clinical research, medical education and evidence-based practice.</p>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li><a href="about.html">About Us</a></li>
              <li><a href="work-scope.html">Work Scope</a></li>
              <li><a href="committees.html">Committees</a></li>
              <li><a href="grants.html">Grants</a></li>
            </ul>
          </div>
          <div>
            <h5>Research</h5>
            <ul>
              <li><a href="clinical-trials.html">Clinical Trials</a></li>
              <li><a href="work-scope.html#publications">Publications</a></li>
              <li><a href="research-education.html">Medical Education</a></li>
              <li><a href="events.html">Events</a></li>
            </ul>
          </div>
          <div>
            <h5>Institution</h5>
            <ul>
              <li><a href="careers.html">Careers</a></li>
              <li><a href="about.html#governance">Governance</a></li>
              <li><a href="committees.html#sops">SOPs & Policies</a></li>
              <li><a href="contact.html">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h5>External Links</h5>
            <ul>
              <li><a href="https://cdsco.gov.in" target="_blank" rel="noopener">CDSCO</a></li>
              <li><a href="https://ctri.nic.in" target="_blank" rel="noopener">CTRI Registry</a></li>
              <li><a href="https://www.icmr.gov.in/" target="_blank" rel="noopener">ICMR</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span id="yr"></span> YAMER · Yashoda Academy of Medical Education and Research. All rights reserved.</span>
          <span>YAMER, Hyderabad</span>
        </div>
      </div>
    </footer>`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const headerMount = document.getElementById("site-header");
    const footerMount = document.getElementById("site-footer");
    const activeKey = document.body.getAttribute("data-page") || "home";

    if (headerMount) headerMount.innerHTML = buildHeader(activeKey);
    if (footerMount) footerMount.innerHTML = buildFooter();

    const yr = document.getElementById("yr");
    if (yr) yr.textContent = new Date().getFullYear();

    // dropdown nav (Work Scope > Ethics Committee / Grants)
    document.querySelectorAll(".nav-dd-trigger").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const wrapper = btn.closest(".nav-item-dropdown");
        const isOpen = wrapper.classList.contains("open");
        document.querySelectorAll(".nav-item-dropdown.open").forEach((el) => {
          el.classList.remove("open");
          el.querySelector(".nav-dd-trigger").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          wrapper.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
    document.addEventListener("click", () => {
      document.querySelectorAll(".nav-item-dropdown.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".nav-dd-trigger").setAttribute("aria-expanded", "false");
      });
    });

    // mobile nav toggle
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // accordions
    document.querySelectorAll(".accordion-item button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accordion-item");
        const panel = item.querySelector(".accordion-panel");
        const isOpen = item.classList.contains("open");
        item.parentElement.querySelectorAll(".accordion-item").forEach((el) => {
          el.classList.remove("open");
          el.querySelector(".accordion-panel").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });

    // subnav active state on scroll
    const subnavLinks = document.querySelectorAll(".subnav a");
    if (subnavLinks.length) {
      const targets = Array.from(subnavLinks)
        .map((a) => document.querySelector(a.getAttribute("href")))
        .filter(Boolean);
      const setActive = () => {
        let current = targets[0];
        const scrollPos = window.scrollY + 140;
        targets.forEach((t) => {
          if (t.offsetTop <= scrollPos) current = t;
        });
        subnavLinks.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
        });
      };
      window.addEventListener("scroll", setActive, { passive: true });
      setActive();
    }

    // animated stat counters
    const stats = document.querySelectorAll(".stat .num[data-count]");
    if (stats.length && "IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseInt(el.getAttribute("data-count"), 10);
              const suffix = el.getAttribute("data-suffix") || "";
              let cur = 0;
              const step = Math.max(1, Math.round(target / 40));
              const tick = () => {
                cur += step;
                if (cur >= target) {
                  el.textContent = target + suffix;
                } else {
                  el.textContent = cur + suffix;
                  requestAnimationFrame(tick);
                }
              };
              tick();
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.4 }
      );
      stats.forEach((s) => obs.observe(s));
    }
  });
})();

const wrap = document.querySelector('.subnav .wrap');
const maxScroll = document.body.scrollHeight - window.innerHeight;

window.addEventListener('scroll', () => {
  const progress = window.scrollY / maxScroll; // 0 to 1
  const maxNavScroll = wrap.scrollWidth - wrap.clientWidth;
  wrap.scrollLeft = progress * maxNavScroll;
});




// Workscope Publication Sorting


const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const yearFilter = document.getElementById("yearFilter");

function filterPublications() {

    const search = searchInput.value.toLowerCase();
    const department = departmentFilter.value;
    const year = yearFilter.value;

    const rows = document.querySelectorAll(".data-table tbody tr");

    rows.forEach(row => {

        const rowDepartment = row.dataset.department;
        const rowYear = row.dataset.year;

        const rowText = row.textContent.toLowerCase();

        const matchesSearch = rowText.includes(search);

        const matchesDepartment =
            department === "all" ||
            rowDepartment === department;

        const matchesYear =
            year === "all" ||
            rowYear === year;

        if (matchesSearch && matchesDepartment && matchesYear) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}

searchInput.addEventListener("keyup", filterPublications);
departmentFilter.addEventListener("change", filterPublications);
yearFilter.addEventListener("change", filterPublications);