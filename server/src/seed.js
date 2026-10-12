import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/User.js';
import { Voucher } from './models/Voucher.js';
import { connectDB } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1x1 transparent PNG sample signature data for mock files
const samplePngBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const sampleSignatureBuffer = Buffer.from(samplePngBase64, 'base64');

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Voucher.deleteMany({});

    // Write sample mock signature files
    const empSigFile = 'sample-emp-sig.png';
    const dirSigFile = 'sample-dir-sig.png';
    fs.writeFileSync(path.join(uploadsDir, empSigFile), sampleSignatureBuffer);
    fs.writeFileSync(path.join(uploadsDir, dirSigFile), sampleSignatureBuffer);

    // Create Demo Users for each role
    const employeeUser1 = await User.create({
      name: 'Rahul Sharma',
      email: 'employee@prachay.com',
      password: 'password123',
      role: 'Employee',
      department: 'Engineering',
      employeeId: 'EMP-1042',
    });

    const employeeUser2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@prachay.com',
      password: 'password123',
      role: 'Employee',
      department: 'Marketing & Sales',
      employeeId: 'EMP-1088',
    });

    const directorUser = await User.create({
      name: 'Vikramaditya Roy',
      email: 'director@prachay.com',
      password: 'password123',
      role: 'Director',
      department: 'Executive Management',
      employeeId: 'DIR-0001',
    });

    const accountsUser1 = await User.create({
      name: 'Ananya Deshmukh',
      email: 'accounts@prachay.com',
      password: 'password123',
      role: 'Accounts',
      department: 'Finance & Accounts',
      employeeId: 'ACC-0509',
    });

    const accountsUser2 = await User.create({
      name: 'Rohan Mehta',
      email: 'rohan.acc@prachay.com',
      password: 'password123',
      role: 'Accounts',
      department: 'Finance & Accounts',
      employeeId: 'ACC-0512',
    });

    console.log('✅ Created Demo Users across multiple departments:');
    console.log('   1. Employee 1 (Engineering): employee@prachay.com / password123');
    console.log('   2. Employee 2 (Marketing):   priya@prachay.com / password123');
    console.log('   3. Director (Admin):          director@prachay.com / password123');
    console.log('   4. Accounts 1 (Finance):      accounts@prachay.com / password123');
    console.log('   5. Accounts 2 (Finance):      rohan.acc@prachay.com / password123');

    // Create Initial Demo Vouchers in various states
    const vouchers = [
      {
        voucherNumber: 'EV-2026-0001',
        voucherDate: new Date('2026-03-25'),
        expenseDate: new Date('2026-03-22'),
        department: 'Engineering',
        title: 'Cloud Architecture Workshop & Certification',
        category: 'Training & Certification',
        description: 'AWS Solutions Architect professional training fee and test vouchers for team lead.',
        amount: 14500,
        status: 'Approved',
        employee: employeeUser1._id,
        employeeName: employeeUser1.name,
        employeeId: employeeUser1.employeeId,
        employeeSignatureKey: `local:${empSigFile}`,
        approvedBy: directorUser._id,
        directorName: directorUser.name,
        directorSignatureKey: `local:${dirSigFile}`,
        approvalDate: new Date('2026-03-26'),
      },
      {
        voucherNumber: 'EV-2026-0002',
        voucherDate: new Date('2026-03-28'),
        expenseDate: new Date('2026-03-27'),
        department: 'Engineering',
        title: 'Team Quarterly Project Retrospective Dinner',
        category: 'Meals & Entertainment',
        description: 'Dinner with 6 project contributors to celebrate Sprint 14 release milestone.',
        amount: 8200,
        status: 'Submitted',
        employee: employeeUser1._id,
        employeeName: employeeUser1.name,
        employeeId: employeeUser1.employeeId,
        employeeSignatureKey: `local:${empSigFile}`,
      },
      {
        voucherNumber: 'EV-2026-0003',
        voucherDate: new Date('2026-04-02'),
        expenseDate: new Date('2026-04-01'),
        department: 'Engineering',
        title: 'Client Demo Flight to Mumbai & Cab Conveyance',
        category: 'Travel & Conveyance',
        description: 'Roundtrip flight and airport taxi for on-site product pilot presentation.',
        amount: 19800,
        status: 'Submitted',
        employee: employeeUser1._id,
        employeeName: employeeUser1.name,
        employeeId: employeeUser1.employeeId,
        employeeSignatureKey: `local:${empSigFile}`,
      },
      {
        voucherNumber: 'EV-2026-0004',
        voucherDate: new Date('2026-04-05'),
        expenseDate: new Date('2026-04-04'),
        department: 'Engineering',
        title: 'External Ergonomic Mechanical Keyboards & Monitors',
        category: 'Hardware & Equipment',
        description: 'Ergonomic display setup for high-load engineering station.',
        amount: 12400,
        status: 'Draft',
        employee: employeeUser1._id,
        employeeName: employeeUser1.name,
        employeeId: employeeUser1.employeeId,
      },
      {
        voucherNumber: 'EV-2026-0005',
        voucherDate: new Date('2026-04-08'),
        expenseDate: new Date('2026-04-07'),
        department: 'Engineering',
        title: 'High-end Smartphone for Test Lab',
        category: 'Hardware & Equipment',
        description: 'Device for mobile responsiveness test suite.',
        amount: 35000,
        status: 'Rejected',
        employee: employeeUser1._id,
        employeeName: employeeUser1.name,
        employeeId: employeeUser1.employeeId,
        employeeSignatureKey: `local:${empSigFile}`,
        approvedBy: directorUser._id,
        directorName: directorUser.name,
        approvalDate: new Date('2026-04-09'),
        rejectionReason: 'Please request equipment through IT Procurement Department rather than expense reimbursement.',
      },
      {
        voucherNumber: 'EV-2026-0006',
        voucherDate: new Date('2026-04-09'),
        expenseDate: new Date('2026-04-08'),
        department: 'Marketing & Sales',
        title: 'Annual FinTech Expo Booth Branding & Flyers',
        category: 'Office Supplies',
        description: 'Printed standees, company merchandise, and booth banners for Bengaluru convention.',
        amount: 22500,
        status: 'Submitted',
        employee: employeeUser2._id,
        employeeName: employeeUser2.name,
        employeeId: employeeUser2.employeeId,
        employeeSignatureKey: `local:${empSigFile}`,
      },
    ];

    await Voucher.insertMany(vouchers);
    console.log(`✅ Seeded ${vouchers.length} demo vouchers across Draft, Submitted, Approved, and Rejected states.`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

// If run directly via node src/seed.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const runSeed = async () => {
    await connectDB();
    await seedDatabase();
    await mongoose.connection.close();
    process.exit(0);
  };
  runSeed();
}
