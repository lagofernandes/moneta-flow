import { db } from './index';
import { categories, users, transactions } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // 1. Create or get default demo user
    let demoUser = await db.query.users.findFirst({
      where: eq(users.email, 'demo@monetaflow.com'),
    });

    if (!demoUser) {
      console.log('Creating default demo user...');
      const [insertedUser] = await db.insert(users).values({
        name: 'Usuário Demo',
        email: 'demo@monetaflow.com',
        passwordHash: 'demo_password_hash',
      }).returning();
      demoUser = insertedUser;
    }

    // 2. Default categories to seed
    const hierarchicalCategories = [
      {
        name: 'Transporte', type: 'EXPENSE' as const, color: '#06b6d4', icon: '🚗',
        children: [
          { name: 'Combustível', type: 'EXPENSE' as const, color: '#06b6d4', icon: '⛽' },
          { name: 'Aplicativos', type: 'EXPENSE' as const, color: '#06b6d4', icon: '🚗' },
          { name: 'Transporte Coletivo', type: 'EXPENSE' as const, color: '#06b6d4', icon: '🚌' },
          { name: 'Pedágio & Estacionamento', type: 'EXPENSE' as const, color: '#06b6d4', icon: '🅿️' },
          { name: 'Manutenção & Peças', type: 'EXPENSE' as const, color: '#06b6d4', icon: '🛠️' },
          { name: 'Documentação & Seguro', type: 'EXPENSE' as const, color: '#06b6d4', icon: '📄' },
        ]
      },
      {
        name: 'Moradia', type: 'EXPENSE' as const, color: '#ef4444', icon: '🏠',
        children: [
          { name: 'Aluguel / Financiamento', type: 'EXPENSE' as const, color: '#ef4444', icon: '🗝️' },
          { name: 'Condomínio', type: 'EXPENSE' as const, color: '#ef4444', icon: '🏢' },
          { name: 'Contas Básicas', type: 'EXPENSE' as const, color: '#ef4444', icon: '💡' },
          { name: 'Internet & Conectividade', type: 'EXPENSE' as const, color: '#ef4444', icon: '🌐' },
          { name: 'Limpeza & Organização', type: 'EXPENSE' as const, color: '#ef4444', icon: '🧹' },
          { name: 'Reparos & Manutenção', type: 'EXPENSE' as const, color: '#ef4444', icon: '🛠️' },
          { name: 'Casa & Utensílios', type: 'EXPENSE' as const, color: '#ef4444', icon: '🛋️' },
        ]
      },
      {
        name: 'Alimentação', type: 'EXPENSE' as const, color: '#f59e0b', icon: '🍔',
        children: [
          { name: 'Supermercado', type: 'EXPENSE' as const, color: '#f59e0b', icon: '🛒' },
          { name: 'Restaurantes & Bares', type: 'EXPENSE' as const, color: '#f59e0b', icon: '🍽️' },
          { name: 'Delivery & Lanches', type: 'EXPENSE' as const, color: '#f59e0b', icon: '🛵' },
        ]
      },
      {
        name: 'Pessoal & Saúde', type: 'EXPENSE' as const, color: '#ec4899', icon: '💊',
        children: [
          { name: 'Saúde & Cuidados', type: 'EXPENSE' as const, color: '#ec4899', icon: '🩺' },
          { name: 'Exercícios & Esportes', type: 'EXPENSE' as const, color: '#ec4899', icon: '🏃‍♂️' },
          { name: 'Autocuidado & Estética', type: 'EXPENSE' as const, color: '#ec4899', icon: '💅' },
          { name: 'Vestuário', type: 'EXPENSE' as const, color: '#ec4899', icon: '👕' },
        ]
      },
      {
        name: 'Lazer & Estilo de Vida', type: 'EXPENSE' as const, color: '#a855f7', icon: '🎉',
        children: [
          { name: 'Eventos & Shows', type: 'EXPENSE' as const, color: '#a855f7', icon: '🎫' },
          { name: 'Viagens & Férias', type: 'EXPENSE' as const, color: '#a855f7', icon: '✈️' },
          { name: 'Assinaturas & Streaming', type: 'EXPENSE' as const, color: '#a855f7', icon: '📺' },
          { name: 'Hobbies', type: 'EXPENSE' as const, color: '#a855f7', icon: '🎨' },
          { name: 'Presentes & Doações', type: 'EXPENSE' as const, color: '#a855f7', icon: '🎁' },
        ]
      },
      {
        name: 'Educação & Desenvolvimento', type: 'EXPENSE' as const, color: '#6366f1', icon: '📚',
        children: [
          { name: 'Cursos & Treinamentos', type: 'EXPENSE' as const, color: '#6366f1', icon: '🎓' },
          { name: 'Livros & Materiais', type: 'EXPENSE' as const, color: '#6366f1', icon: '📖' },
        ]
      },
      {
        name: 'Serviços Financeiros & Investimentos', type: 'EXPENSE' as const, color: '#64748b', icon: '🏦',
        children: [
          { name: 'Tarifas & Anuidade', type: 'EXPENSE' as const, color: '#64748b', icon: '🧾' },
          { name: 'Investimentos', type: 'EXPENSE' as const, color: '#64748b', icon: '📈' },
        ]
      },
      { name: 'Outros', type: 'EXPENSE' as const, color: '#64748b', icon: '🏷️' },
      { name: 'Salário', type: 'INCOME' as const, color: '#10b981', icon: '💵' },
      { name: 'Freelance', type: 'INCOME' as const, color: '#8b5cf6', icon: '💻' },
    ];

    console.log('Inserting default system categories...');
    const existingCategories = await db.query.categories.findMany();
    const existingCategoryNames = new Map(existingCategories.map((c) => [c.name.toLowerCase().trim(), c]));

    for (const parentCat of hierarchicalCategories) {
      let parentId = null;
      const parentNameKey = parentCat.name.toLowerCase().trim();

      if (!existingCategoryNames.has(parentNameKey)) {
        const [insertedParent] = await db.insert(categories).values({
          name: parentCat.name,
          type: parentCat.type,
          color: parentCat.color,
          icon: parentCat.icon,
        }).returning();
        parentId = insertedParent.id;
        existingCategoryNames.set(parentNameKey, insertedParent);
      } else {
        parentId = existingCategoryNames.get(parentNameKey)!.id;
      }

      if (parentCat.children) {
        for (const childCat of parentCat.children) {
          const childNameKey = childCat.name.toLowerCase().trim();
          if (!existingCategoryNames.has(childNameKey)) {
            const [insertedChild] = await db.insert(categories).values({
              name: childCat.name,
              type: childCat.type,
              color: childCat.color,
              icon: childCat.icon,
              parentId: parentId,
            }).returning();
            existingCategoryNames.set(childNameKey, insertedChild);
          }
        }
      }
    }

    // 3. Seed initial transactions if table is empty
    const existingTx = await db.query.transactions.findFirst();
    if (!existingTx && demoUser) {
      console.log('Inserting initial transactions...');
      const dbCategories = await db.query.categories.findMany();
      const catMap = new Map(dbCategories.map(c => [c.name, c.id]));

      const sampleTransactions = [
        { description: 'Salário Mensal - Tech Corp', amount: '8500.00', type: 'INCOME' as const, status: 'PAID' as const, categoryName: 'Salário', date: new Date('2026-05-05') },
        { description: 'Supermercado Pão de Açúcar', amount: '720.40', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Supermercado', date: new Date('2026-05-08') },
        { description: 'Aluguel & Condomínio', amount: '2800.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Aluguel / Financiamento', date: new Date('2026-05-10') },
        { description: 'Consultoria UI/UX Design', amount: '2100.00', type: 'INCOME' as const, status: 'PAID' as const, categoryName: 'Freelance', date: new Date('2026-05-14') },
        { description: 'Abastecimento Posto Shell', amount: '240.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Combustível', date: new Date('2026-05-18') },
        { description: 'Farmácia Drogasil', amount: '135.90', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Saúde & Cuidados', date: new Date('2026-05-22') },
        { description: 'Cinema & Jantar em Família', amount: '190.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Eventos & Shows', date: new Date('2026-05-28') },
        { description: 'Salário Mensal - Tech Corp', amount: '8500.00', type: 'INCOME' as const, status: 'PAID' as const, categoryName: 'Salário', date: new Date('2026-06-05') },
        { description: 'Feira Orgânica da Semana', amount: '310.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Supermercado', date: new Date('2026-06-07') },
        { description: 'Aluguel & Condomínio', amount: '2800.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Aluguel / Financiamento', date: new Date('2026-06-10') },
        { description: 'Manutenção & Revisão Veículo', amount: '550.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Manutenção & Peças', date: new Date('2026-06-15') },
        { description: 'Projeto E-commerce Shopify', amount: '4500.00', type: 'INCOME' as const, status: 'PAID' as const, categoryName: 'Freelance', date: new Date('2026-06-20') },
        { description: 'Internet Fibra Óptica', amount: '159.90', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Internet & Conectividade', date: new Date('2026-06-23') },
        { description: 'Mensalidade Academia', amount: '120.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Exercícios & Esportes', date: new Date('2026-06-27') },
        { description: 'Salário Mensal - Tech Corp', amount: '8500.00', type: 'INCOME' as const, status: 'PAID' as const, categoryName: 'Salário', date: new Date('2026-07-05') },
        { description: 'Almoço de Negócios', amount: '285.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Restaurantes & Bares', date: new Date('2026-07-08') },
        { description: 'Aluguel & Condomínio', amount: '2800.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Aluguel / Financiamento', date: new Date('2026-07-10') },
        { description: 'Supermercado Carrefour', amount: '642.50', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Supermercado', date: new Date('2026-07-12') },
        { description: 'Projeto Freelance Web App', amount: '3200.00', type: 'INCOME' as const, status: 'PAID' as const, categoryName: 'Freelance', date: new Date('2026-07-18') },
        { description: 'Plano de Saúde Familiar', amount: '680.00', type: 'EXPENSE' as const, status: 'PAID' as const, categoryName: 'Saúde & Cuidados', date: new Date('2026-07-22') },
        { description: 'Conta de Energia Coelba', amount: '215.30', type: 'EXPENSE' as const, status: 'PENDING' as const, categoryName: 'Contas Básicas', date: new Date('2026-07-25') },
        { description: 'Assinatura de Ferramentas Cloud', amount: '99.00', type: 'EXPENSE' as const, status: 'PENDING' as const, categoryName: 'Assinaturas & Streaming', date: new Date('2026-07-27') },
      ];

      for (const item of sampleTransactions) {
        const categoryId = catMap.get(item.categoryName);
        await db.insert(transactions).values({
          userId: demoUser.id,
          categoryId: categoryId || null,
          description: item.description,
          amount: item.amount,
          type: item.type,
          status: item.status,
          date: item.date,
        });
      }
    }

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

seed();
