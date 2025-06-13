import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabase = createClient(
  'https://tpqsceyxdpgerjjiydmy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwcXNjZXl4ZHBnZXJqaXlkbXkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0ODIwNTA1NiwiZXhwIjoyMDYzNzgxMDU2fQ.HCfap8UYNG2LpHnXMhXLCLm-EhnapUHLAoHOlTgTFQY'
);

const authBar = document.getElementById('auth-bar');

function toggleDropdown(dropdown) {
  dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
}

async function renderAuthBar() {
  const { data: { session } } = await supabase.auth.getSession();
  authBar.innerHTML = '';

  if (session?.user) {
    const userMetadata = session.user.user_metadata || {};
    const name = userMetadata.preferred_username || userMetadata.username || session.user.email || 'GitHub User';
    const avatar = userMetadata.avatar_url || null;

    const userInfo = document.createElement('div');
    userInfo.id = 'user-info';

    if (avatar) {
      const img = document.createElement('img');
      img.src = avatar;
      img.alt = name;
      userInfo.appendChild(img);
    }

    const nameDiv = document.createElement('div');
    nameDiv.innerHTML = `<strong>${name}</strong>`;
    userInfo.appendChild(nameDiv);
    authBar.appendChild(userInfo);

    const dropdown = document.createElement('div');
    dropdown.id = 'user-dropdown';

    const createIconButton = (iconName, label, onClick) => {
      const btn = document.createElement('button');
      btn.innerHTML = `<i data-lucide="${iconName}" style="width: 20px; height: 20px;"></i>${label}`;
      btn.addEventListener('click', onClick);
      return btn;
    };

    dropdown.appendChild(createIconButton('layout-dashboard', 'Dashboard', () => {
      window.location.href = 'dashboard.html';
    }));

    dropdown.appendChild(createIconButton('user-circle', 'Profile Page', () => {
      const encodedName = encodeURIComponent(name);
      window.location.href = `artist-profile.html?name=${encodedName}`;
    }));

    dropdown.appendChild(createIconButton('log-out', 'Logout', async () => {
      await supabase.auth.signOut();
      window.location.reload();
    }));

    authBar.appendChild(dropdown);

    userInfo.addEventListener('click', () => toggleDropdown(dropdown));
    document.addEventListener('click', (e) => {
      if (!authBar.contains(e.target)) dropdown.style.display = 'none';
    });

    lucide.createIcons();
  } else {
    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'Login with GitHub';
    loginBtn.className = 'auth-btn';
    loginBtn.addEventListener('click', async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.href }
      });
    });
    authBar.appendChild(loginBtn);
  }
}

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAuthBar);
} else {
  renderAuthBar();
}
