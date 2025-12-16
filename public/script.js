const apiBase = '/api/users';

/* =========================
   LISTAR USUÁRIOS
========================= */
async function fetchUsers() {
    const res = await fetch(apiBase);
    const data = await res.json();

    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';

    data.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.nome}</td>
      <td>${u.email}</td>
      <td>${u.telefone || ''}</td>
      <td>
        <button class="action" onclick="editUser(${u.id})">Editar</button>
        <button class="action" onclick="deleteUser(${u.id})">Excluir</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

/* =========================
   EXCLUIR USUÁRIO
========================= */
async function deleteUser(id) {
    if (!confirm('Confirma remoção?')) return;

    await fetch(`${apiBase}/${id}`, {
        method: 'DELETE'
    });

    fetchUsers();
}

/* =========================
   EDITAR USUÁRIO
========================= */
async function editUser(id) {
    const res = await fetch(`${apiBase}/${id}`);
    if (!res.ok) {
        alert('Erro ao buscar usuário');
        return;
    }

    const u = await res.json();

    document.getElementById('nome').value = u.nome;
    document.getElementById('email').value = u.email;
    document.getElementById('telefone').value = u.telefone || '';

    // Senha NÃO vem preenchida por segurança
    document.getElementById('senha').value = '';
    document.getElementById('confirmarSenha').value = '';

    // Marca o formulário como edição
    document
        .getElementById('formCadastro')
        .setAttribute('data-edit-id', u.id);
}

/* =========================
   SUBMIT DO FORMULÁRIO
========================= */
document
    .getElementById('formCadastro')
    .addEventListener('submit', async(e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        const form = e.target;
        const editId = form.getAttribute('data-edit-id');

        /* =========================
           VALIDAÇÕES
        ========================= */
        if (!nome || !email) {
            alert('Nome e email são obrigatórios.');
            return;
        }

        // Se estiver criando novo usuário, senha é obrigatória
        if (!editId && !senha) {
            alert('Senha é obrigatória.');
            return;
        }

        // Se digitou senha, validar confirmação
        if (senha && senha !== confirmarSenha) {
            alert('As senhas não conferem.');
            return;
        }

        /* =========================
           MONTA OBJETO
        ========================= */
        const payload = {
            nome,
            email,
            telefone
        };

        // Só envia senha se o usuário digitou
        if (senha) {
            payload.senha = senha;
        }

        /* =========================
           CREATE OU UPDATE
        ========================= */
        if (editId) {
            await fetch(`${apiBase}/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            form.removeAttribute('data-edit-id');
        } else {
            await fetch(apiBase, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        form.reset();
        fetchUsers();
    });

/* =========================
   INICIALIZAÇÃO
========================= */
fetchUsers();