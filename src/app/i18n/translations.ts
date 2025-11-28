export interface Translations {
  [key: string]: string;
}

export const dictionaries: { [lang: string]: Translations } = {
  es: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'chart.clients.title': 'Clientes',
    'chart.rejectionReasons.title': 'Motivos de Rechazo',
    'chart.productFamilies.title': 'Familias de productos',
    'chart.byMonth.title': 'Por mes',
    'chart.byWeekday.title': 'Por día de la semana',
    'table.total': 'Total',
    'table.noData': 'No hay datos que mostrar',
    
    // Rechazos
    'rejections.title': 'Rechazos',
    'rejections.search.placeholder': 'Buscar...',
    'rejections.invalidCharacters': 'Caracteres no permitidos',
    'rejections.export': 'Exportar',
    'rejections.map': 'Ver en Mapa',
    'rejections.loading': 'Cargando...',
    'rejections.saveChanges': 'Guardar cambios',
    'rejections.table.convertToOpportunity': 'Convertir en oportunidad (% ó € + Promo)',
    'rejections.table.status': 'Estado',
    'rejections.table.date': 'Fecha',
    'rejections.table.city': 'Población',
    'rejections.table.client': 'Cliente',
    'rejections.table.product': 'Producto',
    'rejections.table.reason': 'Motivo',
    'rejections.table.interest': 'Interés',
    'rejections.table.myPrice': 'Mi Precio',
    'rejections.table.theirPrice': 'Su Precio',
    'rejections.table.competitor': 'Competidor',
    'rejections.table.salesmanProposal': 'Propuesta Agente',
    
    // Usuarios
    'users.title': 'Gestión de Usuarios',
    'users.search.placeholder': 'Buscar por nombre, email o cargo...',
    'users.createUser': 'Crear Usuario',
    'users.clearSearch': 'Limpiar búsqueda'
  },
  en: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'chart.clients.title': 'Clients',
    'chart.rejectionReasons.title': 'Rejection Reasons',
    'chart.productFamilies.title': 'Product Families',
    'chart.byMonth.title': 'By Month',
    'chart.byWeekday.title': 'By Day of Week',
    'table.total': 'Total',
    'table.noData': 'No data to display',
    
    // Rejections
    'rejections.title': 'Rejections',
    'rejections.search.placeholder': 'Search...',
    'rejections.invalidCharacters': 'Invalid characters',
    'rejections.export': 'Export',
    'rejections.map': 'View on Map',
    'rejections.loading': 'Loading...',
    'rejections.saveChanges': 'Save changes',
    'rejections.table.convertToOpportunity': 'Convert to opportunity (% or € + Promo)',
    'rejections.table.status': 'Status',
    'rejections.table.date': 'Date',
    'rejections.table.city': 'City',
    'rejections.table.client': 'Client',
    'rejections.table.product': 'Product',
    'rejections.table.reason': 'Reason',
    'rejections.table.interest': 'Interest',
    'rejections.table.myPrice': 'My Price',
    'rejections.table.theirPrice': 'Their Price',
    'rejections.table.competitor': 'Competitor',
    'rejections.table.salesmanProposal': 'Salesman Proposal',
    
    // Users
    'users.title': 'User Management',
    'users.search.placeholder': 'Search by name, email or position...',
    'users.createUser': 'Create User',
    'users.clearSearch': 'Clear search'
  },
  ca: {
    // Dashboard
    'dashboard.title': 'Panell',
    'chart.clients.title': 'Clients',
    'chart.rejectionReasons.title': 'Raons de Rebuig',
    'chart.productFamilies.title': 'Famílies de productes',
    'chart.byMonth.title': 'Per mes',
    'chart.byWeekday.title': 'Per dia de la setmana',
    'table.total': 'Total',
    'table.noData': 'No hi ha dades per mostrar',
    
    // Rebutjos
    'rejections.title': 'Rebutjos',
    'rejections.search.placeholder': 'Cercar...',
    'rejections.invalidCharacters': 'Caràcters no permesos',
    'rejections.export': 'Exportar',
    'rejections.map': 'Veure al Mapa',
    'rejections.loading': 'Carregant...',
    'rejections.saveChanges': 'Guardar canvis',
    'rejections.table.convertToOpportunity': 'Convertir en oportunitat (% o € + Promo)',
    'rejections.table.status': 'Estat',
    'rejections.table.date': 'Data',
    'rejections.table.city': 'Població',
    'rejections.table.client': 'Client',
    'rejections.table.product': 'Producte',
    'rejections.table.reason': 'Motiu',
    'rejections.table.interest': 'Interès',
    'rejections.table.myPrice': 'El meu Preu',
    'rejections.table.theirPrice': 'El seu Preu',
    'rejections.table.competitor': 'Competidor',
    'rejections.table.salesmanProposal': 'Proposta Agent',
    
    // Usuaris
    'users.title': 'Gestió d\'Usuaris',
    'users.search.placeholder': 'Cercar per nom, email o càrrec...',
    'users.createUser': 'Crear Usuari',
    'users.clearSearch': 'Netejar cerca'
  }
};
