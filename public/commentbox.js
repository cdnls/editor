document.addEventListener('DOMContentLoaded', function () {
  const commentDivs = document.querySelectorAll('[id^="commentbox"]');

  commentDivs.forEach(div => {
    const commentId = div.id;

    // 🔧 Tambahkan link admin di atas form
    const adminLink = document.createElement('p');
    adminLink.innerHTML = `<a href="https://cdnts.vercel.app/admin.html?id=${commentId}" target="_blank" style="font-size:0.9em;color:#555">[admin]🔧Edit komentar</a>`;
    div.appendChild(adminLink);

    // 💬 Buat form komentar
    const form = document.createElement('form');
    form.innerHTML = `
      <input type="text" name="name" style="width:50%" placeholder="Nama" required><br>
      <textarea name="comment" style="width:100%" placeholder="Komentar..." required></textarea><br>
      <button type="submit">Kirim</button>
    `;
form.style.cssText = `
  width: 100%;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 6px;
  background: #fafafa;
`;
    // 📋 Buat list komentar
    const list = document.createElement('div');
    list.className = 'comment-list';
    list.innerHTML = `<p><em>Memuat komentar...</em></p>`;
list.style.cssText = `
  width: 100%;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 6px;
  background: #fafafa;
`;
    div.appendChild(form);
    div.appendChild(list);

    // 🔄 Ambil komentar dari Redis
    fetch(`https://cdnts.vercel.app/api/index?id=${commentId}`)
      .then(res => res.json())
      .then(data => {
        list.innerHTML = '';
        const comments = data.comments || [];
        if (comments.length === 0) {
          list.innerHTML = `<p><em>Belum ada komentar...</em></p>`;
        } else {
          comments.forEach(c => {
            const item = document.createElement('p');
            item.innerHTML = `
<div style="border:1px solid #eee">
<strong>${c.name}</strong><br/> ${c.comment}</div>`;
            list.appendChild(item);
          });
        }
      })
      .catch(err => {
        list.innerHTML = `<p><em>Gagal memuat komentar: ${err}</em></p>`;
      });

    // 📥 Tangani submit komentar baru
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const comment = form.comment.value.trim();

      if (!name || !comment) return;

      fetch('https://cdnts.vercel.app/api/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, name, comment })
      })
        .then(() => {
          if (list.querySelector('em')) {
            list.innerHTML = '';
          }

          const item = document.createElement('p');
          item.innerHTML = `<strong>${name}</strong>: ${comment}`;
          list.appendChild(item);

          form.reset();
        })
        .catch(err => {
          alert('Gagal menyimpan komentar: ' + err);
        });
    });
  });
});