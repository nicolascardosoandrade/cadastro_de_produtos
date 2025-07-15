document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const resultado = document.getElementById('resultado');

  if (!form || !resultado) return; // segurança para evitar erro em outras páginas

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const min = document.getElementById('precomin').value;
    const max = document.getElementById('precomax').value;

    if (Number(min) > Number(max)) {
      resultado.textContent = 'Preço mínimo não pode ser maior que o máximo.';
      return;
    }

    resultado.textContent = 'Carregando...';

    try {
      const response = await fetch(`/estoque?precomin=${min}&precomax=${max}`);
      if (!response.ok) throw new Error('Erro ao buscar dados');

      const produtos = await response.json();

      if (produtos.length === 0) {
        resultado.textContent = 'Nenhum produto encontrado.';
        return;
      }

      let html = '<ul>';
      produtos.forEach(p => {
        html += `<li><strong>${p.nome}</strong> - R$ ${parseFloat(p.preco).toFixed(2).replace('.', ',')} - Estoque: ${p.estoque}</li>`;
      });
      html += '</ul>';

      resultado.innerHTML = html;

    } catch (error) {
      resultado.textContent = error.message;
    }
  });
});
