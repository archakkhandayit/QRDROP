
    let currentSize = 220;
    let currentURL = '';

    const input = document.getElementById('url-input');
    const section = document.getElementById('qr-section');
    const output = document.getElementById('qr-output');
    const errorMsg = document.getElementById('error-msg');
    const preview = document.getElementById('url-preview');
    const copyBtn = document.getElementById('copy-btn');

    // Enter key support
    input.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });

    function isValidURL(str) {
      try {
        const u = new URL(str);
        return u.protocol === 'http:' || u.protocol === 'https:';
      } catch { return false; }
    }

    function setSize(btn) {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSize = parseInt(btn.dataset.size);
      if (currentURL) generateQR(currentURL);
    }

    function generate() {
      const url = input.value.trim();
      if (!isValidURL(url)) {
        errorMsg.classList.add('show');
        input.style.color = 'var(--accent2)';
        return;
      }
      errorMsg.classList.remove('show');
      input.style.color = 'var(--text)';
      currentURL = url;
      generateQR(url);
    }

    function generateQR(url) {
      output.innerHTML = '';
      const color = document.getElementById('qr-color').value;
      const bg = document.getElementById('bg-color').value;

      new QRCode(output, {
        text: url,
        width: currentSize,
        height: currentSize,
        colorDark: color,
        colorLight: bg,
        correctLevel: QRCode.CorrectLevel.H
      });

      // Show section
      section.classList.add('visible');

      // Update preview
      const display = url.length > 52 ? url.slice(0, 49) + '…' : url;
      preview.innerHTML = `<span>↗</span> ${display}`;
    }

    // Regenerate on color change
    document.getElementById('qr-color').addEventListener('input', () => { if (currentURL) generateQR(currentURL); });
    document.getElementById('bg-color').addEventListener('input', () => { if (currentURL) generateQR(currentURL); });

    function downloadQR() {
      const canvas = output.querySelector('canvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    function copyURL() {
      if (!currentURL) return;
      navigator.clipboard.writeText(currentURL).then(() => {
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = '⎘ Copy URL';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    }