// Utility to save user data to localStorage for admin panel
export function saveUserToLocalStorage(name: string, mobile: string) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  users.push({ id: Date.now(), name, mobile, date, time });
  localStorage.setItem('users', JSON.stringify(users));
}
