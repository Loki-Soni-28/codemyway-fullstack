import { prisma } from '../src/lib/db';

async function main() {
  const cols = await prisma.$queryRaw`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'Class' 
    ORDER BY ordinal_position;
  `;
  console.log('Columns in Class table:', cols);
}

main().catch(console.error).finally(() => prisma.$disconnect());
