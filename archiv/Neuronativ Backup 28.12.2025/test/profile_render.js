// profile_render.js
export function renderProfiles(profileData){
  document.querySelectorAll(".profile-card").forEach(card=>{
    const key = card.dataset.profile;
    const data = profileData[key];
    if(!data) return;

    card.querySelector(".profile-bar-fill").style.width = data.score + "%";
    card.querySelector(".profile-percent").textContent = data.score + "%";
    card.querySelector(".profile-desc").textContent = data.text;
  });

  const list = document.querySelector(".profile-reasons");
  list.innerHTML = "";
  profileData.reasons.forEach(r=>{
    const li = document.createElement("li");
    li.textContent = r;
    list.appendChild(li);
  });

  document.querySelector(".profile-next-text").textContent =
    profileData.next;
}
