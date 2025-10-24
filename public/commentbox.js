(function () {
  const commentDivs = document.querySelectorAll('[id^="commentbox"]');

  commentDivs.forEach(div => {
    const commentId = div.id;

    // Buat form komentar
    const form = document.createElement('form');
    form.innerHTML = `
      <input type="text" name="name" placeholder="Nama" required><br>
      <textarea name="comment" placeholder="Komentar..." required></textarea><br>
      <button type="submit">Kirim</button>
    `;

    // Buat list komentar dummy
    const list = document.createElement('div');
    list.className = 'comment-list';
    list.innerHTML = `<p><em>Belum ada komentar...</em></p>`;

    // Tambahkan ke div
    div.appendChild(form);
    div.appendChild(list);

    // Tangani submit (sementara cuma tampilkan di bawah)
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const comment = form.comment.value.trim();

      if (!name || !comment) return;

      const item = document.createElement('p');
      item.innerHTML = `<strong>${name}</strong>: ${comment}`;
      list.appendChild(item);

      form.reset();
    });
  });
})();