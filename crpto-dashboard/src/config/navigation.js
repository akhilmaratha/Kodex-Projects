export const sidebarSections = [
  {
    title: 'Dashboards',
    categories: [
      {
        label: 'Dashboards',
        subItems: [
          { label: 'Analytics', path: '/dashboards/analytics' },
          { label: 'E-Commerce', path: '/dashboards/e-commerce' },
          { label: 'Crypto', path: '/dashboards/crypto' }
        ]
      }
    ]
  },
  {
    title: 'Pages',
    categories: [
      {
        label: 'Pages',
        subItems: [
          { label: 'Settings', path: '/pages/settings' },
          { label: 'Projects', path: '/pages/projects', pro: true },
          { label: 'Clients', path: '/pages/clients', pro: true },
          { label: 'Orders', path: '/pages/orders', pro: true },
          { label: 'Pricing', path: '/pages/pricing', pro: true },
          { label: 'Chat', path: '/pages/chat', pro: true },
          { label: 'Blank Page', path: '/pages/blank-page' }
        ]
      }
    ]
  },
  {
    title: 'Components',
    categories: [
      {
        label: 'Components',
        subItems: [
          { label: 'UI Elements', path: '/components/ui-elements' },
          { label: 'Icons', path: '/components/icons' },
          { label: 'Forms', path: '/components/forms' },
          { label: 'Tables', path: '/components/tables' }
        ]
      },
      {
        label: 'Plugins',
        subItems: [
          { label: 'Charts', path: '/plugins/charts' },
          { label: 'DataTables', path: '/plugins/datatables' },
          { label: 'Calendar', path: '/plugins/calendar' }
        ]
      }
    ]
  }
]

export const navMenus = [
  {
    label: 'Mega Menu',
    items: [
      { label: 'Overview', path: '/dashboards/analytics' },
      { label: 'Billing', path: '/pages/pricing' },
      { label: 'Wallets', path: '/dashboards/crypto' },
      { label: 'Notifications', path: '/pages/chat' }
    ]
  },
  {
    label: 'Resources',
    items: [
      { label: 'Docs', path: '/components/ui-elements' },
      { label: 'API Status', path: '/components/tables' },
      { label: 'Support', path: '/pages/settings' },
      { label: 'Community', path: '/pages/clients' }
    ]
  }
]
