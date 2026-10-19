const usernameInput = document.getElementById("usernameInput");
const searchBtn = document.getElementById("searchBtn");
const profileCard = document.getElementById("profileCard");
const skeletonCard = document.getElementById("skeletonCard");
const errorMsg = document.getElementById("errorMsg");

const avatar = document.getElementById("avatar");
const fullName = document.getElementById("fullName");
const usernameEl = document.getElementById("username");
const bio = document.getElementById("bio");
const repos = document.getElementById("repos");
const followers = document.getElementById("followers");
const following = document.getElementById("following");
const gists = document.getElementById("gists");
const userLocation = document.getElementById("location");
const blog = document.getElementById("blog");
const joinDate = document.getElementById("joinDate");
const profileLink = document.getElementById("profileLink");

// FORMAT LARGE NUMBERS LIKE 9100 -> 9.1K
function formatCount(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }

  return num;
}

// FORMAT DATE
function formatDate(isoString) {
  const date = new Date(isoString);

  const options = {
    month: "short",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

// SHOW LOADING
function showLoading() {
  profileCard.classList.add("hidden");
  errorMsg.classList.add("hidden");
  skeletonCard.classList.remove("hidden");

  searchBtn.classList.add("hidden");
  searchBtn.disabled = true;
}

// HIDE LOADING
function hideLoading() {
  skeletonCard.classList.add("hidden");

  searchBtn.classList.remove("hidden");
  searchBtn.disabled = false;
}

// SHOW ERROR
function showError() {
  profileCard.classList.add("hidden");
  errorMsg.classList.remove("hidden");
}

// RENDER PROFILE
function renderProfile(data) {
  avatar.src = data.avatar_url;

  fullName.textContent = data.name || data.login;

  usernameEl.textContent = "@" + data.login;
  usernameEl.href = data.html_url;

  bio.textContent = data.bio || "This user hasn't added a bio yet.";

  repos.textContent = formatCount(data.public_repos);
  followers.textContent = formatCount(data.followers);
  following.textContent = formatCount(data.following);
  gists.textContent = formatCount(data.public_gists);

  userLocation.textContent = data.location || "Not specified";

  joinDate.textContent = formatDate(data.created_at);

  // BLOG
  if (data.blog) {
    let url = data.blog;

    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    blog.href = url;

    blog.textContent = data.blog.replace(/^https?:\/\//, "");

    blog.parentElement.classList.remove("hidden");
  } else {
    blog.parentElement.classList.add("hidden");
  }

  // GITHUB PROFILE LINK
  profileLink.href = data.html_url;

  // SHOW PROFILE
  errorMsg.classList.add("hidden");
  profileCard.classList.remove("hidden");
}

// FETCH GITHUB USER DATA
async function fetchGitHubUser(username) {
  showLoading();

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();

    renderProfile(data);
  } catch (err) {
    showError();
  } finally {
    hideLoading();
  }
}

// HANDLE SEARCH
function handleSearch() {
  const username = usernameInput.value.trim();

  if (!username) {
    return;
  }

  fetchGitHubUser(username);
}

// ADD EVENT LISTENER
searchBtn.addEventListener("click", handleSearch);

usernameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// LOAD DEFAULT PROFILE ON FIRST VISIT
window.addEventListener("DOMContentLoaded", () => {
  fetchGitHubUser(usernameInput.value.trim());
});
