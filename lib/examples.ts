export interface RegexExample {
  label: string
  pattern: string
  flags: string
  testText: string
  description: string
}

export const EXAMPLES: RegexExample[] = [
  {
    label: 'Números inteiros',
    pattern: '\\d+',
    flags: 'g',
    testText: 'Tenho 25 maçãs e 10 bananas. Custou R$ 3,50.',
    description: 'Captura qualquer sequência de dígitos',
  },
  {
    label: 'E-mail',
    pattern: '[\\w.+-]+@[\\w-]+\\.[\\w.]+',
    flags: 'gi',
    testText: 'Contato: joao@email.com ou maria.silva@empresa.com.br',
    description: 'Formato básico de endereço de e-mail',
  },
  {
    label: 'CPF',
    pattern: '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}',
    flags: 'g',
    testText: 'CPFs: 123.456.789-09 e 987.654.321-00',
    description: 'CPF no formato 000.000.000-00',
  },
  {
    label: 'CEP',
    pattern: '\\d{5}-?\\d{3}',
    flags: 'g',
    testText: 'CEPs válidos: 01310-100 e 20040100',
    description: 'CEP com ou sem hífen',
  },
  {
    label: 'Data BR',
    pattern: '(\\d{2})\\/(\\d{2})\\/(\\d{4})',
    flags: 'g',
    testText: 'Reunião: 12/05/2025. Entrega: 30/06/2025.',
    description: 'Data no formato DD/MM/AAAA com grupos de captura',
  },
  {
    label: 'Telefone BR',
    pattern: '\\(?\\d{2}\\)?[\\s-]?\\d{4,5}-?\\d{4}',
    flags: 'g',
    testText: 'Ligue: (11) 99999-0000 ou 21 3333-4444',
    description: 'Celular ou fixo com DDD',
  },
  {
    label: 'URL simples',
    pattern: 'https?:\\/\\/[\\w.-]+(?:\\/[^\\s]*)?',
    flags: 'gi',
    testText: 'Visite https://google.com ou http://meusite.com.br/pagina',
    description: 'URLs com http ou https',
  },
  {
    label: 'Hashtag',
    pattern: '#\\w+',
    flags: 'g',
    testText: 'Post: #javascript #regex #programação é incrível!',
    description: 'Qualquer hashtag',
  },
  {
    label: 'Palavras repetidas',
    pattern: '\\b(\\w+)\\s+\\1\\b',
    flags: 'gi',
    testText: 'Esse texto tem tem palavras palavras repetidas.',
    description: 'Backreference: detecta palavras duplicadas em sequência',
  },
  {
    label: 'Cor hexadecimal',
    pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b',
    flags: 'g',
    testText: 'Cores: #FF5733, #fff, #1a2b3c, texto sem cor.',
    description: 'Hex de 3 ou 6 dígitos',
  },
  {
    label: 'DotAll / Single Line',
    pattern: '<div>.*?<\\/div>',
    flags: 'gs',
    testText: 'Aqui temos uma div com várias linhas:\n<div>\n  <p>Texto da linha 1</p>\n  <p>Texto da linha 2</p>\n</div>\nE o texto continua...',
    description: 'A flag "s" permite que o ponto (.) capture as quebras de linha (Enter). Desative o "s" no testador e veja o que acontece!',
  },
  {
    label: 'Início de linha (Multiline)',
    pattern: '^ERRO:.*$',
    flags: 'gm',
    testText: 'INFO: Sistema iniciado\nERRO: Falha na conexão\nINFO: Tentando reconectar...\nERRO: Arquivo não encontrado',
    description: 'A flag "m" faz com que ^ e $ considerem o início/fim de CADA LINHA. Desative o "m" e veja como ele falha ao não estar no início do texto inteiro.',
  },
  {
    label: 'Grupos de Captura (Data)',
    pattern: '(?<dia>\\d{2})\\/(?<mes>\\d{2})\\/(?<ano>\\d{4})',
    flags: 'g',
    testText: 'A reunião de planejamento será em 15/08/2024. A entrega final ficou para 02/09/2024.',
    description: 'Use (?<nome>...) para criar grupos nomeados. Vá na aba "Grupos" abaixo para ver o Dia, Mês e Ano extraídos separadamente!',
  },
]
