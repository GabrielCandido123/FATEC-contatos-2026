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

export async function exibirContatos() {
  const contatos = await getContatos();
  console.log(contatos);

  let template = document.getElementById("contacts-list");

  template.replaceChildren();

  contatos.forEach((item) => {
    const cardContato = `<div class="contact-card-style">
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
