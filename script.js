// -------------------
// Elements
// -------------------
const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");
const issuesGrid = document.getElementById("issuesGrid");
const searchInput = document.querySelector(
  "input[placeholder='Search issues...']",
);
const loader = document.getElementById("loader");

// Modal
const issueModal = document.getElementById("issueModal");
const closeModalBtn = document.getElementById("closeModal");

// Filter Tabs
const filterTabs = document.querySelectorAll("#filterTabsContainer button");

// Default active tab
filterTabs[0].classList.remove(
  "bg-white",
  "border",
  "border-[#E4E4E7]",
  "text-gray-500",
);
filterTabs[0].classList.add("bg-[#4F00FF]", "text-white");

// Default credentials
const defaultUsername = "admin";
const defaultPassword = "admin123";

// Store issues
let currentIssues = [];
let currentFilter = "all";

// -------------------
// Login
// -------------------
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === defaultUsername && password === defaultPassword) {
    loginPage.classList.add("hidden");
    dashboardPage.classList.remove("hidden");
    fetchIssues();
  } else {
    alert("Invalid username or password!");
  }
});

// -------------------
// Fetch Issues
// -------------------
async function fetchIssues(query = "") {
  loader.classList.remove("hidden");
  issuesGrid.innerHTML = "";

  let url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  if (query) {
    url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(query)}`;
  }

  const res = await fetch(url);
  const json = await res.json();

  if (json.status === "success") {
    currentIssues = json.data;
    renderIssues();
  } else {
    issuesGrid.innerHTML = "No issues found!";
  }

  loader.classList.add("hidden");
}

// -------------------
// Render Issues
// -------------------
function renderIssues() {
  issuesGrid.innerHTML = "";

  let filteredIssues = currentIssues;

  if (currentFilter === "open") {
    filteredIssues = currentIssues.filter((issue) => issue.status === "open");
  } else if (currentFilter === "closed") {
    filteredIssues = currentIssues.filter((issue) => issue.status === "closed");
  }

  filteredIssues.forEach((issue) => {
    const card = createCard(issue);
    issuesGrid.appendChild(card);
  });

  if (filteredIssues.length === 0) {
    issuesGrid.innerHTML = "No issues found!";
  }
}

// -------------------
// Create Card
// -------------------
function createCard(issue) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col";

  // Status
  let statusIcon =
    issue.status === "open"
      ? "./assets/Open-Status.png"
      : "./assets/Closed-Status.png";
  card.style.borderTop =
    issue.status === "open" ? "5px solid #00A96E" : "5px solid #A855F7";

  // Priority
  let priorityText = "",
    priorityBg = "";
  if (issue.priority === "high") {
    priorityText = "#EF4444";
    priorityBg = "#FEECEC";
  } else if (issue.priority === "medium") {
    priorityText = "#FFB000";
    priorityBg = "#FFFBEB";
  } else {
    priorityText = "#9CA3AF";
    priorityBg = "#F3F4F6";
  }

  // Label Colors
  const labelColors = {
    bug: {
      text: "#EF4444",
      bg: "#FEECEC",
      border: "#FECACA",
      icon: "./assets/bug.png",
    },
    "help wanted": {
      text: "#D97706",
      bg: "#FFF8DB",
      border: "#FDE68A",
      icon: "./assets/help_wanted.png",
    },
    enhancement: {
      text: "#10B981",
      bg: "#ECFDF5",
      border: "#A7F3D0",
      icon: "./assets/enhancement-icon.png",
    },
    "good first issue": {
      text: "#6366F1",
      bg: "#E0E7FF",
      border: "#C7D2FE",
      icon: "",
    },
  };

  card.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <img src="${statusIcon}" class="w-6 h-6"/>
      <span class="w-[80px] h-[24px] flex items-center justify-center rounded-full text-[14px] font-bold uppercase"
        style="color:${priorityText}; background:${priorityBg}">${issue.priority}</span>
    </div>

    <h3 class="font-bold text-[#1E293B] text-[14px] mb-[12px]">${issue.title}</h3>

    <p class="text-gray-400 text-[12px] mb-[12px] line-clamp-2">${issue.description}</p>

    <div class="flex flex-wrap gap-2 mb-[12px]">
      ${issue.labels
        .map((label) => {
          const l = labelColors[label.toLowerCase()] || {
            text: "#000",
            bg: "#eee",
            border: "#ccc",
            icon: "",
          };
          return `<span class="inline-flex items-center py-[6px] px-[8px] rounded-md border text-[12px] font-bold"
          style="color:${l.text}; background:${l.bg}; border-color:${l.border}">
          ${l.icon ? `<img src="${l.icon}" class="w-[12px] h-[12px] mr-[2px]"/>` : ""}${label.toUpperCase()}</span>`;
        })
        .join("")}
    </div>

    <div class="border-t border-gray-400 mb-[12px]"></div>

    <div class="mt-auto">
      <p class="text-[12px] text-gray-400 font-medium">#${issue.id} by <span class="text-gray-600 font-bold">${issue.author}</span></p>
      <p class="text-[12px] text-gray-400">${new Date(issue.createdAt).toLocaleDateString()}</p>
    </div>
  `;

  card.addEventListener("click", () => openModal(issue.id));

  return card;
}

// -------------------
// Modal
// -------------------
async function openModal(id) {
  issueModal.classList.remove("hidden");

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const json = await res.json();
  const issue = json.data;

  document.getElementById("issueTitle").textContent = issue.title;
  document.getElementById("issueDescription").textContent = issue.description;
  document.getElementById("issueAssignee").textContent =
    issue.author || "Unknown";
  document.getElementById("issueAssigneeBottom").textContent =
    issue.author || "Unknown";
  document.getElementById("issueDate").textContent = new Date(
    issue.createdAt,
  ).toLocaleDateString();

  const status = document.getElementById("issueStatus");
  status.textContent = issue.status.toUpperCase();
  status.style.background = issue.status === "open" ? "#00A96E" : "#A855F7";
}

// -------------------
// Close Modal
// -------------------
closeModalBtn.addEventListener("click", () =>
  issueModal.classList.add("hidden"),
);
issueModal.addEventListener("click", (e) => {
  if (e.target === issueModal) issueModal.classList.add("hidden");
});

// -------------------
// Filter Tabs
// -------------------
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((btn) => {
      btn.classList.remove("bg-[#4F00FF]", "text-white");
      btn.classList.add(
        "bg-white",
        "border",
        "border-[#E4E4E7]",
        "text-gray-500",
      );
    });

    tab.classList.remove(
      "bg-white",
      "border",
      "border-[#E4E4E7]",
      "text-gray-500",
    );
    tab.classList.add("bg-[#4F00FF]", "text-white");

    currentFilter = tab.textContent.trim().toLowerCase();
    renderIssues();
  });
});

// -------------------
// Search
// -------------------
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  fetchIssues(query);
});
