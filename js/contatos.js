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

export function preview() {
  const input = document.getElementById("preview-input");
  const image = document.getElementById("preview-image");

  if (input && image) {
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader(); //trasnformando imagem em texto
        reader.onload = (e) => {
          image.src = e.target.result;
        };
        reader.readAsDataURL(file); //conversação para base64 para armazenar em banco
      }
    });
  }
}

export function registrarContato() {
  const form = document.querySelector(".form-container");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const rawData = Object.fromEntries(formData);
      console.log(document.getElementById("preview-image").src);
      const contato = {
        nome: rawData.nome,
        celular: rawData.celular,
        foto: document.getElementById("preview-image").src,
        email: rawData.email,
        endereco: rawData.endereco,
        cidade: rawData.cidade,
      };

      try {
        await criarContato(contato);
        alert("Contato salvo com sucesso!");
        form.reset();
        document.getElementById("preview-image").src =
          "https://img.freepik.com/psd-gratuitas/renderizacao-3d-do-estilo-de-cabelo-para-o-design-do-avatar_23-2151869121.jpg";
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

  let template = document.getElementById("contacts-list");

  template.replaceChildren();

  contatos.forEach((item) => {
    const cardContato = `<div class="contact-card-style" data-id="${item.id}">
            <h3>${item.nome}</h3>
            <img
              src="${item.foto || "https://img.freepik.com/psd-gratuitas/ilustracao-3d-de-avatar-ou-perfil-humano_23-2150671122.jpg"}"
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
          alert("O contato foi deletado com sucesso!");
          location.reload();
        } catch {
          alert("Não foi possível deletar o contato.");
        }
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
        <div class="registration-content" style="padding: 10px; box-shadow: none; flex-direction: column; align-items: center; gap: 20px;">
          <div class="image-container" style="gap: 10px;">
            <span class="image-label" style="font-size: 14px; font-weight: 500; color: #4a5568;">Escolha sua foto de perfil</span>
            <div class="image-preview" style="width: 150px; height: 150px;">
              <img id="preview-image" src="${contato.foto}" alt="Preview" />
            </div>
            <label for="preview-input" class="btn-upload" style="padding: 5px 10px; font-size: 12px;">Trocar Foto</label>
            <input type="file" id="preview-input" accept="image/*" hidden />
          </div>
          <form class="form-container" style="flex: 1; width: 100%;">
            <h2 style="font-size: 18px; margin-bottom: 15px;">Editar Contato</h2>
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
              <button type="submit" class="btn-submit" style="padding: 10px; font-size: 14px;">Salvar</button>
              <button type="button" class="btn-action" onclick="location.reload()" style="background: #cbd5e0; color: #4a5568;">Cancelar</button>
            </div>
          </form>
        </div>
      `;

      card.innerHTML = formEditar; // transforma o card atual no formulario de edição
      preview(); // Inicializa o preview para o novo form de edição

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
            document.getElementById("preview-image")?.src ||
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
