# Habitat

Aplicativo mobile em React Native com Expo para acompanhar hábitos, registrar anotações e organizar a rotina por dia.

## Sobre o projeto

O Habitat foi criado para centralizar três coisas que normalmente ficam espalhadas:

- hábitos com recorrência e hábitos únicos
- anotações ligadas a datas específicas
- calendário com visão por dia para acessar e criar registros rapidamente

O app usa navegação em stack + tabs, persistência local com AsyncStorage e gerenciamento de estado com Zustand.

## Funcionalidades

- criar, editar, concluir e excluir hábitos
- suportar hábitos `single`, `daily`, `weekly`, `monthly` e `custom`
- acompanhar progresso de hoje e sequência de hábitos
- criar, editar, favoritar e excluir anotações
- vincular notas a um dia específico
- criar hábitos e notas diretamente pelo calendário da tela inicial
- editar a data das notas no menu de edição com seletor nativo de data
- autenticação local com armazenamento de sessão

## Tecnologias

- Expo SDK 54
- React Native
- React Navigation
- Zustand
- AsyncStorage
- `@react-native-community/datetimepicker`

## Estrutura principal

- `App.tsx` - ponto de entrada visual do app
- `index.ts` - registro do componente raiz no Expo
- `src/navigation/` - fluxo de autenticação, abas e rotas globais
- `src/screens/` - telas do app
- `src/components/` - componentes reutilizáveis de interface
- `src/store/` - estado global e persistência local
- `src/types/` - tipos centrais do domínio
- `src/styles/` - tema e cores do app

## Como executar

Instale as dependências e inicie o ambiente de desenvolvimento:

```bash
npm install
npx expo start
```

## Scripts disponíveis

```bash
npm start
npm run android
npm run ios
npm run web
```

## Desenvolvimento

Valide o TypeScript antes de enviar mudanças:

```bash
npx tsc --noEmit
```

## Observações

- O app salva dados localmente no dispositivo.
- Datas de hábitos e notas usam formato local `YYYY-MM-DD` para evitar problemas de fuso horário.
- O calendário da Home mostra hábitos e anotações por dia e permite abrir ou criar registros no dia selecionado.
