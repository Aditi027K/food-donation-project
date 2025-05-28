const API_BASE = 'http://localhost:8084/api';
function updateDashboardStats({donors=0, foods=0, pickups=0, availableFoods=0}) {
    document.getElementById('statDonors').textContent = donors;
    document.getElementById('statFoods').textContent = foods;
    document.getElementById('statPickups').textContent = pickups;
    document.getElementById('statAvailableFoods').textContent = availableFoods;
}
// ----------- DONORS -----------
const donorForm = document.getElementById('donorForm');
const donorList = document.getElementById('donorList');
const foodDonorId = document.getElementById('foodDonorId');

donorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('donorName').value;
    const contact = document.getElementById('donorContact').value;
    await fetch(`${API_BASE}/donors`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, contact })
    });
    donorForm.reset();
    loadDonors();
});

async function loadDonors() {
    const res = await fetch(`${API_BASE}/donors`);
    const donors = await res.json();

    donorList.innerHTML = donors.map(d => `<li>${d.name} (${d.contact})</li>`).join('');

    foodDonorId.innerHTML = '<option value="">Select Donor</option>' +
        donors.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
        window.__donorCount = donors.length;
updateDashboardStats({
  donors: window.__donorCount,
  foods: window.__foodCount || 0,
  pickups: window.__pickupCount || 0,
  availableFoods: window.__availableFoodCount || 0
});

}

// ----------- FOOD ITEMS (Available/Picked Up Separation) -----------
const foodForm = document.getElementById('foodForm');
const availableFoodList = document.getElementById('availableFoodList');
const pickedFoodList = document.getElementById('pickedFoodList');
const pickupFoodId = document.getElementById('pickupFoodId');

foodForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const donor_id = foodDonorId.value;
    const food_name = document.getElementById('foodName').value;
    const quantity = document.getElementById('foodQty').value;
    const expiry_date = document.getElementById('foodExpiry').value;
    await fetch(`${API_BASE}/food`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ donor_id, food_name, quantity, expiry_date })
    });
    foodForm.reset();
    loadDonors(); // Refresh donors in dropdown
    loadPickups(); // This will trigger loadFood for live updates
});

let pickedFoodIds = [];

async function loadPickups() {
    const res = await fetch(`${API_BASE}/pickups`);
    const pickups = await res.json();
    pickedFoodIds = pickups.map(p => p.food_id); // Save picked food IDs

    pickupList.innerHTML = pickups.length === 0
      ? '<li>No pickups yet.</li>'
      : pickups.map(p =>
        `<li>
          <span style="color:green;font-weight:bold;">✔</span>
          <b>${p.food_name}</b> picked by ${p.pickup_person} at ${p.pickup_time}
        </li>`
      ).join('');

    loadFood(); // Reload food lists and pickup dropdown after pickups
    window.__pickupCount = pickups.length;
updateDashboardStats({
  donors: window.__donorCount || 0,
  foods: window.__foodCount || 0,
  pickups: window.__pickupCount,
  availableFoods: window.__availableFoodCount || 0
});

}

async function loadFood() {
    const res = await fetch(`${API_BASE}/food`);
    const foods = await res.json();

    // Separate available and picked foods
    const availableFoods = foods.filter(f => !pickedFoodIds.includes(f.id));
    const pickedFoods = foods.filter(f => pickedFoodIds.includes(f.id));

    // Render available foods
    availableFoodList.innerHTML = availableFoods.length === 0
      ? '<li>No available foods for pickup.</li>'
      : availableFoods.map(f =>
        `<li>
          <b>${f.food_name}</b> (Qty: ${f.quantity}, Donor: ${f.donor_name}, Expires: ${f.expiry_date})
          <span style="color:#22c55e;font-size:0.9em;font-weight:600;background:#e0ffe0;border-radius:7px;padding:2px 7px; margin-left:8px;">Available</span>
        </li>`
      ).join('');

    // Render picked up foods
    pickedFoodList.innerHTML = pickedFoods.length === 0
      ? '<li>No foods have been picked up yet.</li>'
      : pickedFoods.map(f =>
        `<li>
          <b>${f.food_name}</b> (Qty: ${f.quantity}, Donor: ${f.donor_name}, Expires: ${f.expiry_date})
          <span style="color:#f43f5e;font-size:0.9em;font-weight:600;background:#ffe0e0;border-radius:7px;padding:2px 7px; margin-left:8px;">Picked Up ✔</span>
        </li>`
      ).join('');

    // Only show foods not picked up yet in pickup form
    pickupFoodId.innerHTML = '<option value="">Select Food Item</option>' +
      availableFoods.map(f => `<option value="${f.id}">${f.food_name} (${f.donor_name})</option>`).join('');

    // Hide pickup section if no foods available
    document.getElementById('pickupSection').style.display = availableFoods.length === 0 ? 'none' : 'block';
    window.__foodCount = foods.length;
window.__availableFoodCount = availableFoods.length;
updateDashboardStats({
  donors: window.__donorCount || 0,
  foods: window.__foodCount,
  pickups: window.__pickupCount || 0,
  availableFoods: window.__availableFoodCount
});

}

// ----------- PICKUPS -----------
const pickupForm = document.getElementById('pickupForm');
const pickupList = document.getElementById('pickupList');

pickupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const food_id = pickupFoodId.value;
    const pickup_person = document.getElementById('pickupPerson').value;
    const pickup_time = document.getElementById('pickupTime').value;
    await fetch(`${API_BASE}/pickups`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ food_id, pickup_person, pickup_time })
    });
    pickupForm.reset();
    loadPickups(); // Will update everything via cascade
});

// ---------- INITIAL LOAD (Load pickups first!) ----------
loadDonors();
loadPickups(); // Will call loadFood after pickups load
