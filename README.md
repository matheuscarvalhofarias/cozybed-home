# Cozybed Home

Storefront de roupas de cama com hero em vídeo, catálogo por categorias, páginas de produto, seleção de cores, sacola local e página Quem Somos.

## Rodar localmente

Requer Python 3. Na raiz do repositório:

```sh
python -m http.server 4173 --directory dist
```

Abra http://localhost:4173. Sirva sempre a pasta `dist` como raiz: as páginas usam caminhos absolutos.

## Estrutura

- `dist/index.html`: página inicial.
- `dist/products/`: páginas individuais dos produtos.
- `dist/quem-somos/`: página institucional.
- `dist/products.json`: catálogo e variantes.
- `dist/assets/`: imagens, logo e vídeos.
- `dist/style.css` e `dist/pages.css`: estilos.
- `dist/app.js`, `dist/page-common.js` e `dist/product-page.js`: interações do site.

## Publicação

A POC no GitHub Pages está disponível em:
https://matheuscarvalhofarias.github.io/cozybed-home/

A publicação atual usa **Deploy from a branch → gh-pages → / (root)**. A branch `main` contém o código-fonte; `gh-pages` contém o conteúdo gerado por `node scripts/build-pages.mjs`, que adapta os caminhos para `/cozybed-home/`. O conteúdo original de `dist` permanece compatível com hospedagem na raiz. Alterações na `main` precisam ser preparadas e enviadas também à `gh-pages` para atualizar a POC.

O workflow `.github/workflows/pages.yml` ficou disponível apenas para execução manual, caso se opte futuramente pela origem **GitHub Actions**. Ele não é a forma de publicação ativa.

Site estático, sem etapa de build. Configure a pasta de publicação como `dist` em uma hospedagem estática.

A sacola usa armazenamento local do navegador. Checkout, conta e atendimento usam os destinos configurados no código. Esta implementação não é um tema Shopify Liquid; a instalação nativa na Shopify exige adaptação.
