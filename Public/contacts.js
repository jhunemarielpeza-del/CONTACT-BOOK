const API_BASE = 'http://localhost:3000/api';

// Auth guard
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user) {
  window.location.href = 'Index.html';
}

// ========================
//  DOM References
// ========================
const navUsername = document.getElementById('nav-username');
const logoutBtn = document.getElementById('logout-btn');
const addContactBtn = document.getElementById('add-contact-btn');
const searchInput = document.getElementById('search-input');
const contactsGrid = document.getElementById('contacts-grid');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

// Contact Modal
const contactModal = document.getElementById('contact-modal');
const modalTitle = document.getElementById('modal-title');
const modalClose = document.getElementById('modal-close');
const modalOverlay = document.getElementById('modal-overlay');
const cancelBtn = document.getElementById('cancel-btn');
const saveContactBtn = document.getElementById('save-contact-btn');
const modalError = document.getElementById('modal-error');
const contactIdInput = document.getElementById('contact-id');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactPhone = document.getElementById('contact-phone');
const contactAddress = document.getElementById('contact-address');
const contactNotes = document.getElementById('contact-notes');

// Delete Modal
const deleteModal = document.getElementById('delete-modal');
const deleteOverlay = document.getElementById('delete-overlay');
const deleteModalClose = document.getElementById('delete-modal-close');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const deleteContactName = document.getElementById('delete-contact-name');

// ========================
//  State
// ========================
let allContacts = [];
let deleteTargetId = null;

// ========================
//  Init
// ========================
navUsername.textContent = `👤 ${user.username}`;
fetchContacts();

// ========================
//  Alerts
// ========================
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
  successMsg.classList.add('hidden');
  setTimeout(() => errorMsg.classList.add('hidden'), 4000);
}

function showSuccess(msg) {
  successMsg.textContent = msg;
  successMsg.classList.remove('hidden');
  errorMsg.classList.add('hidden');
  setTimeout(() => successMsg.classList.add('hidden'), 3000);
}

// ========================
//  API Headers
// ========================
function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// ========================
//  Fetch Contacts
// ========================
async function fetchContacts() {
  try {
    const res = await fetch(`${API_BASE}/contacts`, { headers: authHeaders() });

    if (res.status === 401) {
      localStorage.clear();
      window.location.href = 'Index.html';
      return;
    }

    const data = await res.json();
    allContacts = data;
    renderContacts(allContacts);
  } catch (err) {
    contactsGrid.innerHTML =
      '<p class="empty-state">❌ Failed to load contacts. Is the server running on port 3000?</p>';
  }
}

// ========================
//  Render Contacts
// ========================
function renderContacts(contacts) {
  if (contacts.length === 0) {
    contactsGrid.innerHTML =
      '<p class="empty-state">No contacts yet. Click "+ Add Contact" to get started!</p>';
    return;
  }

  contactsGrid.innerHTML = contacts
    .map((c) => {
      const initial = c.name.charAt(0).toUpperCase();
      return `
        <div class="contact-card">
          <div class="contact-avatar">${initial}</div>
          <div class="contact-name">${escapeHtml(c.name)}</div>
          ${c.email ? `<div class="contact-info">✉️ ${escapeHtml(c.email)}</div>` : ''}
          ${c.phone ? `<div class="contact-info">📞 ${escapeHtml(c.phone)}</div>` : ''}
          ${c.address ? `<div class="contact-info">📍 ${escapeHtml(c.address)}</div>` : ''}
          ${c.notes ? `<div class="contact-info">📝 ${escapeHtml(c.notes)}</div>` : ''}
          <div class="contact-actions">
            <button class="btn-edit" onclick="openEditModal('${c.id}')">✏️ Edit</button>
            <button class="btn-delete" onclick="openDeleteModal('${c.id}', '${escapeHtml(c.name)}')">🗑️ Delete</button>
          </div>
        </div>
      `;
    })
    .join('');
}

// ========================
//  Search
// ========================
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allContacts.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query)
  );
  renderContacts(filtered);
});

// ========================
//  Contact Modal: Open/Close
// ========================
function openAddModal() {
  modalTitle.textContent = 'Add Contact';
  contactIdInput.value = '';
  contactName.value = '';
  contactEmail.value = '';
  contactPhone.value = '';
  contactAddress.value = '';
  contactNotes.value = '';
  modalError.classList.add('hidden');
  contactModal.classList.remove('hidden');
  contactName.focus();
}

function openEditModal(id) {
  const c = allContacts.find((c) => c.id === id);
  if (!c) return;

  modalTitle.textContent = 'Edit Contact';
  contactIdInput.value = c.id;
  contactName.value = c.name;
  contactEmail.value = c.email;
  contactPhone.value = c.phone;
  contactAddress.value = c.address;
  contactNotes.value = c.notes;
  modalError.classList.add('hidden');
  contactModal.classList.remove('hidden');
  contactName.focus();
}

function closeContactModal() {
  contactModal.classList.add('hidden');
}

addContactBtn.addEventListener('click', openAddModal);
modalClose.addEventListener('click', closeContactModal);
cancelBtn.addEventListener('click', closeContactModal);
modalOverlay.addEventListener('click', closeContactModal);

// ========================
//  Save Contact (Add / Edit)
// ========================
saveContactBtn.addEventListener('click', async () => {
  const name = contactName.value.trim();
  if (!name) {
    modalError.textContent = 'Contact name is required.';
    modalError.classList.remove('hidden');
    return;
  }

  modalError.classList.add('hidden');
  saveContactBtn.disabled = true;
  saveContactBtn.textContent = 'Saving...';

  const payload = {
    name,
    email: contactEmail.value.trim(),
    phone: contactPhone.value.trim(),
    address: contactAddress.value.trim(),
    notes: contactNotes.value.trim(),
  };

  const id = contactIdInput.value;
  const isEdit = !!id;
  const url = isEdit ? `${API_BASE}/contacts/${id}` : `${API_BASE}/contacts`;
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      modalError.textContent = data.message || 'Failed to save contact.';
      modalError.classList.remove('hidden');
      return;
    }

    closeContactModal();
    showSuccess(isEdit ? 'Contact updated successfully!' : 'Contact added successfully!');
    fetchContacts();
  } catch (err) {
    modalError.textContent = 'Network error. Please try again.';
    modalError.classList.remove('hidden');
  } finally {
    saveContactBtn.disabled = false;
    saveContactBtn.textContent = 'Save Contact';
  }
});

// ========================
//  Delete Modal
// ========================
function openDeleteModal(id, name) {
  deleteTargetId = id;
  deleteContactName.textContent = name;
  deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  deleteTargetId = null;
}

deleteModalClose.addEventListener('click', closeDeleteModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
deleteOverlay.addEventListener('click', closeDeleteModal);

confirmDeleteBtn.addEventListener('click', async () => {
  if (!deleteTargetId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Deleting...';

  try {
    const res = await fetch(`${API_BASE}/contacts/${deleteTargetId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.message || 'Failed to delete contact.');
      return;
    }

    closeDeleteModal();
    showSuccess('Contact deleted successfully!');
    fetchContacts();
  } catch (err) {
    showError('Network error. Please try again.');
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Delete';
  }
});

// ========================
//  Logout
// ========================
logoutBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'Index.html';
});

// ========================
//  Utility
// ========================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}