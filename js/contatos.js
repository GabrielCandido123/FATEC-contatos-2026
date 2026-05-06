const BASE_URL = "https://bakcend-fecaf-render.onrender.com/contatos";

export async function getContatos() {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Erro ao buscar contatos");
  }
  return response.json();
}

export async function criarContato(contato) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contato),
  };

  const response = await fetch(BASE_URL, options);

  if (!response.ok) {
    throw new Error("Erro ao criar contato");
  }

  return response.json();
}

export async function atualizarContato(id, contato) {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contato),
  };

  const response = await fetch(`${BASE_URL}/${id}`, options);

  if (!response.ok) {
    throw new Error("Erro ao atualizar contato");
  }

  return response.json();
}

export async function deletarContato(id) {
  const options = {
    method: "DELETE",
  };

  const response = await fetch(`${BASE_URL}/${id}`, options);

  if (!response.ok) {
    throw new Error("Erro ao deletar contato");
  }

  return true;
}

export function registrarContato() {
  const form = document.querySelector(".form-container");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const rawData = Object.fromEntries(formData);

      const contato = {
        nome: rawData.nome,
        celular: rawData.celular,
        foto: "https://img.freepik.com/psd-gratuitas/renderizacao-3d-do-estilo-de-cabelo-para-o-design-do-avatar_23-2151869121.jpg",
        email: rawData.email,
        endereco: rawData.endereco,
        cidade: rawData.cidade,
      };

      try {
        await criarContato(contato);
        alert("Contato salvo com sucesso!");
        form.reset();
      } catch (error) {
        console.error("Erro ao salvar contato:", error);
        alert("Não foi possível salvar o contato.");
      }
    });
  }
}

//criando função de geração de cards de contatos
export async function exibirContatos() {
  const contatos = await getContatos();
  window.onload;

  let template = document.getElementById("contacts-list");

  template.replaceChildren();

  contatos.forEach((item) => {
    const cardContato = `<div class="contact-card-style" data-id="${item.id}">
            <h3>${item.nome}</h3>
            <img
              src="https://img.freepik.com/psd-gratuitas/ilustracao-3d-de-avatar-ou-perfil-humano_23-2150671122.jpg"
              alt="imagem do contato"
            />
            <p><strong>Id:</strong> ${item.id}</p>
            <p><strong>Celular:</strong> ${item.celular}</p>
            <p><strong>E-mail:</strong> ${item.email}</p>
            <p><strong>Endereço:</strong> ${item.endereco}</p>
            <p><strong>Cidade:</strong> ${item.cidade}</p>
            <div class="card-actions">
              <button class="btn-action btn-put">Editar Contato</button>
              <button class="btn-action btn-delete">Excluir Contato</button>
            </div>
          </div>`;

    template.innerHTML += cardContato;
  });
}

// consumindo função deletar contato utilizando data-id(dataset) e closest
export async function excluirContato() {
  const template = document.getElementById("contacts-list");

  template.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-delete")) {
      const card = event.target.closest(".contact-card-style");
      const id = card.dataset.id;

      if (confirm("tem certeza que deseja deletar este contato ?")) {
        try {
          await deletarContato(id);
          location.reload();
        } catch {
          alert("O contato foi deletado com sucesso!");
        }
      } else {
        throw new Error("falha ao deletar usuario");
      }
    }
  });
}

// criando form dinamico para atualizar um contato existente utilizando data-id(dataset) e closest
export async function editarContato() {
  const template = document.getElementById("contacts-list");

  template.addEventListener("click", async (event) => {
    if (event.target.classList.contains("btn-put")) {
      const card = event.target.closest(".contact-card-style");
      const id = card.dataset.id;

      const response = await fetch(`${BASE_URL}/${id}`);
      const contato = await response.json();

      //criando form editar
      const formEditar = `
        <form class="form-container">
          <h2>Editar Contato</h2>
          <div class="form-group">
            <label for="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome" value="${contato.nome}" required />
          </div>
          <div class="form-group">
            <label for="celular">Celular</label>
            <input type="tel" id="celular" name="celular" value="${contato.celular}" required />
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" value="${contato.email}" required />
          </div>
          <div class="form-group">
            <label for="endereco">Endereço</label>
            <input type="text" id="endereco" name="endereco" value="${contato.endereco}" required />
          </div>
          <div class="form-group">
            <label for="cidade">Cidade</label>
            <input type="text" id="cidade" name="cidade" value="${contato.cidade}" required />
          </div>
          <div class="card-actions">
            <button type="submit" class="btn-submit">Salvar Alterações</button>
            <button type="button" class="btn-action" onclick="location.reload()">Cancelar</button>
          </div>
        </form>
      `;

      card.innerHTML = formEditar; // transforma o card atual no formulario de edição

      const formSalvar = card.querySelector("form");
      formSalvar.addEventListener("submit", async (event) => {
        event.preventDefault(); // evita que a pagina recarregue

        const formData = new FormData(formSalvar); // criando array com os dados do form
        const rawData = Object.fromEntries(formData); //transformando dados do form em objeto

        const contatoAtualizado = {
          // passando o contato atualizado
          nome: rawData.nome,
          celular: rawData.celular,
          foto:
            contato.foto ||
            "https://img.freepik.com/psd-gratuitas/renderizacao-3d-do-estilo-de-cabelo-para-o-design-do-avatar_23-2151869121.jpg",
          email: rawData.email,
          endereco: rawData.endereco,
          cidade: rawData.cidade,
        };

        try {
          await atualizarContato(id, contatoAtualizado); // atualizando contato
          alert("Contato atualizado com sucesso!");
          location.reload(); // atualiza a pagina após atualizar o contato
        } catch (error) {
          console.error("Erro ao atualizar contato:", error);
          alert("Não foi possível atualizar o contato.");
        }
      });
    }
  });
}
