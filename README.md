# Testador de Expressões Regulares (Regex)

Um testador de Regex interativo e visual construído com **Next.js**, **React** e **shadcn/ui**. Ele permite que você teste padrões, veja resultados destacados em tempo real, explore os grupos capturados e entenda passo a passo como as suas expressões regulares funcionam.

## Como funciona todo o fluxo

O projeto opera de forma local e reativa (Client-side), processando suas expressões diretamente no seu navegador, garantindo velocidade e privacidade. O fluxo acontece da seguinte forma:

1. **Entrada de Dados (Inputs)**: Você digita a expressão regular (ex: `\d+`) e o texto que deseja testar. As opções de *flags* (como `g`, `i`, `m`, `s`) podem ser ativadas e desativadas facilmente por meio de botões.
2. **Motor de Processamento (Engine)**: O hook customizado `useRegex` compila a sua expressão usando o objeto nativo `RegExp` do JavaScript a cada vez que você digita. 
3. **Preview Visual (Highlighting)**: O motor encontra as combinações (matches) dentro do texto de teste e injeta componentes visuais coloridos, destacando exatamente onde a regex funcionou de forma clara e amigável.
4. **Análise Detalhada (Grupos e Tokens)**:
   - **Grupos de Captura**: Se você usar parênteses `()`, o sistema quebra o resultado e exibe separadamente na aba "Grupos" o que foi extraído por cada parêntese.
   - **Explicação Léxica**: A aba "Explicação" lê a sua Regex caractere por caractere e converte símbolos complexos (como `\w`, `*`, `?`) em explicações legíveis em português ("qualquer caractere de palavra", "zero ou mais repetições", etc).

Todo o processamento de texto e UI é instantâneo e não realiza nenhuma requisição para servidores externos.

## Como usar

1. **Escreva o Padrão**: Digite sua Regex no campo superior "Expressão Regular".
2. **Defina as Flags**: Clique nos botões `g` (Global), `i` (Ignore Case), `m` (Multiline) ou `s` (DotAll) para modificar como a busca se comporta.
3. **Insira o Texto**: No campo "Texto de Teste", cole o bloco de texto ou código que você quer vasculhar.
4. **Observe os Resultados**:
   - A aba **Preview** mostra o texto com blocos coloridos onde a regex obteve sucesso.
   - A aba **Grupos** mostrará variáveis `$1`, `$2` ou Grupos Nomeados, excelente para extrair pedaços de textos complexos (como dias, meses e anos de uma data).
   - A aba **Explicação** é o dicionário que te ensina o que cada código que você digitou faz.
5. **Precisa de inspiração?**: Clique no botão **"Exemplos"** no canto superior direito para carregar moldes prontos como validadores de E-mail, Data ou CPF.

---

### Website

https://regex-test-git-main-regisfilhodevs-projects.vercel.app/