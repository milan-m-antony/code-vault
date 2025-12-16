// Demo client-side behavior for viewing only (does not call PHP on server)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('result');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const a = Number(fd.get('a')) || 0;
    const b = Number(fd.get('b')) || 0;
    result.textContent = `Client-side sum: ${a + b}`;
  });
});
