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

// Realistic digital calligraphy signatures for demo seed data
const empSignatureSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 110" width="320" height="110">
  <path d="M 35 65 Q 65 15 90 50 T 130 65 Q 165 20 195 70 Q 225 30 255 65 Q 275 80 300 55" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
  <path d="M 45 80 Q 150 88 285 75" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
  <text x="45" y="58" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-size="34" font-weight="bold" fill="#0f172a">Rahul Sharma</text>
  <text x="50" y="96" font-family="monospace" font-size="10" fill="#64748b">EMP-1042 • Digitally Signed</text>
</svg>`;

const dirSignatureSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 110" width="320" height="110">
  <path d="M 30 45 Q 60 5 95 70 T 145 35 Q 180 15 215 65 Q 240 40 290 50" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M 40 85 Q 135 90 285 80" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
  <text x="40" y="55" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-size="32" font-weight="bold" fill="#0f172a">V. Roy</text>
  <text x="50" y="96" font-family="monospace" font-size="10" fill="#475569">Executive Director • Prachay Securities</text>
</svg>`;

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Voucher.deleteMany({});

    // Write sample mock signature files
    const empSigFile = 'sample-emp-sig.png';
    const dirSigFile = 'sample-dir-sig.png';
    fs.writeFileSync(path.join(uploadsDir, empSigFile), empSignatureSvg);
    fs.writeFileSync(path.join(uploadsDir, dirSigFile), dirSignatureSvg);
    fs.writeFileSync(path.join(uploadsDir, 'sample-emp-sig.svg'), empSignatureSvg);
    fs.writeFileSync(path.join(uploadsDir, 'sample-dir-sig.svg'), dirSignatureSvg);

    // Create Demo Users for each role
    const employeeUser = await User.create({
      name: 'Rahul Sharma',
      email: 'employee@prachay.com',
      password: 'password123',
      role: 'Employee',
      department: 'Engineering',
      employeeId: 'EMP-1042',
    });

    const directorUser = await User.create({
      name: 'Vikramaditya Roy',
      email: 'director@prachay.com',
      password: 'password123',
      role: 'Director',
      department: 'Executive Management',
      employeeId: 'DIR-0001',
    });

    const accountsUser = await User.create({
      name: 'Ananya Deshmukh',
      email: 'accounts@prachay.com',
      password: 'password123',
      role: 'Accounts',
      department: 'Finance & Accounts',
      employeeId: 'ACC-0509',
    });

    console.log('✅ Created 3 Standard Demo Users:');
    console.log('   1. Employee: employee@prachay.com / password123');
    console.log('   2. Director: director@prachay.com / password123');
    console.log('   3. Accounts: accounts@prachay.com / password123');

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
        employee: employeeUser._id,
        employeeName: employeeUser.name,
        employeeId: employeeUser.employeeId,
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
        employee: employeeUser._id,
        employeeName: employeeUser.name,
        employeeId: employeeUser.employeeId,
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
        employee: employeeUser._id,
        employeeName: employeeUser.name,
        employeeId: employeeUser.employeeId,
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
        employee: employeeUser._id,
        employeeName: employeeUser.name,
        employeeId: employeeUser.employeeId,
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
        employee: employeeUser._id,
        employeeName: employeeUser.name,
        employeeId: employeeUser.employeeId,
        employeeSignatureKey: `local:${empSigFile}`,
        approvedBy: directorUser._id,
        directorName: directorUser.name,
        approvalDate: new Date('2026-04-09'),
        rejectionReason: 'Please request equipment through IT Procurement Department rather than expense reimbursement.',
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
