import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded regardless of execution working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { User } from './models/User.js';
import { Voucher } from './models/Voucher.js';
import { connectDB } from './config/db.js';

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

    // Clear existing vouchers
    await Voucher.deleteMany({});

    // Write sample mock signature files
    const empSigFile = 'sample-emp-sig.png';
    const dirSigFile = 'sample-dir-sig.png';
    fs.writeFileSync(path.join(uploadsDir, empSigFile), empSignatureSvg);
    fs.writeFileSync(path.join(uploadsDir, dirSigFile), dirSignatureSvg);
    fs.writeFileSync(path.join(uploadsDir, 'sample-emp-sig.svg'), empSignatureSvg);
    fs.writeFileSync(path.join(uploadsDir, 'sample-dir-sig.svg'), dirSignatureSvg);

    // Upsert or create Demo Users for each role
    let employeeUser = await User.findOne({ email: 'employee@prachay.com' });
    if (!employeeUser) {
      employeeUser = await User.create({
        name: 'Sagar Bawanthade',
        email: 'employee@prachay.com',
        password: 'password123',
        role: 'Employee',
        department: 'Engineering',
        employeeId: 'EMP-1042',
      });
    }

    let directorUser = await User.findOne({ email: 'director@prachay.com' });
    if (!directorUser) {
      directorUser = await User.create({
        name: 'Vikramaditya Roy',
        email: 'director@prachay.com',
        password: 'password123',
        role: 'Director',
        department: 'Executive Management',
        employeeId: 'DIR-0001',
      });
    }

    let accountsUser = await User.findOne({ email: 'accounts@prachay.com' });
    if (!accountsUser) {
      accountsUser = await User.create({
        name: 'Ananya Deshmukh',
        email: 'accounts@prachay.com',
        password: 'password123',
        role: 'Accounts',
        department: 'Finance & Accounts',
        employeeId: 'ACC-0509',
      });
    }

    console.log('✅ Standard Demo Users Ready:');
    console.log('   1. Employee: employee@prachay.com / password123');
    console.log('   2. Director: director@prachay.com / password123');
    console.log('   3. Accounts: accounts@prachay.com / password123');

    // AWS S3 Signature Keys (stored in AWS S3 bucket)
    const empSigKey = 'signatures/emp-signature.jpeg';
    const dirSigKey = 'signatures/admin-signature.jpeg';

    // Create Initial Demo Vouchers covering all statuses (Approved, Submitted, Draft, Rejected)
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
        employeeSignatureKey: empSigKey,
        approvedBy: directorUser._id,
        directorName: directorUser.name,
        directorSignatureKey: dirSigKey,
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
        employeeSignatureKey: empSigKey,
      },
      {
        voucherNumber: 'EV-2026-0003',
        voucherDate: new Date('2026-04-01'),
        expenseDate: new Date('2026-03-30'),
        department: 'Engineering',
        title: 'Ergonomic Desk Accessories & External Monitor Arm',
        category: 'Office Supplies',
        description: 'Dual monitor stand and ergonomic wireless keyboard for developer workstation.',
        amount: 6450,
        status: 'Draft',
        employee: employeeUser._id,
        employeeName: employeeUser.name,
        employeeId: employeeUser.employeeId,
      },
      {
        voucherNumber: 'EV-2026-0004',
        voucherDate: new Date('2026-04-03'),
        expenseDate: new Date('2026-04-02'),
        department: 'Engineering',
        title: 'Client Hospitality Dinner at Taj Exotica Goa',
        category: 'Travel & Conveyance',
        description: 'Flight tickets and luxury hotel stay for technology partnership conference.',
        amount: 38500,
        status: 'Rejected',
        employee: employeeUser._id,
        employeeName: employeeUser.name,
        employeeId: employeeUser.employeeId,
        employeeSignatureKey: empSigKey,
        approvedBy: directorUser._id,
        directorName: directorUser.name,
        rejectionReason: 'Expense exceeds standard quarterly allowance. Please attach prior written pre-approval from department VP and revised itemized GST invoices.',
      },
      {
        voucherNumber: 'EV-2026-0005',
        voucherDate: new Date('2026-04-05'),
        expenseDate: new Date('2026-04-04'),
        department: 'Engineering',
        title: 'Annual GitHub Copilot & JetBrains Tooling License',
        category: 'Software & Subscriptions',
        description: 'Annual enterprise subscriptions for AI code completion and IDE productivity pack.',
        amount: 19800,
        status: 'Approved',
        employee: employeeUser._id,
        employeeName: employeeUser.name,
        employeeId: employeeUser.employeeId,
        employeeSignatureKey: empSigKey,
        approvedBy: directorUser._id,
        directorName: directorUser.name,
        directorSignatureKey: dirSigKey,
        approvalDate: new Date('2026-04-06'),
      },
    ];

    await Voucher.insertMany(vouchers);
    console.log(`✅ Seeded ${vouchers.length} demo vouchers across Draft, Submitted, Approved, and Rejected states in MongoDB Atlas.`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

// If run directly via node src/seed.js or npm run seed
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const runSeed = async () => {
    await connectDB();
    await seedDatabase();
    await mongoose.connection.close();
    process.exit(0);
  };
  runSeed();
}
