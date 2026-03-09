const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");
const issuesGrid = document.getElementById("issuesGrid");
const searchInput = document.querySelector(
  "input[placeholder='Search issues...']",
);
const loader = document.getElementById("loader");
// Modal

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
