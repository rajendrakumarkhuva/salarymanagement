// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const countries = ['USA', 'UK', 'Germany', 'India', 'Canada', 'Australia', 'Singapore', 'Brazil', 'France', 'Japan'];
const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Product', 'Design', 'Operations', 'Legal', 'Support'];
const titles = [
  'Software Engineer', 'Senior Software Engineer', 'Engineering Manager',
  'Marketing Manager', 'Sales Representative', 'HR Specialist',
  'Financial Analyst', 'Product Manager', 'UX Designer', 'Operations Analyst',
  'Legal Counsel', 'Customer Support Lead', 'Data Scientist', 'DevOps Engineer'
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmployee(index: number) {
  const country = getRandomElement(countries);
  const department = getRandomElement(departments);
  const title = getRandomElement(titles);
  
  // Realistic salary ranges by title
  let baseSalary = 60000;
  if (title.includes('Senior') || title.includes('Manager')) baseSalary = 110000;
  else if (title.includes('Lead') || title.includes('Director')) baseSalary = 140000;
  else if (title.includes('Analyst') || title.includes('Specialist')) baseSalary = 75000;
  
  // Add some randomness
  baseSalary = Math.floor(baseSalary * (0.85 + Math.random() * 0.3));

  const bonus = Math.floor(baseSalary * (0.05 + Math.random() * 0.15));

  return {
    employeeId: `EMP${String(index + 1).padStart(5, '0')}`,
    name: `Employee ${index + 1}`,
    title,
    department,
    country,
    baseSalary,
    bonus,
    currency: country === 'India' || country === 'Singapore' ? 'INR' : 'USD',
    effectiveDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
  };
}

async function main() {
  console.log('🌱 Seeding 10,000 employees...');

  // Clear existing data
  await prisma.employee.deleteMany();

  const employees = Array.from({ length: 10000 }, (_, i) => generateEmployee(i));

  // Batch insert for performance
  const batchSize = 500;
  for (let i = 0; i < employees.length; i += batchSize) {
    const batch = employees.slice(i, i + batchSize);
    await prisma.employee.createMany({ data: batch });
    console.log(`Inserted ${i + batch.length} / 10000 employees`);
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });