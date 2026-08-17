const formulario = document.querySelector("#form");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = formulario.querySelector("input").value;
    const mensagem = formulario.querySelector("textarea").value;

    const numeroWhatsApp = "5584998354985";

    const texto = `Olá, Joyce!

Meu nome é ${nome}.

Mensagem:
${mensagem}`;

    const mensagemCodificada = encodeURIComponent(texto);

    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    window.open(linkWhatsApp, "_blank");
});