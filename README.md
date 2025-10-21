# EcoarEnergy Dashboard

Dashboard moderno de gestão de energia inspirado em design profissional, desenvolvido para o sistema EcoarEnergy.

## 🎨 Design

O dashboard foi criado seguindo princípios modernos de UI/UX, com:

- **Layout em Grid**: Organização clara e hierárquica dos componentes
- **Sidebar Lateral**: Navegação intuitiva com menu fixo
- **Cards Interativos**: Componentes com hover effects e transições suaves
- **Paleta de Cores Profissional**: Verde-água (teal) como cor principal, complementado por rosa, amarelo e azul
- **Tipografia Clara**: Hierarquia visual bem definida
- **Responsividade**: Design adaptável para diferentes tamanhos de tela

## 🚀 Tecnologias

- **React 18**: Framework JavaScript moderno
- **Vite**: Build tool rápido e eficiente
- **Tailwind CSS**: Framework CSS utility-first
- **Recharts**: Biblioteca para gráficos e visualizações
- **Lucide React**: Ícones modernos e consistentes
- **shadcn/ui**: Componentes UI de alta qualidade

## 📦 Estrutura do Projeto

```
src/
├── components/
│   ├── Sidebar.jsx              # Menu lateral de navegação
│   ├── Header.jsx               # Cabeçalho com saudação e perfil
│   ├── NextMonitoring.jsx       # Card de próximo monitoramento
│   ├── EnergyStatistics.jsx     # Card com estatísticas e gráfico
│   ├── DeviceRankings.jsx       # Tabela de ranking de dispositivos
│   ├── MetricCard.jsx           # Card reutilizável de métricas
│   └── ActionBanner.jsx         # Banner de call-to-action
├── data/
│   └── mockData.js              # Dados mockados do sistema
├── App.jsx                      # Componente principal
└── App.css                      # Estilos globais e customizações
```

## 🎯 Funcionalidades

### Dashboard Principal

1. **Próximo Monitoramento**
   - Visualização do próximo dispositivo a ser monitorado
   - Data e hora agendada
   - Comparação entre dispositivos (VS)

2. **Estatísticas de Energia**
   - Gráfico de barras interativo
   - Métricas de economia, metas, desperdício e perdas
   - Visualização clara de performance

3. **Ranking de Dispositivos**
   - Tabela completa com todos os dispositivos
   - Métricas detalhadas (MP, W, D, L, G, PTS)
   - Ícones personalizados para cada dispositivo
   - Destaque visual para o primeiro colocado

4. **Cards de Métricas**
   - **Eficiência**: Percentual de eficiência geral (65%)
   - **Custo Total**: Custo acumulado (R$690.2k)
   - **Orçamento Mensal**: Orçamento disponível (R$240.6k)
   - **Score Médio**: Pontuação média do sistema (7.2)

5. **Banner de Ação**
   - Lembrete visual para configuração
   - Call-to-action destacado
   - Design atrativo com gradiente

### Menu Lateral

- Dashboard (ativo)
- Dispositivos
- Estatísticas
- Calendário
- Finanças
- Transferências
- Relatórios

## 🎨 Paleta de Cores

- **Primary (Teal)**: `#4FD1C5` - Elementos principais e sidebar
- **Secondary (Coral/Rosa)**: `#FC8181` - Destaques e alertas
- **Accent (Amarelo)**: `#F6E05E` - Elementos de destaque
- **Success (Verde)**: `#48BB78` - Valores positivos
- **Background**: `#F7FAFC` - Fundo geral com gradiente sutil
- **Card Background**: `#FFFFFF` - Fundo dos cards

## 🔧 Como Executar

### Desenvolvimento

```bash
cd ecoarenergy-dashboard
pnpm install
pnpm run dev
```

O dashboard estará disponível em `http://localhost:5173/`

### Build para Produção

```bash
pnpm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

## 📊 Dados Mockados

Os dados exibidos no dashboard são mockados e incluem:

- 6 dispositivos principais (Bomba CAG, Chiller, Fancoil, etc.)
- Métricas de eficiência, consumo e performance
- Estatísticas de economia e desperdício
- Valores financeiros (custos e orçamentos)

Para integrar com dados reais, substitua os imports em `src/data/mockData.js` por chamadas à API real.

## 🎯 Próximos Passos

- [ ] Integração com API real da Ecoarenergy
- [ ] Implementação de autenticação
- [ ] Gráficos em tempo real
- [ ] Notificações push
- [ ] Exportação de relatórios
- [ ] Modo escuro (dark mode)
- [ ] Filtros e busca avançada
- [ ] Histórico de monitoramento

## 📝 Licença

Este projeto foi desenvolvido para a Ecoarenergy.

---

**Desenvolvido com ❤️ usando React + Tailwind CSS**

