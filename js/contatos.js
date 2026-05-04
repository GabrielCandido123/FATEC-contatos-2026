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
